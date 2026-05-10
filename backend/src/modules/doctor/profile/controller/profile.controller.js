import profileService from '../service/profile.service.js';

class ProfileController {
  async updateProfile(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await profileService.updateProfile(
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
      const profile = await profileService.getProfile(userId);
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async addOrUpdateDegreeInfo(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await profileService.addOrUpdateDegreeInfo(
        userId,
        req.body,
        req.files
      );
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorDegreeInfo(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await profileService.getDoctorDegreeInfo(userId);
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorFullProfileDetails(req, res, next) {
    try {
      const userId = req.user._id;
      const profile = await profileService.getDoctorFullProfileDetails(userId);
      res.status(profile.status).json({ ...profile.result });
    } catch (error) {
      next(error);
    }
  }

  async addOrUpdateOrganization(req, res, next) {
    try {
      const userId = req.user._id;
      const organization = await profileService.addOrUpdateOrganization(
        userId,
        req.body
      );
      res.status(organization.status).json({ ...organization.result });
    } catch (error) {
      next(error);
    }
  }

  async getDoctorOrganizationDetails(req, res, next) {
    try {
      const userId = req.user._id;
      const organization =
        await profileService.getDoctorOrganizationDetails(userId);
      res.status(organization.status).json({ ...organization.result });
    } catch (error) {
      next(error);
    }
  }

  async rejectReport(req, res, next) {
    try {
      const doctorId = req.user._id;
      const { user_id } = req.body;
      const result = await profileService.rejectReport(doctorId, user_id);
      res.status(result.status).json({ ...result.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
