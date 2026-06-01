import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Empty, Spin, message } from 'antd';
import { penaltyApi } from '@/services/api';
import { CheckOutlined } from '@ant-design/icons';

const normalizeStatus = (status: string | undefined) => status?.toString().trim().toLowerCase();

const ClientPenalties: React.FC = () => {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPenalties = async () => {
      try {
        setLoading(true);
        const data = await penaltyApi.getMyPenalties();
        setPenalties(Array.isArray(data) ? data : []);
      } catch (error) {
        message.error('Lỗi khi tải danh sách phạt!');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPenalties();
  }, []);

  const handlePayPenalty = async (penaltyId: number) => {
    try {
      await penaltyApi.pay(penaltyId);
      message.success('Thanh toán thành công!');
      setPenalties(penalties.map(p => 
        p.id === penaltyId ? { ...p, status: 'Paid' } : p
      ));
    } catch (error: any) {
      message.error(error?.message || 'Thanh toán thất bại!');
    }
  };

  const columns = [
    {
      title: 'Mã phạt',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => <span>{reason || 'Trả muộn/Hư hỏng'}</span>,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (amount: number) => <span style={{ fontWeight: 600, color: '#f5576c' }}>{amount?.toLocaleString()} đ</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const normalized = normalizeStatus(status);
        return (
          <Tag color={normalized === 'paid' ? 'green' : 'red'}>
            {normalized === 'paid' ? '✓ Đã nộp' : '⏳ Chưa nộp'}
          </Tag>
        );
      },
    },
    {
      title: 'Ngày phạt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        normalizeStatus(record.status) === 'unpaid' ? (
          <Button 
            type="primary" 
            danger 
            size="small"
            onClick={() => handlePayPenalty(record.id)}
          >
            💳 Thanh toán
          </Button>
        ) : (
          <Tag icon={<CheckOutlined />} color="success">Đã thanh toán</Tag>
        )
      ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }} />;
  }

  if (!penalties || penalties.length === 0) {
    return (
      <Empty
        description="Bạn không có khoản phạt nào 🎉"
        style={{ marginTop: '60px' }}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      >
        <Button type="primary">Quay lại trang chủ</Button>
      </Empty>
    );
  }

  const unpaidTotal = penalties
    .filter(p => normalizeStatus(p.status) === 'unpaid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div>
      {unpaidTotal > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #f5576c 0%, #fd7272 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>💰 Tổng tiền nợ</div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{unpaidTotal.toLocaleString()} đ</div>
          <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '8px' }}>Vui lòng liên hệ Admin để thanh toán sớm</div>
        </div>
      )}

      <Table
        columns={columns}
        dataSource={penalties}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
        style={{ marginTop: '24px' }}
      />
    </div>
  );
};

export default ClientPenalties;
