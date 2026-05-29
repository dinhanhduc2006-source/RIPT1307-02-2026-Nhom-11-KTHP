import { DollarOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { penaltyApi, userApi } from '@/services/api';

const { Text } = Typography;

const PenaltiesPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [penaltyRes, userRes] = await Promise.all([
        penaltyApi.getAll(),
        userApi.getAll()
      ]);
      setData(penaltyRes || []);
      setUsers(userRes || []);
    } catch (error) {
      message.error('Không thể tải danh sách vi phạm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await penaltyApi.create(values);
      message.success('Đã lập biên bản vi phạm mới');
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (e) {
      message.error('Lỗi khi lập biên bản');
    }
  };

  const handleCollectMoney = async (id: number) => {
    try {
      await penaltyApi.pay(id);
      message.success('Đã xác nhận thu tiền bồi thường/phạt thành công!');
      fetchData();
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
    }
  };

  return (
    <PageContainer
      title="Quản lý Vi phạm & Thu phạt"
      subTitle="Xử lý các trường hợp trả muộn, làm hỏng hoặc mất thiết bị"
    >
      <ProCard bordered>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Lập biên bản vi phạm
        </Button>
        <ProTable
          loading={loading}
          dataSource={data}
          rowKey="id"
          search={false}
          columns={[
            {
              title: 'Người vi phạm',
              dataIndex: 'user',
              render: (_, record: any) => <Text strong>{record.user?.username || 'N/A'}</Text>,
            },
            { title: 'Lý do phạt', dataIndex: 'reason' },
            {
              title: 'Số tiền (VNĐ)',
              dataIndex: 'amount',
              render: (v) => (
                <Text type="danger" strong>
                  {v ? v.toLocaleString() : '0'} đ
                </Text>
              ),
            },
            { 
              title: 'Ngày lập biên bản', 
              dataIndex: 'date',
              render: (v: any) => v || '-'
            },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (s) => (
                <Tag
                  color={
                    s === 'Unpaid' ? 'red' : 'success'
                  }
                >
                  {s === 'Unpaid' ? 'Chưa nộp' : 'Đã nộp'}
                </Tag>
              ),
            },
            {
              title: 'Hành động',
              render: (_, record: any) => (
                <Space>
                  {record.status === 'Unpaid' && (
                    <Popconfirm
                      title="Xác nhận sinh viên đã nộp đủ tiền?"
                      onConfirm={() => handleCollectMoney(record.id)}
                    >
                      <a style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        <DollarOutlined /> Thu tiền
                      </a>
                    </Popconfirm>
                  )}
                  {record.status === 'Paid' && (
                    <Text type="secondary">Hoàn tất</Text>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </ProCard>

      <Modal
        title="Lập biên bản vi phạm mới"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        okText="Lập biên bản"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="userId"
            label="Chọn người vi phạm"
            rules={[{ required: true, message: 'Vui lòng chọn người vi phạm!' }]}
          >
            <Select 
              showSearch 
              placeholder="Tìm theo username..."
              optionFilterProp="children"
            >
              {users.map((u: any) => (
                <Select.Option key={u.id} value={u.id}>
                  {u.username} ({u.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="amount"
            label="Số tiền phạt (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              min={0}
              step={1000}
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập lý do!' }]}
          >
            <Input.TextArea rows={3} placeholder="Ví dụ: Làm hỏng màn hình máy chiếu, Trả muộn 3 ngày..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default PenaltiesPage;
