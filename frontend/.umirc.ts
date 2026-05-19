import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},

  // =================================================================
  // CẤU HÌNH VIỆT HÓA TOÀN CỤC (Sửa triệt để các nút tiếng Trung/Anh)
  // =================================================================
  locale: {
    default: 'vi-VN', // Đặt ngôn ngữ mặc định hệ thống là Tiếng Việt
    antd: true, // Bật tự động dịch bộ thư viện Ant Design sang tiếng Việt
    baseNavigator: false, // Bỏ qua thiết lập ngôn ngữ gốc của trình duyệt người dùng
  },

  layout: {
    title: 'CLB Thiết Bị',
    locale: false, // Giữ false để ẩn nút chuyển vùng ngôn ngữ trên thanh Header
  },

  routes: [
    // Tuyến đường gốc trung gian: Tự động kiểm tra Vai trò để rẽ luồng điều hướng
    { path: '/', component: './index' },

    // =================================================================
    // 1. GIAO DIỆN CLIENT ĐỘC LẬP (SINH VIÊN / GIẢNG VIÊN)
    // =================================================================
    {
      name: 'Trang chủ Client',
      path: '/client-home',
      component: './ClientHome',
      layout: false, // Ẩn hoàn toàn khung Sidebar Menu bên trái của Admin
      wrappers: ['@/wrappers/AuthWrapper'],
    },

    // =================================================================
    // 2. GIAO DIỆN QUẢN TRỊ (CHỈ DÀNH RIÊNG CHO ADMIN)
    // =================================================================
    // --- NHÓM LÕI ---
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

    // --- NHÓM NGHIỆP VỤ NÂNG CAO ---
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

    // --- NHÓM CỘNG ĐỒNG ---
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

    // --- NHÓM BÁO CÁO & HỆ THỐNG ---
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

    // --- NHÓM CÁ NHÂN ---
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

    // =================================================================
    // 3. TRANG ĐĂNG NHẬP (LAYOUT ĐỘC LẬP)
    // =================================================================
    { path: '/login', component: './Login', layout: false },
  ],
  npmClient: 'npm',
});
