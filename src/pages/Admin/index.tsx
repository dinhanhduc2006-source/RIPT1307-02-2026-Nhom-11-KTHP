import {
  Button,
  Badge,
  Divider,
  Drawer,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
  Row,
  Col,
} from 'antd';
import {
  PageContainer,
  ProCard,
  ProTable,
} from '@ant-design/pro-components';
import React, { useMemo, useState } from 'react';

const { Paragraph, Title } = Typography;
const { TabPane } = Tabs;

type Post = {
  id: number;
  title: string;
  content: string;
  tags: string[];
  category: string;
  author: string;
  createdAt: string;
  comments: number;
  positive: number;
  negative: number;
};

type User = {
  id: number;
  username: string;
  email: string;
  role: 'Sinh viên' | 'Giảng viên' | 'Quản trị viên';
  status: 'Active' | 'Locked';
  createdAt: string;
};

type Equipment = {
  id: number;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'Sẵn sàng' | 'Hết hàng' | 'Bảo trì';
};

type LoanRequest = {
  id: number;
  requester: string;
  item: string;
  borrowDate: string;
  returnDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

const initialPosts: Post[] = [
  {
    id: 1,
    title: 'Đề xuất tổ chức buổi thảo luận môn Lập trình web',
    content:
      'Cần thêm buổi thảo luận và chia nhóm thực hành cho môn Lập trình web, đặc biệt cho các bạn năm nhất.',
    tags: ['môn học', 'web', 'câu lạc bộ'],
    category: 'Học tập',
    author: 'Nguyễn Văn A',
    createdAt: '2026-05-02',
    comments: 4,
    positive: 12,
    negative: 1,
  },
  {
    id: 2,
    title: 'Xin mượn máy chiếu cho buổi họp câu lạc bộ',
    content:
      'Buổi họp câu lạc bộ sáng tạo cần dùng máy chiếu và loa. Xin admin hỗ trợ giữ thiết bị.',
    tags: ['thiết bị', 'câu lạc bộ', 'máy chiếu'],
    category: 'Sự kiện',
    author: 'Trần Thị B',
    createdAt: '2026-05-03',
    comments: 6,
    positive: 18,
    negative: 0,
  },
];

const initialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@school.edu.vn',
    role: 'Quản trị viên',
    status: 'Active',
    createdAt: '2025-12-01',
  },
  {
    id: 2,
    username: 'sv01',
    email: 'sv01@school.edu.vn',
    role: 'Sinh viên',
    status: 'Active',
    createdAt: '2026-01-10',
  },
  {
    id: 3,
    username: 'gv01',
    email: 'gv01@school.edu.vn',
    role: 'Giảng viên',
    status: 'Locked',
    createdAt: '2026-02-14',
  },
];

const initialEquipment: Equipment[] = [
  {
    id: 1,
    name: 'Máy chiếu Sony',
    category: 'Trình chiếu',
    available: 2,
    total: 3,
    status: 'Sẵn sàng',
  },
  {
    id: 2,
    name: 'Micro không dây',
    category: 'Âm thanh',
    available: 1,
    total: 2,
    status: 'Sẵn sàng',
  },
  {
    id: 3,
    name: 'Laptop dự phòng',
    category: 'Tin học',
    available: 0,
    total: 1,
    status: 'Hết hàng',
  },
];

const initialRequests: LoanRequest[] = [
  {
    id: 1,
    requester: 'Nguyễn Văn A',
    item: 'Máy chiếu Sony',
    borrowDate: '2026-05-06',
    returnDate: '2026-05-07',
    status: 'Pending',
  },
  {
    id: 2,
    requester: 'Trần Thị B',
    item: 'Micro không dây',
    borrowDate: '2026-05-05',
    returnDate: '2026-05-06',
    status: 'Approved',
  },
];

const AdminPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [requests, setRequests] = useState<LoanRequest[]>(initialRequests);
  const [postFilter, setPostFilter] = useState<string>('');
  const [postTagFilter, setPostTagFilter] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [userFormVisible, setUserFormVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [form] = Form.useForm<Partial<User>>();

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const query = postFilter.trim().toLowerCase();
      const tagCheck = postTagFilter ? post.tags.includes(postTagFilter) : true;
      const contentMatch =
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query);
      return contentMatch && tagCheck;
    });
  }, [postFilter, postTagFilter, posts]);

  const categories = Array.from(new Set(posts.map((item) => item.category)));
  const tags = Array.from(new Set(posts.flatMap((item) => item.tags)));

  const handleDeletePost = (id: number) => {
    setPosts((prev) => prev.filter((item) => item.id !== id));
    message.success('Xóa bài đăng thành công');
  };

  const handleSaveUser = async () => {
    const values = await form.validateFields();
    if (!values.username || !values.email || !values.role) {
      return;
    }
    if (editingUser) {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === editingUser.id ? { ...item, ...values } : item,
        ),
      );
      message.success('Cập nhật người dùng thành công');
    } else {
      const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
      setUsers((prev) => [
        ...prev,
        {
          id: nextId,
          username: values.username || 'new-user',
          email: values.email || '',
          role: values.role as User['role'],
          status: 'Active',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ]);
      message.success('Thêm người dùng thành công');
    }
    setUserFormVisible(false);
    setEditingUser(null);
    form.resetFields();
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

  const handleRequestAction = (requestId: number, action: 'Approved' | 'Rejected') => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: action } : item,
      ),
    );
    if (action === 'Approved') {
      const request = requests.find((item) => item.id === requestId);
      if (request) {
        setEquipment((prev) =>
          prev.map((item) =>
            item.name === request.item && item.available > 0
              ? { ...item, available: item.available - 1 }
              : item,
          ),
        );
      }
      message.success('Yêu cầu đã được duyệt và thiết bị đã được cập nhật');
    } else {
      message.warn('Yêu cầu đã bị từ chối');
    }
  };

  const mostBorrowed = useMemo(() => {
    const counts: Record<string, number> = {};
    requests.forEach((request) => {
      if (request.status === 'Approved') {
        counts[request.item] = (counts[request.item] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [requests]);

  return (
    <PageContainer
      header={{
        title: 'Bảng điều khiển Quản trị viên',
        breadcrumb: {
          routes: [
            { path: '/admin', breadcrumbName: 'Quản trị' },
          ],
        },
      }}
    >
      <Tabs defaultActiveKey="posts" type="card">
        <TabPane tab="Quản lý bài đăng" key="posts">
          <ProCard title="Danh sách bài đăng" bordered>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col xs={24} md={12}>
                <Input
                  placeholder="Tìm bài đăng theo từ khoá"
                  value={postFilter}
                  onChange={(event) => setPostFilter(event.target.value)}
                />
              </Col>
              <Col xs={24} md={12}>
                <Select
                  allowClear
                  placeholder="Lọc theo tag"
                  style={{ width: '100%' }}
                  value={postTagFilter || undefined}
                  onChange={(value) => setPostTagFilter(value || '')}
                >
                  {tags.map((tag) => (
                    <Select.Option key={tag} value={tag}>
                      {tag}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <ProTable<Post>
              columns={[
                {
                  title: 'Tiêu đề',
                  dataIndex: 'title',
                  ellipsis: true,
                },
                {
                  title: 'Tác giả',
                  dataIndex: 'author',
                  width: 140,
                },
                {
                  title: 'Danh mục',
                  dataIndex: 'category',
                  width: 120,
                },
                {
                  title: 'Tag',
                  dataIndex: 'tags',
                  render: (_, record) => (
                    <Space wrap>
                      {record.tags.map((tag) => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  ),
                },
                {
                  title: 'Bình luận',
                  dataIndex: 'comments',
                  width: 110,
                },
                {
                  title: 'Vote',
                  dataIndex: 'positive',
                  render: (_, record) => (
                    <span>
                      +{record.positive} / -{record.negative}
                    </span>
                  ),
                  width: 140,
                },
                {
                  title: 'Ngày tạo',
                  dataIndex: 'createdAt',
                  width: 110,
                },
                {
                  title: 'Hành động',
                  valueType: 'option',
                  render: (_, record) => (
                    <>
                      <a onClick={() => setSelectedPost(record)}>Chi tiết</a>
                      <Divider type="vertical" />
                      <Popconfirm
                        title="Xóa bài đăng này?"
                        onConfirm={() => handleDeletePost(record.id)}
                      >
                        <a>Xóa</a>
                      </Popconfirm>
                    </>
                  ),
                },
              ]}
              dataSource={filteredPosts}
              rowKey="id"
              search={false}
              pagination={{ pageSize: 5 }}
            />
          </ProCard>
          <Drawer
            width={640}
            open={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            title="Chi tiết bài đăng"
          >
            {selectedPost ? (
              <div>
                <Title level={4}>{selectedPost.title}</Title>
                <Paragraph>
                  <strong>Tác giả:</strong> {selectedPost.author}
                </Paragraph>
                <Paragraph>
                  <strong>Ngày đăng:</strong> {selectedPost.createdAt}
                </Paragraph>
                <Paragraph>
                  <strong>Nội dung:</strong> {selectedPost.content}
                </Paragraph>
                <Paragraph>
                  <strong>Tags:</strong>{' '}
                  {selectedPost.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Paragraph>
                <Paragraph>
                  <strong>Số bình luận:</strong> {selectedPost.comments}
                </Paragraph>
                <Paragraph>
                  <strong>Vote:</strong> +{selectedPost.positive} / -{selectedPost.negative}
                </Paragraph>
              </div>
            ) : null}
          </Drawer>
        </TabPane>

        <TabPane tab="Quản lý người dùng" key="users">
          <ProCard title="Danh sách người dùng" bordered>
            <Button
              type="primary"
              style={{ marginBottom: 16 }}
              onClick={() => {
                form.resetFields();
                setEditingUser(null);
                setUserFormVisible(true);
              }}
            >
              Thêm người dùng
            </Button>
            <ProTable<User>
              columns={[
                {
                  title: 'Tên đăng nhập',
                  dataIndex: 'username',
                },
                {
                  title: 'Email',
                  dataIndex: 'email',
                },
                {
                  title: 'Vai trò',
                  dataIndex: 'role',
                },
                {
                  title: 'Trạng thái',
                  dataIndex: 'status',
                  render: (_, record) => (
                    <Badge
                      status={record.status === 'Active' ? 'success' : 'error'}
                      text={record.status}
                    />
                  ),
                },
                {
                  title: 'Ngày tạo',
                  dataIndex: 'createdAt',
                  width: 120,
                },
                {
                  title: 'Hành động',
                  valueType: 'option',
                  render: (_, record) => (
                    <Space>
                      <a
                        onClick={() => {
                          setEditingUser(record);
                          form.setFieldsValue(record);
                          setUserFormVisible(true);
                        }}
                      >
                        Sửa
                      </a>
                      <a onClick={() => handleToggleLock(record)}>
                        {record.status === 'Active' ? 'Khóa' : 'Mở khóa'}
                      </a>
                      <a onClick={() => handleResetPassword(record)}>
                        Cấp mật khẩu
                      </a>
                    </Space>
                  ),
                },
              ]}
              dataSource={users}
              rowKey="id"
              search={false}
              pagination={{ pageSize: 5 }}
            />
          </ProCard>
          <Modal
            title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng'}
            open={userFormVisible}
            onOk={handleSaveUser}
            onCancel={() => {
              setUserFormVisible(false);
              setEditingUser(null);
              form.resetFields();
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="username"
                label="Tên đăng nhập"
                rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
              >
                <Select>
                  <Select.Option value="Sinh viên">Sinh viên</Select.Option>
                  <Select.Option value="Giảng viên">Giảng viên</Select.Option>
                  <Select.Option value="Quản trị viên">Quản trị viên</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </TabPane>

        <TabPane tab="Quản lý thiết bị" key="equipment">
          <ProCard title="Kho thiết bị" gutter={16} bordered>
            <ProCard colSpan="60%" layout="center">
              <ProTable<Equipment>
                columns={[
                  { title: 'Thiết bị', dataIndex: 'name' },
                  { title: 'Loại', dataIndex: 'category', width: 120 },
                  { title: 'Sẵn có', dataIndex: 'available', width: 100 },
                  { title: 'Tổng', dataIndex: 'total', width: 100 },
                  {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    width: 120,
                  },
                ]}
                dataSource={equipment}
                rowKey="id"
                search={false}
                pagination={{ pageSize: 5 }}
              />
            </ProCard>
            <ProCard colSpan="40%" layout="center">
              <Title level={5}>Thiết bị mượn nhiều nhất</Title>
              {mostBorrowed.length ? (
                mostBorrowed.map(([item, count]) => (
                  <Paragraph key={item}>
                    <strong>{item}</strong> — {count} lần duyệt
                  </Paragraph>
                ))
              ) : (
                <Paragraph>Chưa có yêu cầu duyệt.</Paragraph>
              )}
            </ProCard>
          </ProCard>

          <Divider />

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
                  width: 110,
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
                        onClick={() => handleRequestAction(record.id, 'Approved')}
                      >
                        Duyệt
                      </Button>
                      <Button
                        danger
                        size="small"
                        disabled={record.status !== 'Pending'}
                        onClick={() => handleRequestAction(record.id, 'Rejected')}
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
        </TabPane>
      </Tabs>
    </PageContainer>
  );
};

export default AdminPage;
