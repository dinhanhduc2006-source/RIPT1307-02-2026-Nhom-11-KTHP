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
  role: 'Sinh viên' | 'Giảng viên' | 'Quản trị viên';
  status: 'Active' | 'Locked';
  createdAt: string;
};

export type Equipment = {
  id: number;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'Sẵn sàng' | 'Hết hàng' | 'Bảo trì';
};

export type LoanRequest = {
  id: number;
  requester: string;
  item: string;
  borrowDate: string;
  returnDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Đề xuất tổ chức buổi thảo luận môn Lập trình web',
    content:
      'Cần thêm buổi thảo luận và chia nhóm thực hành cho môn Lập trình web, đặc biệt cho các bạn năm nhất.',
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
    title: 'Xin mượn máy chiếu cho buổi họp câu lạc bộ',
    content:
      'Buổi họp câu lạc bộ sáng tạo cần dùng máy chiếu và loa. Xin admin hỗ trợ giữ thiết bị.',
    tags: ['thiết bị', 'câu lạc bộ', 'máy chiếu'],
    category: 'Sự kiện',
    author: 'Trần Thị B',
    createdAt: '2026-05-03',
    comments: 6,
    positive: 18,
    negative: 0,
  },
];

export const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@school.edu.vn',
    role: 'Quản trị viên',
    status: 'Active',
    createdAt: '2025-12-01',
  },
  {
    id: 2,
    username: 'sv01',
    email: 'sv01@school.edu.vn',
    role: 'Sinh viên',
    status: 'Active',
    createdAt: '2026-01-10',
  },
  {
    id: 3,
    username: 'gv01',
    email: 'gv01@school.edu.vn',
    role: 'Giảng viên',
    status: 'Locked',
    createdAt: '2026-02-14',
  },
];

export const initialEquipment: Equipment[] = [
  {
    id: 1,
    name: 'Máy chiếu Sony',
    category: 'Trình chiếu',
    available: 2,
    total: 3,
    status: 'Sẵn sàng',
  },
  {
    id: 2,
    name: 'Micro không dây',
    category: 'Âm thanh',
    available: 1,
    total: 2,
    status: 'Sẵn sàng',
  },
  {
    id: 3,
    name: 'Laptop dự phòng',
    category: 'Tin học',
    available: 0,
    total: 1,
    status: 'Hết hàng',
  },
];

export const initialRequests: LoanRequest[] = [
  {
    id: 1,
    requester: 'Nguyễn Văn A',
    item: 'Máy chiếu Sony',
    borrowDate: '2026-05-06',
    returnDate: '2026-05-07',
    status: 'Pending',
  },
  {
    id: 2,
    requester: 'Trần Thị B',
    item: 'Micro không dây',
    borrowDate: '2026-05-05',
    returnDate: '2026-05-06',
    status: 'Approved',
  },
];
