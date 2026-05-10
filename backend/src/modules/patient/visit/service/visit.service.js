import Visit from '../../../../models/visit.model.js';
import DoctorPatientRelation from '../../../../models/doctorPatientRelation.model.js';
import mongoose from 'mongoose';
import User from '../../../../models/user.model.js';
class PatientVisitService {
  async getVisitList(patientId, query) {
    try {
      const relations = await DoctorPatientRelation.find({
        patient_id: patientId,
        is_active: true,
      }).select('_id');
      const relationIds = relations.map((r) => r._id);

      const visits = await Visit.find({
        doctor_patient_relations_id: { $in: relationIds },
        is_active: true,
      })
        .populate({
          path: 'doctor_patient_relations_id',
          populate: [
            {
              path: 'doctor_id',
              select: 'firstName lastName email phone abha_id profile_picture',
            },
            {
              path: 'patient_id',
              select: 'firstName lastName email phone abha_id profile_picture',
            },
          ],
        })
        .sort({ visit_date: -1 });

      return {
        status: 200,
        result: {
          status: true,
          message: 'Visits fetched successfully',
          visits,
          meta: {
            total: visits.length,
            resultCount: visits.length,
            sortBy: 'visit_date',
            sortOrder: 'desc',
          },
        },
      };
    } catch (error) {
      return {
        status: 500,
        result: {
          status: false,
          message: error.message,
        },
      };
    }
  }

  async getVisitById(visitId, patientId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(visitId)) {
        return {
          status: 400,
          result: { success: false, message: 'Invalid visit ID' },
        };
      }
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return {
          status: 400,
          result: { success: false, message: 'Invalid patient ID' },
        };
      }

      const visit = await Visit.findOne({
        _id: new mongoose.Types.ObjectId(visitId),
        is_active: true,
      }).populate({
        path: 'doctor_patient_relations_id',
        match: { patient_id: new mongoose.Types.ObjectId(patientId) },
        populate: [
          {
            path: 'patient_id',
            select: 'firstName lastName email phone abha_id profile_picture',
          },
          {
            path: 'doctor_id',
            select: 'firstName lastName email phone abha_id profile_picture',
          },
        ],
      });

      if (!visit || !visit.doctor_patient_relations_id) {
        return {
          status: 404,
          result: { success: false, message: 'Visit not found' },
        };
      }

      return {
        status: 200,
        result: { success: true, visit },
      };
    } catch (error) {
      return {
        status: 500,
        result: { success: false, message: error.message },
      };
    }
  }

  async getListOfDoctors(query) {
    try {
      const { page = 1, limit = 10, search = '' } = query;
      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      const doctors = await User.find({
        role: 'doctor',
        is_active: true,
      }).select('firstName lastName email phone abha_id profile_picture');

      console.log(doctors, 'doctors');

      return {
        status: 200,
        result: {
          success: true,
          doctors,
          meta: {
            total: doctors.length,
            limit: itemsPerPage,
            currentPage,
            totalPages: Math.ceil(doctors.length / itemsPerPage),
          },
        },
      };
    } catch (error) {
      return {
        status: 500,
        result: { success: false, message: error.message },
      };
    }
  }

  async bookVisit(patientId, visitData) {
    try {
      if (!mongoose.Types.ObjectId.isValid(patientId)) {
        return {
          status: 400,
          result: { success: false, message: 'Invalid patient ID' },
        };
      }

      const {
        doctor_id,
        visit_date,
        visit_time,
        duration,
        visit_type,
        case_file_type,
        symptoms,
      } = visitData;

      if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return {
          status: 400,
          result: { success: false, message: 'Invalid doctor ID' },
        };
      }

      const doctor_patient_id = await DoctorPatientRelation.findOne({
        doctor_id: doctor_id,
        patient_id: patientId,
        is_active: true,
      }).select('_id');

      let doctor_patient_relation_id = null;

      if (!doctor_patient_id) {
        const new_doctor_patient_id = await DoctorPatientRelation.create({
          doctor_id: doctor_id,
          patient_id: patientId,
          is_active: true,
        });

        doctor_patient_relation_id = new_doctor_patient_id._id;
      }

      const newVisit = new Visit({
        doctor_patient_relations_id:
          doctor_patient_id._id || doctor_patient_relation_id,
        visit_date: visit_date,
        visit_time: visit_time,
        duration: duration,
        visit_type: visit_type,
        case_file_type: case_file_type,
        symptoms: symptoms,
        is_active: false,
        status: 'pending',
      });

      await newVisit.save();

      return {
        status: 200,
        result: { success: true, message: 'Visit booked successfully' },
      };
    } catch (error) {
      return {
        status: 500,
        result: { success: false, message: error.message },
      };
    }
  }
}

export default new PatientVisitService();
