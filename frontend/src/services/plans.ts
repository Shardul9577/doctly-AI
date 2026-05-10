import apiClient from '../utils/apiClient';

export interface PlanFeature {
  key: string;
  title: string;
  star_feature: boolean;
  description: string;
}

export interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: number;
  token_limit: number;
  features: PlanFeature[];
  billing_cycle: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlansResponse {
  status: boolean;
  data: {
    plans: Plan[];
  };
  message: string;
}

export const plansService = {
  // Get all plans
  getAllPlans: async (): Promise<PlansResponse> => {
    const response = await apiClient.get('/api/admin/plans');
    return response.data;
  },

  // Get plan by ID
  getPlanById: async (id: string): Promise<PlansResponse> => {
    const response = await apiClient.get(`/api/admin/plans/${id}`);
    return response.data;
  },
};
