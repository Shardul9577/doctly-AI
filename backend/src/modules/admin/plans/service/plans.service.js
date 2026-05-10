import plansModel from '../../../../models/plans.model.js';
import { MESSAGES } from '../common/constant.common.js';

class PlansService {
  async createPlan(planData) {
    try {
      const { name } = planData;

      // Check if plan with same name already exists
      const existingPlan = await plansModel.findOne({ name });
      if (existingPlan) {
        return {
          status: 409,
          result: {
            status: false,
            message: 'Plan with this name already exists',
          },
        };
      }

      const newPlan = await plansModel.create(planData);

      return {
        status: 201,
        result: {
          status: true,
          message: MESSAGES.PLAN_CREATED_SUCCESSFULLY,
          data: newPlan,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePlan(planId, planData) {
    try {
      const plan = await plansModel.findById(planId);

      if (!plan) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PLAN_NOT_FOUND,
          },
        };
      }

      // Check if name is being updated and if it conflicts with existing plan
      if (planData.name && planData.name !== plan.name) {
        const existingPlan = await plansModel.findOne({
          name: planData.name,
          _id: { $ne: planId },
        });
        if (existingPlan) {
          return {
            status: 409,
            result: {
              status: false,
              message: 'Plan with this name already exists',
            },
          };
        }
      }

      Object.assign(plan, planData);
      await plan.save();

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PLAN_UPDATED_SUCCESSFULLY,
          data: plan,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPlansList(query = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        is_active,
        billing_cycle,
        sortBy = 'priority',
        sortOrder = 'asc',
      } = query;

      const currentPage = parseInt(page);
      const itemsPerPage = parseInt(limit);
      const skip = (currentPage - 1) * itemsPerPage;

      // Build filter object
      const filter = {};

      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }

      if (is_active !== undefined) {
        filter.is_active = is_active === 'true';
      }

      if (billing_cycle) {
        filter.billing_cycle = billing_cycle;
      }

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const [plans, totalPlans] = await Promise.all([
        plansModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(itemsPerPage)
          .lean(),
        plansModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(totalPlans / itemsPerPage);

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PLANS_RETRIEVED_SUCCESSFULLY,
          data: {
            plans,
            pagination: {
              currentPage,
              totalPages,
              totalPlans,
              itemsPerPage,
              hasNextPage: currentPage < totalPages,
              hasPrevPage: currentPage > 1,
            },
          },
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getPlanById(planId) {
    try {
      const plan = await plansModel.findById(planId);

      if (!plan) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PLAN_NOT_FOUND,
          },
        };
      }

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PLAN_RETRIEVED_SUCCESSFULLY,
          data: plan,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async deletePlan(planId) {
    try {
      const plan = await plansModel.findById(planId);

      if (!plan) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PLAN_NOT_FOUND,
          },
        };
      }

      await plansModel.findByIdAndDelete(planId);

      return {
        status: 200,
        result: {
          status: true,
          message: MESSAGES.PLAN_DELETED_SUCCESSFULLY,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async togglePlanStatus(planId) {
    try {
      const plan = await plansModel.findById(planId);

      if (!plan) {
        return {
          status: 404,
          result: {
            status: false,
            message: MESSAGES.PLAN_NOT_FOUND,
          },
        };
      }

      plan.is_active = !plan.is_active;
      await plan.save();

      return {
        status: 200,
        result: {
          status: true,
          message: `Plan ${plan.is_active ? 'activated' : 'deactivated'} successfully`,
          data: plan,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new PlansService();
