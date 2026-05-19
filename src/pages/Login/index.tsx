import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import bcrypt from 'bcryptjs';
import React from 'react';
import { initialUsers } from '../Admin/data'; // Nạp dữ liệu gốc vào đây

const LoginPage: React.FC = () => {
  const handleLogin = async (values: Record<string, any>) => {
    const { username, password } = values;

    // Đọc từ bộ nhớ, NẾU TRỐNG (null) thì dùng initialUsers làm phao cứu sinh
    const savedUsers = localStorage.getItem('mock_users');
    const users = savedUsers ? JSON.parse(savedUsers) : initialUsers;

    // Tự động gieo hạt (seed) dữ liệu vào bộ nhớ nếu đây là lần đầu chạy
    if (!savedUsers) {
      localStorage.setItem('mock_users', JSON.stringify(initialUsers));
    }

    const user = users.find((u: any) => u.username === username);

    if (!user) {
      message.error('Tài khoản không tồn tại!');
      return;
    }
    if (user.status === 'Locked') {
      message.error('Tài khoản của bạn đã bị khóa!');
      return;
    }

    // So sánh mật khẩu bằng Bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      message.error('Sai mật khẩu!');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    message.success(`Đăng nhập thành công!`);
    window.location.href =
      user.role === 'Quản trị viên' ? '/admin' : '/client-home';
  };

  return (
    <div
      style={{
        backgroundColor: '#f0f2f5',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoginForm
        title="Hệ thống Quản trị Lõi"
        subTitle="Đăng nhập hệ thống"
        onFinish={handleLogin}
      >
        <ProFormText
          name="username"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="Tên đăng nhập"
          rules={[{ required: true }]}
        />
        <ProFormText.Password
          name="password"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="Mật khẩu"
          rules={[{ required: true }]}
        />
      </LoginForm>
    </div>
  );
};
export default LoginPage;
