import { Button, Space, Tag } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import React from 'react';
import { LoanRequest } from '../data';

type Props = {
  requests: LoanRequest[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
};

const LoanRequests: React.FC<Props> = ({ requests, onApprove, onReject }) => {
  return (
    <ProCard title="Danh sách yêu cầu mượn" bordered>
      <ProTable<LoanRequest>
        columns={[
          { title: 'Người yêu cầu', dataIndex: 'requester' },
          { title: 'Thiết bị', dataIndex: 'item' },
          { title: 'Ngày mượn', dataIndex: 'borrowDate', width: 120 },
          { title: 'Ngày trả', dataIndex: 'returnDate', width: 120 },
          {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 120,
            render: (_, record) => {
              const color =
                record.status === 'Approved'
                  ? 'green'
                  : record.status === 'Rejected'
                  ? 'red'
                  : 'gold';
              return <Tag color={color}>{record.status}</Tag>;
            },
          },
          {
            title: 'Hành động',
            valueType: 'option',
            render: (_, record) => (
              <Space>
                <Button
                  type="primary"
                  size="small"
                  disabled={record.status !== 'Pending'}
                  onClick={() => onApprove(record.id)}
                >
                  Duyệt
                </Button>
                <Button
                  danger
                  size="small"
                  disabled={record.status !== 'Pending'}
                  onClick={() => onReject(record.id)}
                >
                  Từ chối
                </Button>
              </Space>
            ),
          },
        ]}
        dataSource={requests}
        rowKey="id"
        search={false}
        pagination={{ pageSize: 5 }}
      />
    </ProCard>
  );
};

export default LoanRequests;
