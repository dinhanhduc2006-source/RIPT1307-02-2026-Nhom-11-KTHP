import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';

const AccessPage: React.FC = () => {
  const access = useAccess();
  return (
    <PageContainer
      ghost
      header={{
        title: 'Ví dụ Phân quyền',
      }}
    >
      <Access accessible={access.canAdmin}>
        <Button>Chỉ có Admin mới có thể thấy nút này</Button>
      </Access>
    </PageContainer>
  );
};

export default AccessPage;
