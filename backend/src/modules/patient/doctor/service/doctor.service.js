import User from '../../../../models/user.model.js';
import DoctorPatientRelation from '../../../../models/doctorPatientRelation.model.js';
import { MESSAGES } from '../common/constant.common.js';
import PersonalDetail from '../../../../models/personalDetail.model.js'; 
class DoctorService {
  async getDoctors(patientId, query) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        abha_id = '',
        sortBy = 'firstName',
        sortOrder = 'asc',
        relation_status, // true or false
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);

      let relationFilter = { patient_id: patientId };

      if (relation_status !== undefined) {
        relationFilter.is_active = relation_status;
      }

      // Step 1: Fetch related patient IDs
      const doctorRelations =
        await DoctorPatientRelation.find(relationFilter).select('doctor_id');

      if (!doctorRelations || doctorRelations.length === 0) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.DOCTORS_NOT_FOUND,
            doctors: [],
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

      const doctorIds = doctorRelations.map((rel) => rel.doctor_id.toString());

      // Step 2: Build the base filter
      const filter = {
        _id: { $in: doctorIds },
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

      const doctors = await User.find(filter)
        .select('-password -accesstoken')
        
        .populate({
          path: 'personal_details',
          model: PersonalDetail,
          select: '-_id -user_id -createdAt -updatedAt -__v',
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
          message: MESSAGES.DOCTORS_FETCHED_SUCCESSFULLY,
          doctors,
          meta: {
            total,
            limit: itemsPerPage,
            currentPage,
            totalPages,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            prevPage: hasPrevPage ? currentPage - 1 : null,
            resultCount: doctors.length,
            sortBy,
            sortOrder,
          },
        },
      };
    } catch (error) {
      console.error('Error in getDoctors:', error);
      return {
        status: 500,
        result: {
          status: false,
          message: 'Internal Server Error',
          doctors: [],
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
}

export default new DoctorService();
