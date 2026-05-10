// backend/src/modules/admin/service/admin.service.js

import User from '../../../models/user.model.js';
import PersonalDetails from '../../../models/personalDetail.model.js';
import Organizations from '../../../models/Organization.model.js';
import { MESSAGES } from '../common/constant.common.js';
import emailService from '../../../emails/services/mail.service.js';
import Blog from '../../../models/blog.model.js';
import { sendDocRejectionEmail } from '../../../utils/email.utils.js';
import { sendDocApprovalEmail } from '../../../utils/email.utils.js';

class AdminService {
  constructor() {
    this.userModel = User;
    this.personalDetailsModel = PersonalDetails;
    this.organizationModel = Organizations;
    this.blogModel = Blog;
  }
  async getDoctors(options) {
    try {
      const {
        search,
        status,
        sortBy,
        sortOrder,
        page = '1',
        limit = '10',
      } = options;
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);

      const query = { role: 'doctor', deleted_at: null };
      if (status && status !== 'all') {
        query.is_active = status === 'active';
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ];
      }

      const totalDocs = await User.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / parsedLimit);
      const skip = (parsedPage - 1) * parsedLimit;

      let sortOptions = {};
      if (sortBy) {
        if (sortBy === 'name') {
          sortOptions = {
            firstName: sortOrder === 'asc' ? 1 : -1,
            lastName: sortOrder === 'asc' ? 1 : -1,
          };
        } else {
          sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }
      } else {
        sortOptions = { createdAt: -1 };
      }

      const doctors = await User.find(query)
        .select('-password -__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit);

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.DOCTORS_FETCHED_SUCCESSFULLY,
          data: doctors,
          pagination: {
            totalDocs,
            limit: parsedLimit,
            page: parsedPage,
            totalPages,
            hasNextPage: parsedPage < totalPages,
            hasPrevPage: parsedPage > 1,
            nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
            prevPage: parsedPage > 1 ? parsedPage - 1 : null,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPatients(options) {
    try {
      const {
        search,
        status,
        sortBy,
        sortOrder,
        page = '1',
        limit = '10',
      } = options;
      const parsedPage = parseInt(page);
      const parsedLimit = parseInt(limit);

      const query = { role: 'patient', deleted_at: null };
      if (status && status !== 'all') {
        query.is_active = status === 'active';
      }

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ];
      }

      const totalDocs = await User.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / parsedLimit);
      const skip = (parsedPage - 1) * parsedLimit;

      let sortOptions = {};
      if (sortBy) {
        if (sortBy === 'name') {
          sortOptions = {
            firstName: sortOrder === 'asc' ? 1 : -1,
            lastName: sortOrder === 'asc' ? 1 : -1,
          };
        } else {
          sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }
      } else {
        sortOptions = { createdAt: -1 };
      }

      const patients = await User.find(query)
        .select('-password -__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit);

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PATIENTS_FETCHED_SUCCESSFULLY,
          data: patients,
          pagination: {
            totalDocs,
            limit: parsedLimit,
            page: parsedPage,
            totalPages,
            hasNextPage: parsedPage < totalPages,
            hasPrevPage: parsedPage > 1,
            nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
            prevPage: parsedPage > 1 ? parsedPage - 1 : null,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAccountDetailsById(userId) {
    try {
      if (!userId) {
        return {
          status: 400,
          result: {
            status: false,
            message: MESSAGES.MISSING_USER_ID,
          },
        };
      }

      const user = await User.findById(userId)
        .select('-_id -__v -password -deleted_at -createdAt -updatedAt')
        .lean();

      if (!user) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.USER_NOT_FOUND,
          },
        };
      }

      let totalPatients = 0;
      let totalDoctors = 0;

      try {
        totalPatients = await User.countDocuments({ role: 'patient' });
        totalDoctors = await User.countDocuments({ role: 'doctor' });
      } catch (error) {
        throw error;
      }

      const aboutDetails = {
        about: user?.about || null,
        social_links: user?.social_links || null,
        profile_picture: user?.profile_picture || null,
        abha_id: user?.abha_id || null,
        totalDoctors,
        totalPatients,
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
      };

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.ADMINS_FETCHED_SUCCESSFULLY,
          aboutDetails,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getDoctorsForDocumentVerification(options) {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
    } = options;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    let initialUserMatch = {
      role: 'doctor',
      deleted_at: null,
      is_active: true,
      personal_details: { $exists: true, $ne: null },
    };

    let aggregateQuery = [
      { $match: initialUserMatch },
      {
        $lookup: {
          from: this.personalDetailsModel.collection.name,
          localField: 'personal_details',
          foreignField: '_id',
          as: 'personal_details',
        },
      },
      { $unwind: '$personal_details' },
      {
        $match: {
          'personal_details.verified_status': { $ne: 'verified' },
          'personal_details.degree_url': { $exists: true, $ne: null, $ne: '' },
          'personal_details.aadhaar_card_url': {
            $exists: true,
            $ne: null,
            $ne: '',
          },
          'personal_details.pan_card_url': {
            $exists: true,
            $ne: null,
            $ne: '',
          },
          'personal_details.license_number': {
            $exists: true,
            $ne: null,
            $ne: '',
          },
          ...(search && {
            $or: [
              { firstName: new RegExp(search, 'i') },
              { lastName: new RegExp(search, 'i') },
              { email: new RegExp(search, 'i') },
              { 'personal_details.specialization': new RegExp(search, 'i') },
              { 'personal_details.qualification': new RegExp(search, 'i') },
            ],
          }),
        },
      },
    ];

    aggregateQuery.push({
      $lookup: {
        from: this.organizationModel.collection.name,
        localField: '_id',
        foreignField: 'doctor_ids',
        as: 'organizations',
      },
    });

    let sortStage = {};
    const order = sortOrder === 'asc' ? 1 : -1;

    if (sortBy === 'name') {
      sortStage = {
        firstName: order,
        lastName: order,
      };
    } else if (
      sortBy === 'personal_details.createdAt' ||
      sortBy === 'createdAt'
    ) {
      sortStage[sortBy] = order;
    } else if (sortBy) {
      sortStage[sortBy] = order;
    } else {
      sortStage = { 'personal_details.createdAt': -1 };
    }

    const projectStage = {
      _id: 1,
      firstName: 1,
      lastName: 1,
      abha_id: 1,
      personal_address: 1,
      gender: 1,
      email: 1,
      phone: 1,
      profile_picture: 1,
      birth_date: 1,
      blood_group: 1,
      marital_status: 1,
      spouse_full_name: 1,
      createdAt: 1,
      'personal_details.specialization': 1,
      'personal_details.qualification': 1,
      'personal_details.createdAt': 1,
      'personal_details.degree_url': 1,
      'personal_details.aadhaar_card_url': 1,
      'personal_details.pan_card_url': 1,
      'personal_details.license_number': 1,
      'personal_details.verified_status': 1,
      'personal_details.rejection_reason': 1,
      'organizations.name': 1,
      'organizations.type': 1,
      'organizations.phone': 1,
      'organizations.email': 1,
      'organizations.organization_address': 1,
      'organizations.is_individual': 1,
      'organizations.is_active': 1,
    };

    const totalDocsResult = await this.userModel.aggregate([
      ...aggregateQuery,
      { $count: 'total' },
    ]);

    const totalDocs = totalDocsResult.length > 0 ? totalDocsResult[0].total : 0;
    const totalPages = Math.ceil(totalDocs / parsedLimit);
    const skip = (parsedPage - 1) * parsedLimit;

    let fetchDoctorsPipeline = [
      ...aggregateQuery,
      { $sort: sortStage },
      { $project: projectStage },
      { $skip: skip },
      { $limit: parsedLimit },
    ];

    const doctors = await this.userModel.aggregate(fetchDoctorsPipeline);

    return {
      status: 200,
      result: {
        status: true,
        message: MESSAGES.DOCTORS_FOR_VERIFICATION_FETCHED_SUCCESSFULLY,
        message: MESSAGES.DOCTORS_FOR_VERIFICATION_FETCHED_SUCCESSFULLY,
        data: doctors,
        pagination: {
          totalDocs,
          limit: parsedLimit,
          page: parsedPage,
          totalPages,
          hasNextPage: parsedPage < totalPages,
          hasPrevPage: parsedPage > 1,
          nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
          prevPage: parsedPage > 1 ? parsedPage - 1 : null,
        },
      },
    };
  }

  async getDoctorDetailsForVerification(doctorId) {
    if (!doctorId) {
      return {
        status: 400,
        result: {
          status: false,
          message: MESSAGES.INVALID_DOCTOR_ID,
        },
      };
    }

    const doctor = await this.userModel
      .findById(doctorId)
      .populate({
        path: 'personal_details',
        model: 'personal_details',
        select: '-_id -user_id -__v -updatedAt',
      })
      .select('-password -__v');

    if (!doctor || doctor.role !== 'doctor' || !doctor.personal_details) {
      return {
        status: 404,
        result: {
          status: false,
          message: MESSAGES.DOCTOR_NOT_FOUND_OR_MISSING_DOCS,
        },
      };
    }

    const personalDetails = doctor.personal_details;

    if (
      !personalDetails.degree_url ||
      !personalDetails.aadhaar_card_url ||
      !personalDetails.pan_card_url
    ) {
      return {
        status: 404,
        result: {
          status: false,
          message: MESSAGES.DOCTOR_NOT_FOUND_OR_MISSING_DOCS,
        },
      };
    }

    return {
      status: 200,
      result: {
        status: true,
        message: MESSAGES.DOCTOR_DETAILS_FETCHED_SUCCESSFULLY,
        data: doctor,
      },
    };
  }

  async verifyDoctorDocuments(doctorId, action, rejectionReason) {
    const user = await this.userModel
      .findById(doctorId)
      .select('email firstName lastName');

    if (!user) {
      return { status: 404, result: { message: MESSAGES.DOCTOR_NOT_FOUND } };
    }
    const personalDetails = await this.personalDetailsModel.findOne({
      user_id: doctorId,
    });

    if (!personalDetails) {
      return { status: 404, result: { message: MESSAGES.DOCTOR_NOT_FOUND } };
    }

    if (
      !personalDetails.degree_url ||
      !personalDetails.aadhaar_card_url ||
      !personalDetails.pan_card_url
    ) {
      return {
        status: 400,
        result: { message: MESSAGES.DOCTOR_NO_DOCUMENTS_TO_VERIFY },
      };
    }

    let newStatus = personalDetails.verified_status;
    let updateFields = {};
    let message = '';

    if (action === 'approve') {
      if (newStatus === 'verified') {
        return {
          status: 200,
          result: {
            message: MESSAGES.DOCTOR_ALREADY_VERIFIED,
            doctor: personalDetails,
          },
        };
      }
      newStatus = 'verified';
      updateFields = { verified_status: newStatus, rejection_reason: null };
      message = MESSAGES.DOCTOR_DOCUMENTS_APPROVED;
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return {
          status: 400,
          result: { message: MESSAGES.REJECTION_REASON_REQUIRED },
        };
      }
      if (newStatus === 'rejected') {
        return {
          status: 200,
          result: {
            message: MESSAGES.DOCTOR_ALREADY_REJECTED,
            doctor: personalDetails,
          },
        };
      }
      newStatus = 'rejected';
      updateFields = {
        verified_status: newStatus,
        rejection_reason: rejectionReason,
      };
      message = MESSAGES.DOCTOR_DOCUMENTS_REJECTED;
    } else {
      return {
        status: 400,
        result: { message: MESSAGES.INVALID_VERIFICATION_ACTION },
      };
    }

    personalDetails.set(updateFields);
    await personalDetails.save();

    let name = `${user.firstName} ${user.lastName}`;

    if (action === 'approve') {
      await sendDocApprovalEmail(user.email, name);
    } else if (action === 'reject') {
      await sendDocRejectionEmail(user.email, name, rejectionReason);
    }
    return {
      status: 200,
      result: { message: message, doctor: personalDetails },
    };
  }

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

  async addOrUpdateInfo(userId, personalDetails) {
    try {
      const {
        email,
        firstName,
        lastName,
        phone,
        marital_status,
        about,
        city,
        state,
        country,
        zipCode,
        isPublic,
        profile_picture,
      } = personalDetails;

      const userUpdatePayload = {};

      if (email !== undefined && email !== null)
        userUpdatePayload.email = email;
      if (firstName !== undefined && firstName !== null)
        userUpdatePayload.firstName = firstName;
      if (lastName !== undefined && lastName !== null)
        userUpdatePayload.lastName = lastName;
      if (phone !== undefined && phone !== null)
        userUpdatePayload.phone = phone;

      if (marital_status !== undefined && marital_status !== null)
        userUpdatePayload.marital_status = marital_status;

      if (about !== undefined && about !== null)
        userUpdatePayload.about = about;
      if (isPublic !== undefined && isPublic !== null)
        userUpdatePayload.isPublic = isPublic;

      if (city !== undefined && city !== null)
        userUpdatePayload['address.city'] = city;
      if (state !== undefined && state !== null)
        userUpdatePayload['address.state'] = state;
      if (country !== undefined && country !== null)
        userUpdatePayload['address.country'] = country;
      if (zipCode !== undefined && zipCode !== null)
        userUpdatePayload['address.zipCode'] = zipCode;

      if (
        profile_picture !== undefined &&
        profile_picture !== null &&
        profile_picture !== ''
      ) {
        userUpdatePayload.photoURL = profile_picture;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: userUpdatePayload },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error(MESSAGES.PROFILE_NOT_FOUND);
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

  //Blog

  async createBlog(body, file, user) {
    try {
      const { postTitle, tags, sections } = body;

      const created_by = user?._id;
      const image = file ? file.path : null;

      let parsedTags = [];
      if (tags) {
        parsedTags = Array.isArray(tags) ? tags : JSON.parse(tags);
      }

      let parsedSections = [];
      if (sections) {
        parsedSections = Array.isArray(sections)
          ? sections
          : JSON.parse(sections);
      }

      const firstSectionDescription = parsedSections?.[0]?.description?.trim();
      if (!postTitle?.trim() || !firstSectionDescription) {
        return {
          status: 400,
          result: {
            status: false,
            message: MESSAGES.BLOG_REQUIREMENT,
          },
        };
      }

      const newBlog = await this.blogModel.create({
        postTitle,
        image,
        tags: parsedTags,
        sections: parsedSections,
        created_by,
      });

      return {
        status: 201,
        result: {
          status: true,
          message: MESSAGES.BLOG_POST_SUCCESS,
          blog: newBlog,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updateBlog(id, body, file, user) {
    try {
      const created_by = user._id;
      const updateData = { ...body };

      if (file) {
        updateData.image = file.path;
      }

      const updatedBlog = await this.blogModel.findOneAndUpdate(
        { _id: id, created_by, deleted_at: null },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedBlog) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.BLOG_NOT_FOUND,
          },
        };
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.BLOG_POSTED,
          blog: updatedBlog,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getBlogsByAdmin(user, options) {
    try {
      const { search, page = '1', limit = '10', sortBy, sortOrder } = options;
      const parsedPage = parseInt(page, 10);
      const parsedLimit = parseInt(limit, 10);

      const query = { deleted_at: null };

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        query.$or = [
          { postTitle: searchRegex },
          { 'sections.description': searchRegex },
        ];
      }

      const totalDocs = await this.blogModel.countDocuments(query);
      const totalPages = Math.ceil(totalDocs / parsedLimit);
      const skip = (parsedPage - 1) * parsedLimit;

      let sortOptions = {};
      if (sortBy) {
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } else {
        sortOptions = { createdAt: -1 };
      }

      const blogs = await this.blogModel
        .find(query)
        .select('-__v')
        .sort(sortOptions)
        .skip(skip)
        .limit(parsedLimit)
        .populate({
          path: 'created_by',
          select: 'firstName profile_picture',
        });

      const formattedBlogs = blogs.map((blog) => ({
        _id: blog._id,
        postTitle: blog.postTitle,
        image: blog.image,
        tags: blog.tags,
        sections: blog.sections,
        created_by: blog.created_by?._id,
        deleted_at: blog.deleted_at,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          name: blog.created_by?.firstName,
          avatarUrl: blog.created_by?.profile_picture,
        },
      }));

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.BLOG_RETRIEVED,
          blogs: formattedBlogs,
          pagination: {
            totalDocs,
            limit: parsedLimit,
            page: parsedPage,
            totalPages,
            hasNextPage: parsedPage < totalPages,
            hasPrevPage: parsedPage > 1,
            nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
            prevPage: parsedPage > 1 ? parsedPage - 1 : null,
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getBlogById(id) {
    try {
      if (!id) {
        return {
          status: 400,
          result: {
            status: false,
            message: MESSAGES.BLOG_NOT_FOUND,
          },
        };
      }

      const blog = await this.blogModel
        .findOne({ _id: id, deleted_at: null })
        .select('-__v')
        .populate({
          path: 'created_by',
          select: 'firstName profile_picture',
        });

      if (!blog) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.BLOG_NOT_FOUND,
          },
        };
      }

      const formattedBlog = {
        _id: blog._id,
        postTitle: blog.postTitle,
        image: blog.image,
        tags: blog.tags,
        sections: blog.sections,
        created_by: blog.created_by._id,
        deleted_at: blog.deleted_at,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          name: blog.created_by.firstName,
          avatarUrl: blog.created_by.profile_picture,
        },
      };

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.BLOG_RETRIEVED,
          blog: formattedBlog,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteBlog(id, user) {
    try {
      if (!id) {
        return {
          status: 400,
          result: {
            status: false,
            message: MESSAGES.BLOG_NOT_FOUND,
          },
        };
      }

      const created_by = user._id;

      const deletedBlog = await this.blogModel.findOneAndUpdate(
        { _id: id, created_by, deleted_at: null },
        { $set: { deleted_at: new Date() } },
        { new: true }
      );

      if (!deletedBlog) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.BLOG_NOT_FOUND,
          },
        };
      }

      const formattedBlog = {
        _id: deletedBlog._id,
        postTitle: deletedBlog.postTitle,
        image: deletedBlog.image,
        tags: deletedBlog.tags,
        sections: deletedBlog.sections,
        created_by: deletedBlog.created_by,
        deleted_at: deletedBlog.deleted_at,
        createdAt: deletedBlog.createdAt,
        updatedAt: deletedBlog.updatedAt,
      };

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.BLOG_DELETED_SUCCESS,
          blog: formattedBlog,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async searchBlogs(query) {
    if (!query || query.trim() === '') {
      return {
        status: 400,
        result: {
          status: false,
          message: MESSAGES.BLOG_SEARCH_ERR,
        },
      };
    }

    try {
      const searchRegex = new RegExp(query.trim(), 'i');

      const blogs = await this.blogModel
        .find({
          deleted_at: null,
          $or: [
            { postTitle: searchRegex },
            { 'sections.description': searchRegex },
          ],
        })
        .select('-__v')
        .sort({ createdAt: -1 })
        .populate({
          path: 'created_by',
          select: 'firstName profile_picture',
        });

      const formattedBlogs = blogs.map((blog) => ({
        _id: blog._id,
        postTitle: blog.postTitle,
        image: blog.image,
        tags: blog.tags,
        sections: blog.sections,
        created_by: blog.created_by._id,
        deleted_at: blog.deleted_at,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: {
          name: blog.created_by.firstName,
          avatarUrl: blog.created_by.profile_picture,
        },
      }));

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.BLOG_RETRIEVED,
          blogs: formattedBlogs,
        },
      };
    } catch (error) {
      return {
        status: 500,
        result: {
          status: false,
          message: MESSAGES.BLOG_SEARCH_ERR,
          error: error.message,
        },
      };
    }
  }
}

export default new AdminService();
