import User from '../../../../models/user.model.js';
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

  async getAllReports(patientUserId, query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'created_at',
        sortOrder = 'desc',
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      // Step 1: Find all doctor-patient relations for this patient
      const relations = await DoctorPatientRelation.find({
        patient_id: patientUserId,
        is_active: true,
      }).select('_id');

      if (!relations || relations.length === 0) {
        return {
          status: 200,
          result: {
            status: true,
            message: MESSAGES.REPORTS_FETCHED_SUCCESSFULLY,
            reports: [],
            meta: {
              total: 0,
              limit: itemsPerPage,
              currentPage,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
              nextPage: null,
              prevPage: null,
              resultCount: 0,
              sortBy,
              sortOrder,
            },
          },
        };
      }

      const relationIds = relations.map((rel) => rel._id);

      // Step 2: Find all visits for these relations
      const visits = await Visit.find({
        doctor_patient_relations_id: { $in: relationIds },
        is_active: true,
      }).select('_id');

      if (!visits || visits.length === 0) {
        return {
          status: 200,
          result: {
            status: true,
            message: MESSAGES.REPORTS_FETCHED_SUCCESSFULLY,
            reports: [],
            meta: {
              total: 0,
              limit: itemsPerPage,
              currentPage,
              totalPages: 0,
              hasNextPage: false,
              hasPrevPage: false,
              nextPage: null,
              prevPage: null,
              resultCount: 0,
              sortBy,
              sortOrder,
            },
          },
        };
      }

      const visitIds = visits.map((visit) => visit._id);

      // Step 3: Build filter for reports
      const filter = {
        visit: { $in: visitIds },
        deleted_at: null,
      };

      // Step 4: Sorting
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Step 5: Get total count and paginated reports
      const total = await Report.countDocuments(filter);

      const reports = await Report.find(filter)
        .populate({
          path: 'visit',
          populate: {
            path: 'doctor_patient_relations_id',
            populate: [
              {
                path: 'doctor_id',
                select:
                  'firstName lastName email phone profile_picture abha_id',
              },
              {
                path: 'patient_id',
                select:
                  'firstName lastName email phone profile_picture abha_id',
              },
            ],
          },
        })
        .sort(sortOptions)
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage);

      const totalPages = Math.ceil(total / itemsPerPage);
      const hasNextPage = currentPage < totalPages;
      const hasPrevPage = currentPage > 1;

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.REPORTS_FETCHED_SUCCESSFULLY,
          reports,
          meta: {
            total,
            limit: itemsPerPage,
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            resultCount: reports.length,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportById(patientUserId, reportId) {
    try {
      // Step 1: Find all doctor-patient relations for this patient
      const relations = await DoctorPatientRelation.find({
        patient_id: patientUserId,
        is_active: true,
      }).select('_id');

      if (!relations || relations.length === 0) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.REPORT_NOT_FOUND,
          },
        };
      }

      const relationIds = relations.map((rel) => rel._id);

      // Step 2: Find the report and verify it belongs to this patient
      const report = await Report.findOne({
        _id: reportId,
        deleted_at: null,
      }).populate({
        path: 'visit',
        match: {
          doctor_patient_relations_id: { $in: relationIds },
          is_active: true,
        },
        populate: {
          path: 'doctor_patient_relations_id',
          populate: [
            {
              path: 'doctor_id',
              select: 'firstName lastName email phone profile_picture abha_id',
            },
            {
              path: 'patient_id',
              select: 'firstName lastName email phone profile_picture abha_id',
            },
          ],
        },
      });

      if (!report || !report.visit) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.REPORT_NOT_FOUND,
          },
        };
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.REPORT_FETCHED_SUCCESSFULLY,
          report,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService();
