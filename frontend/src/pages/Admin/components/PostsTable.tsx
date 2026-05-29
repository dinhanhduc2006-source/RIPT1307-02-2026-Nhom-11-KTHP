import { ProCard, ProTable } from '@ant-design/pro-components';
import { Divider, Drawer, Popconfirm, Space, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { Post } from '../data';

const { Paragraph, Title } = Typography;

type Props = {
  posts: Post[];
  onDeletePost: (id: number) => void;
};

const PostsTable: React.FC<Props> = ({ posts, onDeletePost }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <ProCard title="Danh sách bài đăng" bordered>
      <ProTable<Post>
        columns={[
          { title: 'Tiêu đề', dataIndex: 'title', ellipsis: true },
          { 
            title: 'Tác giả', 
            dataIndex: 'author', 
            width: 140,
            render: (_, record: any) => typeof record.author === 'object' ? record.author?.username : record.author 
          },
          { title: 'Danh mục', dataIndex: 'category', width: 110 },
          {
            title: 'Tags',
            dataIndex: 'tags',
            render: (_, record) => {
              const tagList = Array.isArray(record.tags) 
                ? record.tags 
                : (typeof record.tags === 'string' ? record.tags.split(',').map(t => t.trim()).filter(Boolean) : []);
              return (
                <Space wrap>
                  {tagList.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </Space>
              );
            },
          },
          { title: 'Ngày đăng', dataIndex: 'createdAt', width: 110 },
          {
            title: 'Hành động',
            valueType: 'option',
            render: (_, record) => (
              <Space>
                <a onClick={() => setSelectedPost(record)}>Chi tiết</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="Bạn có chắc muốn xoá bài đăng này?"
                  onConfirm={() => onDeletePost(record.id)}
                >
                  <a style={{ color: 'red' }}>Xóa</a>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={posts}
        rowKey="id"
        search={false}
      />

      <Drawer
        width={500}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Nội dung chi tiết bài đăng"
      >
        {selectedPost && (
          <>
            <Title level={4}>{selectedPost.title}</Title>
            <Paragraph>
              <strong>Tác giả:</strong> {typeof selectedPost.author === 'object' ? (selectedPost.author as any)?.username : selectedPost.author}
            </Paragraph>
            <Paragraph>
              <strong>Ngày đăng:</strong> {selectedPost.createdAt}
            </Paragraph>
            <Divider />
            <Paragraph>{selectedPost.content}</Paragraph>
            <Divider />
            <Paragraph>
              <strong>Bình luận:</strong> {selectedPost.comments} |
              <strong> Thích:</strong> {selectedPost.positive}
            </Paragraph>
          </>
        )}
      </Drawer>
    </ProCard>
  );
};

export default PostsTable;
