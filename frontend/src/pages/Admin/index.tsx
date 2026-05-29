import { PageContainer } from '@ant-design/pro-components';
import { message, Tabs, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import DashboardPanel from './components/DashboardPanel';
import EquipmentPanel from './components/EquipmentPanel';
import LoanRequests from './components/LoanRequests';
import PostsTable from './components/PostsTable';
import UsersTable from './components/UsersTable';
import {
  equipmentApi,
  userApi,
  postApi,
  loanRequestApi,
} from '@/services/api';
import {
  Equipment,
  LoanRequest,
  Post,
  User,
} from './data';

const { TabPane } = Tabs;

const AdminPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [postsRes, usersRes, equipRes, requestsRes] = await Promise.all([
        postApi.getAll(),
        userApi.getAll(),
        equipmentApi.getAll(),
        loanRequestApi.getAll(),
      ]);
      
      setPosts(postsRes || []);
      setUsers(usersRes || []);
      setEquipment(equipRes || []);
      setRequests(requestsRes || []);
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi tải dữ liệu từ server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveUser = async (user: Partial<User> & { id?: number }) => {
    message.warning('Tính năng cập nhật User qua API đang được phát triển');
  };

  const handleApproveRequest = async (id: number) => {
    try {
      await loanRequestApi.approve(id);
      message.success('Yêu cầu đã được duyệt');
      fetchData();
    } catch (error) {
      message.error('Duyệt yêu cầu thất bại');
    }
  };

  const handleReturnRequest = async (id: number) => {
    try {
      await loanRequestApi.returnItem(id);
      message.success('Đã nhận lại thiết bị!');
      fetchData();
    } catch (error) {
      message.error('Trả thiết bị thất bại');
    }
  };

  const handleSaveEquipment = async (eq: Partial<Equipment> & { id?: number }) => {
    try {
      if (eq.id) {
        await equipmentApi.update(eq.id, eq);
        message.success('Cập nhật thành công');
      } else {
        await equipmentApi.create(eq);
        message.success('Thêm mới thành công');
      }
      fetchData();
    } catch (error) {
      message.error('Lưu thiết bị thất bại');
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await postApi.delete(id);
      message.success('Xóa bài đăng thành công');
      fetchData();
    } catch (error) {
      message.error('Xóa bài đăng thất bại');
    }
  };

  const handleToggleLock = async (user: User) => {
    try {
      const newStatus = user.status === 'Active' ? 'Locked' : 'Active';
      await userApi.updateStatus(user.id, newStatus);
      message.success('Đã thay đổi trạng thái khóa');
      fetchData();
    } catch (error) {
      message.error('Thay đổi trạng thái thất bại');
    }
  };

  const handleRejectRequest = async (id: number, reason: string) => {
    try {
      await loanRequestApi.reject(id, reason);
      message.warning(`Từ chối: ${reason}`);
      fetchData();
    } catch (error) {
      message.error('Từ chối yêu cầu thất bại');
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    try {
      await equipmentApi.delete(id);
      message.success('Đã xóa');
      fetchData();
    } catch (error) {
      message.error('Xóa thiết bị thất bại');
    }
  };

  return (
    <PageContainer header={{ title: 'Bảng điều khiển hệ thống Quản trị' }}>
      <Spin spinning={loading}>
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
          <TabPane tab="Thiết bị" key="equipment">
            <EquipmentPanel
              equipment={equipment}
              requests={requests}
              onSaveEquipment={handleSaveEquipment}
              onDeleteEquipment={handleDeleteEquipment}
            />
          </TabPane>
          <TabPane tab="Người dùng" key="users">
            <UsersTable
              users={users}
              onSaveUser={handleSaveUser}
              onToggleLock={handleToggleLock}
            />
          </TabPane>
          <TabPane tab="Yêu cầu mượn" key="requests">
            <LoanRequests
              requests={requests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onReturn={handleReturnRequest}
            />
          </TabPane>
        </Tabs>
      </Spin>
    </PageContainer>
  );
};

export default AdminPage;
