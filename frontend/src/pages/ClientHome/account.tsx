import { ProCard } from '@ant-design/pro-components';
import { Button, Descriptions, Form, Input, message, Tag } from 'antd';
import React from 'react';
import { getUser, userApi, clearAuth } from '@/services/api';
import { LogoutOutlined } from '@ant-design/icons';

const ClientAccount: React.FC = () => {
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
    <ProCard split="vertical" bordered headerBordered style={{ marginBottom: '24px' }}>
      <ProCard title="👤 Hồ sơ của bạn" colSpan="50%">
        <Descriptions column={1}>
          <Descriptions.Item label="Tên đăng nhập">
            {currentUser.username}
          </Descriptions.Item>
          {currentUser.fullName && (
            <Descriptions.Item label="Họ và tên">
              {currentUser.fullName}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Email">
            {currentUser.email}
          </Descriptions.Item>
          <Descriptions.Item label="Vai trò">
            <Tag color="blue">{currentUser.role || 'Student'}</Tag>
          </Descriptions.Item>
        </Descriptions>
        <Button danger icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: 20, width: '100%' }}>
          Đăng xuất
        </Button>
      </ProCard>
      <ProCard title="🔐 Đổi mật khẩu" colSpan="50%">
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
          <Button type="primary" onClick={handleUpdatePassword} style={{ width: '100%' }}>
            Cập nhật mật khẩu
          </Button>
        </Form>
      </ProCard>
    </ProCard>
  );
};

export default ClientAccount;
