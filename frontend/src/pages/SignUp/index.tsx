import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message, Button, ConfigProvider, theme } from 'antd';
import React, { useState, useEffect } from 'react';
import { history } from '@umijs/max';
import { authApi } from '@/services/api';

const SignUpPage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00dfbe]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#70ffe0]/5 rounded-full blur-[100px]" />

        <div 
          className={`w-full max-w-[1000px] flex rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out border border-white/5 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Left Visual Area (Narrower on mobile, hidden on small) */}
          <div className="hidden lg:flex w-[400px] relative p-12 bg-gradient-to-tr from-[#0a1421] via-[#1b0530] to-[#004d40] overflow-hidden flex-col justify-center border-r border-white/5">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdHRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
            <div className="relative z-10 text-center">
              <h1 className="text-5xl font-black text-white leading-tight tracking-tighter mb-6">
                BẮT ĐẦU <br />
                <span className="text-[#00dfbe]">HÀNH TRÌNH</span>
              </h1>
              <div className="h-1.5 w-16 bg-[#00dfbe] mx-auto mb-10 rounded-full" />
              <p className="text-[#b9cac4] text-lg font-medium leading-relaxed">
                Chỉ mất vài giây để thiết lập tài khoản và bắt đầu quản lý thiết bị media chuyên nghiệp.
              </p>
            </div>
            
            {/* Feature Highlights */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between gap-4">
              <div className="text-center">
                <span className="block text-white font-bold text-base">30 GIÂY</span>
                <span className="text-[#b9cac4] text-[10px] uppercase tracking-wider">Đăng ký nhanh</span>
              </div>
              <div className="text-center">
                <span className="block text-white font-bold text-base">BẢO MẬT</span>
                <span className="text-[#b9cac4] text-[10px] uppercase tracking-wider">Mã hóa 100%</span>
              </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="flex-1 bg-[#16202e]/60 backdrop-blur-xl p-10 md:p-14 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
               <div className="flex items-center justify-center lg:justify-start gap-3 mb-4 cursor-pointer" onClick={() => history.push('/')}>
                <span className="material-symbols-outlined text-[#00dfbe] text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
                <span className="text-2xl font-bold text-[#00dfbe] tracking-tighter">PTIT Club</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Tạo tài khoản mới</h2>
              <p className="text-[#b9cac4] text-base">Tham gia cộng đồng PTIT Club ngay hôm nay</p>
            </div>

            <LoginForm
              contentStyle={{ minWidth: '100%' }}
              submitter={{
                searchConfig: { submitText: 'Tạo tài khoản' },
                render: (_, dom) => (
                  <div className="mt-8">
                    <Button 
                      type="primary" 
                      size="large" 
                      block 
                      onClick={() => _.form?.submit()} 
                      className="h-14 rounded-xl bg-gradient-to-r from-[#00e5c3] to-[#00c2a3] border-none text-[#00201a] font-bold text-lg hover:scale-[1.02] transition-transform shadow-[0_4px_20px_rgba(0,223,190,0.3)]"
                    >
                      Đăng ký tài khoản
                    </Button>
                  </div>
                )
              }}
              onFinish={handleSignUp}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <ProFormText
                    name="username"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className="text-[#00dfbe]" />,
                      className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    }}
                    placeholder="Tên tài khoản (username)"
                    rules={[{ required: true, message: 'Vui lòng nhập tên tài khoản!' }]}
                  />
                </div>

                <div className="md:col-span-2">
                  <ProFormText
                    name="email"
                    fieldProps={{
                      size: 'large',
                      prefix: <MailOutlined className="text-[#00dfbe]" />,
                      className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    }}
                    placeholder="Địa chỉ Email"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email!' },
                      { type: 'email', message: 'Định dạng email không hợp lệ!' }
                    ]}
                  />
                </div>

                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className="text-[#00dfbe]" />,
                    className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  }}
                  placeholder="Mật khẩu (6+ ký tự)"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                  ]}
                />

                <ProFormText.Password
                  name="confirmPassword"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className="text-[#00dfbe]" />,
                    className: "h-14 rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  }}
                  placeholder="Xác nhận mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu!' }]}
                />
              </div>

              <div className="mt-8 text-center text-[#b9cac4]">
                Đã có tài khoản thành viên?{' '}
                <a 
                  onClick={() => history.push('/login')}
                  className="text-[#00dfbe] font-bold hover:underline"
                >
                  Đăng nhập ngay
                </a>
              </div>
            </LoginForm>

            <div className="mt-12 text-center text-on-surface-variant/40 text-[10px] uppercase tracking-wider">
              Bằng cách đăng ký, bạn đồng ý với Điều khoản & Chính sách của PTIT Club.
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SignUpPage;
