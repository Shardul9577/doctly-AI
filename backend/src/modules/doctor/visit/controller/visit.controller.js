import visitService from '../service/visit.service.js';

class VisitController {
  async addNewVisit(req, res, next) {
    try {
      const userId = req.user._id;
      const visit = await visitService.addNewVisit(userId, req.body);
      res.status(visit.status).json({ ...visit.result });
    } catch (error) {
      next(error);
    }
  }

  async updateExistingVisit(req, res, next) {
    try {
      const visitId = req.params.id;
      const files = req.files;
      const data = req.body;
      const visit = await visitService.updateExistingVisit(
        visitId,
        files,
        data,
      );
      res.status(visit.status).json({ ...visit.result });
    } catch (error) {
      next(error);
    }
  }

  async getVisitList(req, res, next) {
    try {
      const doctorId = req.user._id;
      const query = req.query;
      const response = await visitService.getVisitList(doctorId, query);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async getVisitById(req, res, next) {
    try {
      const visitId = req.params.id;
      const response = await visitService.getVisitById(visitId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async getVisitListByPatientApprovalToday(req, res, next) {
    try {
      const doctorId = req.user._id;
      const response =
        await visitService.getVisitListByPatientApprovalToday(doctorId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async approveVisit(req, res, next) {
    try {
      const visitId = req.params.id;
      const response = await visitService.approveVisit(visitId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async rejectVisit(req, res, next) {
    try {
      const visitId = req.params.id;
      const response = await visitService.rejectVisit(visitId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async getReportList(req, res, next) {
    try {
      const { patientId } = req.query;

      console.log(patientId, 'patientId');

      const response = await visitService.getReportList(patientId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }
}

export default new VisitController();
