import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useModel } from '@umijs/max';
import { authApi, setAuth } from '@/services/api';

const LoginPage: React.FC = () => {
  const { refresh } = useModel('@@initialState');
  const [btnHover, setBtnHover] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleLogin = async (values: any) => {
    try {
      const response: any = await authApi.login(values.identifier, values.password);
      setAuth(response.token, response.refreshToken, response.user);

      // Refresh initialState to update access and layout
      await refresh();

      message.success('Chào mừng bạn quay trở lại!');
      
      const destination = response.user.role === 'Admin' ? '/admin' : '/client-home';
      window.location.href = destination;
    } catch (error: any) {
      message.error(error?.message || 'Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, #0b0426 0%, #2b0b3a 60%, #2f0e3f 100%)', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <div style={{ width: '1100px', maxWidth: '96%', height: 620, borderRadius: 24, display: 'flex', overflow: 'hidden', boxShadow: '0 36px 90px rgba(2,6,23,0.65)' }}>
        {/* Left: Login Card (bigger, white with rounded corners) */}
        <div style={{ width: 720, background: '#fff', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 18, borderRadius: '24px 0 0 24px', transform: loaded ? 'translateY(0)' : 'translateY(28px)', opacity: loaded ? 1 : 0, transition: 'opacity 520ms ease, transform 520ms cubic-bezier(0.2,0.8,0.2,1)', transitionDelay: '120ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 74, height: 74, borderRadius: 38, background: 'linear-gradient(135deg,#8b5cf6,#ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 22, boxShadow: '0 10px 30px rgba(140,88,255,0.18)' }}>
              <UserOutlined />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0f2130' }}>Chào mừng</div>
              <div style={{ fontSize: 14, color: '#7a8591' }}>Đăng nhập để tiếp tục sử dụng</div>
            </div>
          </div>

          <div style={{ marginTop: 18 }}>
            <LoginForm
              contentStyle={{ padding: 0 }}
              submitter={{
                searchConfig: { submitText: 'Đăng nhập' },
                render: (_, dom) => (
                  <div style={{ marginTop: 12 }}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => _.form?.submit()}
                      onMouseEnter={() => setBtnHover(true)}
                      onMouseLeave={() => setBtnHover(false)}
                      style={{
                        height: 56,
                        borderRadius: 28,
                        background: 'linear-gradient(90deg,#7c3aed,#ec4899)',
                        border: 'none',
                        fontWeight: 800,
                        padding: '0 40px',
                        transform: btnHover ? 'scale(1.02)' : 'scale(1)',
                        transition: 'transform 160ms ease, box-shadow 160ms ease',
                        boxShadow: btnHover ? '0 22px 60px rgba(236,72,153,0.26)' : '0 14px 40px rgba(124,58,237,0.22)'
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </div>
                ),
              }}
              onFinish={handleLogin}
            >
              <div style={{ marginBottom: 14 }}>
                <ProFormText
                  name="identifier"
                  fieldProps={{ size: 'large', prefix: <UserOutlined style={{ color: '#c9cbd0' }} />, style: { borderRadius: 999, border: '1px solid #f0f0f2', paddingLeft: 20, height: 56, background: '#fafafa' } }}
                  placeholder="Username hoặc email"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                />
              </div>

              <div style={{ marginBottom: 8 }}>
                <ProFormText.Password
                  name="password"
                  fieldProps={{ size: 'large', prefix: <LockOutlined style={{ color: '#c9cbd0' }} />, style: { borderRadius: 999, border: '1px solid #f0f0f2', paddingLeft: 20, height: 56, background: '#fafafa' } }}
                  placeholder="Mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8a8f98', fontSize: 14 }}><input type="checkbox" />Ghi nhớ</label>
                <a style={{ color: '#7c3aed', fontSize: 14 }} aria-label="Quên mật khẩu">Quên mật khẩu?</a>
              </div>
            </LoginForm>
          </div>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 15, color: '#64748b' }}>
            Chưa có tài khoản?{' '}
            <a 
              onClick={() => history.push('/signup')}
              style={{ color: '#ec4899', fontWeight: 700, textDecoration: 'underline' }}
            >
              Tham gia ngay
            </a>
          </div>

          <div style={{ marginTop: 28, textAlign: 'center', color: '#9aa6b2', fontSize: 13 }}>
            © 2026 CLB Thiết Bị — Leading Innovation
          </div>
        </div>

        {/* Right: Purple strip with Welcome text (narrower, like sample) */}
        <div style={{ width: 380, position: 'relative', padding: 32, background: 'linear-gradient(180deg,#1b0530 0%, rgba(124,58,237,0.95) 30%, rgba(236,72,153,0.92) 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', borderRadius: '0 24px 24px 0', transform: loaded ? 'translateY(0)' : 'translateY(36px)', opacity: loaded ? 1 : 0, transition: 'opacity 640ms ease, transform 640ms cubic-bezier(0.2,0.8,0.2,1)', transitionDelay: '260ms' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 20%, rgba(255,255,255,0.04), transparent 20%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 2, marginLeft: 8 }}>
            <h1 style={{ fontSize: 56, margin: 0, lineHeight: 1, fontWeight: 900, letterSpacing: -1 }}>Ready.</h1>
            <h1 style={{ fontSize: 56, margin: 0, lineHeight: 1, fontWeight: 900, letterSpacing: -1 }}>Set.</h1>
            <h1 style={{ fontSize: 56, margin: 0, lineHeight: 1, fontWeight: 900, letterSpacing: -1, color: '#fbcfe8' }}>Go!</h1>
            <p style={{ marginTop: 24, fontSize: 15, color: 'rgba(255,255,255,0.92)', maxWidth: 300, lineHeight: 1.6 }}>Hệ thống quản lý mượn trả thiết bị — gọn nhẹ, trực quan và an toàn tuyệt đối.</p>
          </div>

          <div style={{ position: 'absolute', right: 24, bottom: 24, width: 220, height: 220, borderRadius: 110, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(255,255,255,0.01))', filter: 'blur(60px)', opacity: 0.95 }} />
          <div style={{ position: 'absolute', right: 80, top: 40, width: 140, height: 140, borderRadius: 70, background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03), rgba(255,255,255,0))', filter: 'blur(40px)', opacity: 0.7 }} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
