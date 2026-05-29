import { PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Select, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { announcementApi, getUser } from '@/services/api';

const NotificationsPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await announcementApi.getAll();
      setData(res || []);
    } catch (error) {
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (record?: any) => {
    setEditingId(record?.id || null);
    form.setFieldsValue(record || { status: 'Active' });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const user = getUser();
      
      if (editingId) {
        await announcementApi.update(editingId, values);
        message.success('Đã cập nhật thông báo!');
      } else {
        await announcementApi.create(values);
        message.success('Đã đăng thông báo mới!');
      }
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error('Lỗi khi lưu thông báo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await announcementApi.delete(id);
      message.success('Đã xóa thông báo');
      fetchData();
    } catch (error) {
      message.error('Xóa thất bại');
    }
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
        <ProTable<any>
          loading={loading}
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
            { 
              title: 'Ngày tạo', 
              dataIndex: 'createdAt',
              render: (v: any) => v || '-'
            },
            {
              title: 'Thao tác',
              render: (_, r) => (
                <Space>
                  <a onClick={() => openModal(r)}>Sửa</a>
                  <a
                    style={{ color: 'red' }}
                    onClick={() => handleDelete(r.id)}
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
