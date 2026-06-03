import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, Typography, Timeline, Button, Space, Skeleton, Tag } from 'antd';
import { 
  SearchOutlined, 
  FormOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  BellOutlined, 
  ArrowRightOutlined,
  ThunderboltOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import { getUser, loanRequestApi, announcementApi } from '@/services/api';

const { Title, Text, Paragraph } = Typography;

interface DashboardStats {
  borrowing: number;
  pending: number;
  notifications: number;
}

const DashboardOverview: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const [stats, setStats] = useState<DashboardStats>({ borrowing: 0, pending: 0, notifications: 0 });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  const user = getUser();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Loan Requests to calculate stats & activities
      const requests = await loanRequestApi.getMyRequests();
      const approved = requests.filter((r: any) => r.status === 'Approved').length;
      const pending = requests.filter((r: any) => r.status === 'Pending').length;

      // 2. Fetch Announcements for notification count
      const announcements = await announcementApi.getActive();
      
      setStats({
        borrowing: approved,
        pending: pending,
        notifications: announcements.length
      });

      // 3. Map requests to Recent Activities (Top 5 newest)
      const sortedActivities = requests
        .sort((a: any, b: any) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime())
        .slice(0, 5)
        .map((req: any) => ({
          id: req.id,
          content: `Yêu cầu mượn "${req.equipment?.name || 'Thiết bị'}" - Trạng thái: ${
            req.status === 'Approved' ? 'Đã duyệt' : 
            req.status === 'Pending' ? 'Đang chờ' : 
            req.status === 'Rejected' ? 'Từ chối' : 'Đã trả'
          }`,
          time: new Date(req.updatedAt || req.createdAt).toLocaleString('vi-VN'),
          status: req.status
        }));
      
      setActivities(sortedActivities);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const renderHeader = () => (
    <div className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="flex items-center gap-3 mb-2">
        <div className="px-3 py-1 rounded-full bg-[#00dfbe]/10 border border-[#00dfbe]/30 text-[#00dfbe] text-[10px] font-bold uppercase tracking-widest">
          Hệ thống trực tuyến
        </div>
      </div>
      <Title level={2} className="!text-[#d9e3f6] !m-0 !font-bold">
        Chào mừng trở lại, <span className="text-[#00dfbe] drop-shadow-[0_0_15px_rgba(0,229,195,0.4)]">{user?.username}</span>
      </Title>
      <Text className="text-[#b9cac4] text-base opacity-80">
        Bạn có <span className="text-white font-bold">{stats.borrowing}</span> thiết bị đang mượn và <span className="text-[#ffb4ab] font-bold">{stats.pending}</span> yêu cầu đang chờ phê duyệt.
      </Text>
    </div>
  );

  const renderStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {[
        { label: 'Đang mượn', value: stats.borrowing, icon: <ThunderboltOutlined />, color: '#00dfbe' },
        { label: 'Chờ phê duyệt', value: stats.pending, icon: <ClockCircleOutlined />, color: '#ffb4ab' },
        { label: 'Thông báo mới', value: stats.notifications, icon: <BellOutlined />, color: '#fff' },
      ].map((item, index) => (
        <div 
          key={index}
          className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-end group hover:border-[#00dfbe]/50 transition-all cursor-default shadow-lg"
        >
          <div>
            <Text className="text-[#b9cac4] text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">{item.label}</Text>
            {loading ? <Skeleton.Button active size="large" /> : (
              <Text className="text-4xl font-bold leading-none" style={{ color: item.color }}>{item.value}</Text>
            )}
          </div>
          <div className="text-3xl opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" style={{ color: item.color }}>
            {item.icon}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMainContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cột Trái: Hoạt động gần đây */}
      <div className="lg:col-span-2">
        <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 h-full shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <Title level={4} className="!text-white !m-0 flex items-center gap-2">
              <HistoryOutlined className="text-[#00dfbe]" /> Hoạt động gần đây
            </Title>
            <Button type="link" onClick={() => onNavigate('reservations')} className="text-[#00dfbe] p-0 hover:opacity-80">Lịch sử chi tiết</Button>
          </div>

          {loading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : activities.length > 0 ? (
            <Timeline
              className="custom-dashboard-timeline"
              items={activities.map(act => ({
                dot: <div className={`w-2.5 h-2.5 rounded-full ${act.status === 'Approved' ? 'bg-[#00dfbe] shadow-[0_0_10px_#00dfbe]' : 'bg-white/20'}`} />,
                children: (
                  <div className="pb-6 animate-in fade-in duration-500">
                    <Text className="text-[#d9e3f6] block font-medium text-sm">{act.content}</Text>
                    <Text className="text-[#b9cac4] text-[11px] opacity-50">{act.time}</Text>
                  </div>
                ),
              }))}
            />
          ) : (
            <div className="py-20 text-center">
                <Paragraph className="text-[#b9cac4]">Bạn chưa có hoạt động nào gần đây.</Paragraph>
            </div>
          )}
        </div>
      </div>

      {/* Cột Phải: Thao tác nhanh */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl">
          <Title level={4} className="!text-white !mb-8">Thao tác nhanh</Title>
          <Space direction="vertical" className="w-full" size={16}>
            <Button 
              block 
              size="large" 
              icon={<SearchOutlined />} 
              onClick={() => onNavigate('equipment')}
              className="h-16 !bg-[#00dfbe] !text-[#00201a] border-none font-bold rounded-xl flex items-center justify-between px-6 group hover:shadow-[0_0_20px_rgba(0,229,195,0.4)] transition-all"
            >
              Mượn thiết bị mới <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              block 
              size="large" 
              icon={<FormOutlined />} 
              onClick={() => onNavigate('community')}
              className="h-16 !bg-white/5 !text-white border border-white/10 font-bold rounded-xl flex items-center justify-between px-6 group hover:bg-white/10 transition-all"
            >
              Đăng bài thảo luận <ArrowRightOutlined className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Space>
        </div>

        <div className="bg-gradient-to-br from-[#00dfbe]/20 to-transparent border border-[#00dfbe]/20 rounded-2xl p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-[#00dfbe] font-bold mb-2 flex items-center gap-2">
                <ThunderboltOutlined /> Quy tắc mượn trả
            </h4>
            <Paragraph className="text-[#b9cac4] text-[11px] leading-relaxed m-0">
                Hãy trả thiết bị đúng hạn để duy trì điểm uy tín và giúp các thành viên khác có cơ hội sử dụng nhé!
            </Paragraph>
          </div>
          <ThunderboltOutlined className="absolute -right-4 -bottom-4 text-white opacity-5 text-7xl rotate-12" />
        </div>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: { colorPrimary: '#00dfbe' },
      }}
    >
      <div className="w-full animate-in fade-in duration-1000">
        {renderHeader()}
        {renderStats()}
        {renderMainContent()}
      </div>

      <style>{`
        .custom-dashboard-timeline .ant-timeline-item-tail {
          border-inline-start: 2px solid rgba(255, 255, 255, 0.05) !important;
        }
        .ant-timeline-item-content {
          margin-inline-start: 26px !important;
        }
      `}</style>
    </ConfigProvider>
  );
};

export default DashboardOverview;
