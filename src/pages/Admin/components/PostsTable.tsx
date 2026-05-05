import { Button, Col, Divider, Drawer, Input, Popconfirm, Row, Select, Space, Tag, Typography } from 'antd';
import { ProCard, ProTable } from '@ant-design/pro-components';
import React, { useMemo, useState } from 'react';
import { Post } from '../data';

type Props = {
  posts: Post[];
  onDeletePost: (id: number) => void;
};

const { Paragraph, Title } = Typography;

const PostsTable: React.FC<Props> = ({ posts, onDeletePost }) => {
  const [query, setQuery] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const tagOptions = Array.from(new Set(posts.flatMap((post) => post.tags)));

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const text = query.trim().toLowerCase();
        const matchesText =
          post.title.toLowerCase().includes(text) ||
          post.content.toLowerCase().includes(text) ||
          post.author.toLowerCase().includes(text);
        const matchesTag = tagFilter ? post.tags.includes(tagFilter) : true;
        return matchesText && matchesTag;
      }),
    [posts, query, tagFilter],
  );

  return (
    <ProCard title="Quản lý bài đăng" bordered>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} md={12}>
          <Input.Search
            placeholder="Tìm kiếm bài đăng"
            enterButton
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} md={12}>
          <Select
            allowClear
            placeholder="Lọc theo tag"
            style={{ width: '100%' }}
            value={tagFilter || undefined}
            onChange={(value) => setTagFilter(value || '')}
          >
            {tagOptions.map((tag) => (
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
            width: 150,
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
            width: 100,
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
            width: 120,
          },
          {
            title: 'Hành động',
            valueType: 'option',
            render: (_, record) => (
              <>
                <a onClick={() => setSelectedPost(record)}>Chi tiết</a>
                <Divider type="vertical" />
                <Popconfirm
                  title="Bạn có chắc muốn xoá bài này?"
                  onConfirm={() => onDeletePost(record.id)}
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

      <Drawer
        width={640}
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Chi tiết bài đăng"
      >
        {selectedPost && (
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
              <strong>Bình luận:</strong> {selectedPost.comments}
            </Paragraph>
            <Paragraph>
              <strong>Vote:</strong> +{selectedPost.positive} / -{selectedPost.negative}
            </Paragraph>
          </div>
        )}
      </Drawer>
    </ProCard>
  );
};

export default PostsTable;
