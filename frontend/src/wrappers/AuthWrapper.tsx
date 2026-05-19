import { Navigate, Outlet } from '@umijs/max';

export default () => {
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const userStr = localStorage.getItem('currentUser');

  // Nếu đã đăng nhập, cho phép đi tiếp vào trang (Outlet)
  if (userStr) {
    return <Outlet />;
  }

  // Nếu chưa đăng nhập, đá văng ra trang Login
  return <Navigate to="/login" />;
};
