import { PageContainer } from '@ant-design/pro-components';
import { message, Tabs } from 'antd';
import bcrypt from 'bcryptjs';
import React, { useEffect, useState } from 'react';
import DashboardPanel from './components/DashboardPanel';
import EquipmentPanel from './components/EquipmentPanel';
import LoanRequests from './components/LoanRequests';
import PostsTable from './components/PostsTable';
import UsersTable from './components/UsersTable';
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
  const [posts, setPosts] = useState<Post[]>(() => {
    const s = localStorage.getItem('mock_posts');
    return s ? JSON.parse(s) : initialPosts;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const s = localStorage.getItem('mock_users');
    return s ? JSON.parse(s) : initialUsers;
  });
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const s = localStorage.getItem('mock_equipment');
    return s ? JSON.parse(s) : initialEquipment;
  });
  const [requests, setRequests] = useState<LoanRequest[]>(() => {
    const s = localStorage.getItem('mock_requests');
    return s ? JSON.parse(s) : initialRequests;
  });

  useEffect(() => {
    localStorage.setItem('mock_posts', JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    localStorage.setItem('mock_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem('mock_equipment', JSON.stringify(equipment));
  }, [equipment]);
  useEffect(() => {
    localStorage.setItem('mock_requests', JSON.stringify(requests));
  }, [requests]);

  // HÀM GHI LOG TỰ ĐỘNG
  const logAction = (action: string, detail: string) => {
    const logs = JSON.parse(localStorage.getItem('mock_audit_logs') || '[]');
    const userStr = localStorage.getItem('currentUser');
    const user = userStr
      ? JSON.parse(userStr)
      : { username: 'System', role: 'System' };

    logs.unshift({
      id: Date.now(),
      time: new Date().toLocaleString('vi-VN'),
      user: user.username,
      role: user.role,
      action,
      detail,
    });
    localStorage.setItem('mock_audit_logs', JSON.stringify(logs));
  };

  const handleSaveUser = async (user: Partial<User> & { id?: number }) => {
    const { password, ...restUserData } = user;
    let newHashedPassword = undefined;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      newHashedPassword = await bcrypt.hash(password, salt);
    }

    if (user.id) {
      setUsers((prev) =>
        prev.map((item) => {
          if (item.id === user.id) {
            const updatedUser = { ...item, ...restUserData };
            if (newHashedPassword) updatedUser.password = newHashedPassword;
            return updatedUser;
          }
          return item;
        }),
      );
      logAction(
        'Quản lý người dùng',
        `Cập nhật thông tin/mật khẩu tài khoản: ${user.username}`,
      );
      message.success('Cập nhật người dùng thành công');
    } else {
      const nextId = Math.max(0, ...users.map((item) => item.id)) + 1;
      setUsers((prev) => [
        ...prev,
        {
          id: nextId,
          ...restUserData,
          password: newHashedPassword || '',
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
        } as User,
      ]);
      logAction(
        'Quản lý người dùng',
        `Tạo mới tài khoản người dùng: ${user.username}`,
      );
      message.success('Thêm người dùng thành công');
    }
  };

  const handleApproveRequest = (id: number) => {
    const request = requests.find((item) => item.id === id);
    if (request) {
      const eq = equipment.find((item) => item.name === request.item);
      if (eq && eq.available <= 0) {
        message.error(`Không thể duyệt! "${eq.name}" đã hết hàng.`);
        return;
      }

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'Approved' } : item,
        ),
      );
      setEquipment((prev) =>
        prev.map((item) => {
          if (item.name === request.item) {
            const newAvailable = item.available - 1;
            return {
              ...item,
              available: newAvailable,
              status: newAvailable === 0 ? 'Hết hàng' : item.status,
            };
          }
          return item;
        }),
      );
      logAction(
        'Duyệt yêu cầu',
        `Phê duyệt cho ${request.requester} mượn thiết bị ${request.item}`,
      );
      message.success('Yêu cầu đã được duyệt');
    }
  };

  const handleReturnRequest = (id: number) => {
    const request = requests.find((item) => item.id === id);
    if (request) {
      const todayStr = new Date().toISOString().split('T')[0];
      const isOverdue = new Date(request.returnDate) < new Date(todayStr);

      if (isOverdue) {
        const penalties = JSON.parse(
          localStorage.getItem('mock_penalties') || '[]',
        );
        const daysOverdue = Math.ceil(
          (new Date(todayStr).getTime() -
            new Date(request.returnDate).getTime()) /
            (1000 * 3600 * 24),
        );
        const fine = daysOverdue * 20000;
        penalties.unshift({
          id: Date.now(),
          student: request.requester,
          reason: `Trả muộn thiết bị ${request.item} quá hạn ${daysOverdue} ngày`,
          amount: fine,
          status: 'Chưa nộp',
          date: todayStr,
        });
        localStorage.setItem('mock_penalties', JSON.stringify(penalties));
      }

      setRequests((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: 'Returned' } : item,
        ),
      );
      setEquipment((prev) =>
        prev.map((item) => {
          if (item.name === request.item)
            return {
              ...item,
              available: item.available + 1,
              status: 'Sẵn sàng',
            };
          return item;
        }),
      );
      logAction(
        'Nhận trả thiết bị',
        `Nhận lại thiết bị ${request.item} từ ${request.requester} ${
          isOverdue ? '(Vi phạm quá hạn)' : ''
        }`,
      );
      message.success('Đã nhận lại thiết bị!');
    }
  };

  const handleSaveEquipment = (eq: Partial<Equipment> & { id?: number }) => {
    if (eq.status === 'Bảo trì') {
      const maintenance = JSON.parse(
        localStorage.getItem('mock_maintenance') || '[]',
      );
      const isExistTicket = maintenance.some(
        (m: any) => m.equipment === eq.name && m.status !== 'Đã xong',
      );
      if (!isExistTicket) {
        maintenance.unshift({
          id: Date.now(),
          equipment: eq.name,
          issue: 'Phát hiện hỏng hóc cần chuyển sửa chữa từ quản trị viên',
          cost: 0,
          status: 'Chờ duyệt',
          date: new Date().toISOString().split('T')[0],
          reporter: 'admin',
        });
        localStorage.setItem('mock_maintenance', JSON.stringify(maintenance));
      }
    }

    if (eq.id) {
      setEquipment((prev) =>
        prev.map((item) => (item.id === eq.id ? { ...item, ...eq } : item)),
      );
      logAction('Kho thiết bị', `Chỉnh sửa thông số thiết bị: ${eq.name}`);
      message.success('Cập nhật thành công');
    } else {
      const nextId = Math.max(0, ...equipment.map((item) => item.id)) + 1;
      setEquipment((prev) => [...prev, { id: nextId, ...eq } as Equipment]);
      logAction('Kho thiết bị', `Thêm mới thiết bị vào kho: ${eq.name}`);
      message.success('Thêm mới thành công');
    }
  };

  const handleDeletePost = (id: number) => {
    const target = posts.find((p) => p.id === id);
    setPosts((prev) => prev.filter((item) => item.id !== id));
    logAction(
      'Quản lý bài đăng',
      `Xóa bài viết thảo luận của: ${target?.author}`,
    );
    message.success('Xóa bài đăng thành công');
  };

  const handleToggleLock = (user: User) => {
    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id
          ? { ...item, status: item.status === 'Active' ? 'Locked' : 'Active' }
          : item,
      ),
    );
    logAction(
      'Quản lý người dùng',
      `Thay đổi trạng thái Khóa/Mở khóa tài khoản: ${user.username}`,
    );
    message.success('Đã thay đổi trạng thái khóa');
  };

  const handleRejectRequest = (id: number, reason: string) => {
    const request = requests.find((item) => item.id === id);
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Rejected' } : item,
      ),
    );
    logAction(
      'Từ chối yêu cầu',
      `Từ chối duyệt đơn mượn đồ của ${request?.requester}. Lý do: ${reason}`,
    );
    message.warning(`Từ chối: ${reason}`);
  };

  const handleDeleteEquipment = (id: number) => {
    const target = equipment.find((e) => e.id === id);
    setEquipment((prev) => prev.filter((item) => item.id !== id));
    logAction('Kho thiết bị', `Xóa thiết bị ra khỏi danh mục: ${target?.name}`);
    message.success('Đã xóa');
  };

  return (
    <PageContainer header={{ title: 'Bảng điều khiển hệ thống Quản trị' }}>
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
    </PageContainer>
  );
};
export default AdminPage;
