import {
  CalendarOutlined,
  HistoryOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import {
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  Equipment,
  LoanRequest,
  initialEquipment,
  initialRequests,
} from '../Admin/data';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const HomePage: React.FC = () => {
  const [equipment] = useState<Equipment[]>(() => {
    const s = localStorage.getItem('mock_equipment');
    return s ? JSON.parse(s) : initialEquipment;
  });

  const [requests, setRequests] = useState<LoanRequest[]>(() => {
    const s = localStorage.getItem('mock_requests');
    return s ? JSON.parse(s) : initialRequests;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Equipment | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [form] = Form.useForm();

  // ĐÃ SỬA: Chỉ đồng bộ danh sách requests do sinh viên tạo ra, tuyệt đối không lưu đè equipment tại đây
  useEffect(() => {
    localStorage.setItem('mock_requests', JSON.stringify(requests));
  }, [requests]);

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.category.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleBorrow = (item: Equipment) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [borrowDate, returnDate] = values.dateRange;

      const currentUserStr = localStorage.getItem('currentUser');
      const currentUser = currentUserStr ? JSON.parse(currentUserStr) : {};
      const currentUsername = currentUser.username || 'Sinh viên ẩn danh';

      const newRequest: LoanRequest = {
        id: Date.now(),
        requester: currentUsername,
        item: selectedItem!.name,
        borrowDate: borrowDate.format('YYYY-MM-DD'),
        returnDate: returnDate.format('YYYY-MM-DD'),
        status: 'Pending',
      };

      setRequests([newRequest, ...requests]);
      message.success(
        'Đăng ký mượn thành công! Hãy sang Bảng điều khiển để duyệt đơn.',
      );
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log('Validate Failed:', error);
    }
  };

  const renderStatus = (status: string) => {
    const config: Record<string, { color: string; text: string }> = {
      Pending: { color: 'orange', text: 'Chờ duyệt' },
      Approved: { color: 'blue', text: 'Đang mượn' },
      Rejected: { color: 'red', text: 'Từ chối' },
      Returned: { color: 'green', text: 'Đã trả' },
    };
    const curr = config[status] || { color: 'default', text: status };
    return <Tag color={curr.color}>{curr.text}</Tag>;
  };

  return (
    <PageContainer
      title="Dịch vụ mượn thiết bị"
      subTitle="Danh sách thiết bị trong kho và lịch sử đăng ký"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* KHỐI 1: DANH SÁCH THIẾT BỊ KHẢ DỤNG */}
        <ProCard
          title={
            <span>
              <CalendarOutlined /> Danh sách thiết bị hiện có
            </span>
          }
          bordered
          headerBordered
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: 16,
            }}
          >
            <Input.Search
              placeholder="Tìm thiết bị..."
              allowClear
              style={{ width: 260 }}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <ProTable<Equipment>
            dataSource={filteredEquipment}
            rowKey="id"
            search={false}
            options={false}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Tên thiết bị',
                dataIndex: 'name',
                render: (v) => <Text strong>{v}</Text>,
              },
              { title: 'Danh mục', dataIndex: 'category' },
              {
                title: 'Số lượng khả dụng',
                render: (_, record) => `${record.available} / ${record.total}`,
              },
              {
                title: 'Trạng thái',
                render: (_, record) => {
                  if (record.available === 0)
                    return <Badge status="error" text="Hết hàng" />;
                  if (record.status === 'Bảo trì')
                    return <Badge status="warning" text="Đang bảo trì" />;
                  return <Badge status="success" text="Sẵn sàng" />;
                },
              },
              {
                title: 'Thao tác',
                valueType: 'option',
                render: (_, record) => [
                  <Button
                    key="borrow"
                    type="primary"
                    size="small"
                    disabled={
                      record.available === 0 || record.status === 'Bảo trì'
                    }
                    onClick={() => handleBorrow(record)}
                  >
                    Đăng ký mượn
                  </Button>,
                ],
              },
            ]}
          />
        </ProCard>

        {/* KHỐI 2: LỊCH SỬ MƯỢN TRÊN TOÀN HỆ THỐNG */}
        <ProCard
          title={
            <span>
              <HistoryOutlined /> Lịch sử mượn thiết bị toàn hệ thống
            </span>
          }
          bordered
          headerBordered
        >
          <ProTable<LoanRequest>
            dataSource={requests}
            rowKey="id"
            search={false}
            options={false}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Người mượn',
                dataIndex: 'requester',
                render: (v) => <Text strong>{v}</Text>,
              },
              { title: 'Thiết bị', dataIndex: 'item' },
              { title: 'Ngày mượn', dataIndex: 'borrowDate' },
              { title: 'Ngày trả dự kiến', dataIndex: 'returnDate' },
              {
                title: 'Trạng thái',
                dataIndex: 'status',
                render: (s) => renderStatus(s as string),
              },
              {
                title: 'Ghi chú',
                render: (_, record) => {
                  if (record.status === 'Approved') {
                    const isOverdue = new Date(record.returnDate) < new Date();
                    return isOverdue ? (
                      <Text type="danger">Quá hạn trả! ⚠️</Text>
                    ) : (
                      <Text type="secondary">Đang mượn đồ</Text>
                    );
                  }
                  return '-';
                },
              },
            ]}
          />
        </ProCard>
      </div>

      <Modal
        title={
          <span>
            <SendOutlined /> Đăng ký mượn thiết bị
          </span>
        }
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Tạo yêu cầu"
        cancelText="Hủy"
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Đang đăng ký mượn: </Text>
          <Text strong style={{ color: '#1890ff' }}>
            {selectedItem?.name}
          </Text>
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            name="dateRange"
            label="Thời gian mượn - trả"
            rules={[
              { required: true, message: 'Vui lòng chọn thời gian mượn!' },
            ]}
          >
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default HomePage;
