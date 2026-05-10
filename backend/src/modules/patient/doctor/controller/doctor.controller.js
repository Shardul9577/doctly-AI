import doctorService from '../service/doctor.service.js';

class DoctorController {
  async getDoctors(req, res, next) {
    try {
      const patientId = req.user._id;
      const doctors = await doctorService.getDoctors(patientId, req.query);
      res.status(doctors.status).json({ ...doctors.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new DoctorController();
