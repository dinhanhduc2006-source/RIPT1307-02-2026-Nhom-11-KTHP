import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { auditLogApi } from '@/services/api';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await auditLogApi.getAll();
      setLogs(res || []);
    } catch (error) {
      message.error('Không thể tải nhật ký hệ thống');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <PageContainer
      title="Nhật ký hoạt động hệ thống"
      subTitle="Theo dõi và truy vết các thao tác mượn trả, thay đổi dữ liệu"
    >
      <ProCard bordered>
        <ProTable
          loading={loading}
          dataSource={logs}
          rowKey="id"
          search={false}
          options={{ reload: fetchLogs, setting: true }}
          pagination={{ pageSize: 10 }}
          columns={[
            { 
              title: 'Thời gian thao tác', 
              dataIndex: 'createdAt', 
              width: 190,
              render: (v: any) => v ? new Date(v).toLocaleString('vi-VN') : '-'
            },
            {
              title: 'Người thực hiện',
              dataIndex: 'user',
              width: 160,
              render: (_, record: any) => (
                <>
                  <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                    {record.user?.username || 'N/A'}
                  </span>
                  <Tag
                    color={record.user?.role === 'Admin' ? 'gold' : 'blue'}
                  >
                    {record.user?.role || 'User'}
                  </Tag>
                </>
              ),
            },
            {
              title: 'Hành động',
              dataIndex: 'action',
              width: 160,
              render: (v: any) => <Tag color="green">{v}</Tag>,
            },
            { title: 'Nội dung chi tiết nghiệp vụ', dataIndex: 'detail' },
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};

export default AuditLogs;
