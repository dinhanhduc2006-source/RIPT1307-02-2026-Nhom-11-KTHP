// ĐÃ SỬA: Đọc đúng chuẩn dữ liệu từ initialState cấp phát thay vì can thiệp đọc trộm localStorage
export default function access(initialState: { currentUser: any } | undefined) {
  const { currentUser } = initialState || {};

  return {
    // Nếu vai trò của tài khoản khớp hoàn toàn với Quản trị viên -> Cho phép xem các menu Admin
    canAdmin: currentUser?.role === 'Quản trị viên',
  };
}
