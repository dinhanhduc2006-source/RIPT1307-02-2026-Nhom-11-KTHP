import {
  LikeOutlined,
  MessageOutlined,
  PlusOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Tag,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { Post } from '../Admin/data';

const { Paragraph, Title } = Typography;

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const saved = localStorage.getItem('mock_posts');
    if (saved) setPosts(JSON.parse(saved));
  }, []);

  const handleCreatePost = async () => {
    try {
      const values = await form.validateFields();
      const userStr = localStorage.getItem('currentUser');
      const user = userStr
        ? JSON.parse(userStr)
        : { username: 'Sinh viên ẩn danh' };

      const newPost: Post = {
        id: Date.now(),
        title: values.title,
        content: values.content,
        category: values.category,
        tags: values.tags
          ? values.tags.split(',').map((t: string) => t.trim())
          : ['Thảo luận'],
        author: user.username,
        positive: 0,
        comments: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('mock_posts', JSON.stringify(updatedPosts));

      message.success('Đã đăng bài viết mới thành công lên bảng tin!');
      setIsModalOpen(false);
      form.resetFields();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <PageContainer
      title="Bảng tin & Thảo luận cộng đồng"
      subTitle="Nơi chia sẻ thông tin, đề xuất và trao đổi về các thiết bị"
    >
      <ProCard bordered style={{ minHeight: '60vh' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{ marginBottom: 16 }}
        >
          Tạo bài thảo luận mới
        </Button>
        <ProList<Post>
          itemLayout="vertical"
          rowKey="id"
          dataSource={posts}
          renderItem={(item) => (
            <ProCard bordered style={{ marginBottom: 16 }} hoverable>
              <Title level={4} style={{ marginTop: 0 }}>
                {item.title}
              </Title>
              <Space style={{ margin: '4px 0 12px 0' }}>
                <Tag color="magenta">{item.category}</Tag>
                {item.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </Space>
              <Paragraph style={{ fontSize: 15, color: '#333' }}>
                {item.content}
              </Paragraph>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#8c8c8c',
                  marginTop: 16,
                }}
              >
                <Space>
                  <Avatar icon={<UserOutlined />} size="small" />
                  <span style={{ fontWeight: 'bold', color: '#595959' }}>
                    {item.author}
                  </span>
                  <span>| {item.createdAt}</span>
                </Space>
                <Space size="large">
                  <span
                    style={{ cursor: 'pointer', transition: 'color 0.3s' }}
                    onClick={() =>
                      message.info(
                        'Tính năng Thích bài viết đang được nâng cấp!',
                      )
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#1890ff')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'inherit')
                    }
                  >
                    <LikeOutlined /> {item.positive} Thích
                  </span>
                  <span
                    style={{ cursor: 'pointer', transition: 'color 0.3s' }}
                    onClick={() =>
                      message.info(
                        'Tính năng Bình luận sẽ ra mắt trong phiên bản sau!',
                      )
                    }
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = '#1890ff')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = 'inherit')
                    }
                  >
                    <MessageOutlined /> {item.comments} Bình luận
                  </span>
                </Space>
              </div>
            </ProCard>
          )}
        />
      </ProCard>

      <Modal
        title="Soạn nội dung bài thảo luận mới"
        open={isModalOpen}
        onOk={handleCreatePost}
        onCancel={() => setIsModalOpen(false)}
        destroyOnClose
        okText="Đăng bài"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Tiêu đề thảo luận"
            rules={[
              { required: true, message: 'Vui lòng nhập tiêu đề bài đăng!' },
            ]}
          >
            <Input placeholder="Nhập tiêu đề thảo luận..." />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục phân loại"
            rules={[{ required: true, message: 'Vui lòng điền danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục..." />
          </Form.Item>
          <Form.Item name="tags" label="Nhãn từ khóa (Tags)">
            <Input placeholder="Nhập nhãn từ khóa..." />
          </Form.Item>
          <Form.Item
            name="content"
            label="Nội dung thảo luận chi tiết"
            rules={[
              {
                required: true,
                message: 'Vui lòng viết nội dung bài thảo luận!',
              },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung chi tiết..." />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ForumPage;
