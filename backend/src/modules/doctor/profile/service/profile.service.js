import User from '../../../../models/user.model.js';
import PersonalDetails from '../../../../models/personalDetail.model.js';
import Organization from '../../../../models/organization.model.js';
import Report from '../../../../models/reports.model.js';
import Visit from '../../../../models/visit.model.js';
import DoctorPatientRelation from '../../../../models/doctorPatientRelation.model.js';
import { MESSAGES } from '../common/constant.common.js';

class ProfileService {
  async updateProfile(userId, profileData, files) {
    try {
      const profile_picture = files?.path || null;

      await User.findByIdAndUpdate(
        userId,
        {
          ...profileData,
          ...(profile_picture && { profile_picture }),
        },
        { new: true }
      );
      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PROFILE_SUCCESS,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const user = await User.findById(userId).select(
        '-_id -__v -password -deleted_at -createdAt -updatedAt -verification_details_id'
      );
      if (!user) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PROFILE_NOT_FOUND,
            user: null,
          },
        };
      }
      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PROFILE_GET_SUCCESS,
          user: user,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdateDegreeInfo(userId, personalDetails, files) {
    try {
      const {
        license_number,
        specialization,
        qualification,
        medical_school,
        languages,
        clinic_id,
        hospital_id,
        organization_address,
      } = personalDetails;

      const payload = {
        user_id: userId,
        verified_status: 'pending',
      };

      const fields = {
        license_number,
        specialization,
        qualification,
        medical_school,
        clinic_id,
        hospital_id,
        organization_address,
      };

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined && value !== '') {
          payload[key] = value;
        }
      }

      if (languages) {
        payload.languages = Array.isArray(languages) ? languages : [languages];
      }

      const fileMap = {
        degree_file: 'degree_url',
        aadhaar_card_file: 'aadhaar_card_url',
        pan_card_file: 'pan_card_url',
      };

      for (const [fileField, urlField] of Object.entries(fileMap)) {
        if (files[fileField] && files[fileField][0]?.path) {
          payload[urlField] = files[fileField][0].path;
        }
      }

      let personalDetailsDoc;

      const existingPersonalDetails = await PersonalDetails.findOne({
        user_id: userId,
      });

      if (existingPersonalDetails) {
        personalDetailsDoc = await PersonalDetails.findOneAndUpdate(
          { user_id: userId },
          payload,
          {
            new: true,
            runValidators: true,
          }
        );
      } else {
        personalDetailsDoc = await PersonalDetails.create(payload);
      }

      const user = await User.findById(userId);
      if (user && personalDetailsDoc) {
        if (
          !user.personal_details ||
          user.personal_details.toString() !== personalDetailsDoc._id.toString()
        ) {
          user.personal_details = personalDetailsDoc._id;
          await user.save();
        }
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PERSONAL_DETAILS_SUCCESS,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctorDegreeInfo(userId) {
    try {
      const personalInfo = await PersonalDetails.findOne({
        user_id: userId,
      }).select('-_id -user_id -__v');
      if (!personalInfo) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PROFILE_NOT_FOUND,
            personalInfo: null,
          },
        };
      }
      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PERSONAL_INFO_SUCCESS,
          personalInfo,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctorFullProfileDetails(userId) {
    try {
      const [user, personalInfo, organization] = await Promise.all([
        User.findById(userId).select(
          '-_id -__v -password -deleted_at -createdAt -updatedAt'
        ),
        PersonalDetails.findOne({ user_id: userId }).select(
          '-_id -__v -user_id -createdAt -updatedAt'
        ),
        Organization.findOne({ owner_id: userId }).select(
          '-_id -__v -user_id -owner_id'
        ),
      ]);

      const aboutDetails = {
        about: user?.about || null,
        social_links: user?.social_links || null,
        profile_picture: user?.profile_picture || null,
        abha_id: user?.abha_id || null,
        personal_info: {
          fullName: `${user?.firstName} ${user?.lastName}` || null,
          email: user?.email || null,
          phone: user?.phone || null,
          age: user?.age || null,
          personal_address: user?.personal_address || null,
          gender: user?.gender || null,
          date_of_birth: user?.birth_date || null,
          blood_group: user?.blood_group || null,
          marital_status: user?.marital_status || null,
          spouse_full_name: user?.spouse_full_name || null,
        },
        qualification_info: {
          license_number: personalInfo?.license_number || null,
          specialization: personalInfo?.specialization || null,
          qualification: personalInfo?.qualification || null,
          medical_school: personalInfo?.medical_school || null,
          languages: personalInfo?.languages || null,
          verified_status: personalInfo?.verified_status || null,
          rejection_reason: personalInfo?.rejection_reason || null,
        },
        organization_info: {
          organization_name: organization?.name || null,
          organization_type: organization?.type || null,
          organization_phone: organization?.phone || null,
          organization_email: organization?.email || null,
          organization_people: organization?.doctor_ids || null,
          organization_id:
            personalInfo?.clinic_id || personalInfo?.hospital_id || null,
          organization_address: organization?.organization_address || null,
          is_individual: organization?.is_individual || true,
          is_active: organization?.is_active || true,
        },
        download_images: {
          degree_url: personalInfo?.degree_url || null,
          aadhaar_card_url: personalInfo?.aadhaar_card_url || null,
          pan_card_url: personalInfo?.pan_card_url || null,
        },
      };

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PROFILE_GET_SUCCESS,
          aboutDetails,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async addOrUpdateOrganization(userId, orgDetails) {
    try {
      const { name, type, phone, email, is_individual, address } = orgDetails;

      const user = await User.findById(userId);
      if (!user || user.role !== 'doctor') {
        return {
          status: 403,
          result: {
            status: false,
            message: MESSAGES.DOCTOR_ONLY_ALLOWED,
          },
        };
      }

      // Check if organization already exists for this user as owner
      let org = await Organization.findOne({ owner_id: userId });

      const payload = {
        name,
        type,
        phone,
        email,
        organization_address: address,
        owner_id: userId,
        doctor_ids: [userId],
        is_individual: is_individual ?? true,
        is_active: true,
      };

      if (org) {
        await Organization.findByIdAndUpdate(org._id, payload, {
          new: true,
        });
      } else {
        await Organization.create(payload);
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.ORGANIZATION_SUCCESS,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctorOrganizationDetails(userId) {
    try {
      const organization = await Organization.findOne({
        owner_id: userId,
      }).select('-_id -__v -updatedAt');
      if (!organization) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.ORGANIZATION_NOT_FOUND,
          },
        };
      }
      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.ORGANIZATION_GET_SUCCESS,
          organization,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async rejectReport(doctorId, patientUserId) {
    try {
      // Step 1: Find doctor-patient relation for this patient and doctor
      const relation = await DoctorPatientRelation.findOne({
        patient_id: patientUserId,
        doctor_id: doctorId,
        is_active: true,
      });

      if (!relation) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.NO_RELATION_FOUND,
          },
        };
      }

      // Step 2: Find all visits for this relation
      const visits = await Visit.find({
        doctor_patient_relations_id: relation._id,
        is_active: true,
      }).select('_id');

      if (!visits || visits.length === 0) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.REPORT_NOT_FOUND,
          },
        };
      }

      const visitIds = visits.map((visit) => visit._id);

      // Step 3: Find the latest report for these visits
      const latestReport = await Report.findOne({
        visit: { $in: visitIds },
        deleted_at: null,
      })
        .populate({
          path: 'visit',
          populate: {
            path: 'doctor_patient_relations_id',
            select: 'doctor_id',
          },
        })
        .sort({ created_at: -1 });

      if (!latestReport) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.REPORT_NOT_FOUND,
          },
        };
      }

      // Step 4: Verify that the doctor_id in the report's visit matches the authenticated doctor
      const reportDoctorId =
        latestReport.visit?.doctor_patient_relations_id?.doctor_id?.toString();

      if (!reportDoctorId || reportDoctorId !== doctorId.toString()) {
        return {
          status: 403,
          result: {
            status: false,
            message: MESSAGES.UNAUTHORIZED_DOCTOR,
          },
        };
      }

      // Step 5: Delete the report
      await Report.findByIdAndDelete(latestReport._id);

      // Step 6: Also remove report_id from the visit if it exists
      if (latestReport.visit?._id) {
        await Visit.findByIdAndUpdate(latestReport.visit._id, {
          $unset: { report_id: 1 },
        });
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.REPORT_DELETED_SUCCESS,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService();
