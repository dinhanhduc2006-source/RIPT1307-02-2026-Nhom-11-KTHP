import { Badge, Button, Form, Input, Modal, Select, Space } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';
import { User } from '../data';

type Props = {
  users: User[];
  onSaveUser: (user: Partial<User> & { id?: number }) => void;
  onToggleLock: (user: User) => void;
  onResetPassword: (user: User) => void;
};

const UsersTable: React.FC<Props> = ({ users, onSaveUser, onToggleLock, onResetPassword }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm<Partial<User>>();

  const openModal = (user?: User) => {
    setEditingUser(user || null);
    form.setFieldsValue(user || { role: 'Sinh viên' });
    setModalVisible(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    onSaveUser({ ...values, id: editingUser?.id });
    setModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  return (
    <ProCard title="Quản lý người dùng" bordered>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={() => openModal()}>
        Thêm người dùng
      </Button>
      <ProTable<User>
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
                text={record.status}
              />
            ),
          },
          { title: 'Ngày tạo', dataIndex: 'createdAt', width: 140 },
          {
            title: 'Hành động',
            valueType: 'option',
            render: (_, record) => (
              <Space>
                <a onClick={() => openModal(record)}>Sửa</a>
                <a onClick={() => onToggleLock(record)}>
                  {record.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                </a>
                <a onClick={() => onResetPassword(record)}>Cấp mật khẩu</a>
              </Space>
            ),
          },
        ]}
        dataSource={users}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
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
            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Select.Option value="Sinh viên">Sinh viên</Select.Option>
              <Select.Option value="Giảng viên">Giảng viên</Select.Option>
              <Select.Option value="Quản trị viên">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </ProCard>
  );
};

export default UsersTable;
