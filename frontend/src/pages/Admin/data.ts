// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES) ---

export type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  author: string;
  createdAt: string;
  comments: number;
  positive: number;
  negative: number;
};

export type User = {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: 'Student' | 'Faculty' | 'Admin';
  status: 'Active' | 'Locked';
  createdAt: string;
};

export type Equipment = {
  id: number;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'Available' | 'Out of Stock' | 'Maintenance';
};

export type LoanRequest = {
  id: number;
  requester: User;
  equipment: Equipment;
  borrowDate: string;
  returnDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  rejectReason?: string;
};

export type Announcement = {
  id: number;
  title: string;
  content: string;
  status: 'Active' | 'Draft' | 'Archived';
  author: string;
  createdAt: string;
};

export type SystemConfig = {
  maxBorrowDays: number;
  finePerDay: number;
  allowOverdueBorrow: boolean;
  clubEmail: string;
};

// --- 2. DỮ LIỆU MẪU KHỞI TẠO (MOCK DATA) ---

// ĐÃ SỬA: Chuỗi mã băm Bcrypt chuẩn toán học 100% của mật khẩu "123456" (Xóa bỏ hoàn toàn import bcryptjs ở đầu file để tránh block UI)
const HASHED_123456 =
  '$2a$10$.5Elh8fgxypNUWhpUUr/xOa2sZm0VIaE0qWuGGl9otUfobb46T1Pq';

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@school.edu.vn',
    password: HASHED_123456,
    role: 'Admin',
    status: 'Active',
    createdAt: '2025-12-01',
  },
  {
    id: 2,
    username: 'sv01',
    email: 'sv01@school.edu.vn',
    password: HASHED_123456,
    role: 'Student',
    status: 'Active',
    createdAt: '2026-01-10',
  },
  {
    id: 3,
    username: 'gv01',
    email: 'gv01@school.edu.vn',
    password: HASHED_123456,
    role: 'Faculty',
    status: 'Locked',
    createdAt: '2026-02-14',
  },
];

export const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Đề xuất tổ chức buổi thảo luận môn Lập trình web',
    content:
      'Cần thêm buổi thảo luận và chia nhóm thực hành cho môn Lập trình web, đặc biệt cho các bạn sinh viên năm nhất.',
    tags: ['môn học', 'web', 'câu lạc bộ'],
    category: 'Học tập',
    author: 'Nguyễn Văn A',
    createdAt: '2026-05-02',
    comments: 4,
    positive: 12,
    negative: 1,
  },
  {
    id: 2,
    title: 'Xin mượn máy chiếu cho buổi họp câu lạc bộ ngày chủ nhật',
    content:
      'Buổi họp câu lạc bộ sáng tạo tuần này cần dùng máy chiếu và thiết bị âm thanh cầm tay. Xin ban quản trị hỗ trợ.',
    tags: ['thiết bị', 'câu lạc bộ', 'máy chiếu'],
    category: 'Sự kiện',
    author: 'Trần Thị B',
    createdAt: '2026-05-03',
    comments: 6,
    positive: 18,
    negative: 0,
  },
];

export const initialEquipment: Equipment[] = [
  {
    id: 1,
    name: 'Máy chiếu Sony',
    category: 'Trình chiếu',
    available: 2,
    total: 3,
    status: 'Available',
  },
  {
    id: 2,
    name: 'Micro không dây',
    category: 'Âm thanh',
    available: 1,
    total: 2,
    status: 'Available',
  },
  {
    id: 3,
    name: 'Laptop dự phòng',
    category: 'Tin học',
    available: 0,
    total: 1,
    status: 'Out of Stock',
  },
];

export const initialRequests: LoanRequest[] = [
  {
    id: 1,
    requester: initialUsers[1],
    equipment: initialEquipment[0],
    borrowDate: '2026-05-06',
    returnDate: '2026-05-07',
    status: 'Pending',
  },
  {
    id: 2,
    requester: initialUsers[2],
    equipment: initialEquipment[1],
    borrowDate: '2026-05-05',
    returnDate: '2026-05-06',
    status: 'Approved',
  },
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Thông báo nghỉ lễ 30/4 - 1/5',
    content:
      'Kho thiết bị sẽ tạm thời đóng cửa từ ngày 30/4 đến hết ngày 3/5. Các bạn vui lòng thực hiện thủ tục hoàn trả đồ trước thời hạn nêu trên.',
    status: 'Active',
    author: 'Admin Lõi',
    createdAt: '2026-04-25',
  },
];

export const initialSystemConfig: SystemConfig = {
  maxBorrowDays: 7,
  finePerDay: 20000,
  allowOverdueBorrow: false,
  clubEmail: 'clb.thietbi@school.edu.vn',
};
