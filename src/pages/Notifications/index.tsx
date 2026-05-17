import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Select, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { Announcement, initialAnnouncements } from '../Admin/data';

const NotificationsPage: React.FC = () => {
  const [data, setData] = useState<Announcement[]>(() => {
    const s = localStorage.getItem('mock_notifications');
    return s ? JSON.parse(s) : initialAnnouncements;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('mock_notifications', JSON.stringify(data));
  }, [data]);

  const openModal = (record?: Announcement) => {
    setEditingId(record?.id || null);
    form.setFieldsValue(record || { status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...values } : item,
        ),
      );
      message.success('Đã cập nhật thông báo!');
    } else {
      setData([
        {
          ...values,
          id: Date.now(),
          author: 'Quản trị viên',
          createdAt: new Date().toISOString().split('T')[0],
        },
        ...data,
      ]);
      message.success('Đã đăng thông báo mới!');
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <PageContainer title="Quản lý thông báo">
      <ProCard bordered>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => openModal()}
          style={{ marginBottom: 16 }}
        >
          Tạo thông báo
        </Button>
        <ProTable<Announcement>
          dataSource={data}
          rowKey="id"
          search={false}
          columns={[
            { title: 'Tiêu đề', dataIndex: 'title', width: '30%' },
            { title: 'Nội dung', dataIndex: 'content', ellipsis: true },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (s) => (
                <Tag color={s === 'Active' ? 'green' : 'gray'}>{s}</Tag>
              ),
            },
            { title: 'Ngày tạo', dataIndex: 'createdAt' },
            {
              title: 'Thao tác',
              render: (_, r) => (
                <Space>
                  <a onClick={() => openModal(r)}>Sửa</a>
                  <a
                    style={{ color: 'red' }}
                    onClick={() => setData(data.filter((i) => i.id !== r.id))}
                  >
                    Xóa
                  </a>
                </Space>
              ),
            },
          ]}
        />
      </ProCard>
      <Modal
        title={editingId ? 'Sửa thông báo' : 'Soạn thông báo'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="Active">
            <Select>
              <Select.Option value="Active">Đăng ngay</Select.Option>
              <Select.Option value="Draft">Bản nháp</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default NotificationsPage;
