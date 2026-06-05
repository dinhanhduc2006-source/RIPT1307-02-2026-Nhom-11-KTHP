import { FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { Button, Input, Modal, Select, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { LoanRequest } from '../data';

const { Text } = Typography;

type Props = {
  requests: LoanRequest[];
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onReturn: (id: number) => void;
};

const LoanRequests: React.FC<Props> = ({
  requests,
  onApprove,
  onReject,
  onReturn,
}) => {
  // State cho Modal Từ chối
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // State cho bộ lọc (Filter & Search)
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const handleConfirmReject = () => {
    if (rejectId) {
      onReject(rejectId, rejectReason || 'Không có lý do cụ thể');
      setRejectModalOpen(false);
      setRejectReason('');
      setRejectId(null);
    }
  };

  // Logic xử lý lọc dữ liệu ngay trên Frontend
  const filteredRequests = requests.filter((req) => {
    // 1. Lọc theo từ khóa (Tên người mượn hoặc Tên thiết bị)
    const matchSearch =
      req.requester.username.toLowerCase().includes(searchText.toLowerCase()) ||
      req.equipment.name.toLowerCase().includes(searchText.toLowerCase());

    // 2. Lọc theo trạng thái
    const matchStatus = statusFilter === 'All' || req.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <ProCard title="Quản lý yêu cầu mượn thiết bị" bordered>
      {/* THANH CÔNG CỤ LỌC & TÌM KIẾM */}
      <div
        style={{ marginBottom: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}
      >
        <Input
          placeholder="Tìm tên sinh viên, thiết bị..."
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />
        <Select
          defaultValue="All"
          style={{ width: 180 }}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          suffixIcon={<FilterOutlined />}
        >
          <Select.Option value="All">Tất cả trạng thái</Select.Option>
          <Select.Option value="Pending">Chờ duyệt</Select.Option>
          <Select.Option value="Approved">Đang mượn</Select.Option>
          <Select.Option value="Returned">Đã trả</Select.Option>
          <Select.Option value="Rejected">Đã từ chối</Select.Option>
        </Select>
      </div>

      {/* BẢNG DỮ LIỆU ĐÃ ĐƯỢC LỌC */}
      <ProTable<LoanRequest>
        dataSource={filteredRequests}
        rowKey="id"
        search={false}
        options={false}
        pagination={{ pageSize: 5 }}
        columns={[
          {
            title: 'Người yêu cầu',
            dataIndex: 'requester',
            render: (v: any) => <Text strong>{v?.username || 'N/A'}</Text>,
          },
          {
            title: 'Thiết bị',
            dataIndex: ['equipment', 'name'],
          },
          { title: 'Ngày mượn', dataIndex: 'borrowDate', width: 110 },
          { title: 'Hạn trả', dataIndex: 'returnDate', width: 110 },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (status) => {
              const config: Record<string, { color: string; text: string }> = {
                Pending: { color: 'orange', text: 'Chờ duyệt' },
                Approved: { color: 'blue', text: 'Đang mượn' },
                Rejected: { color: 'red', text: 'Từ chối' },
                Returned: { color: 'green', text: 'Đã trả' },
              };
              const curr = config[status as string] || {
                color: 'default',
                text: status,
              };
              return <Tag color={curr.color}>{curr.text}</Tag>;
            },
          },
          {
            title: 'Hành động',
            valueType: 'option',
            width: 150,
            render: (_, record) => (
              <Space wrap>
                {record.status === 'Pending' && (
                  <>
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => onApprove(record.id)}
                    >
                      Duyệt
                    </Button>
                    <Button
                      danger
                      size="small"
                      onClick={() => {
                        setRejectId(record.id);
                        setRejectModalOpen(true);
                      }}
                    >
                      Từ chối
                    </Button>
                  </>
                )}
                {record.status === 'Approved' && (
                  <Button
                    style={{
                      backgroundColor: '#52c41a',
                      color: '#fff',
                      border: 'none',
                    }}
                    size="small"
                    onClick={() => onReturn(record.id)}
                  >
                    Nhận lại đồ
                  </Button>
                )}
              </Space>
            ),
          },
        ]}
      />

      {/* MODAL TỪ CHỐI */}
      <Modal
        title="Xác nhận từ chối yêu cầu"
        open={rejectModalOpen}
        onOk={handleConfirmReject}
        onCancel={() => {
          setRejectModalOpen(false);
          setRejectReason('');
        }}
        okText="Gửi từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Text>Vui lòng nhập lý do từ chối để thông báo cho sinh viên:</Text>
        <Input.TextArea
          rows={4}
          style={{ marginTop: 12 }}
          placeholder="Ví dụ: Thiết bị đang được bảo trì hoặc bạn đang có 1 đơn nợ chưa trả..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </ProCard>
  );
};

export default LoanRequests;
