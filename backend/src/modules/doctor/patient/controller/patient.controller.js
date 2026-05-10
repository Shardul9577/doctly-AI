import patientService from '../service/patient.service.js';

class PatientController {
  async addNewPatient(req, res, next) {
    try {
      const userId = req.user._id;
      const patient = await patientService.addNewPatient(userId, req.body);
      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req, res, next) {
    try {
      const patientId = req.params.id;
      const patient = await patientService.updatePatient(patientId, req.body);
      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async getPatientLists(req, res, next) {
    try {
      const userId = req.user._id;

      const patient = await patientService.getPatientLists(userId, req.query);

      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async getPatientById(req, res, next) {
    try {
      const patientId = req.params.id;
      const patient = await patientService.getPatientById(patientId);
      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async getAllPatientLists(req, res, next) {
    try {
      const userId = req.user._id;
      const patient = await patientService.getAllPatientLists(
        userId,
        req.query
      );

      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async connectExistingPatient(req, res, next) {
    try {
      const userId = req.user._id;
      const patientId = req.params.id;
      const patient = await patientService.connectExistingPatient(
        userId,
        patientId
      );
      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }

  async disconnectExistingPatient(req, res, next) {
    try {
      const userId = req.user._id;
      const patientId = req.params.id;
      const patient = await patientService.disconnectExistingPatient(
        userId,
        patientId
      );
      res.status(patient.status).json({ ...patient.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new PatientController();
