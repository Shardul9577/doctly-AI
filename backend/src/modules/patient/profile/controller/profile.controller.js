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

  async getAllReports(req, res, next) {
    try {
      const userId = req.user._id;
      const reports = await profileService.getAllReports(userId, req.query);
      res.status(reports.status).json({ ...reports.result });
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const userId = req.user._id;
      const { id } = req.params;
      const report = await profileService.getReportById(userId, id);
      res.status(report.status).json({ ...report.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
