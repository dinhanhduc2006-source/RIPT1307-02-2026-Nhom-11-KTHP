import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, DatePicker, Badge, message, Card } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { equipmentApi, loanRequestApi } from '@/services/api';

const { RangePicker } = DatePicker;

interface EquipmentItem {
  id: number;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'Available' | 'OutOfStock' | 'Out of Stock' | 'Maintenance';
}

const EquipmentList: React.FC = () => {
  const [data, setData] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
  const [form] = Form.useForm();

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const result = await equipmentApi.getAll();
      setData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải danh sách thiết bị từ máy chủ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleOpenBorrowModal = (item: EquipmentItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedItem(null);
  };

  const getLoanRequestErrorMessage = (error: any) => {
    const response = error?.response;
    const code = response?.data?.code;
    const messageText = response?.data?.message;

    if (code === 1011 || code === 1014) {
      return 'Thời gian mượn vượt quá số ngày quy định. Vui lòng chọn lại.';
    }

    return messageText || error?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.';
  };

  const handleSubmitRequest = async (values: { dates: [Dayjs, Dayjs] }) => {
    if (!selectedItem) {
      message.error('Vui lòng chọn thiết bị trước khi gửi yêu cầu.');
      return;
    }

    const [startDate, endDate] = values.dates;

    if (!startDate || !endDate) {
      message.error('Vui lòng chọn đầy đủ ngày mượn và ngày trả.');
      return;
    }

    if (endDate.isBefore(startDate, 'day')) {
      message.error('Ngày trả phải sau hoặc bằng ngày mượn. Vui lòng chọn lại.');
      return;
    }

    try {
      await loanRequestApi.create({
        equipmentId: selectedItem.id,
        borrowDate: startDate.format('YYYY-MM-DD'),
        returnDate: endDate.format('YYYY-MM-DD'),
      });

      message.success('Gửi yêu cầu mượn thiết bị thành công! Vui lòng chờ phê duyệt.');
      handleCancel();
      fetchEquipment();
    } catch (error: any) {
      console.error(error);
      message.error(getLoanRequestErrorMessage(error));
    }
  };

  const renderStatus = (status: string) => {
    if (status === 'Available') return <Badge status="success" text="Sẵn sàng mượn" />;
    if (status === 'Maintenance') return <Badge status="warning" text="Đang bảo trì" />;
    return <Badge status="error" text="Đã hết đồ" />;
  };

  const columns = [
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Danh mục', dataIndex: 'category', key: 'category' },
    {
      title: 'Sẵn có / Tổng số',
      key: 'quantity',
      render: (_: any, record: EquipmentItem) => `${record.available} / ${record.total}`,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'status',
      key: 'status',
      render: renderStatus,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: EquipmentItem) => (
        <Button
          type="primary"
          disabled={record.status !== 'Available' || record.available === 0}
          onClick={() => handleOpenBorrowModal(record)}
        >
          Đăng ký mượn
        </Button>
      ),
    },
  ];

  return (
    <Card title="Danh Sách Thiết Bị Thành Viên">
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} />

      <Modal
        title={`Đăng ký mượn: ${selectedItem?.name || 'Thiết bị'}`}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitRequest}>
          <Form.Item
            name="dates"
            label="Chọn thời gian mượn - trả"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày mượn và ngày trả!' },
              () => ({
                validator(_, value) {
                  if (!value || value.length !== 2) {
                    return Promise.reject(new Error('Vui lòng chọn ngày mượn và ngày trả.'));
                  }
                  const [startDate, endDate] = value as [Dayjs, Dayjs];
                  if (endDate.isBefore(startDate, 'day')) {
                    return Promise.reject(new Error('Ngày trả phải sau hoặc bằng ngày mượn.'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <RangePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default EquipmentList;