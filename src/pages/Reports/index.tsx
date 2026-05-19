import { Column, Pie } from '@ant-design/charts';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, Row, Statistic, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Equipment, LoanRequest } from '../Admin/data';

const ReportsPage: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<LoanRequest[]>([]);

  // Đọc dữ liệu thực tế từ bộ nhớ LocalStorage để cập nhật số liệu liên tục
  useEffect(() => {
    const savedEquipment = localStorage.getItem('mock_equipment');
    const savedRequests = localStorage.getItem('mock_requests');

    if (savedEquipment) setEquipment(JSON.parse(savedEquipment));
    if (savedRequests) setRequests(JSON.parse(savedRequests));
  }, []);

  // Tính toán dữ liệu phân phối lượt mượn cho biểu đồ cột
  const deviceData = equipment.map((item) => ({
    type: item.name,
    value: item.total - item.available,
  }));

  // Thống kê phân loại trạng thái xử lý đơn cho biểu đồ tròn
  const statusData = [
    {
      type: 'Đã trả lại kho',
      value: requests.filter((r) => r.status === 'Returned').length,
    },
    {
      type: 'Đang mượn ngoài',
      value: requests.filter((r) => r.status === 'Approved').length,
    },
    {
      type: 'Từ chối duyệt',
      value: requests.filter((r) => r.status === 'Rejected').length,
    },
    {
      type: 'Yêu cầu chờ duyệt',
      value: requests.filter((r) => r.status === 'Pending').length,
    },
  ];

  // Logic tạo và tải file CSV thật (Hỗ trợ mở trực tiếp trên Microsoft Excel không bị lỗi font Tiếng Việt)
  const handleExportCSV = () => {
    if (requests.length === 0) {
      message.warning('Không có dữ liệu đơn mượn để thực hiện xuất file!');
      return;
    }

    const headers = [
      'Mã Đơn',
      'Người Mượn',
      'Thiết Bị',
      'Ngày Mượn',
      'Hạn Trả',
      'Trạng Thái',
    ];
    const rows = requests.map((r) => [
      r.id,
      `"${r.requester}"`,
      `"${r.item}"`,
      r.borrowDate,
      r.returnDate,
      r.status,
    ]);

    // Thêm ký tự BOM (\uFEFF) ở đầu file để bảo toàn mã hóa UTF-8 cho Tiếng Việt khi Excel đọc dữ liệu
    const csvContent =
      '\uFEFF' + [headers, ...rows].map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `BaoCao_HeThongMuon_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    message.success('Đã khởi tạo và tải xuống file CSV báo cáo!');
  };

  return (
    <PageContainer
      title="Báo cáo tình hình sử dụng thiết bị"
      extra={
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportCSV}
        >
          Xuất Excel / CSV
        </Button>
      }
    >
      {/* KHỐI SỐ LIỆU TỔNG QUAN */}
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <ProCard bordered hoverable>
            <Statistic
              title="Thiết bị sẵn sàng / Tổng kho"
              value={`${equipment.reduce(
                (acc, item) => acc + item.available,
                0,
              )} / ${equipment.reduce((acc, item) => acc + item.total, 0)}`}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard bordered hoverable>
            <Statistic
              title="Thiết bị đang bảo trì"
              value={equipment.filter((e) => e.status === 'Bảo trì').length}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <ProCard bordered hoverable>
            <Statistic title="Tổng lượt đăng ký mượn" value={requests.length} />
          </ProCard>
        </Col>
      </Row>

      {/* KHỐI BIỂU ĐỒ TRỰC QUAN HÓA */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={14}>
          <ProCard
            title="Thống kê lượng thiết bị đang được mượn bên ngoài"
            bordered
          >
            <Column
              data={deviceData}
              xField="type"
              yField="value"
              height={300}
            />
          </ProCard>
        </Col>
        <Col span={10}>
          <ProCard title="Tỷ lệ phân phối trạng thái đơn mượn đồ" bordered>
            <Pie
              data={statusData}
              angleField="value"
              colorField="type"
              radius={0.8}
              height={300}
            />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ReportsPage;
