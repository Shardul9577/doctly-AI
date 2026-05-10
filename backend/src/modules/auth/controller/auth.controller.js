import authService from '../service/auth.service.js';

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.registerUserService(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token } = req.query;

      const verify = await authService.emailVerify(token);
      return res
        .status(verify.code)
        .json({ status: verify.status, message: verify.message });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const token = await authService.loginUser(req.body);
      if (token.status) {
        return res.status(201).json(token);
      }
      return res
        .status(token.code)
        .json({ status: token.status, message: token.message });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = await authService.refreshAccessToken(req.body);
      return res.status(token.code).json({ ...token.result });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const token = await authService.forgotPassword(email);
      return res.status(token.code).json({ ...token.result });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token } = req.query;
      const { password } = req.body;
      const user = await authService.resetPassword(password, token);
      return res.status(user.code).json({ ...user.result });
    } catch (error) {
      next(error);
    }
  }

  async updatePassword(req, res, next) {
    try {
      const userId = req.user._id;
      const user = await authService.updatePassword(userId, req.body);
      return res.status(user.code).json({ ...user.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
