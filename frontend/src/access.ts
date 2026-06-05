import { getUser } from '@/services/api';

// Đã dùng dữ liệu đăng nhập backend từ initialState
export default function access(initialState: { currentUser: any } | undefined) {
  const currentUser = initialState?.currentUser ?? (typeof window !== 'undefined' ? getUser() : undefined);

  return {
    // Dùng role backend ('Admin') để mở menu Admin
    canAdmin: currentUser?.role === 'Admin',
  };
}
