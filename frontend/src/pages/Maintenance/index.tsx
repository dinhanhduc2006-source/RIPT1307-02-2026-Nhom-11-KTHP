import { PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Space,
  Tag,
} from 'antd';
import React, { useEffect, useState } from 'react';

const initialMaintenance = [
  {
    id: 1,
    equipment: 'Máy chiếu Sony',
    issue: 'Cháy bóng đèn',
    cost: 1500000,
    status: 'Đang sửa',
    date: '2026-05-10',
    reporter: 'admin',
  },
  {
    id: 2,
    equipment: 'Micro không dây',
    issue: 'Mất tín hiệu',
    cost: 300000,
    status: 'Đã xong',
    date: '2026-05-01',
    reporter: 'gv01',
  },
];

const MaintenancePage: React.FC = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('mock_maintenance');
    return saved ? JSON.parse(saved) : initialMaintenance;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem('mock_maintenance', JSON.stringify(data));
  }, [data]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setData([
      {
        id: Date.now(),
        ...values,
        date: new Date().toISOString().split('T')[0],
        reporter: 'admin',
      },
      ...data,
    ]);
    message.success('Đã tạo phiếu bảo trì mới!');
    setIsModalOpen(false);
    form.resetFields();
  };

  const updateStatus = (id: number, newStatus: string) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
    message.success(`Đã cập nhật tiến độ thành: ${newStatus}`);
  };

  return (
    <PageContainer
      title="Quản lý Bảo trì & Sửa chữa"
      subTitle="Theo dõi chi phí và tiến độ sửa chữa thiết bị hỏng"
    >
      <ProCard bordered>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Tạo phiếu bảo trì
        </Button>
        <ProTable
          dataSource={data}
          rowKey="id"
          search={false}
          columns={[
            { title: 'Mã phiếu', dataIndex: 'id', width: 100 },
            {
              title: 'Tên thiết bị',
              dataIndex: 'equipment',
              render: (t) => <strong>{t}</strong>,
            },
            { title: 'Tình trạng lỗi', dataIndex: 'issue' },
            {
              title: 'Chi phí dự kiến (VNĐ)',
              dataIndex: 'cost',
              render: (v) => v.toLocaleString() + ' đ',
            },
            { title: 'Ngày báo hỏng', dataIndex: 'date' },
            {
              title: 'Tiến độ',
              dataIndex: 'status',
              render: (s) => (
                <Tag
                  color={
                    s === 'Chờ duyệt'
                      ? 'orange'
                      : s === 'Đang sửa'
                      ? 'blue'
                      : 'green'
                  }
                >
                  {s}
                </Tag>
              ),
            },
            {
              title: 'Cập nhật',
              render: (_, record) => (
                <Space>
                  {record.status !== 'Đã xong' && (
                    <a onClick={() => updateStatus(record.id, 'Đang sửa')}>
                      Bắt đầu sửa
                    </a>
                  )}
                  {record.status !== 'Đã xong' && (
                    <a
                      style={{ color: 'green' }}
                      onClick={() => updateStatus(record.id, 'Đã xong')}
                    >
                      Hoàn thành
                    </a>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </ProCard>

      <Modal
        title={
          <span>
            <ToolOutlined /> Lập phiếu bảo trì mới
          </span>
        }
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        okText="Tạo phiếu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="equipment"
            label="Tên thiết bị hỏng"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tên thiết bị hỏng..." />
          </Form.Item>
          <Form.Item
            name="issue"
            label="Mô tả lỗi"
            rules={[{ required: true }]}
          >
            <Input.TextArea
              rows={2}
              placeholder="Nhập mô tả tình trạng lỗi..."
            />
          </Form.Item>
          <Form.Item
            name="cost"
            label="Chi phí dự kiến (VNĐ)"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              step={10000}
              style={{ width: '100%' }}
              placeholder="Nhập chi phí dự kiến..."
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái ban đầu"
            initialValue="Chờ duyệt"
          >
            <Select>
              <Select.Option value="Chờ duyệt">Chờ duyệt chi phí</Select.Option>
              <Select.Option value="Đang sửa">Mang đi sửa ngay</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
export default MaintenancePage;
