import { history } from '@umijs/max';
import React, { useEffect } from 'react';
import { isAuthenticated, getUser } from '@/services/api';

const IndexPage: React.FC = () => {
  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.role === 'Admin') {
        history.push('/admin');
      } else {
        history.push('/client-home');
      }
    } else {
      history.push('/login');
    }
  }, []);

  return null;
};

export default IndexPage;
