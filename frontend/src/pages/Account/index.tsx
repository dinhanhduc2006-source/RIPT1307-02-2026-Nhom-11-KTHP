import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Descriptions, Form, Input, message, Tag } from 'antd';
import bcrypt from 'bcryptjs';
import React from 'react';
import { User } from '../Admin/data';

const AccountPage: React.FC = () => {
  const [form] = Form.useForm();
  const currentUserStr = localStorage.getItem('currentUser');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;

  const handleUpdatePassword = async () => {
    const values = await form.validateFields();

    // 1. Verify mật khẩu hiện tại
    const isMatch = await bcrypt.compare(
      values.currentPassword,
      currentUser.password,
    );
    if (!isMatch) {
      message.error('Mật khẩu hiện tại không chính xác!');
      return;
    }

    // 2. Kiểm tra khớp mật khẩu mới
    if (values.newPassword !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    // 3. Hash pass mới và lưu thật
    const salt = await bcrypt.genSalt(10);
    const newHashed = await bcrypt.hash(values.newPassword, salt);

    const savedUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const updatedUsers = savedUsers.map((u: User) =>
      u.id === currentUser.id ? { ...u, password: newHashed } : u,
    );

    localStorage.setItem('mock_users', JSON.stringify(updatedUsers));
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ ...currentUser, password: newHashed }),
    );

    message.success('Cập nhật mật khẩu thành công!');
    form.resetFields();
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  if (!currentUser) return null;

  return (
    <PageContainer title="Cài đặt tài khoản">
      <ProCard split="vertical" bordered headerBordered>
        <ProCard title="Hồ sơ của bạn" colSpan="50%">
          <Descriptions column={1}>
            <Descriptions.Item label="Tên đăng nhập">
              {currentUser.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {currentUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color="gold">{currentUser.role}</Tag>
            </Descriptions.Item>
          </Descriptions>
          <Button danger onClick={handleLogout} style={{ marginTop: 20 }}>
            Đăng xuất
          </Button>
        </ProCard>
        <ProCard title="Đổi mật khẩu" colSpan="50%">
          <Form form={form} layout="vertical">
            <Form.Item
              name="currentPassword"
              label="Mật khẩu hiện tại"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận MK mới"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
            <Button type="primary" onClick={handleUpdatePassword}>
              Cập nhật mật khẩu
            </Button>
          </Form>
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};
export default AccountPage;
