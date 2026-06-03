import { LockOutlined, UserOutlined, GoogleOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Button, ConfigProvider, theme, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { history, useModel } from '@umijs/max';
import { authApi, setAuth } from '@/services/api';

const LoginPage: React.FC = () => {
  const { refresh } = useModel('@@initialState');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleLogin = async (values: any) => {
    try {
      const response: any = await authApi.login(values.identifier, values.password);
      setAuth(response.token, response.refreshToken, response.user);
      await refresh();
      message.success('Chào mừng bạn quay trở lại!');
      const destination = response.user.role === 'Admin' ? '/admin' : '/client-home';
      window.location.href = destination;
    } catch (error: any) {
      message.error(error?.message || 'Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  const handleGoogleLogin = () => {
    message.info('Tính năng đăng nhập với Google đang được phát triển');
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#00dfbe',
          colorBgContainer: 'transparent',
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-[#0a1421] p-4 relative overflow-hidden font-sans antialiased">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#00dfbe]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#70ffe0]/5 rounded-full blur-[100px]" />
        
        <div 
          className={`w-full max-w-[1000px] flex rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out border border-white/5 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Left: Login Form */}
          <div className="flex-1 bg-[#16202e]/60 backdrop-blur-xl p-10 md:p-14 flex flex-col justify-center">
            <div className="mb-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4 cursor-pointer" onClick={() => history.push('/')}>
                <span className="material-symbols-outlined text-[#00dfbe] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                <span className="text-2xl font-bold text-[#00dfbe] tracking-tighter">PTIT Club</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Chào mừng trở lại</h1>
              <p className="text-[#b9cac4] text-base">Đăng nhập để quản lý thiết bị của bạn</p>
            </div>

            <LoginForm
              contentStyle={{ minWidth: '100%' }}
              submitter={{
                searchConfig: { submitText: 'Đăng nhập' },
                render: (_, dom) => (
                  <div className="flex flex-col gap-4 mt-6">
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={() => _.form?.submit()}
                      className="h-14 rounded-xl bg-gradient-to-r from-[#70ffe0] to-[#00dfbe] border-none text-[#00201a] font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(0,223,190,0.3)]"
                    >
                      Đăng nhập
                    </Button>
                    
                    <Divider plain className="border-white/10 m-0 text-on-surface-variant/50 uppercase tracking-[0.2em] text-[10px] font-bold">Hoặc</Divider>
                    
                    <Button
                      size="large"
                      block
                      icon={<GoogleOutlined />}
                      onClick={handleGoogleLogin}
                      className="h-14 rounded-xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-colors flex items-center justify-center gap-3"
                    >
                      Tiếp tục với Google
                    </Button>
                  </div>
                ),
              }}
              onFinish={handleLogin}
            >
              <div className="space-y-4">
                <ProFormText
                  name="identifier"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className="text-[#00dfbe]" />,
                    className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  }}
                  placeholder="Tên đăng nhập hoặc email"
                  rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                />

                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className="text-[#00dfbe]" />,
                    className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  }}
                  placeholder="Mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                />
              </div>

              <div className="flex justify-between items-center mt-6 text-sm">
                <label className="flex items-center gap-2 text-[#b9cac4] cursor-pointer">
                  <input type="checkbox" className="rounded border-white/10 bg-white/5 accent-[#00dfbe]" />
                  <span>Ghi nhớ tôi</span>
                </label>
                <a className="text-[#00dfbe] font-semibold hover:underline">Quên mật khẩu?</a>
              </div>
            </LoginForm>

            <div className="mt-10 text-center text-[#b9cac4]">
              Chưa có tài khoản?{' '}
              <a 
                onClick={() => history.push('/signup')}
                className="text-[#00dfbe] font-bold hover:underline"
              >
                Đăng ký ngay
              </a>
            </div>
          </div>

          {/* Right: Brand Visual (visible on md+) */}
          <div className="hidden lg:flex w-[400px] relative p-12 bg-gradient-to-br from-[#1b0530] via-[#0a1421] to-[#004d40] overflow-hidden flex-col justify-center border-l border-white/5">
             <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
             <div className="relative z-10 space-y-2">
                <h2 className="text-6xl font-black text-white leading-none tracking-tighter">ELITE</h2>
                <h2 className="text-6xl font-black text-[#00dfbe] leading-none tracking-tighter">PTIT</h2>
                <h2 className="text-6xl font-black text-white leading-none tracking-tighter">Club.</h2>
                <div className="h-1 w-20 bg-[#00dfbe] mt-6 rounded-full" />
                <p className="text-[#b9cac4] mt-8 text-lg font-medium leading-relaxed">Nền tảng quản lý thiết bị media chuyên nghiệp hàng đầu dành cho sinh viên.</p>
             </div>
             
             <div className="absolute bottom-10 left-12 right-12 uppercase tracking-[0.2em] text-on-surface-variant/50 font-bold text-[10px]">
              © 2026 PTIT Club — Leading Innovation
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default LoginPage;

