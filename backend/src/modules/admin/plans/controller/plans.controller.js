import plansService from '../service/plans.service.js';

class PlansController {
  async createPlan(req, res, next) {
    try {
      const plan = await plansService.createPlan(req.body);
      res.status(plan.status).json({ ...plan.result });
    } catch (error) {
      next(error);
    }
  }

  async updatePlan(req, res, next) {
    try {
      const planId = req.params.id;
      const plan = await plansService.updatePlan(planId, req.body);
      res.status(plan.status).json({ ...plan.result });
    } catch (error) {
      next(error);
    }
  }

  async getPlansList(req, res, next) {
    try {
      const plans = await plansService.getPlansList(req.query);
      res.status(plans.status).json({ ...plans.result });
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req, res, next) {
    try {
      const planId = req.params.id;
      const plan = await plansService.getPlanById(planId);
      res.status(plan.status).json({ ...plan.result });
    } catch (error) {
      next(error);
    }
  }

  async deletePlan(req, res, next) {
    try {
      const planId = req.params.id;
      const plan = await plansService.deletePlan(planId);
      res.status(plan.status).json({ ...plan.result });
    } catch (error) {
      next(error);
    }
  }

  async togglePlanStatus(req, res, next) {
    try {
      const planId = req.params.id;
      const plan = await plansService.togglePlanStatus(planId);
      res.status(plan.status).json({ ...plan.result });
    } catch (error) {
      next(error);
    }
  }
}

export default new PlansController();
