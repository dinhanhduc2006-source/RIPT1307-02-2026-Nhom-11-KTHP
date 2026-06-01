import React, { useState, useEffect } from 'react';
import { Table, Tag, Card, message, Button, Modal, Input, Space } from 'antd';
import { ToolOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { loanRequestApi, equipmentApi } from '@/services/api';

interface LoanRequestItem {
  id: number;
  equipmentName?: string;
  borrowDate: string;
  returnDate: string;
  status: string;
  rejectReason?: string;
  returnedAt?: string;
  equipment?: { id?: number; name?: string };
}

const normalizeLoanStatus = (status: string) => status?.toString().trim().toLowerCase();

const BorrowHistory: React.FC = () => {
  const [historyData, setHistoryData] = useState<LoanRequestItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportingLoanId, setReportingLoanId] = useState<number | null>(null);
  const [reportEquipmentId, setReportEquipmentId] = useState<number | null>(null);
  const [reportIssue, setReportIssue] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [returnModalVisible, setReturnModalVisible] = useState(false);
  const [returnLoanId, setReturnLoanId] = useState<number | null>(null);
  const [returnLoading, setReturnLoading] = useState(false);

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

  const handleReportIssue = (loanId: number) => {
    const loan = historyData.find((l) => l.id === loanId);
    const equipmentId = loan?.equipment?.id || (loan as any)?.equipmentId || null;
    if (!equipmentId) {
      message.error('Không xác định mã thiết bị để báo cáo.');
      return;
    }

    setReportingLoanId(loanId);
    setReportEquipmentId(equipmentId);
    setReportIssue('');
    setReportModalVisible(true);
  };

  const submitReport = async () => {
    if (!reportIssue.trim() || !reportEquipmentId) {
      message.error('Vui lòng mô tả sự cố để gửi báo cáo!');
      return;
    }

    try {
      setReportLoading(true);
      await equipmentApi.setMaintenance(reportEquipmentId, reportIssue);
      message.success('✅ Báo cáo sự cố thành công! Admin sẽ xử lý sớm.');
      setReportModalVisible(false);
      setReportIssue('');
      setReportEquipmentId(null);
    } catch (error: any) {
      message.error(error?.message || 'Báo cáo thất bại!');
    } finally {
      setReportLoading(false);
    }
  };

  const handleReturnItem = (loanId: number) => {
    setReturnLoanId(loanId);
    setReturnModalVisible(true);
  };

  const submitReturnItem = async () => {
    if (!returnLoanId) {
      message.error('Không xác định yêu cầu trả thiết bị.');
      return;
    }

    try {
      setReturnLoading(true);
      await loanRequestApi.returnItem(returnLoanId);
      message.success('Đã gửi yêu cầu trả thiết bị thành công!');
      setReturnModalVisible(false);
      setReturnLoanId(null);
      fetchHistory();
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || 'Trả thiết bị thất bại!');
    } finally {
      setReturnLoading(false);
    }
  };

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
        const normalized = normalizeLoanStatus(status);
        if (normalized === 'pending') return <Tag color="blue">Chờ phê duyệt</Tag>;
        if (normalized === 'approved') return <Tag color="green">Đang mượn</Tag>;
        if (normalized === 'returned') return <Tag color="purple">Đã trả đồ</Tag>;
        if (normalized === 'rejected')
          return <Tag color="red">Bị từ chối ({record.rejectReason || 'Không rõ lý do'})</Tag>;
        return <Tag color="default">{status || 'Không rõ'}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: LoanRequestItem) => {
        const normalized = normalizeLoanStatus(record.status);
        return (
          <Space wrap>
            {normalized === 'approved' && (
              <Button
                type="primary"
                size="small"
                onClick={() => handleReturnItem(record.id)}
              >
                Trả thiết bị
              </Button>
            )}
            {normalized === 'approved' && (
              <Button
                type="default"
                danger
                size="small"
                icon={<ToolOutlined />}
                onClick={() => handleReportIssue(record.id)}
              >
                Báo hỏng
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Card title="Lịch Sử Mượn Thiết Bị Của Tôi">
      <Table columns={columns} dataSource={historyData} rowKey="id" loading={loading} />

      {/* Report Issue Modal */}
      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <span>Báo cáo sự cố thiết bị</span>
          </Space>
        }
        open={reportModalVisible}
        onOk={submitReport}
        onCancel={() => setReportModalVisible(false)}
        okText="Gửi báo cáo"
        cancelText="Hủy"
        confirmLoading={reportLoading}
      >
        <div style={{ marginBottom: '16px', padding: '12px', background: '#fef3cd', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
          <strong>⚠️ Lưu ý:</strong> Báo cáo sự cố sẽ được gửi đến Admin để xử lý ngay. Vui lòng mô tả chi tiết sự cố để Admin có thể hỗ trợ nhanh hơn.
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
            Mô tả sự cố:
          </label>
          <Input.TextArea
            rows={4}
            placeholder="Ví dụ: Máy chiếu bị lỗi đèn, không phát sáng. Hoặc: Pin của thiết bị hết lâu..."
            value={reportIssue}
            onChange={(e) => setReportIssue(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        title="Xác nhận trả thiết bị"
        open={returnModalVisible}
        onOk={submitReturnItem}
        onCancel={() => setReturnModalVisible(false)}
        okText="Xác nhận trả"
        cancelText="Hủy"
        confirmLoading={returnLoading}
      >
        <div style={{ marginBottom: '24px' }}>
          <p>Bạn có chắc chắn muốn gửi yêu cầu trả thiết bị này không?</p>
          <p>Admin sẽ cập nhật trạng thái sau khi nhận lại thiết bị.</p>
        </div>
      </Modal>
    </Card>
  );
};

export default BorrowHistory;