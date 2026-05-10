// utils/tokenManager.ts
import type { NextRouter } from 'next/router';
import axiosInstance from './axios'; // Import your prebuilt axios instance

const API_URL = '/api/auth/refresh-token'; // Relative path (baseURL handled in axiosInstance)

export function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    const currentTime = Math.floor(Date.now() / 1000);

    // Buffer of 60 seconds (1 minute)
    const bufferTime = 120;

    // If the token expires in <= 60 seconds, consider it expired
    return decoded.exp - currentTime <= bufferTime;
  } catch (error) {
    console.error('Token parsing error:', error);
    return true; // treat invalid token as expired
  }
}

export async function tokenManager(router: NextRouter) {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!refreshToken) {
    clearAuthDataAndRedirect(router);
    return null;
  }

  try {
    const response = await axiosInstance.post(API_URL, { refreshToken });

    const token = response?.data?.accessToken;

    // Clear old tokens
    localStorage.removeItem('refreshToken');

    // Save new access token
    localStorage.setItem('accessToken', token);

    return token;
  } catch (error) {
    clearAuthDataAndRedirect(router);
    return null;
  }
}

function clearAuthDataAndRedirect(router: NextRouter) {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userData');
  router.push('/');
}
