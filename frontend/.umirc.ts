import { defineConfig } from '@umijs/max';

export default defineConfig({
  // Proxy API requests to Spring Boot backend (port 8080)
  proxy: {
    '/api/v1': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },

  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},

  locale: {
    default: 'vi-VN',
    antd: true,
    baseNavigator: false,
  },

  layout: {
    title: 'CLB Thiết Bị',
    locale: false,
  },

  // Performance Optimizations
  hash: true,
  fastRefresh: true,
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },

  routes: [
    { path: '/', component: './index' },
    {
      name: 'Trang chủ Client',
      path: '/client-home',
      component: './ClientHome',
      layout: false,
      wrappers: ['@/wrappers/AuthWrapper'],
    },
    {
      name: 'Bảng điều khiển',
      icon: 'DashboardOutlined',
      path: '/admin',
      component: './Admin',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Dịch vụ thiết bị',
      icon: 'AppstoreAddOutlined',
      path: '/home',
      component: './Home',
      wrappers: ['@/wrappers/AuthWrapper'],
    },
    {
      name: 'Quản lý Bảo trì',
      icon: 'ToolOutlined',
      path: '/maintenance',
      component: './Maintenance',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Vi phạm & Thu phạt',
      icon: 'DollarOutlined',
      path: '/penalties',
      component: './Penalties',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Cộng đồng thảo luận',
      icon: 'TeamOutlined',
      path: '/forum',
      component: './Forum',
      wrappers: ['@/wrappers/AuthWrapper'],
    },
    {
      name: 'Quản lý thông báo',
      icon: 'NotificationOutlined',
      path: '/notifications',
      component: './Notifications',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Báo cáo & Thống kê',
      icon: 'PieChartOutlined',
      path: '/reports',
      component: './Reports',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Nhật ký hệ thống',
      icon: 'ProfileOutlined',
      path: '/audit-logs',
      component: './AuditLogs',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Cấu hình tham số',
      icon: 'ControlOutlined',
      path: '/settings',
      component: './Settings',
      wrappers: ['@/wrappers/AuthWrapper'],
      access: 'canAdmin',
    },
    {
      name: 'Hướng dẫn & FAQ',
      icon: 'QuestionCircleOutlined',
      path: '/help',
      component: './Help',
      wrappers: ['@/wrappers/AuthWrapper'],
    },
    {
      name: 'Hồ sơ tài khoản',
      icon: 'UserOutlined',
      path: '/account',
      component: './Account',
      wrappers: ['@/wrappers/AuthWrapper'],
    },
    { path: '/login', component: './Login', layout: false },
    { path: '/signup', component: './SignUp', layout: false },
  ],
  npmClient: 'npm',
});