import React, { useMemo, useState, useEffect } from 'react';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import { Typography, Button, Row, Col, Card, Tag, Space, Dropdown, Alert, Skeleton, Empty, Avatar, Form, Input, Modal, message, Drawer, Badge } from 'antd';
import { history, useLocation } from '@umijs/max';
import { 
  LaptopOutlined, 
  HistoryOutlined, 
  LogoutOutlined,
  UserOutlined,
  RocketOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { clearAuth, getUser, loanRequestApi, penaltyApi, announcementApi, postApi } from '@/services/api';

import EquipmentList from './equipment';
import BorrowHistory from './history';
import ClientAccount from './account';
import ClientPenalties from './penalties';

const { Paragraph } = Typography;

// CSS Animations
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animateIn {
    animation: fadeInUp 0.6s ease-out;
  }

  .animateInDelay1 {
    animation: fadeInUp 0.6s ease-out 0.1s both;
  }

  .animateInDelay2 {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  .animateInDelay3 {
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }

  .cardHover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cardHover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .statCard {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    transition: all 0.3s ease;
  }

  .statCard:hover {
    transform: scale(1.05);
  }

  .statCard:nth-child(2) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .heroSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }

  .heroSection::before {
    content: '';
    position: absolute;
    top: 0;
    right: -100px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .featureCard {
    border: none;
    border-radius: 16px;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .featureCard::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .featureCard:hover::before {
    opacity: 1;
  }
`;

const normalizeStatus = (status: string | undefined) => status?.toString().trim().toLowerCase();

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
    if (tab === 'equipment' || tab === 'history' || tab === 'account' || tab === 'penalties') {
      return tab;
    }
    return 'dashboard';
  }, [location.search]);

  const handleLogout = () => {
    clearAuth();
    history.push('/login');
  };

  // States for dashboard data
  const [loans, setLoans] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [postForm] = Form.useForm();

  const loadAnnouncements = async () => {
    try {
      setNotificationsLoading(true);
      const data = await announcementApi.getActive();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(true);
    if (!announcements.length) {
      loadAnnouncements();
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [loansData, penaltiesData, announcementsData, postsData] = await Promise.all([
          loanRequestApi.getMyRequests(),
          penaltyApi.getMyPenalties(),
          announcementApi.getActive(),
          postApi.getAll(),
        ]);
        setLoans(Array.isArray(loansData) ? loansData : []);
        setPenalties(Array.isArray(penaltiesData) ? penaltiesData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentTab === 'dashboard') {
      fetchData();
    }
  }, [currentTab]);

  useEffect(() => {
    if (!announcements.length) {
      loadAnnouncements();
    }
  }, []);

  const handleCreatePost = async () => {
    try {
      const values = await postForm.validateFields();
      const user = getUser();
      if (!user) {
        message.error('Vui lòng đăng nhập để đăng bài');
        return;
      }
      setCreatePostLoading(true);
      await postApi.create({
        title: values.title,
        content: values.content,
        category: values.category,
        tags: values.tags || 'Thảo luận',
      });
      message.success('Đã đăng bài viết mới thành công!');
      postForm.resetFields();
      setPostModalOpen(false);
      const refreshedPosts = await postApi.getAll();
      setPosts(Array.isArray(refreshedPosts) ? refreshedPosts : []);
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || 'Đăng bài thất bại');
    } finally {
      setCreatePostLoading(false);
    }
  };

  const renderContent = () => {
    if (currentTab === 'equipment') {
      return <EquipmentList />;
    }
    if (currentTab === 'history') {
      return <BorrowHistory />;
    }
    if (currentTab === 'account') {
      return <ClientAccount />;
    }
    if (currentTab === 'penalties') {
      return <ClientPenalties />;
    }

    return (
      <>
        <style>{animationStyles}</style>
        
        {/* Hero Section */}
        <div className="animateIn" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '48px 32px',
          color: 'white',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Typography.Title level={1} style={{ margin: '0 0 16px', color: 'white', fontSize: '2.5rem' }}>
              Chào mừng, {currentUserLabel}! 👋
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '32px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Quản lý mượn trả thiết bị nhanh chóng, dễ dàng và hiệu quả. Theo dõi yêu cầu, lịch sử mượn và nhận thông báo tức thời.
            </Typography.Paragraph>
            <Space wrap style={{ gap: '12px' }}>
              <Button type="primary" size="large" onClick={() => history.push('/client-home?tab=equipment')} style={{
                backgroundColor: '#fff',
                color: '#667eea',
                border: 'none',
                fontWeight: '600',
                height: '44px'
              }}>
                🎁 Đăng ký mượn thiết bị
              </Button>
              <Button size="large" onClick={() => history.push('/client-home?tab=history')} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                fontWeight: '600',
                height: '44px'
              }}>
                📋 Xem lịch sử mượn
              </Button>
            </Space>
          </div>
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-50px',
            width: '400px',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={8}>
            <div className="animateInDelay1 statCard">
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>📌 Đang mượn</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : loans.filter((l: any) => normalizeStatus(l.status) === 'approved').length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>thiết bị</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="animateInDelay2 statCard">
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>⏳ Chờ duyệt</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : loans.filter((l: any) => normalizeStatus(l.status) === 'pending').length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>phiếu</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="animateInDelay3 statCard" style={{ background: penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') ? 'linear-gradient(135deg, #f5576c 0%, #fd7272 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>💸 Nợ phạt</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : penalties.filter((p: any) => normalizeStatus(p.status) === 'unpaid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>đ</div>
            </div>
          </Col>
        </Row>

        {/* Alert Section */}
        {!loading && (penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') || loans.some((l: any) => normalizeStatus(l.status) === 'approved' && new Date(l.returnDate) < new Date())) && (
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            {penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') && (
              <Col xs={24}>
                <Alert
                  message="⚠️ Bạn có tiền phạt chưa nộp"
                  description={`Tổng tiền phạt nợ: ${penalties.filter((p: any) => normalizeStatus(p.status) === 'unpaid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toLocaleString()} đ. Vui lòng liên hệ Admin để giải quyết.`}
                  type="error"
                  showIcon
                  action={<Button size="small" danger onClick={() => history.push('/client-home?tab=penalties')}>Xem chi tiết</Button>}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            )}
            {loans.some((l: any) => normalizeStatus(l.status) === 'approved' && new Date(l.returnDate) < new Date()) && (
              <Col xs={24}>
                <Alert
                  message="❗ Bạn có thiết bị sắp/quá hạn trả"
                  description="Vui lòng trả thiết bị sớm để tránh bị phạt."
                  type="warning"
                  showIcon
                  action={<Button size="small" onClick={() => history.push('/client-home?tab=history')}>Xem lịch sử</Button>}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            )}
          </Row>
        )}

        {/* Features Grid */}
        <div style={{ marginBottom: '32px' }}>
          <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>✨ Tính năng nổi bật</Typography.Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="animateInDelay1 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<LaptopOutlined style={{ fontSize: 32, color: '#667eea' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Quản lý thiết bị</span>}
                  description="Tìm kiếm, xem chi tiết và gửi yêu cầu mượn trực tiếp trong hệ thống."
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="animateInDelay2 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<HistoryOutlined style={{ fontSize: 32, color: '#f5576c' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Theo dõi lịch sử</span>}
                  description="Xem toàn bộ lịch sử mượn trả, trạng thái duyệt và thời hạn trả."
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card id="systemNotificationsSection" className="animateInDelay3 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<BellOutlined style={{ fontSize: 32, color: '#faad14' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Thông báo hệ thống</span>}
                  description="Nhận tin quan trọng từ Admin về lịch nghỉ, quy định và cập nhật kho."
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Community Section */}
        <div style={{ marginBottom: '32px' }}>
          <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>💬 Cộng đồng thảo luận</Typography.Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => setPostModalOpen(true)}>
              <RocketOutlined /> Đăng bài nhanh
            </Button>
            {loading ? (
              <Skeleton active />
            ) : posts.length > 0 ? (
              posts.slice(0, 3).map((post: any) => (
                <Card className="cardHover" key={post.id} style={{ borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>{post.title}</Typography.Title>
                      <Space size="small" wrap>
                        <Tag color="magenta">{post.category}</Tag>
                        {(post.tags || 'Chia sẻ').split(',').map((tag: string) => (
                          <Tag key={tag}>{tag.trim()}</Tag>
                        ))}
                      </Space>
                      <Typography.Paragraph style={{ margin: '10px 0 0 0', color: '#555' }} ellipsis={{ rows: 2, expandable: false }}>
                        {post.content}
                      </Typography.Paragraph>
                    </div>
                    <Avatar size="large" icon={<UserOutlined />} />
                  </div>
                </Card>
              ))
            ) : (
              <Empty description="Chưa có bài viết nào. Hãy tạo bài đầu tiên!" />
            )}
            <Button type="link" onClick={() => history.push('/forum')}>
              Xem toàn bộ bài viết cộng đồng →
            </Button>
          </Space>
        </div>

        <Modal
          title="Tạo bài thảo luận mới"
          open={postModalOpen}
          onOk={handleCreatePost}
          onCancel={() => setPostModalOpen(false)}
          confirmLoading={createPostLoading}
          okText="Đăng bài"
          cancelText="Hủy"
          destroyOnClose
        >
          <Form form={postForm} layout="vertical">
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Tiêu đề bài viết" />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
            >
              <Input placeholder="Ví dụ: Kinh nghiệm mượn, Báo lỗi thiết bị" />
            </Form.Item>
            <Form.Item name="tags" label="Nhãn tags">
              <Input placeholder="Ví dụ: màn hình, laptop, máy chiếu" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <Input.TextArea rows={4} placeholder="Mô tả chi tiết vấn đề hoặc chia sẻ của bạn" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Announcements Section */}
        {!loading && announcements && announcements.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>ℹ️ Thông báo từ Admin</Typography.Title>
            <Row gutter={[24, 24]}>
              {announcements.slice(0, 3).map((announcement: any) => (
                <Col xs={24} key={announcement.id}>
                  <Card className="cardHover" style={{ borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
                          📰 {announcement.title}
                        </Typography.Title>
                        <Typography.Paragraph style={{ margin: '0 0 8px 0', color: '#666' }}>
                          {announcement.content?.substring(0, 100)}...
                        </Typography.Paragraph>
                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                        </Typography.Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Drawer
          title={`Thông báo hệ thống (${announcements.length})`}
          placement="right"
          width={420}
          onClose={() => setNotificationsOpen(false)}
          open={notificationsOpen}
        >
          {notificationsLoading ? (
            <Skeleton active />
          ) : announcements.length > 0 ? (
            announcements.map((announcement: any) => (
              <Card
                key={announcement.id}
                size="small"
                style={{ marginBottom: 16, borderRadius: 12 }}
                bodyStyle={{ padding: 16 }}
              >
                <Typography.Title level={5} style={{ marginBottom: 8 }}>
                  📰 {announcement.title}
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: 12, color: '#555' }}>
                  {announcement.content}
                </Typography.Paragraph>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                </Typography.Text>
              </Card>
            ))
          ) : (
            <Empty description="Không có thông báo mới" />
          )}
        </Drawer>

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#8c8c8c', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
          <Paragraph>© 2026 Hệ thống quản lý mượn trả thiết bị — Tiện lợi, trực quan và chính xác.</Paragraph>
        </div>
      </>
    );
  };

  return (
    <div style={{ height: '100vh', background: '#f5f7fa' }}>
      <ProLayout
        title="CLB Thiết Bị"
        logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        layout="top"
        navTheme="light"
        fixedHeader
        selectedKeys={[currentTab]}
        menuDataRender={() => []}
        avatarProps={{
          icon: <UserOutlined />,
          size: 'small',
          title: currentUserLabel,
          render: (_, avatarDom) => (
            <Space size="middle">
              <Badge count={announcements.length} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: 18, color: '#1890ff' }} />}
                  onClick={handleNotificationsClick}
                />
              </Badge>
              <Dropdown
                menu={{
                  items: [
                  {
                    key: 'info',
                    label: (
                      <div style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                          {currentUser?.fullName || currentUser?.username || 'Người dùng'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                          <Tag color="blue" style={{ marginRight: 0 }}>
                            {currentUser?.role || 'Student'}
                          </Tag>
                        </div>
                        {currentUser?.email && (
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                            ✉️ {currentUser.email}
                          </div>
                        )}
                      </div>
                    ),
                    disabled: true,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'account',
                    label: '⚙️ Cài đặt tài khoản',
                    onClick: () => history.push('/client-home?tab=account'),
                  },
                  {
                    key: 'forum',
                    label: '💬 Diễn đàn sinh viên',
                    onClick: () => history.push('/forum'),
                  },
                  {
                    key: 'penalties',
                    label: '💳 Phiếu phạt & Vi phạm',
                    onClick: () => history.push('/client-home?tab=penalties'),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    label: (
                      <Button
                        type="text"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        Đăng xuất
                      </Button>
                    ),
                    disabled: false,
                  },
                ],
              }}
            >
              {avatarDom}
            </Dropdown>
          </Space>
          ),
        }}
      >
        <PageContainer
        title={
          currentTab === 'equipment' ? 'Đăng ký mượn thiết bị' : 
          currentTab === 'history' ? 'Nhật ký mượn đồ cá nhân' :
          currentTab === 'account' ? 'Cài đặt tài khoản' :
          currentTab === 'penalties' ? 'Lịch sử vi phạm & Phạt' : 'Bảng điều khiển'
        }
      >
          {renderContent()}
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default ClientHome;

