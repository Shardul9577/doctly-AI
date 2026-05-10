import visitService from '../service/visit.service.js';

class visitController {
  async getVisitList(req, res, next) {
    try {
      const patientId = req.user._id;
      const query = req.query;
      const response = await visitService.getVisitList(
        patientId,
        query,
        'patient'
      );
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async getVisitById(req, res, next) {
    try {
      const visitId = req.params.id;
      const patientId = req.user._id;
      const response = await visitService.getVisitById(visitId, patientId);
      res.status(response.status).json(response.result);
    } catch (error) {
      next(error);
    }
  }

  async getListOfDoctors(req, res, next) {
    try {
      const query = req.query;

      console.log(query, 'query');

      const response = await visitService.getListOfDoctors(query);
      res.status(response.status).json({ ...response.result });
    } catch (error) {
      next(error);
    }
  }

  async bookVisit(req, res, next) {
    try {
      const patientId = req.user._id;
      const {
        doctor_id,
        visit_date,
        visit_time,
        duration,
        visit_type,
        case_file_type,
        symptoms,
      } = req.body;

      const response = await visitService.bookVisit(patientId, {
        doctor_id,
        visit_date,
        visit_time,
        duration,
        visit_type,
        case_file_type,
        symptoms,
      });

      res.status(response.status).json({ ...response.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new visitController();
