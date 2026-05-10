import User from '../../../../models/user.model.js';
import PatientRelation from '../../../../models/doctorPatientRelation.model.js';
import Organization from '../../../../models/organization.model.js';
import { MESSAGES } from '../common/constant.common.js';
import { hashPassword } from '../../../../utils/bcrypt.util.js';

class PatientService {
  async addNewPatient(userId, patientData) {
    try {
      const { phone, email } = patientData;

      const existing = await User.findOne({ email }).select('_id email');
      if (existing) {
        return {
          status: 409,
          result: {
            status: false,
            message: MESSAGES.PATIENT_ALREADY_EXISTS,
          },
        };
      }

      // Hash the password
      const hashedPassword = await hashPassword(phone.toString());

      const newPatient = await User.create({
        ...patientData,
        role: 'patient',
        password: hashedPassword,
      });

      if (newPatient) {
        const organization = await Organization.findOne({
          owner_id: userId,
        }).select('_id');
        await PatientRelation.create({
          patient_id: newPatient._id,
          doctor_id: userId,
          organization_id: organization ? organization._id : null,
          is_active: true,
        });
      }
      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENT_CREATED_SUCCESSFULLY,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePatient(patientId, patientData) {
    try {
      const patient = await User.findById(patientId);

      if (!patient) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PATIENT_NOT_FOUND,
          },
        };
      }

      Object.assign(patient, patientData);
      await patient.save();

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENT_UPDATED_SUCCESSFULLY,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPatientLists(doctorId, query = {}) {
    try {
      const {
        page,
        limit,
        search = '',
        abha_id = '',
        sortBy = 'firstName',
        sortOrder = 'asc',
        relation_status, // true or false
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      let relationFilter = { doctor_id: doctorId };
      if (relation_status !== undefined) {
        relationFilter.is_active = relation_status;
      }

      // Step 1: Fetch related patient IDs
      const patientRelations =
        await PatientRelation.find(relationFilter).select('patient_id');

      if (!patientRelations || patientRelations.length === 0) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PATIENTS_NOT_FOUND,
            patients: [],
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

      const patientIds = patientRelations.map((rel) =>
        rel.patient_id.toString()
      );

      // Step 2: Build the base filter
      const filter = {
        _id: { $in: patientIds },
      };

      // Step 3: Add search conditions
      const orConditions = [];
      if (search) {
        const regex = new RegExp(search, 'i');
        orConditions.push(
          { firstName: regex },
          { lastName: regex },
          { email: regex }
        );
      }

      if (abha_id) {
        const abhaRegex = new RegExp(abha_id, 'i');
        orConditions.push({ abha_id: abhaRegex });
      }

      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }

      // Step 4: Sorting and Pagination
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      const total = await User.countDocuments(filter);

      const patients = await User.find(filter)
        .select(
          '_id abha_id firstName lastName email age phone personal_address profile_picture'
        )
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
          message: MESSAGES.PATIENTS_FETCHED_SUCCESSFULLY,
          patients,
          meta: {
            total,
            limit: itemsPerPage,
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            resultCount: patients.length,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      console.error('Error in getPatientLists:', error);
      return {
        status: 500,
        result: {
          status: false,
          message: 'Internal Server Error',
          patients: [],
          meta: {
            total: 0,
            limit: parseInt(query.limit || 10),
            currentPage: parseInt(query.page || 1),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
            resultCount: 0,
            sortBy: query.sortBy || 'firstName',
            sortOrder: query.sortOrder || 'asc',
          },
        },
      };
    }
  }

  async getPatientById(patientId) {
    try {
      const patient = await User.findById(patientId).select(
        '-_id -password -__v -createdAt -updatedAt -deleted_at'
      );

      if (!patient) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PATIENT_NOT_FOUND,
          },
        };
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENTS_FETCHED_SUCCESSFULLY,
          patient,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllPatientLists(doctorId, query) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        abha_id = '',
        sortBy = 'firstName',
        sortOrder,
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      // 1. Find all patient_ids that have any relation
      const allRelations = await PatientRelation.find({
        doctor_id: doctorId,
        is_active: true,
      }).select('patient_id');
      const allRelatedPatientIds = new Set(
        allRelations.map((rel) => rel.patient_id.toString())
      );

      // 2. Build filter for User query
      const filter = {
        _id: { $nin: Array.from(allRelatedPatientIds) },
        role: 'patient',
      };

      // Add search conditions
      const orConditions = [];
      if (search) {
        const regex = new RegExp(search, 'i');
        orConditions.push(
          { firstName: regex },
          { lastName: regex },
          { email: regex }
        );
      }
      if (abha_id) {
        const abhaRegex = new RegExp(abha_id, 'i');
        orConditions.push({ abha_id: abhaRegex });
      }
      if (orConditions.length > 0) {
        filter.$or = orConditions;
      }

      // Sorting and Pagination
      const sortOptions = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
      const total = await User.countDocuments(filter);

      const patients = await User.find(filter)
        .select(
          '_id abha_id firstName lastName email age phone personal_address profile_picture social_links'
        )
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
          message: 'Patients fetched successfully',
          patients,
          meta: {
            total,
            limit: itemsPerPage,
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            resultCount: patients.length,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      console.error('Error in getAllPatientLists:', error);
      return {
        status: 500,
        result: {
          status: false,
          message: 'Internal Server Error',
          patients: [],
          meta: {
            total: 0,
            limit: parseInt(query.limit || 10),
            currentPage: parseInt(query.page || 1),
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null,
            resultCount: 0,
            sortBy: query.sortBy || 'firstName',
            sortOrder: query.sortOrder || 'asc',
          },
        },
      };
    }
  }

  async connectExistingPatient(userId, patientId) {
    try {
      // Check if relation already exists
      const existingRelation = await PatientRelation.findOne({
        doctor_id: userId,
        patient_id: patientId,
      });

      if (existingRelation) {
        if (existingRelation.is_active) {
          return {
            status: 400,
            result: {
              status: false,
              message: MESSAGES.PATIENT_ALREADY_CONNECTED,
            },
          };
        }

        // Reactivate the inactive relation
        existingRelation.is_active = true;
        await existingRelation.save();

        return {
          status: 200,
          result: {
            status: true,
            message: MESSAGES.PATIENT_REACTIVATED,
          },
        };
      }

      // Get organization ID
      const organization = await Organization.findOne({
        owner_id: userId,
      }).select('_id');

      // Create new relation
      await PatientRelation.create({
        patient_id: patientId,
        doctor_id: userId,
        organization_id: organization ? organization._id : null,
        is_active: true,
      });

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENT_CONNECTED,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async disconnectExistingPatient(doctorId, patientId) {
    try {
      const relation = await PatientRelation.findOne({
        doctor_id: doctorId,
        patient_id: patientId,
      });

      if (!relation) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PATIENT_NOT_FOUND,
          },
        };
      }

      if (!relation.is_active) {
        return {
          status: 400,
          result: {
            status: false,
            message: MESSAGES.PATIENT_ALREADY_DISCONNECTED,
          },
        };
      }

      relation.is_active = false;
      await relation.save();

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENT_DISCONNECTED,
        },
      };
    } catch (error) {
      next(error);
    }
  }
}

export default new PatientService();
