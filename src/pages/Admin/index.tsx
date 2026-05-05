import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Tabs, message } from 'antd';
import DashboardPanel from './components/DashboardPanel';
import PostsTable from './components/PostsTable';
import UsersTable from './components/UsersTable';
import EquipmentPanel from './components/EquipmentPanel';
import LoanRequests from './components/LoanRequests';
import {
  Equipment,
  initialEquipment,
  initialPosts,
  initialRequests,
  initialUsers,
  LoanRequest,
  Post,
  User,
} from './data';

const { TabPane } = Tabs;

const AdminPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [requests, setRequests] = useState<LoanRequest[]>(initialRequests);

  const handleDeletePost = (id: number) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa bài đăng thành công');
  };

  const handleSaveUser = (user: Partial<User> & { id?: number }) => {
    if (user.id) {
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, ...user } : item)),
      );
      message.success('Cập nhật người dùng thành công');
    } else {
      const nextId = Math.max(0, ...users.map((item) => item.id)) + 1;
      setUsers((prev) => [
        ...prev,
        {
          id: nextId,
          username: user.username || 'new-user',
          email: user.email || '',
          role: (user.role as User['role']) || 'Sinh viên',
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
      message.success('Thêm người dùng thành công');
    }
  };

  const handleToggleLock = (user: User) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? { ...item, status: item.status === 'Active' ? 'Locked' : 'Active' }
          : item,
      ),
    );
    message.success(
      user.status === 'Active' ? 'Đã khoá tài khoản' : 'Đã mở khoá tài khoản',
    );
  };

  const handleResetPassword = (user: User) => {
    message.success(`Đã gửi email cấp lại mật khẩu cho ${user.username}`);
  };

  const handleApproveRequest = (id: number) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Approved' } : item,
      ),
    );
    const request = requests.find((item) => item.id === id);
    if (request) {
      setEquipment((prev) =>
        prev.map((item) =>
          item.name === request.item && item.available > 0
            ? { ...item, available: item.available - 1 }
            : item,
        ),
      );
    }
    message.success('Yêu cầu đã được duyệt và kho đã cập nhật');
  };

  const handleRejectRequest = (id: number) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Rejected' } : item,
      ),
    );
    message.warn('Yêu cầu đã bị từ chối');
  };

  return (
    <PageContainer
      header={{
        title: 'Bảng điều khiển hệ thống Quản trị',
      }}
    >
      <Tabs defaultActiveKey="dashboard" type="card">
        <TabPane tab="Tổng quan" key="dashboard">
          <DashboardPanel
            posts={posts}
            users={users}
            equipment={equipment}
            requests={requests}
          />
        </TabPane>
        <TabPane tab="Bài đăng" key="posts">
          <PostsTable posts={posts} onDeletePost={handleDeletePost} />
        </TabPane>
        <TabPane tab="Người dùng" key="users">
          <UsersTable
            users={users}
            onSaveUser={handleSaveUser}
            onToggleLock={handleToggleLock}
            onResetPassword={handleResetPassword}
          />
        </TabPane>
        <TabPane tab="Thiết bị" key="equipment">
          <EquipmentPanel equipment={equipment} requests={requests} />
        </TabPane>
        <TabPane tab="Yêu cầu mượn" key="requests">
          <LoanRequests
            requests={requests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
          />
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default AdminPage;
