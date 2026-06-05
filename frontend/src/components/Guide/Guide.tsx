import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Guide.less';

interface Props {
  name: string;
}

// Component mẫu hướng dẫn sử dụng
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          Chào mừng bạn đến với <strong>{name}</strong> !
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
