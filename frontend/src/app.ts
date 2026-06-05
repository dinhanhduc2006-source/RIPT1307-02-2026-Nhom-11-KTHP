import { getUser, clearAuth } from '@/services/api';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { message, notification, Avatar, Dropdown } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { SelectLang } from '@@/plugin-locale';
import './global.css';

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
    // Provide a custom rightRender to localize the logout label and ensure safe logout call
    rightRender: (initState: any, setInitState: any, runtimeConfig: any) => {
      const showAvatar = initState?.avatar || initState?.name || runtimeConfig.logout;
      const disableAvatarImg = initState?.avatar === false;
      const nameClassName = disableAvatarImg ? 'umi-plugin-layout-name umi-plugin-layout-hide-avatar-img' : 'umi-plugin-layout-name';

      const avatarChildren: any[] = [];
      if (!disableAvatarImg) {
        avatarChildren.push(
            React.createElement(Avatar, {
              key: 'avatar-img',
              size: 'small',
              className: 'umi-plugin-layout-avatar',
              src: initState?.avatar || 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
              alt: 'avatar',
            }),
        );
      }
      avatarChildren.push(React.createElement('span', { key: 'avatar-name', className: nameClassName }, initState?.name));

      const avatarDom = showAvatar ? React.createElement('span', { className: 'umi-plugin-layout-action' }, ...avatarChildren) : null;

      const menu = {
        className: 'umi-plugin-layout-menu',
        selectedKeys: [],
        items: [
          {
            key: 'logout',
            label: React.createElement(React.Fragment, null, React.createElement(LogoutOutlined, { key: 'logout-icon' }), ' Đăng xuất'),
            onClick: () => {
              runtimeConfig?.logout?.(initState);
            },
          },
        ],
      };

      const rightChildren: any[] = [];
      if (runtimeConfig.logout) {
        rightChildren.push(React.createElement(Dropdown, { key: 'dropdown', menu: menu, overlayClassName: 'umi-plugin-layout-container' }, avatarDom));
      } else {
        rightChildren.push(avatarDom);
      }
      rightChildren.push(React.createElement(SelectLang, { key: 'select-lang' }));

      return React.createElement('div', { className: 'umi-plugin-layout-right anticon' }, ...rightChildren);
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
  baseURL: process.env.UMI_APP_API_URL || '',

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