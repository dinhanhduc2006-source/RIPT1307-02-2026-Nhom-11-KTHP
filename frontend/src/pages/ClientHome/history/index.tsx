import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, message } from 'antd';
import { loanRequestApi } from '@/services/api';

interface LoanRequestItem {
  id: number;
  equipmentName?: string;
  borrowDate: string;
  returnDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Returned';
  rejectReason?: string;
  returnedAt?: string;
  equipment?: { name?: string };
}

const BorrowHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<LoanRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const result = await loanRequestApi.getMyRequests();
      setHistoryData(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error(error);
      message.error('Không thể tải lịch sử mượn đồ từ hệ thống. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const columns = [
    { title: 'Mã lượt', dataIndex: 'id', key: 'id' },
    {
      title: 'Tên thiết bị',
      dataIndex: ['equipment', 'name'],
      key: 'equipmentName',
      render: (text: string, record: LoanRequestItem) => text || record.equipmentName || record.equipment?.name || 'Không xác định',
    },
    { title: 'Ngày mượn dự kiến', dataIndex: 'borrowDate', key: 'borrowDate' },
    { title: 'Ngày trả dự kiến', dataIndex: 'returnDate', key: 'returnDate' },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: LoanRequestItem) => {
        if (status === 'Pending') return <Tag color="blue">Chờ phê duyệt</Tag>;
        if (status === 'Approved') return <Tag color="green">Đang mượn</Tag>;
        if (status === 'Returned') return <Tag color="purple">Đã trả đồ</Tag>;
        return <Tag color="error">Bị từ chối ({record.rejectReason || 'Không rõ lý do'})</Tag>;
      },
    },
  ];

  return (
    <Card title="Lịch Sử Mượn Thiết Bị Của Tôi">
      <Table columns={columns} dataSource={historyData} rowKey="id" loading={loading} />
    </Card>
  );
};

export default BorrowHistory;