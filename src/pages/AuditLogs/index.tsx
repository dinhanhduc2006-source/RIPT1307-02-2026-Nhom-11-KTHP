import { PageContainer, ProCard, ProTable } from '@ant-design/pro-components';
import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState([]);

  // ĐÃ SỬA: Đọc động nhật ký thao tác thực tế thay vì dữ liệu tĩnh
  useEffect(() => {
    const savedLogs = localStorage.getItem('mock_audit_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  return (
    <PageContainer
      title="Nhật ký hoạt động hệ thống"
      subTitle="Theo dõi và truy vết các thao tác mượn trả, thay đổi dữ liệu"
    >
      <ProCard bordered>
        <ProTable
          dataSource={logs}
          rowKey="id"
          search={false}
          options={{ reload: true, setting: true }}
          pagination={{ pageSize: 10 }}
          columns={[
            { title: 'Thời gian thao tác', dataIndex: 'time', width: 190 },
            {
              title: 'Người thực hiện',
              dataIndex: 'user',
              width: 160,
              render: (_, record: any) => (
                <>
                  <span style={{ fontWeight: 'bold', marginRight: 8 }}>
                    {record.user}
                  </span>
                  <Tag
                    color={record.role === 'Quản trị viên' ? 'gold' : 'blue'}
                  >
                    {record.role}
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
