import { ProCard, ProTable } from '@ant-design/pro-components';
import { Badge, Button, Form, Input, Modal, Select, Space } from 'antd';
import React, { useState } from 'react';
import { User } from '../data';

type Props = {
  users: User[];
  // Cập nhật kiểu trả về thành Promise<void> | void để hỗ trợ await xử lý bất đồng bộ
  onSaveUser: (user: Partial<User> & { id?: number }) => Promise<void> | void;
  onToggleLock: (user: User) => void;
};

const UsersTable: React.FC<Props> = ({ users, onSaveUser, onToggleLock }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm<Partial<User>>();

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    form.setFieldsValue(user || { role: 'Student' });
    setModalVisible(true);
  };

  // ĐÃ SỬA: Thêm await khi gọi hàm onSaveUser để chờ Bcrypt hash xong mới đóng modal (Tránh bất đồng bộ lỗi dữ liệu)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      // Chờ lưu dữ liệu và băm mật khẩu hoàn tất
      await onSaveUser({ ...values, id: editingUser?.id });

      // Sau khi lưu thành công mới thực hiện đóng form và xóa trường dữ liệu cũ
      setModalVisible(false);
      setEditingUser(null);
      form.resetFields();
    } catch (error) {
      console.error('Xác thực form thất bại hoặc lỗi lưu trữ:', error);
    }
  };

  return (
    <ProCard title="Quản lý tài khoản người dùng" bordered>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => openModal()}
      >
        + Thêm người dùng mới
      </Button>

      <ProTable<User>
        rowKey="id"
        search={false}
        dataSource={users}
        pagination={{ pageSize: 5 }}
        columns={[
          { title: 'Tên đăng nhập', dataIndex: 'username' },
          { title: 'Email', dataIndex: 'email' },
          { title: 'Vai trò', dataIndex: 'role' },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (_, record) => (
              <Badge
                status={record.status === 'Active' ? 'success' : 'error'}
                text={record.status === 'Active' ? 'Hoạt động' : 'Bị khóa'}
              />
            ),
          },
          { title: 'Ngày tạo', dataIndex: 'createdAt', width: 140 },
          {
            title: 'Hành động',
            valueType: 'option',
            render: (_, record) => (
              <Space>
                <a onClick={() => openModal(record)}>Sửa thông tin / Đổi MK</a>
                <a
                  onClick={() => onToggleLock(record)}
                  style={{
                    color: record.status === 'Active' ? '#ff4d4f' : '#52c41a',
                  }}
                >
                  {record.status === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
                </a>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={
          editingUser
            ? 'Chỉnh sửa tài khoản / Reset mật khẩu'
            : 'Thêm tài khoản mới'
        }
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          setEditingUser(null);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên đăng nhập"
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: !editingUser,
                message: 'Vui lòng nhập mật khẩu khởi tạo!',
              },
            ]}
            extra={
              editingUser
                ? 'Để trống nếu giữ nguyên mật khẩu cũ'
                : 'Mật khẩu khởi tạo tài khoản'
            }
          >
            <Input.Password placeholder="Nhập mật khẩu..." />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập địa chỉ email!' },
              { type: 'email', message: 'Định dạng email không chính xác!' },
            ]}
          >
            <Input placeholder="viand@school.edu.vn" />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Select.Option value="Student">Sinh viên</Select.Option>
              <Select.Option value="Faculty">Giảng viên</Select.Option>
              <Select.Option value="Admin">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ProCard>
  );
};

export default UsersTable;
