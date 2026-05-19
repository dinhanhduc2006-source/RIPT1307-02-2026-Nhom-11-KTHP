import { DollarOutlined } from '@ant-design/icons';
import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { message, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const { Text } = Typography;

const initialPenalties = [
  {
    id: 1,
    student: 'sv01',
    reason: 'Trả thiết bị quá hạn 3 ngày',
    amount: 60000,
    status: 'Chưa nộp',
    date: '2026-05-15',
  },
  {
    id: 2,
    student: 'Nguyễn Văn A',
    reason: 'Làm hỏng cáp kết nối máy chiếu',
    amount: 150000,
    status: 'Đã nộp',
    date: '2026-04-20',
  },
];

const PenaltiesPage: React.FC = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('mock_penalties');
    return saved ? JSON.parse(saved) : initialPenalties;
  });

  useEffect(() => {
    localStorage.setItem('mock_penalties', JSON.stringify(data));
  }, [data]);

  const handleCollectMoney = (id: number) => {
    setData(
      data.map((item) =>
        item.id === id ? { ...item, status: 'Đã nộp' } : item,
      ),
    );
    message.success('Đã xác nhận thu tiền bồi thường/phạt thành công!');
  };

  return (
    <PageContainer
      title="Quản lý Vi phạm & Thu phạt"
      subTitle="Xử lý các trường hợp trả muộn, làm hỏng hoặc mất thiết bị"
    >
      <ProCard bordered>
        <ProTable
          dataSource={data}
          rowKey="id"
          search={false}
          columns={[
            {
              title: 'Người vi phạm',
              dataIndex: 'student',
              render: (t) => <Text strong>{t}</Text>,
            },
            { title: 'Lý do phạt', dataIndex: 'reason' },
            {
              title: 'Số tiền (VNĐ)',
              dataIndex: 'amount',
              render: (v) => (
                <Text type="danger" strong>
                  {v.toLocaleString()} đ
                </Text>
              ),
            },
            { title: 'Ngày lập biên bản', dataIndex: 'date' },
            {
              title: 'Trạng thái',
              dataIndex: 'status',
              render: (s) => (
                <Tag
                  color={
                    s === 'Chờ nộp' || s === 'Chưa nộp' ? 'red' : 'success'
                  }
                >
                  {s}
                </Tag>
              ),
            },
            {
              title: 'Hành động',
              render: (_, record) => (
                <Space>
                  {record.status !== 'Đã nộp' && (
                    <Popconfirm
                      title="Xác nhận sinh viên đã nộp đủ tiền?"
                      onConfirm={() => handleCollectMoney(record.id)}
                    >
                      <a style={{ color: '#52c41a', fontWeight: 'bold' }}>
                        <DollarOutlined /> Thu tiền
                      </a>
                    </Popconfirm>
                  )}
                  {record.status === 'Đã nộp' && (
                    <Text type="secondary">Hoàn tất</Text>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};
export default PenaltiesPage;
