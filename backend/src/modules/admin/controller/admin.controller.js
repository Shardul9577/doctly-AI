// backend/src/modules/admin/controller/admin.controller.js

import AdminService from '../service/admin.service.js';

class AdminController {
  async getDoctorsList(req, res, next) {
    try {
      const doctors = await AdminService.getDoctors(req.query);
      res.status(doctors.status).json({ ...doctors?.result });
    } catch (error) {
      next(error);
    }
  }

  async getPatientsList(req, res, next) {
    try {
      const patients = await AdminService.getPatients(req.query);
      res.status(patients.status).json(patients.result);
    } catch (error) {
      next(error);
    }
  }

  async getAdminDetails(req, res, next) {
    try {
      const serviceResponse = await AdminService.getAccountDetailsById(
        req?.user?.id
      );
      res.status(serviceResponse.status).json({ ...serviceResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorsForDocumentVerification(req, res, next) {
    try {
      const doctorsData = await AdminService.getDoctorsForDocumentVerification(
        req.query
      );
      res.status(doctorsData.status).json(doctorsData.result);
    } catch (error) {
      next(error);
    }
  }
  async getDoctorDetails(req, res, next) {
    try {
      const { id } = req.params;
      const serviceResponse =
        await AdminService.getDoctorDetailsForVerification(id);

      res.status(serviceResponse.status).json({ ...serviceResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async verifyDoctorDocuments(req, res, next) {
    try {
      const { id } = req.params;
      const { action, rejectionReason } = req.body;
      const serviceResponse = await AdminService.verifyDoctorDocuments(
        id,
        action,
        rejectionReason
      );

      res.status(serviceResponse.status).json({
        ...serviceResponse.result,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await AdminService.updateProfile(
        userId,
        req.body,
        req.file
      );
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await AdminService.getProfile(userId);
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async addOrUpdateInfo(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await AdminService.addOrUpdateInfo(userId, req.body);
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  //Blog
  async createBlog(req, res, next) {
    try {
      const blogResponse = await AdminService.createBlog(
        req.body,
        req.file,
        req.user
      );
      res.status(blogResponse.status).json({ ...blogResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async updateBlog(req, res, next) {
    try {
      const blogResponse = await AdminService.updateBlog(
        req.params.id,
        req.body,
        req.file,
        req.user
      );
      res.status(blogResponse.status).json({ ...blogResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async getBlogsList(req, res, next) {
    try {
      const blogsResponse = await AdminService.getBlogsByAdmin(
        req.user,
        req.query
      );
      res.status(blogsResponse.status).json({ ...blogsResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async getSingleBlog(req, res, next) {
    try {
      const blogResponse = await AdminService.getBlogById(req.params.id);
      res.status(blogResponse.status).json({ ...blogResponse.result });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req, res, next) {
    try {
      const deleteResponse = await AdminService.deleteBlog(
        req.params?.id,
        req.user
      );
      res.status(deleteResponse.status).json({ ...deleteResponse.result });
    } catch (error) {
      next(error);
    }
  }
  async searchBlogs(req, res, next) {
    try {
      const searchResult = await AdminService.searchBlogs(req.query.query);
      res.status(searchResult.status).json({ ...searchResult.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
