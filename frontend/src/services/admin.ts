// frontend/src/services/admin.ts

import apiClient from '../utils/apiClient';

export interface UserData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface PaginationInfo {
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface AdminListResponse {
  status: boolean;
  message: string;
  data: UserData[];
  pagination: PaginationInfo;
}

export const getDoctorsList = async (params?: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<AdminListResponse> => {
  try {
    const response = await apiClient.get<AdminListResponse>('/admin/doctors', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching doctors list:', error);
    throw error;
  }
};

export const getPatientsList = async (params?: {
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<AdminListResponse> => {
  try {
    const response = await apiClient.get<AdminListResponse>('/admin/patients', {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching patients list:', error);
    throw error;
  }
};
