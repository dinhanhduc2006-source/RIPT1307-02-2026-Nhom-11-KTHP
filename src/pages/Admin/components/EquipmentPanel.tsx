import { Col, Row, Tag, Typography } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import React, { useMemo } from 'react';
import { Equipment, LoanRequest } from '../data';

type Props = {
  equipment: Equipment[];
  requests: LoanRequest[];
};

const { Paragraph, Title } = Typography;

const EquipmentPanel: React.FC<Props> = ({ equipment, requests }) => {
  const topEquipment = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach((request) => {
      if (request.status === 'Approved') {
        counts[request.item] = (counts[request.item] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [requests]);

  return (
    <ProCard title="Kho thiết bị" gutter={[16, 16]} split="vertical" bordered>
      <ProCard colSpan="60%" layout="center">
        <ProTable<Equipment>
          columns={[
            { title: 'Thiết bị', dataIndex: 'name' },
            { title: 'Loại', dataIndex: 'category', width: 140 },
            { title: 'Sẵn có', dataIndex: 'available', width: 100 },
            { title: 'Tổng', dataIndex: 'total', width: 100 },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              width: 120,
              render: (_, record) => {
                const color =
                  record.status === 'Sẵn sàng'
                    ? 'success'
                    : record.status === 'Hết hàng'
                    ? 'error'
                    : 'warning';
                return <Tag color={color}>{record.status}</Tag>;
              },
            },
          ]}
          dataSource={equipment}
          rowKey="id"
          search={false}
          pagination={false}
        />
      </ProCard>
      <ProCard colSpan="40%" layout="center">
        <Title level={5}>Thiết bị đã duyệt nhiều nhất</Title>
        {topEquipment.length > 0 ? (
          topEquipment.map(([name, count]) => (
            <Paragraph key={name}>
              <strong>{name}</strong> — {count} lần duyệt
            </Paragraph>
          ))
        ) : (
          <Paragraph>Chưa có thiết bị duyệt nào.</Paragraph>
        )}
      </ProCard>
    </ProCard>
  );
};

export default EquipmentPanel;
