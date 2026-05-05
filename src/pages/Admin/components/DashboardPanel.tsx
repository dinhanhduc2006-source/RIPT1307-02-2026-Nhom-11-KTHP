import { Col, Row, Statistic, Tag, Typography } from 'antd';
import { ProCard } from '@ant-design/pro-components';
import { Column, Pie } from '@ant-design/charts';
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
  const totalPosts = posts.length;
  const activeUsers = users.filter((user) => user.status === 'Active').length;
  const availableDevices = equipment.reduce((total, item) => total + item.available, 0);
  const pendingRequests = requests.filter((item) => item.status === 'Pending').length;

  const requestChartData = useMemo(() => {
    const statusMap: Record<string, number> = {
      Pending: 0,
      Approved: 0,
      Rejected: 0,
    };
    requests.forEach((request) => {
      statusMap[request.status] = (statusMap[request.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({ status, count }));
  }, [requests]);

  const equipmentChartData = useMemo(() => {
    const statusMap: Record<string, number> = {};
    equipment.forEach((item) => {
      statusMap[item.status] = (statusMap[item.status] || 0) + 1;
    });
    return Object.entries(statusMap).map(([status, count]) => ({ status, count }));
  }, [equipment]);

  const borrowTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    equipment.forEach((item) => {
      counts[item.name] = 0;
    });
    requests.forEach((request) => {
      if (request.status === 'Approved') {
        counts[request.item] = (counts[request.item] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([item, count]) => ({ item, count }));
  }, [equipment, requests]);

  const pieConfig = {
    data: requestChartData,
    angleField: 'count',
    colorField: 'status',
    radius: 0.75,
    label: {
      type: 'outer',
      content: '{name}: {percentage}',
      style: {
        fontSize: 12,
      },
    },
    interactions: [{ type: 'element-active' }],
  };

  const columnConfig = {
    data: borrowTrendData,
    xField: 'item',
    yField: 'count',
    seriesField: 'item',
    color: '#1890ff',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.9,
      },
    },
    xAxis: {
      title: { text: 'Thiết bị' },
    },
    yAxis: {
      title: { text: 'Lượt mượn đã duyệt' },
      min: 0,
      nice: true,
    },
    tooltip: {
      showTitle: false,
    },
  };

  return (
    <ProCard
      gutter={[16, 16]}
      split="vertical"
      bordered
      headerBordered
      title="Bảng điều khiển tổng quan"
    >
      <ProCard colSpan="40%" layout="center">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col span={24}>
            <ProCard title="Tổng bài đăng" bordered>
              <Statistic value={totalPosts} valueStyle={{ color: '#1890ff' }} />
            </ProCard>
          </Col>
          <Col span={24}>
            <ProCard title="Người dùng đang hoạt động" bordered>
              <Statistic value={activeUsers} valueStyle={{ color: '#52c41a' }} />
            </ProCard>
          </Col>
          <Col span={24}>
            <ProCard title="Thiết bị sẵn có" bordered>
              <Statistic value={availableDevices} valueStyle={{ color: '#fa8c16' }} />
            </ProCard>
          </Col>
          <Col span={24}>
            <ProCard title="Yêu cầu chờ duyệt" bordered>
              <Statistic value={pendingRequests} valueStyle={{ color: '#f5222d' }} />
            </ProCard>
          </Col>
        </Row>
      </ProCard>
      <ProCard colSpan="60%" layout="center">
        <Row gutter={[16, 16]} style={{ width: '100%' }}>
          <Col span={24}>
            <Title level={5}>Phân loại yêu cầu</Title>
            <Pie {...pieConfig} height={280} />
          </Col>
          <Col span={24}>
            <Title level={5}>Thiết bị mượn nhiều nhất</Title>
            <Column {...columnConfig} height={280} />
          </Col>
        </Row>
      </ProCard>
    </ProCard>
  );
};

export default DashboardPanel;
