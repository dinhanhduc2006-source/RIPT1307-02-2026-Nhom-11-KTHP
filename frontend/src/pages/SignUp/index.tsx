import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import { authApi } from '@/services/api';

const SignUpPage: React.FC = () => {
  const handleSignUp = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await authApi.register({
        username: values.username,
        email: values.email,
        password: values.password,
      });

      message.success('Đăng ký thành công! Vui lòng đăng nhập.');
      history.push('/login');
    } catch (error: any) {
      message.error(error?.message || 'Đăng ký thất bại. Email hoặc Username có thể đã tồn tại.');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        background: '#f0f2f5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
      }}
    >
      {/* Left side: Premium Form Area */}
      <div
        style={{
          width: '550px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 80px',
          backgroundColor: '#fff',
          boxShadow: '10px 0 30px rgba(0,0,0,0.02)',
          zIndex: 2,
        }}
      >
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 700, color: '#001529', marginBottom: '12px' }}>
            Tạo tài khoản
          </h2>
          <p style={{ color: '#8c8c8c', fontSize: '16px' }}>Tham gia cộng đồng quản lý thiết bị thông minh ngay hôm nay.</p>
        </div>

        <LoginForm
          contentStyle={{ minWidth: '100%' }}
          submitter={{
            render: (_, dom) => (
              <div style={{ marginTop: '8px' }}>
                <Button type="primary" size="large" block onClick={() => _.form?.submit()} style={{ height: '50px', fontSize: '16px', fontWeight: 600, borderRadius: '8px' }}>
                  Đăng ký tài khoản
                </Button>
              </div>
            )
          }}
          onFinish={handleSignUp}
        >
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 500, color: '#262626' }}>Tên tài khoản</div>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined style={{ color: '#bfbfbf' }} />,
                style: { borderRadius: '8px' }
              }}
              placeholder="Nhập username..."
              rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 500, color: '#262626' }}>Địa chỉ Email</div>
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large',
                prefix: <MailOutlined style={{ color: '#bfbfbf' }} />,
                style: { borderRadius: '8px' }
              }}
              placeholder="example@school.edu.vn"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Định dạng email không hợp lệ!' }
              ]}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 500, color: '#262626' }}>Mật khẩu</div>
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: '#bfbfbf' }} />,
                style: { borderRadius: '8px' }
              }}
              placeholder="Tối thiểu 6 ký tự"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
              ]}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '8px', fontWeight: 500, color: '#262626' }}>Xác nhận mật khẩu</div>
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined style={{ color: '#bfbfbf' }} />,
                style: { borderRadius: '8px' }
              }}
              placeholder="Nhập lại mật khẩu..."
              rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
            />
          </div>

          <div style={{ textAlign: 'center', color: '#595959', marginTop: '32px', fontSize: '15px' }}>
            Đã có tài khoản thành viên?{' '}
            <a 
              onClick={() => history.push('/login')}
              style={{ fontWeight: 600, color: '#1890ff', textDecoration: 'underline' }}
            >
              Đăng nhập ngay
            </a>
          </div>
        </LoginForm>

        <div style={{ marginTop: '40px', textAlign: 'center', color: '#bfbfbf', fontSize: '12px' }}>
          Bằng cách đăng ký, bạn đồng ý với Điều khoản & Chính sách của chúng tôi.
        </div>
      </div>

      {/* Right side: Premium Artistic Background */}
      <div
        style={{
          flex: 1,
          background: 'linear-gradient(135deg, #1890ff 0%, #001529 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          padding: '80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dynamic Background Patterns */}
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', bottom: '-100px', left: '-50px' }} />
        
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ color: '#fff', fontSize: '56px', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
            BẮT ĐẦU <span style={{ color: '#bae7ff' }}>HÀNH TRÌNH</span>
          </h1>
          <div style={{ width: '80px', height: '4px', background: '#bae7ff', margin: '0 auto 32px auto', borderRadius: '2px' }} />
          <p style={{ fontSize: '20px', opacity: 0.9, maxWidth: '500px', fontWeight: 300, lineHeight: 1.6 }}>
            Chỉ mất vài giây để thiết lập tài khoản và bắt đầu quản lý thiết bị một cách chuyên nghiệp nhất.
          </p>
        </div>

        {/* Feature Highlights */}
        <div style={{ position: 'absolute', bottom: '60px', right: '60px', display: 'flex', gap: '40px', zIndex: 1 }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '16px' }}>Nhanh chóng</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Đăng ký trong 30s</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', color: '#fff', fontWeight: 600, fontSize: '16px' }}>Bảo mật</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Mã hóa dữ liệu 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
