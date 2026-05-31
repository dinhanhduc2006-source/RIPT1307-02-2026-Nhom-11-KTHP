import React, { useMemo } from 'react';
import { ProLayout, PageContainer, ProCard } from '@ant-design/pro-components';
import { Typography, Result, Button, Row, Col, Card, Descriptions, Tag } from 'antd';
import { history, useLocation, Link } from '@umijs/max';
import { 
  DashboardOutlined, 
  LaptopOutlined, 
  HistoryOutlined, 
  LogoutOutlined,
  UserOutlined 
} from '@ant-design/icons';
import { clearAuth, getUser } from '@/services/api';

// Import trực tiếp 2 giao diện chức năng bạn đã viết vào đây
import EquipmentList from './equipment';
import BorrowHistory from './history';

const { Paragraph } = Typography;

const ClientHome: React.FC = () => {
  const location = useLocation();
  const currentUser = getUser();
  const currentUserLabel =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    'Sinh viên';

  const currentTab = useMemo(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab === 'equipment' || tab === 'history') {
      return tab;
    }
    return 'dashboard';
  }, [location.search]);

  const handleLogout = () => {
    clearAuth();
    history.push('/login');
  };

  // Cấu trúc danh sách menu khớp với các tab trạng thái
  const clientMenuData = [
    {
      key: 'dashboard',
      path: '/client-home',
      name: 'Bảng điều khiển',
      icon: <DashboardOutlined />,
    },
    {
      key: 'equipment',
      path: '/client-home?tab=equipment',
      name: 'Dịch vụ thiết bị',
      icon: <LaptopOutlined />,
    },
    {
      key: 'history',
      path: '/client-home?tab=history',
      name: 'Lịch sử mượn đồ',
      icon: <HistoryOutlined />,
    },
  ];

  // Hàm render nội dung động dựa vào tab đang chọn
  const renderContent = () => {
    if (currentTab === 'equipment') {
      return <EquipmentList />;
    }
    if (currentTab === 'history') {
      return <BorrowHistory />;
    }

    // Nội dung mặc định của trang Dashboard chính
    return (
      <>
        <ProCard bordered ghost style={{ marginBottom: '24px' }}>
          <Result
            status="success"
            title="Chào mừng bạn đến với Hệ thống Quản lý Mượn Thiết Bị"
            subTitle="Nơi đăng ký, mượn trả và quản lý công cụ học tập dành riêng cho Thành viên Câu lạc bộ / Sinh viên."
            extra={[
              <Button key="logout" type="default" icon={<LogoutOutlined />} danger onClick={handleLogout}>
                Đăng xuất tài khoản
              </Button>,
            ]}
          />
        </ProCard>

        <ProCard split="vertical" bordered headerBordered style={{ marginBottom: '24px' }}>
          <ProCard title="Hồ sơ tài khoản" colSpan="40%">
            <Descriptions column={1}>
              <Descriptions.Item label="Tên đăng nhập">
                {currentUser?.username || '---'}
              </Descriptions.Item>
              {currentUser?.fullName && (
                <Descriptions.Item label="Họ và tên">
                  {currentUser.fullName}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Email">
                {currentUser?.email || '---'}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag color="gold">{currentUser?.role || 'Sinh viên'}</Tag>
              </Descriptions.Item>
            </Descriptions>
            <Button danger onClick={handleLogout} style={{ marginTop: 20 }}>
              Đăng xuất tài khoản
            </Button>
          </ProCard>

          <ProCard title="Dịch vụ nhanh" colSpan="60%">
            <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px' }}>
              Lựa chọn dịch vụ nhanh
            </div>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  actions={[
                    <Button
                      key="equipment"
                      type="link"
                      onClick={() => history.push('/client-home?tab=equipment')}
                    >
                      Truy cập ngay
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    avatar={<LaptopOutlined style={{ fontSize: '32px', color: '#1890ff' }} />}
                    title="Dịch Vụ Thiết Bị"
                    description="Xem danh sách thiết bị sẵn có trong kho và gửi yêu cầu mượn trực tuyến."
                  />
                </Card>
              </Col>

              <Col xs={24} sm={12}>
                <Card
                  hoverable
                  actions={[
                    <Button
                      key="history"
                      type="link"
                      onClick={() => history.push('/client-home?tab=history')}
                    >
                      Xem lịch sử
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    avatar={<HistoryOutlined style={{ fontSize: '32px', color: '#722ed1' }} />}
                    title="Lịch Sử Mượn Đồ"
                    description="Theo dõi trạng thái phiếu mượn cá nhân: chờ duyệt, chấp nhận, từ chối hoặc hoàn trả."
                  />
                </Card>
              </Col>
            </Row>
          </ProCard>
        </ProCard>
      </>
    );
  };

  return (
    <div style={{ height: '100vh', background: '#f0f2f5' }}>
    <ProLayout
        title="CLB Thiết Bị"
        logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        layout="mix"
        navTheme="light"
        fixedHeader
        fixSiderbar
        selectedKeys={[currentTab]} // Giữ trạng thái sáng đèn cho menu tương ứng
        menuDataRender={() => clientMenuData}
        menuItemRender={(item, defaultDom) => (
          item.path ? (
            <Link to={item.path}>{defaultDom}</Link>
          ) : (
            defaultDom
          )
        )}
        avatarProps={{
          icon: <UserOutlined />,
          size: 'small',
          title: currentUserLabel,
        }}
      >
        <PageContainer title={
          currentTab === 'equipment' ? 'Đăng ký mượn thiết bị' : 
          currentTab === 'history' ? 'Nhật ký mượn đồ cá nhân' : 'Không gian Sinh viên'
        }>
          {renderContent()}
          
          <div style={{ marginTop: '40px', textAlign: 'center', color: '#8c8c8c' }}>
            <Paragraph>© 2026 Hệ thống quản lý mượn trả thiết bị — Tiện lợi, trực quan và chính xác.</Paragraph>
          </div>
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default ClientHome;