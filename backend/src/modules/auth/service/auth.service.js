import crypto from 'crypto';
import User from '../../../models/user.model.js';
import Token from '../../../models/token.model.js';
import VerificationModel from '../../../models/verification.model.js';
import { hashPassword, comparePasswords } from '../../../utils/bcrypt.util.js';
import { MESSAGES } from '../common/constant.common.js';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyResetToken,
} from '../../../utils/jwt.utils.js';
import {
  emailVerification,
  doctorWelcomeEmail,
  patientWelcomeEmail,
  forgetPasswordEmail,
  passwordUpdatedEmail,
} from '../../../utils/email.utils.js';
import verificationModel from '../../../models/verification.model.js';

class AuthService {
  async registerUserService(userData) {
    try {
      const { password, email, role, phone, firstName, ...rest } = userData;

      // Check if email already exists
      const existingUser = await User.findOne({ email }).select('_id');
      if (existingUser) {
        throw new Error(MESSAGES.EMAIL_EXISTS);
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Step 1: Create the user
      const newUser = await User.create({
        email,
        role,
        phone,
        password: hashedPassword,
        firstName,
        ...rest,
      });

      // Step 2: If user is a doctor, create verification details and update user with its ID
      if (role === 'doctor') {
        const verificationCode = crypto.randomBytes(32).toString('hex');

        const verificationDetail = await VerificationModel.findOneAndUpdate(
          { user_id: newUser._id },
          {
            verification_code: verificationCode,
            is_email_verified: false,
            is_phone_verified: false,
            verified_status: false,
          },
          { upsert: true, new: true }
        );

        // Step 3: Update user with verification_details_id
        newUser.verification_details_id = verificationDetail._id;
        await newUser.save();

        // Step 4: Send verification email
        let res = await emailVerification(firstName, email, verificationCode);

        // await sendOtpToPhone(phone, otp);
      } else if (role === 'patient') {
        await patientWelcomeEmail(email, firstName);
      }

      return {
        status: true,
        message: MESSAGES.REGISTER_SUCCESS,
        user: {
          email: newUser.email,
          role: newUser.role,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async emailVerify(token) {
    const verificationRecord = await VerificationModel.findOne({
      verification_code: token,
    });

    if (!verificationRecord) {
      return {
        code: 404,
        status: false,
        message: MESSAGES.EXPIRED_TOKEN,
      };
    }

    if (verificationRecord.is_email_verified) {
      return {
        code: 200,
        status: false,
        message: MESSAGES.EMAIL_ALREADY_VERIFIED,
      };
    }

    verificationRecord.is_email_verified = true;
    verificationRecord.verified_status =
      verificationRecord.is_email_verified &&
      verificationRecord.is_phone_verified;

    await verificationRecord.save();

    const user = await User.findById(verificationRecord.user_id);
    await doctorWelcomeEmail(user.email, user.firstName);
    return {
      code: 200,
      status: true,
      message: MESSAGES.EMAIL_VERIFIED_SUCCESS,
    };
  }

  async loginUser(userData) {
    try {
      const { email, password } = userData;

      const user = await User.findOne({ email }).populate({
        path: 'personal_details',
        select: 'verified_status rejection_reason',
      });
      if (!user) {
        return { code: 404, status: false, message: MESSAGES.USER_NOT_FOUND };
      }

      const isPasswordValid = await comparePasswords(password, user.password);
      if (!isPasswordValid) {
        return {
          code: 401,
          status: false,
          message: MESSAGES.INVALID_CREDENTIALS,
        };
      }

      if (user.role === 'doctor') {
        const verification = await verificationModel.findOne({
          user_id: user._id,
        });
        if (!verification || !verification.is_email_verified) {
          await emailVerification(
            user.firstName,
            email,
            verification.verification_code
          );

          return {
            code: 403,
            status: false,
            message: MESSAGES.EMAIL_NOT_VERIFIED,
          };
        }
      }

      // Generate tokens
      const accessToken = generateToken(user);
      const refreshToken = generateRefreshToken(user);

      // Token expiration setup (e.g., 15 min access, 7 days refresh)
      const now = new Date();
      const accessExpiry = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
      const refreshExpiry = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Save token in DB
      await Token.create({
        user_id: user._id,
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expires_at: accessExpiry,
        refresh_token_expires_at: refreshExpiry,
        created_at: now,
        updated_at: now,
      });

      return {
        status: true,
        message: MESSAGES.LOGIN_SUCCESS,
        token: accessToken,
        refreshToken,
        user: {
          profile_picture: user.profile_picture || null,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          abha_id: user.abha_id,
          verified_status: user?.personal_details?.verified_status || 'pending',
          rejection_reason: user?.personal_details?.rejection_reason || null,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken(tokenData) {
    try {
      const { refreshToken } = tokenData;

      if (!refreshToken) {
        return {
          code: 400,
          result: {
            status: false,
            message: MESSAGES.REFRESH_TOKEN_REQUIRED,
          },
        };
      }

      // Verify the refresh token
      const decoded = await verifyRefreshToken(refreshToken);
      if (decoded.code === 401) {
        return decoded;
      }

      const userId = decoded.result.id;

      // Check if refresh token exists in DB and is not expired or deleted
      const tokenDoc = await Token.findOne({
        user_id: userId,
        refresh_token: refreshToken,
        deleted_at: null,
        refresh_token_expires_at: { $gt: new Date() },
      }).select('_id');

      if (!tokenDoc) {
        return {
          code: 401,
          result: {
            status: false,
            message: MESSAGES.INVALID_TOKEN,
          },
        };
      }

      // Verify user still exists
      const user = await User.findById(userId).select('_id');
      if (!user) {
        return {
          code: 404,
          result: {
            status: false,
            message: MESSAGES.USER_NOT_FOUND,
          },
        };
      }

      // Generate new access token
      const newAccessToken = generateToken(user);
      const accessTokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 15 minutes

      // Update token document in DB
      tokenDoc.access_token = newAccessToken;
      tokenDoc.access_token_expires_at = accessTokenExpiry;
      tokenDoc.updated_at = new Date();
      await tokenDoc.save();

      return {
        code: 200,
        result: {
          status: true,
          message: MESSAGES.TOKEN_REFRESHED,
          accessToken: newAccessToken,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return {
          code: 404,
          result: {
            status: false,
            message: MESSAGES.USER_NOT_FOUND,
          },
        };
      }

      const resetToken = generateResetToken(user);
      await forgetPasswordEmail(user.email, user.firstName, resetToken);

      return {
        code: 200,
        result: {
          status: false,
          message: MESSAGES.RESET_LINK_SENT,
        },
      };
    } catch (err) {
      throw err;
    }
  }

  async resetPassword(password, token) {
    try {
      let decoded;
      try {
        decoded = verifyResetToken(token);
      } catch (err) {
        return {
          code: 401,
          result: { status: false, message: MESSAGES.RESET_TOKEN_REQUIRED },
        };
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return {
          code: 404,
          result: { status: false, message: MESSAGES.USER_NOT_FOUND },
        };
      }

      const hashedPassword = await hashPassword(password);
      user.password = hashedPassword;
      await user.save();

      await passwordUpdatedEmail(user.email, user.firstName);

      return {
        code: 200,
        result: { status: true, message: MESSAGES.PASSWORD_RESET },
      };
    } catch (err) {
      throw err;
    }
  }

  async updatePassword(userId, data) {
    try {
      const { oldPassword, newPassword } = data;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        return {
          code: 404,
          result: { status: false, message: MESSAGES.USER_NOT_FOUND },
        };
      }

      const isMatch = await comparePasswords(oldPassword, user.password);
      if (!isMatch) {
        return {
          code: 400,
          result: { status: false, message: MESSAGES.INVALID_OLD_PASSWORD },
        };
      }

      const hashedPassword = await hashPassword(newPassword);
      user.password = hashedPassword;

      await user.save();

      return {
        code: 200,
        result: { status: true, message: MESSAGES.PASSWORD_UPDATED },
      };
    } catch (err) {
      throw err;
    }
  }
}

export default new AuthService();
