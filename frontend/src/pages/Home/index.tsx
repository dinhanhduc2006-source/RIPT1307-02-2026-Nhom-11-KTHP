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
  Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import { getUser, equipmentApi, loanRequestApi, userApi } from '@/services/api';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const mapEquipmentStatus = (status: string) => {
  switch (status) {
    case 'Available':
      return 'Sẵn sàng';
    case 'Out of Stock':
      return 'Hết hàng';
    case 'Maintenance':
      return 'Bảo trì';
    default:
      return status;
  }
};

const HomePage: React.FC = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const currentUser = getUser();
  const isAdmin = currentUser?.role === 'Admin';

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const reqs: any[] = [
          equipmentApi.getAll(),
          loanRequestApi.getMyRequests(),
        ];
        if (isAdmin) {
          reqs.push(userApi.getAll());
        }
        
        const results = await Promise.all(reqs);
        setEquipment(Array.isArray(results[0]) ? results[0] : []);
        setRequests(Array.isArray(results[1]) ? results[1] : []);
        if (isAdmin && results[2]) {
          setUsers(results[2]);
        }
      } catch (error) {
        console.error(error);
        message.error('Không tải được dữ liệu thiết bị hoặc lịch sử mượn.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredEquipment = equipment.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchKeyword.toLowerCase()),
  );

  const handleBorrow = (item: any) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const [borrowDate, returnDate] = values.dateRange;
      if (!currentUser || !selectedItem) {
        message.error('Vui lòng đăng nhập và chọn thiết bị.');
        return;
      }

      const userId = values.delegatedUserId || currentUser.id;
      const created = await loanRequestApi.create({
        userId,
        equipmentId: selectedItem.id,
        borrowDate: borrowDate.format('YYYY-MM-DD'),
        returnDate: returnDate.format('YYYY-MM-DD'),
      });

      // Only add to current list if borrowing for self to keep history accurate
      if (userId === currentUser.id) {
        setRequests([created, ...requests]);
      }
      
      message.success('Đăng ký mượn thành công! Vui lòng chờ quản trị viên phê duyệt.');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      console.error(error);
      const backendMsg = error?.response?.data?.message || error?.message;
      message.error(backendMsg || 'Không thể tạo yêu cầu mượn. Vui lòng thử lại.');
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
          <ProTable<any>
            loading={loading}
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
                  const mapped = mapEquipmentStatus(record.status);
                  if (record.available === 0) return <Badge status="error" text="Hết hàng" />;
                  if (mapped === 'Bảo trì') return <Badge status="warning" text="Đang bảo trì" />;
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
                    disabled={record.available === 0 || record.status === 'Maintenance'}
                    onClick={() => handleBorrow(record)}
                  >
                    Đăng ký mượn
                  </Button>,
                ],
              },
            ]}
          />
        </ProCard>

        <ProCard
          title={
            <span>
              <HistoryOutlined /> Lịch sử mượn thiết bị của bạn
            </span>
          }
          bordered
          headerBordered
        >
          <ProTable<any>
            loading={loading}
            dataSource={requests}
            rowKey="id"
            search={false}
            options={false}
            pagination={{ pageSize: 5 }}
            columns={[
              {
                title: 'Người mượn',
                dataIndex: ['requester', 'username'],
                render: (_, record) => <Text strong>{record.requester?.username || 'N/A'}</Text>,
              },
              {
                title: 'Thiết bị',
                dataIndex: ['equipment', 'name'],
                render: (_, record) => record.equipment?.name || 'N/A',
              },
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
        <Form form={form} layout="vertical" preserve={false}>
          {isAdmin && (
            <Form.Item
              name="delegatedUserId"
              label="Người mượn (Ủy quyền)"
              tooltip="Chỉ Admin mới có thể đăng ký mượn thay cho người khác"
            >
              <Select placeholder="Chọn người dùng (mặc định là bạn)" allowClear showSearch optionFilterProp="children">
                {users.map((u) => (
                  <Select.Option key={u.id} value={u.id}>
                    {u.username} ({u.role})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item
            name="dateRange"
            label="Thời gian mượn - trả"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian mượn!' }]}
          >
            <RangePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default HomePage;
