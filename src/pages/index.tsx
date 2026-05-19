import { history } from '@umijs/max';
import React, { useEffect } from 'react';

const IndexPage: React.FC = () => {
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) {
      history.push('/login');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role === 'Quản trị viên') {
        history.push('/admin'); // Admin vào Dashboard
      } else {
        history.push('/client-home'); // Sinh viên vào trang Client mới tạo ở trên
      }
    } catch (error) {
      history.push('/login');
    }
  }, []);

  return null;
};

export default IndexPage;
