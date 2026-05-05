import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Hệ thống Quản trị',
  },
  routes: [
    {
      path: '/',
      redirect: '/admin',
    },
    {
      path: '/access',
      redirect: '/admin',
    },
    {
      path: '/table',
      redirect: '/admin',
    },
    {
      name: 'Quản trị viên',
      path: '/admin',
      component: './Admin',
    },
  ],
  npmClient: 'npm',
});
