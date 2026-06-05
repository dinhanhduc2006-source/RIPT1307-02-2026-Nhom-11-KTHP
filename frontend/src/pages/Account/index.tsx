import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Descriptions, Form, Input, message, Tag } from 'antd';
import React from 'react';
import { getUser, userApi, clearAuth } from '@/services/api';

const AccountPage: React.FC = () => {
  const [form] = Form.useForm();
  const currentUser = getUser();

  const handleUpdatePassword = async () => {
    try {
      const values = await form.validateFields();

      if (values.newPassword !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp!');
        return;
      }

      await userApi.changePassword(
        currentUser.id,
        values.currentPassword,
        values.newPassword,
      );

      message.success('Cập nhật mật khẩu thành công!');
      form.resetFields();
    } catch (error: any) {
      message.error(error?.message || 'Cập nhật mật khẩu thất bại!');
    }
  };

  const handleLogout = () => {
    clearAuth();
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
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label="Xác nhận MK mới"
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới' }]}
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
