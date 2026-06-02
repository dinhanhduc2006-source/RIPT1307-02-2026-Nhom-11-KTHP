import React from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Typography, Result, Button } from 'antd';
import { history } from '@umijs/max';
import { clearAuth } from '@/services/api';

const { Title, Paragraph } = Typography;

const ClientHome: React.FC = () => {
  const handleLogout = () => {
    clearAuth();
    history.push('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px' }}>
      <PageContainer title="Trang chủ Thành viên">
        <ProCard bordered>
          <Result
            status="info"
            title="Chào mừng bạn đến với Hệ thống CLB Thiết Bị"
            subTitle="Giao diện dành cho Sinh viên và Giảng viên đang được phát triển."
            extra={[
              <Button key="logout" type="primary" onClick={handleLogout}>
                Đăng xuất
              </Button>
            ]}
          />
          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Title level={4}>Thông tin hướng dẫn</Title>
            <Paragraph>
              Phần giao diện cá nhân hóa cho người dùng sẽ được cập nhật trong các phiên bản tiếp theo.
              Hiện tại, bạn có thể sử dụng menu "Dịch vụ thiết bị" để đăng ký mượn đồ.
            </Paragraph>
          </div>
        </ProCard>
      </PageContainer>
    </div>
  );
};

export default ClientHome;
