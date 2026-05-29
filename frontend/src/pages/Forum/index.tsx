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
import { postApi, getUser } from '@/services/api';

const { Paragraph, Title } = Typography;

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await postApi.getAll();
      setPosts(res || []);
    } catch (error) {
      message.error('Không thể tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    try {
      const values = await form.validateFields();
      const user = getUser();
      
      if (!user) {
        message.error('Vui lòng đăng nhập để đăng bài');
        return;
      }

      const postData = {
        title: values.title,
        content: values.content,
        category: values.category,
        tags: values.tags || 'Thảo luận',
      };

      await postApi.create(postData);

      message.success('Đã đăng bài viết mới thành công lên bảng tin!');
      setIsModalOpen(false);
      form.resetFields();
      fetchPosts();
    } catch (e) {
      console.error(e);
      message.error('Lỗi khi đăng bài');
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
        <ProList<any>
          loading={loading}
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
                {item.tags?.split(',').map((t: string) => (
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
                    {item.author?.username || 'N/A'}
                  </span>
                  <span>| {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : '-'}</span>
                </Space>
                <Space size="large">
                  <span
                    style={{ cursor: 'pointer', transition: 'color 0.3s' }}
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
