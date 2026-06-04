import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Empty, Spin, message, Modal } from 'antd';
import { penaltyApi } from '@/services/api';
import { CheckOutlined } from '@ant-design/icons';

const normalizeStatus = (status: string | undefined) => status?.toString().trim().toLowerCase();

const ClientPenalties: React.FC = () => {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPenalty, setSelectedPenalty] = useState<any | null>(null);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

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

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');

  const openPaymentModal = (record: any) => {
    setSelectedPenalty(record);
    setPaymentMethod('card');
    setIsPaymentModalVisible(true);
  };

  const handleConfirmPayment = async () => {
    if (!selectedPenalty) {
      return;
    }
    try {
      setConfirmingPayment(true);
      await penaltyApi.pay(selectedPenalty.id);
      message.success('Thanh toán thành công! Trạng thái đã được cập nhật.');
      setPenalties(penalties.map(p =>
        p.id === selectedPenalty.id ? { ...p, status: 'Paid' } : p
      ));
      setIsPaymentModalVisible(false);
      setSelectedPenalty(null);
    } catch (error: any) {
      message.error(error?.message || 'Thanh toán thất bại!');
    } finally {
      setConfirmingPayment(false);
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
        if (normalized === 'paid') {
          return <Tag color="green">✓ Đã nộp</Tag>;
        }
        if (normalized === 'pendingapproval') {
          return <Tag color="gold">⏳ Chờ admin xác nhận</Tag>;
        }
        return <Tag color="red">⏳ Chưa nộp</Tag>;
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
      render: (_: any, record: any) => {
        const normalized = normalizeStatus(record.status);
        if (normalized === 'unpaid') {
          return (
            <Button
              type="primary"
              danger
              size="small"
              onClick={() => openPaymentModal(record)}
            >
              💳 Thanh toán
            </Button>
          );
        }
        if (normalized === 'pendingapproval') {
          return <Tag color="orange">Đang chờ xác nhận</Tag>;
        }
        return <Tag icon={<CheckOutlined />} color="success">Đã thanh toán</Tag>;
      },
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

      <Modal
        title="Thanh toán phạt "
        open={isPaymentModalVisible}
        onCancel={() => {
          setIsPaymentModalVisible(false);
          setSelectedPenalty(null);
        }}
        onOk={handleConfirmPayment}
        okText="Xác nhận thanh toán"
        confirmLoading={confirmingPayment}
        cancelText="Hủy"
      >
        {selectedPenalty ? (
          <div>
            <p style={{ marginBottom: 12 }}>
              Số tiền nợ: <strong>{selectedPenalty.amount?.toLocaleString()} đ</strong>
            </p>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Phương thức thanh toán</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button
                  type={paymentMethod === 'card' ? 'primary' : 'default'}
                  onClick={() => setPaymentMethod('card')}
                >
                  Thanh toán Thẻ ngân hàng 
                </Button>
                <Button
                  type={paymentMethod === 'wallet' ? 'primary' : 'default'}
                  onClick={() => setPaymentMethod('wallet')}
                >
                  Thanh toán Ví điện tử 
                </Button>
              </div>
            </div>
            <div style={{ marginBottom: 16, fontSize: 12, color: '#888' }}>
              (Chế độ Sandbox: Bấm Xác nhận để hệ thống tự động xử lý giao dịch thành công)
            </div>
            <div style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 8, background: '#fafafa' }}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>Thông tin đơn thanh toán</div>
              <div>Số tiền: {selectedPenalty.amount?.toLocaleString()} đ</div>
              <div>Mã phạt: #{selectedPenalty.id}</div>
              <div>Người dùng: {selectedPenalty.user?.username || '---'}</div>
              <div>Phương thức: {paymentMethod === 'card' ? 'Thẻ ngân hàng' : 'Ví điện tử'}</div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default ClientPenalties;
