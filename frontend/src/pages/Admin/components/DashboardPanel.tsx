import { Column, Pie } from '@ant-design/charts';
import {
  AppstoreTwoTone,
  BellTwoTone,
  FileTextTwoTone,
  WarningTwoTone,
} from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Alert, Col, Row, Statistic, Typography } from 'antd';
import React, { useMemo } from 'react';
import { Equipment, LoanRequest, Post, User } from '../data';

const { Title } = Typography;

type Props = {
  posts: Post[];
  users: User[];
  equipment: Equipment[];
  requests: LoanRequest[];
};

const DashboardPanel: React.FC<Props> = ({ posts, users, equipment, requests }) => {
  // Thống kê sơ bộ
  const totalPosts = posts.length;
  const totalUsers = users.length;
  const availableDevices = equipment.reduce(
    (total, item) => total + item.available,
    0,
  );
  const pendingRequests = requests.filter(
    (item) => item.status === 'Pending',
  ).length;

  // Lấy ra các đơn đang bị QUÁ HẠN (Đang mượn & ngày trả < hôm nay)
  const overdueRequests = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return requests.filter(
      (req) => req.status === 'Approved' && req.returnDate < today,
    );
  }, [requests]);

  // Dữ liệu biểu đồ tròn (Đã dịch sang Tiếng Việt)
  const requestChartData = useMemo(() => {
    const statusMap: Record<string, { count: number; label: string }> = {
      Pending: { count: 0, label: 'Chờ duyệt' },
      Approved: { count: 0, label: 'Đang mượn' },
      Rejected: { count: 0, label: 'Bị từ chối' },
      Returned: { count: 0, label: 'Đã trả' },
    };
    requests.forEach((request) => {
      if (statusMap[request.status]) {
        statusMap[request.status].count += 1;
      }
    });
    return Object.values(statusMap).map(({ label, count }) => ({
      status: label,
      count,
    }));
  }, [requests]);

  // Dữ liệu biểu đồ cột (Xu hướng mượn)
  const borrowTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    equipment.forEach((item) => {
      counts[item.name] = 0;
    });
    requests.forEach((request) => {
      if (request.status === 'Approved' || request.status === 'Returned') {
        const name = request.equipment.name;
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([item, count]) => ({ item, count }));
  }, [equipment, requests]);

  return (
    <ProCard
      gutter={[16, 16]}
      split="vertical"
      bordered
      headerBordered
      title="Tổng quan hệ thống"
    >
      <ProCard colSpan="40%">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <ProCard bordered hoverable>
              <Statistic
                title="Tổng bài đăng"
                value={totalPosts}
                prefix={<FileTextTwoTone />}
              />
            </ProCard>
          </Col>
          <Col span={24}>
            <ProCard bordered hoverable>
              <Statistic
                title="Thiết bị sẵn có"
                value={availableDevices}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<AppstoreTwoTone twoToneColor="#fa8c16" />}
              />
            </ProCard>
          </Col>
          <Col span={24}>
            <ProCard bordered hoverable>
              <Statistic
                title="Yêu cầu chờ duyệt"
                value={pendingRequests}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BellTwoTone />}
              />
            </ProCard>
          </Col>

          {/* Cảnh báo Quá Hạn */}
          <Col span={24}>
            <ProCard
              bordered
              hoverable
              style={{
                border:
                  overdueRequests.length > 0 ? '1px solid #cf1322' : undefined,
              }}
            >
              <Statistic
                title="Đơn mượn QUÁ HẠN"
                value={overdueRequests.length}
                valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
                prefix={<WarningTwoTone twoToneColor="#cf1322" />}
              />
              {overdueRequests.length > 0 && (
                <Alert
                  message={`Có ${overdueRequests.length} sinh viên chưa trả đồ!`}
                  type="error"
                  showIcon
                  style={{ marginTop: 12 }}
                />
              )}
            </ProCard>
          </Col>
        </Row>
      </ProCard>

      <ProCard colSpan="60%">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5}>Phân loại yêu cầu mượn</Title>
            <Pie
              data={requestChartData}
              angleField="count"
              colorField="status"
              radius={0.7}
              height={250}
            />
          </Col>
          <Col span={24}>
            <Title level={5}>Thiết bị được sử dụng nhiều nhất</Title>
            <Column
              data={borrowTrendData}
              xField="item"
              yField="count"
              height={250}
            />
          </Col>
        </Row>
      </ProCard>
    </ProCard>
  );
};

export default DashboardPanel;
