import mongoose from 'mongoose';
import User from '../../../../models/user.model.js';
import PatientRelation from '../../../../models/doctorPatientRelation.model.js';
import Visit from '../../../../models/visit.model.js';
import { MESSAGES } from '../common/constant.common.js';
import doctorPatientRelationModel from '../../../../models/doctorPatientRelation.model.js';
import Report from '../../../../models/reports.model.js';

class VisitService {
  async addNewVisit(doctorId, visitData) {
    try {
      const { visit_date, visit_time, duration, patient_id, ...rest } =
        visitData;

      const doctor_patient_id = await PatientRelation.findOne({
        doctor_id: doctorId,
        patient_id,
        is_active: true,
      }).select('_id');

      // If no overlap, save the visit
      const newVisit = new Visit({
        doctor_patient_relations_id: doctor_patient_id._id,
        visit_date,
        visit_time,
        duration,
        ...rest,
        status: 'pending',
        is_active: true,
      });

      await newVisit.save();

      return {
        status: 201,
        result: {
          status: true,
          message: MESSAGES.VISIT_CREATED_SUCCESSFULLY,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateExistingVisit(visitId, files, visitData) {
    try {
      const visit = await Visit.findById(visitId);
      if (!visit) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.VISIT_NOT_FOUND,
          },
        };
      }

      const {
        visit_date,
        visit_time,
        duration,
        visit_type,
        case_file_type,
        status,
        notes,
        diagnosis,
        symptoms,
        prescription,
        existingAttachments,
      } = visitData;

      const parsedPrescription = prescription
        ? JSON.parse(prescription)
        : visit.prescription || [];

      // Handle attachments: preserve existing if not provided, otherwise use provided ones
      let finalAttachments;
      if (existingAttachments !== undefined) {
        // If existingAttachments is provided (even if empty string), parse it
        const parsedExistingAttachments = existingAttachments
          ? JSON.parse(existingAttachments)
          : [];
        const newAttachments =
          files?.attachments?.map((file) => file.path) || [];
        finalAttachments = [...parsedExistingAttachments, ...newAttachments];
      } else {
        // If existingAttachments is not provided, preserve existing attachments and add new ones
        const currentAttachments = visit.attachments || [];
        const newAttachments =
          files?.attachments?.map((file) => file.path) || [];
        finalAttachments = [...currentAttachments, ...newAttachments];
      }

      // Build update object
      const updateData = {
        ...(visit_date && { visit_date }),
        ...(visit_time && { visit_time }),
        ...(duration && { duration }),
        ...(visit_type && { visit_type }),
        ...(case_file_type && { case_file_type }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        ...(diagnosis !== undefined && { diagnosis }),
        ...(symptoms !== undefined && { symptoms }),
        ...(prescription && { prescription: parsedPrescription }),
        attachments: finalAttachments, // Always update attachments
      };

      const updatedVisit = await Visit.findByIdAndUpdate(visitId, updateData, {
        new: true,
      });

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.VISIT_UPDATED_SUCCESSFULLY,
          visit: updatedVisit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getVisitList(doctorId, query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        visit_date,
        patient_id,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        status,
        case_file_type,
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      // Step 1: Fetch all patient relations for the doctor
      const relations = await PatientRelation.find({
        doctor_id: doctorId,
        is_active: true,
      }).select('_id patient_id');

      if (!relations.length) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.NO_PATIENT_RELATION_FOUND,
            visits: [],
            meta: {},
          },
        };
      }

      const relationIds = relations.map((r) => r._id.toString());

      // Step 2: Build filters
      const filters = {
        doctor_patient_relations_id: { $in: relationIds },
        is_active: true,
      };

      if (visit_date) {
        filters.visit_date = visit_date;
      }

      if (status) {
        filters.status = status.toLowerCase(); // Ensure lowercase match
      }

      if (case_file_type) {
        filters.case_file_type = case_file_type.toLowerCase();
      }

      if (patient_id) {
        const relationForPatient = relations.find(
          (r) => r.patient_id.toString() === patient_id,
        );
        if (relationForPatient) {
          filters.doctor_patient_relations_id = relationForPatient._id;
        } else {
          // patient not connected
          return {
            status: 200,
            result: {
              status: true,
              message: MESSAGES.NO_VISITS_FOR_PATIENT,
              visits: [],
              meta: {
                total: 0,
                currentPage,
                totalPages: 0,
                resultCount: 0,
                sortBy,
                sortOrder,
              },
            },
          };
        }
      }

      // Step 3: Sorting (default latest first). If sorting by visit_date (stored as string),
      // fall back to createdAt desc to ensure latest visits appear first.
      const sortOptions =
        sortBy === 'visit_date'
          ? { createdAt: -1 }
          : { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Step 4: Pagination
      const total = await Visit.countDocuments(filters);
      const visits = await Visit.find(filters)
        .populate({
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
          message: MESSAGES.VISITS_FETCHED_SUCCESSFULLY,
          visits,
          meta: {
            total,
            limit: itemsPerPage,
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            resultCount: visits.length,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      return {
        status: 500,
        result: {
          status: false,
          message: MESSAGES.SERVER_ERROR,
          visits: [],
          meta: {},
        },
      };
    }
  }

  async getVisitById(visitId) {
    try {
      const visit = await Visit.findById(visitId)
        .populate({
          path: 'doctor_patient_relations_id',
          populate: [
            {
              path: 'doctor_id',
              select: 'firstName lastName email phone profile_picture',
            },
            {
              path: 'patient_id',
              select: 'firstName lastName email phone profile_picture',
            },
          ],
        })
        .select('-__v');

      if (!visit) {
        return {
          status: 404,
          result: {
            success: false,
            message: MESSAGES.VISIT_NOT_FOUND,
          },
        };
      }

      return {
        status: 200,
        result: {
          success: true,
          message: MESSAGES.VISITS_FETCHED_SUCCESSFULLY,
          visit,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getVisitListByPatientApprovalToday(doctorId) {
    try {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const year = String(today.getFullYear());
      const todayStr = `${day}/${month}/${year}`; // DD/MM/YYYY

      // Find all active relations for this doctor and filter visits by those relations
      const relations = await PatientRelation.find({
        doctor_id: doctorId,
        is_active: true,
      }).select('_id');

      if (!relations.length) {
        return {
          status: 200,
          result: {
            success: true,
            message: MESSAGES.VISITS_FETCHED_SUCCESSFULLY,
            visits: [],
          },
        };
      }

      const relationIds = relations.map((r) => r._id.toString());

      const visits = await Visit.find({
        doctor_patient_relations_id: { $in: relationIds },
        visit_date: todayStr,
        status: 'pending',
        is_active: false,
      }).populate({
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
      });

      return {
        status: 200,
        result: {
          success: true,
          message: MESSAGES.VISITS_FETCHED_SUCCESSFULLY,
          visits,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async approveVisit(visitId) {
    try {
      const visit = await Visit.findByIdAndUpdate(visitId, {
        is_active: true,
      });

      return {
        status: 200,
        result: {
          success: true,
          message: 'Visit approved successfully',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async rejectVisit(visitId) {
    try {
      const doctorPatientRelation = await doctorPatientRelationModel.deleteOne({
        _id: visitId,
      });

      const visit = await Visit.findByIdAndUpdate(visitId, {
        doctor_patient_relations_id: null,
        is_active: false,
      });

      return {
        status: 200,
        result: {
          success: true,
          message: 'Visit rejected successfully',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getReportList(patientId) {
    try {
      if (!patientId) {
        return {
          status: 400,
          result: {
            success: false,
            message: 'Patient ID is required',
          },
        };
      }

      const reports = await Report.aggregate([
        {
          $lookup: {
            from: 'visits',
            localField: 'visit',
            foreignField: '_id',
            as: 'visitDoc',
          },
        },
        { $unwind: { path: '$visitDoc', preserveNullAndEmptyArrays: false } },
        {
          $lookup: {
            from: 'doctor_patient_relations',
            localField: 'visitDoc.doctor_patient_relations_id',
            foreignField: '_id',
            as: 'relationDoc',
          },
        },
        { $unwind: { path: '$relationDoc', preserveNullAndEmptyArrays: false } },
        {
          $match: {
            'relationDoc.patient_id': new mongoose.Types.ObjectId(patientId),
          },
        },
        {
          $project: {
            created_at: 0,
            updated_at: 0,
            deleted_at: 0,
            visitDoc: 0,
            relationDoc: 0,
          },
        },
      ]);

      return {
        status: 200,
        result: {
          success: true,
          message: 'Reports fetched successfully',
          reports,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new VisitService();
