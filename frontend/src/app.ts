import { getUser } from '@/services/api';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { message, notification } from 'antd';

export async function getInitialState(): Promise<{ currentUser: any }> {
  return {
    currentUser: getUser(),
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    layout: 'mix',
    splitMenus: false,
    logout: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
    // Custom error boundary for the layout
    errorBoundary: {
      onError: (error: any, info: any) => {
        console.error('UI Error:', error, info);
      },
    },
  };
};

export const request = {
  timeout: 10000,
  errorConfig: {
    errorHandler(error: any) {
      const { response } = error;
      if (response && response.status) {
        const { status, statusText } = response;
        notification.error({
          message: `Request Error ${status}`,
          description: response.data?.message || statusText || 'An unexpected error occurred.',
        });
      } else if (!response) {
        notification.error({
          description: 'Your network has problems and cannot connect to the server',
          message: 'Network Error',
        });
      }
      throw error;
    },
  },
};

