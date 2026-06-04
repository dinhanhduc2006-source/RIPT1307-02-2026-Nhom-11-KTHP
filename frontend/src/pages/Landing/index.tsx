import { history } from '@umijs/max';
import React, { useEffect, useState, useRef } from 'react';
import { isAuthenticated, getUser } from '@/services/api';
import { motion } from 'framer-motion';
import '@/global.css';

// --- Animated Spotlight Card Component ---
const SpotlightCard = ({ children, className = '', variants }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <motion.div
      variants={variants}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,223,190,.15), transparent 40%)`,
        }}
      />
      <div className="relative z-10 h-full flex flex-col">{children}</div>
    </motion.div>
  );
};

// --- Mock Data ---
const NAVIGATION_LINKS = [
  { label: 'Tính năng', path: '#features' },
  { label: 'Kho thiết bị', path: '/home', active: true },
  { label: 'Quy trình', path: '#how-it-works' },
  { label: 'Cộng đồng', path: '/forum' },
];

const HERO_EQUIPMENT = [
  {
    name: 'Sony A7 IV',
    desc: 'Máy ảnh Mirrorless chuyên nghiệp',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmpZGFrkicFowJRv_7DtILVG1YSQOycOoiNam_REnjOmbJsn-TF8NE7MdxtlX5xE5nzDPH16WA1yaejfI86HLZhdjxGwq0jqKfNcsf40VyvkrnxSFbwq6O9OWErmeECFOdJAt7MKvKTYrXQDMY9RcUpEhoH3LhpJKJg4HjXW74KXY5UvJWRKVXcFMjhEk0GViUVXVA59wrNKjF5_tn0A4nS5-2BgcRS4KY8B3pp_nOTjkeJxM1agNOurgpl0EE68Gqr-itDFlMuU3k',
  },
  {
    name: 'DJI Mavic 3 Pro',
    desc: 'Flycam quay phim 5.1K từ trên cao',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZZCtSXPDFsQtDuVUVa5G5JBio3Wx97jfBrKqWj68tcD0yzb20r8oWLh0nA7bTqaEU8LRkaIBAGK83cp1tzQtRE5MV39GvgY1qRfdo2awzYt_CjNOjOriTBEDa9P-DO2ddQ6lag-Ttx6Ryi5sLxFcZQLoAq8nFyb2hgSRSBeMZAzi1a_QH6756Gc7KtLgjg_l2tNgaatJyUMQck0x9ISUys5nNPw0-UILmJBgvJ2r9hR226x5tgN8Yfd3opLyxG6zs9Hq6w43K_0zu',
  },
  {
    name: 'Rode NT1 Condenser',
    desc: 'Micro thu âm chất lượng phòng thu',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADLMea7O_XTyK9AZFf44t_ZNQfdJDdJTdqZsU3Z4OaNZh_MTnCL3jLpoLiJQg0B6KXyR0uK4OhW2jaCwetOO8WIK4MpQVS8N3XIWpQntLNBuG7hrplvc4-KBWh8C_9pR2me3TEBShnfTEeIqE5Rk6CzDQNioa0wCqHHNH-d0_ezh3iez9fAjoTDDmB7stiXanrsg-6Sj5xcpVm2rqXcCcbhwy9gHxcA1nVv6Fj1ROwfh2-4yPj2N4BJX3J8KJOfJYKMyje7gupFtek',
  },
];

const FEATURES = [
  {
    icon: 'inventory_2',
    title: 'Kho thiết bị thông minh',
    desc: 'Theo dõi tình trạng sẵn có theo thời gian thực với cập nhật trạng thái tức thì. Biết chính xác thiết bị nào sẵn sàng, đang được mượn, hoặc đang bảo trì trước khi bạn yêu cầu.',
    tag: '18 thiết bị sẵn có',
  },
  {
    icon: 'forum',
    title: 'Diễn đàn cộng đồng',
    desc: 'Chia sẻ đánh giá, mẹo, và ý tưởng dự án với các nhà sáng tạo khác. Đặt câu hỏi, hợp tác làm phim, và cùng nhau phát triển kỹ năng.',
    tag: '142 thành viên năng động',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Quản trị viên hỗ trợ',
    desc: 'Công cụ mạnh mẽ cho quản lý câu lạc bộ để duyệt yêu cầu, lên lịch bảo trì, và gửi thông báo đến toàn bộ cộng đồng.',
    tag: 'Duyệt yêu cầu nhanh chóng',
  },
];

const EQUIPMENT_LIST = [
  {
    id: 1,
    name: 'Sony A7 IV Mirrorless',
    specs: 'Full-frame · 33MP · 4K60fps',
    status: 'available',
    statusText: 'Sẵn sàng',
    user: 'Minh',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTTz5OmepZ3Ktyr-xrlL4LSFW9_FjLWhmqDbIJ7n4kj92-ZxMMJUp1QyRcmCeO5aECHmH62RtoTuIi0FxSWp6Sk8bZ0QQTP30PlHc1nDd4ERPKBiPgimoNo9URzBuaoZGfq_s5txtmkKA4OBrPM1716MlwSv0nEl9jnVaoIC0hdG3Qm65vFotowWjI4-FUi-wTrwkcD81CGLVQuxp4cX-mR5PEKLASiwnLny0NTO3sI0maRFMzb4w3n0WNT47HcUAKNYNQrNI-kcTV',
  },
  {
    id: 2,
    name: 'DJI Mavic 3 Pro',
    specs: 'Drone · 3 batteries · 15km range',
    status: 'available',
    statusText: 'Sẵn sàng',
    user: 'Tuấn',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZZCtSXPDFsQtDuVUVa5G5JBio3Wx97jfBrKqWj68tcD0yzb20r8oWLh0nA7bTqaEU8LRkaIBAGK83cp1tzQtRE5MV39GvgY1qRfdo2awzYt_CjNOjOriTBEDa9P-DO2ddQ6lag-Ttx6Ryi5sLxFcZQLoAq8nFyb2hgSRSBeMZAzi1a_QH6756Gc7KtLgjg_l2tNgaatJyUMQck0x9ISUys5nNPw0-UILmJBgvJ2r9hR226x5tgN8Yfd3opLyxG6zs9Hq6w43K_0zu',
  },
  {
    id: 3,
    name: 'Rode NT1 Condenser',
    specs: 'Studio mic · Cardioid · Ultra-quiet',
    status: 'available',
    statusText: 'Sẵn sàng',
    user: 'Lan',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADLMea7O_XTyK9AZFf44t_ZNQfdJDdJTdqZsU3Z4OaNZh_MTnCL3jLpoLiJQg0B6KXyR0uK4OhW2jaCwetOO8WIK4MpQVS8N3XIWpQntLNBuG7hrplvc4-KBWh8C_9pR2me3TEBShnfTEeIqE5Rk6CzDQNioa0wCqHHNH-d0_ezh3iez9fAjoTDDmB7stiXanrsg-6Sj5xcpVm2rqXcCcbhwy9gHxcA1nVv6Fj1ROwfh2-4yPj2N4BJX3J8KJOfJYKMyje7gupFtek',
  },
];

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Minh Đức',
    time: '2 giờ',
    type: 'Q&A',
    content:
      'Cần mượn Sony A7 IV cho đồ án cuối kỳ tuần sau — Thứ Hai đến Thứ Tư. Có ai đang giữ hay biết lịch trình của nó không?',
    stats: { comments: 8, likes: 14 },
  },
  {
    id: 2,
    author: 'Club Admin',
    time: '4 giờ',
    type: 'Announcement',
    isAlert: true,
    content:
      'DJI Mavic 3 Pro đang được bảo trì. Dự kiến trả lại vào 3 tháng 6. Xin lỗi vì sự bất tiện này!',
    stats: null,
  },
  {
    id: 3,
    author: 'Hoa Phương',
    time: '6 giờ',
    type: 'Review',
    content:
      'GoPro Hero 12 review: Footage 5.3K quá đỉnh, pin dùng được 2 tiếng quay liên tục 🔥 Rất đáng để mượn!',
    stats: null,
  },
];

// Animation Variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const textRevealContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const textRevealChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Animated Counter Component
const AnimatedCounter = ({
  from,
  to,
  duration = 2,
}: {
  from: number;
  to: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(from);

  useEffect(() => {
    let start = from;
    const increment = (to - from) / (duration * 60); // 60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [from, to, duration]);

  return <span>{count}</span>;
};

const LandingPage: React.FC = () => {
  const [heroIndex, setHeroIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getUser();
      if (user?.role === 'Admin') {
        history.push('/admin');
      } else {
        history.push('/client-home');
      }
    }
  }, []);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isHovering) {
        setHeroIndex((prev) => (prev + 1) % HERO_EQUIPMENT.length);
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [isHovering]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handlePrev = () => {
    setHeroIndex(
      (prev) => (prev - 1 + HERO_EQUIPMENT.length) % HERO_EQUIPMENT.length,
    );
  };

  const handleNext = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_EQUIPMENT.length);
  };

  const handleLogin = () => history.push('/login');
  const handleSignUp = () => history.push('/signup');
  const handleExplore = () => history.push('/home');

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full flex justify-between items-center px-gutter py-stack-sm max-w-[1280px] left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border-b border-white/10 shadow-md z-40">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => history.push('/')}
        >
          <span
            className="material-symbols-outlined text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            videocam
          </span>
          <span className="text-[24px] font-headline-md font-bold text-primary">
            PTIT Club.
          </span>
        </div>

        <div className="hidden md:flex gap-gutter items-center">
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.label}
              className={`${
                link.active
                  ? 'text-primary font-bold border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary transition-colors'
              } font-label-md text-sm`}
              href={link.path}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleLogin}
            className="hidden md:block text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
          >
            Đăng nhập
          </button>
          <button
            onClick={handleSignUp}
            className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-md text-sm hover:bg-primary-container transition-colors shadow-lg"
          >
            Tham gia ngay
          </button>
        </div>
      </nav>

      <main className="pt-[80px]">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-stack-xl px-margin-mobile md:px-margin-desktop bg-grid-pattern">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />

          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-stack-lg items-center relative z-10 text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-stack-md"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                18 thiết bị đang sẵn sàng - PTIT Club
              </div>

              <motion.h1
                variants={textRevealContainer}
                initial="hidden"
                animate="visible"
                className="font-headline-xl text-[40px] md:text-[64px] leading-tight font-bold text-on-background"
              >
                <motion.span variants={textRevealChild} className="inline-block">
                  Mượn Thiết Bị
                </motion.span>{' '}
                <br />
                <motion.span variants={textRevealChild} className="inline-block">
                  Chuyên Nghiệp.
                </motion.span>{' '}
                <br />
                <motion.span
                  variants={textRevealChild}
                  className="gradient-text inline-block"
                >
                  Sáng Tạo Không Giới Hạn.
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-lg text-on-surface-variant max-w-xl"
              >
                Truy cập kho máy ảnh, drone, thiết bị âm thanh và ánh sáng từ
                câu lạc bộ sinh viên của bạn. Miễn phí, dễ dàng yêu cầu, hỗ trợ
                cộng đồng.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button
                  onClick={handleExplore}
                  className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform neon-glow"
                >
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                  Khám phá kho thiết bị
                </button>
                <button className="px-6 py-3 rounded-full border border-outline text-on-surface hover:border-primary hover:text-primary transition-colors font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  Xem cách hoạt động
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex gap-8 pt-8 border-t border-white/10"
              >
                <div>
                  <div className="text-2xl font-headline-md font-bold text-on-background">
                    <AnimatedCounter from={0} to={24} />+
                  </div>
                  <div className="text-xs text-on-surface-variant font-semibold">
                    Thiết bị Pro
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-headline-md font-bold text-primary">
                    <AnimatedCounter from={0} to={142} />
                  </div>
                  <div className="text-xs text-on-surface-variant font-semibold">
                    Thành viên
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-headline-md font-bold text-on-background">
                    <AnimatedCounter from={0} to={500} />+
                  </div>
                  <div className="text-xs text-on-surface-variant font-semibold">
                    Lượt mượn
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="relative group/hero"
            >
              <div
                ref={heroRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setMousePos({ x: 0, y: 0 });
                }}
                className={`glass-panel p-4 rounded-[32px] relative z-10 transition-all duration-300 ease-out cursor-pointer overflow-hidden ${
                  !isHovering ? 'animate-float-circle' : ''
                }`}
                style={{
                  transform: `perspective(1000px) rotateY(${
                    mousePos.x * 20
                  }deg) rotateX(${-mousePos.y * 20}deg) scale(${
                    isHovering ? 1.05 : 1
                  })`,
                }}
              >
                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container/60 backdrop-blur-md border border-white/10 text-primary flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary"
                >
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container/60 backdrop-blur-md border border-white/10 text-primary flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-primary hover:text-on-primary"
                >
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>

                {/* Equipment Slide */}
                <div className="relative h-[300px] md:h-[400px] flex items-center justify-center">
                  {HERO_EQUIPMENT.map((item, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${
                        idx === heroIndex
                          ? 'opacity-100 scale-100 translate-x-0'
                          : 'opacity-0 scale-90 translate-x-full'
                      }`}
                    >
                      <img
                        alt={item.name}
                        className="max-h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(0,223,190,0.3)]"
                        src={item.img}
                      />
                      {idx === heroIndex && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
                          <div className="text-primary font-bold text-lg neon-text-glow">
                            {item.name}
                          </div>
                          <div className="text-on-surface-variant text-xs">
                            {item.desc}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute top-8 right-8 bg-surface-container/80 backdrop-blur-md border border-white/10 rounded-lg p-3 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bolt
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-on-background">
                      Vừa được mượn!
                    </div>
                    <div className="text-[10px] text-on-surface-variant">
                      GoPro Hero 12 - 2 phút trước
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid */}
        <section
          id="features"
          className="py-stack-xl px-margin-mobile md:px-margin-desktop overflow-hidden"
        >
          <div className="max-w-[1280px] mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUpVariant}
              className="mb-stack-lg"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface-container text-on-surface-variant text-xs mb-4">
                <span
                  className="material-symbols-outlined text-primary text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                Tính năng nền tảng
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-on-background mb-4">
                Mọi thứ Câu lạc bộ cần
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
                Từ theo dõi kho thiết bị thông minh đến diễn đàn chia sẻ trong
                cộng đồng — tất cả trong một nền tảng dành riêng cho sinh viên.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid md:grid-cols-3 gap-6 text-left"
            >
              {FEATURES.map((feature, idx) => (
                <SpotlightCard
                  key={idx}
                  variants={fadeUpVariant}
                  className="glass-panel p-6 rounded-[24px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-4">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-headline-md font-semibold text-on-background mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-on-surface-variant flex-grow text-sm leading-relaxed mb-4">
                    {feature.desc}
                  </p>
                  <div className="mt-auto p-3 rounded-lg bg-surface-container border border-primary/20 flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {feature.tag}
                    </span>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Inventory Showcase */}
        <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20" />
          <div className="max-w-[1280px] mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUpVariant}
              className="flex flex-col md:flex-row justify-between items-end mb-stack-lg gap-4"
            >
              <div className="text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Kho thiết bị trực tuyến
                </div>
                <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-on-background">
                  Thiết bị <span className="gradient-text">sẵn có</span>
                </h2>
                <p className="text-on-surface-variant mt-2 text-base">
                  Khám phá kho thiết bị hiện đại, luôn sẵn sàng cho dự án của
                  bạn.
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
                {['Tất cả', 'Máy ảnh', 'Âm thanh', 'Ánh sáng'].map((cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      i === 0
                        ? 'bg-primary/20 text-primary border border-primary/50'
                        : 'bg-surface-container border border-white/10 text-on-surface hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {EQUIPMENT_LIST.map((item) => (
                <SpotlightCard
                  key={item.id}
                  variants={fadeUpVariant}
                  className={`glass-panel rounded-[16px] group ${
                    item.status === 'maintenance' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="h-48 relative bg-surface-container-low p-4 flex items-center justify-center overflow-hidden">
                    <div
                      className={`absolute top-4 right-4 ${
                        item.status === 'available'
                          ? 'bg-primary/20 text-primary border-primary/50'
                          : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/50'
                      } border px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 neon-glow z-20`}
                    >
                      {item.status === 'available' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      ) : (
                        <span className="material-symbols-outlined text-[12px]">
                          build
                        </span>
                      )}
                      {item.statusText}
                    </div>
                    <img
                      alt={item.name}
                      className={`h-full w-full object-cover transition-all duration-500 ${
                        item.status === 'available'
                          ? 'group-hover:scale-110'
                          : 'grayscale'
                      }`}
                      src={item.img}
                    />
                  </div>
                  <div className="p-4 border-t border-white/5 bg-surface-container-highest">
                    <h4 className="text-sm font-bold text-on-background">
                      {item.name}
                    </h4>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {item.specs}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      {item.status === 'available' ? (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-surface-variant border border-white/10 overflow-hidden">
                              <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user}`}
                                alt="avatar"
                              />
                            </div>
                            <span className="text-xs text-on-surface-variant">
                              {item.user}
                            </span>
                          </div>
                          <button
                            onClick={handleLogin}
                            className="bg-primary text-on-primary px-4 py-1.5 rounded-md text-xs font-bold hover:bg-primary-container transition-colors relative z-20"
                          >
                            Mượn
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-xs font-bold text-[#ffb4ab]">
                            Dự kiến trả: {item.returnDate}
                          </div>
                          <button className="bg-surface-variant text-on-surface-variant px-4 py-1.5 rounded-md text-xs font-bold cursor-not-allowed">
                            Không có sẵn
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleExplore}
                className="px-6 py-2 rounded-full border border-white/10 text-on-surface hover:border-primary hover:text-primary transition-colors font-bold flex items-center gap-2 text-sm"
              >
                Xem tất cả 24 thiết bị{' '}
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Timeline */}
        <section
          id="how-it-works"
          className="py-stack-xl px-margin-mobile md:px-margin-desktop relative overflow-hidden text-center"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden md:block" />
          <div className="max-w-[1280px] mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUpVariant}
              className="mb-stack-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface-container text-on-surface-variant text-xs mb-4 font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  route
                </span>
                Cách hoạt động
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-on-background mb-4">
                Mượn thiết bị trong 3 bước đơn giản
              </h2>
              <p className="text-on-surface-variant max-w-2xl mx-auto text-base">
                Từ việc duyệt qua danh sách đến lúc mượn, toàn bộ quá trình mất
                chưa tới 2 phút.
              </p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="space-y-12"
            >
              {/* Step 1 */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-col md:flex-row items-center justify-center gap-8 group"
              >
                <div className="md:w-1/2 flex justify-end">
                  <div className="glass-panel p-6 rounded-[24px] max-w-sm text-center md:text-right hover:border-primary/50 transition-colors">
                    <h3 className="text-xl font-headline-md font-bold text-on-background mb-2">
                      1. Tìm kiếm thiết bị
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Khám phá toàn bộ kho thiết bị với trạng thái thời gian
                      thực. Lọc theo danh mục, kiểm tra thông số kỹ thuật.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-primary text-primary flex items-center justify-center font-bold z-10 neon-glow relative">
                  1
                  <div className="absolute inset-0 rounded-full border border-primary animate-ping opacity-50" />
                </div>
                <div className="md:w-1/2 flex justify-start">
                  <div className="px-4 py-2 rounded-lg bg-surface-container-low border border-white/5 text-on-surface-variant text-xs flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      search
                    </span>{' '}
                    Tìm kiếm & lọc 24+ thiết bị
                  </div>
                </div>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-col md:flex-row-reverse items-center justify-center gap-8 group"
              >
                <div className="md:w-1/2 flex justify-start">
                  <div className="glass-panel p-6 rounded-[24px] max-w-sm text-center md:text-left hover:border-primary/50 transition-colors">
                    <h3 className="text-xl font-headline-md font-bold text-on-background mb-2">
                      2. Gửi yêu cầu mượn
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Chọn ngày của bạn, thêm một ghi chú dự án ngắn gọn và gửi.
                      Quản trị viên duyệt trong vài giờ.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-primary text-primary flex items-center justify-center font-bold z-10 relative">
                  2
                </div>
                <div className="md:w-1/2 flex justify-end">
                  <div className="px-4 py-2 rounded-lg bg-surface-container-low border border-white/5 text-on-surface-variant text-xs flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      event
                    </span>{' '}
                    Chọn ngày · Gửi yêu cầu
                  </div>
                </div>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                variants={fadeUpVariant}
                className="flex flex-col md:flex-row items-center justify-center gap-8 group"
              >
                <div className="md:w-1/2 flex justify-end">
                  <div className="glass-panel p-6 rounded-[24px] max-w-sm text-center md:text-right hover:border-primary/50 transition-colors">
                    <h3 className="text-xl font-headline-md font-bold text-on-background mb-2">
                      3. Nhận máy & Sử dụng
                    </h3>
                    <p className="text-sm text-on-surface-variant leading-relaxed">
                      Nhận thông báo tức thì khi được duyệt. Đến phòng sinh
                      hoạt, ký nhận thiết bị và bắt đầu sáng tạo.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container border-2 border-primary text-primary flex items-center justify-center font-bold z-10 relative">
                  3
                </div>
                <div className="md:w-1/2 flex justify-start">
                  <div className="px-4 py-2 rounded-lg bg-surface-container-low border border-white/5 text-on-surface-variant text-xs flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px] text-primary">
                      task_alt
                    </span>{' '}
                    Phê duyệt trong &lt; 2 giờ
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Community Feed */}
        <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface-container-lowest text-left">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUpVariant}
              className="md:col-span-1 space-y-6 md:sticky md:top-24 self-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Cộng đồng trực tuyến
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-on-background">
                Cộng đồng nói gì về PTIT Club
              </h2>
              <p className="text-on-surface-variant text-base">
                Nguồn cấp dữ liệu thời gian thực về câu hỏi, đánh giá, mẹo, và
                hợp tác dự án.
              </p>
              <button
                onClick={handleSignUp}
                className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold hover:bg-primary-container transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <span className="material-symbols-outlined">group_add</span>
                Tham gia Cộng đồng
              </button>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="md:col-span-2 space-y-4"
            >
              {COMMUNITY_POSTS.map((post) => (
                <SpotlightCard
                  key={post.id}
                  variants={fadeUpVariant}
                  className={`glass-panel p-5 rounded-2xl ${
                    post.isAlert ? 'border-l-4 border-l-[#ffb4ab]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border ${
                        post.isAlert
                          ? 'bg-[#ffb4ab]/20 border-[#ffb4ab]/30 text-[#ffb4ab]'
                          : 'bg-surface-variant border-white/10'
                      }`}
                    >
                      {post.isAlert && (
                        <span className="material-symbols-outlined text-[20px]">
                          admin_panel_settings
                        </span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              post.isAlert
                                ? 'text-[#ffb4ab]'
                                : 'text-on-background'
                            }`}
                          >
                            {post.author}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              post.isAlert
                                ? 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/30'
                                : 'bg-secondary-container/20 text-secondary-container border-secondary-container/30'
                            }`}
                          >
                            {post.isAlert ? 'Thông báo' : post.type}
                          </span>
                        </div>
                        <span className="text-xs text-on-surface-variant">
                          {post.time} trước
                        </span>
                      </div>
                      <p className="text-sm text-on-surface mt-2 flex items-start gap-2 leading-relaxed">
                        {post.isAlert && (
                          <span className="material-symbols-outlined text-[18px] text-[#ffb4ab] mt-1">
                            warning
                          </span>
                        )}
                        {post.content}
                      </p>
                      {post.stats && (
                        <div className="flex items-center gap-4 mt-3 text-on-surface-variant text-xs font-semibold">
                          <span className="flex items-center gap-1 hover:text-primary cursor-pointer relative z-20">
                            <span className="material-symbols-outlined text-[16px]">
                              chat_bubble_outline
                            </span>{' '}
                            {post.stats.comments}
                          </span>
                          <span className="flex items-center gap-1 hover:text-primary cursor-pointer relative z-20">
                            <span className="material-symbols-outlined text-[16px]">
                              favorite_border
                            </span>{' '}
                            {post.stats.likes}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-grid-pattern relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl mx-auto text-center relative z-10 glass-panel p-8 md:p-12 rounded-[32px] neon-glow"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold mb-6">
              <span className="material-symbols-outlined text-[14px]">
                card_membership
              </span>
              Miễn phí cho mọi thành viên
            </div>
            <h2 className="text-3xl md:text-[48px] font-headline-xl font-bold text-on-background mb-6 leading-tight">
              Sẵn sàng mượn thiết bị đầu tiên?
            </h2>
            <p className="text-lg text-on-surface-variant mb-8">
              Tham gia cùng 142 sinh viên sáng tạo đang sử dụng PTIT Club để
              hiện thực hóa dự án của họ — hoàn toàn miễn phí.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleSignUp}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl"
              >
                <span className="material-symbols-outlined">person_add</span>
                Tham gia PTIT Club ngay
              </button>
              <button className="px-8 py-4 rounded-full border border-outline text-on-surface hover:border-primary hover:text-primary transition-colors font-bold flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">mail</span>
                Liên hệ Admin
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface"
                  />
                ))}
              </div>
              <div className="flex text-[#ffb4ab]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[16px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs text-on-surface-variant font-semibold">
                Được tin dùng bởi 142+ sinh viên
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 w-full px-margin-desktop py-stack-xl flex flex-col md:flex-row justify-between gap-gutter mt-12 text-left">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              videocam
            </span>
            <span className="text-2xl font-headline-md font-bold text-primary">
              PTIT Club.
            </span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Nền tảng mượn thiết bị dành cho sinh viên. Mượn đồ chuyên nghiệp,
            xây dựng dự án tuyệt vời, cùng nhau phát triển.
          </p>
          <div className="text-[10px] font-bold text-on-surface-variant mt-4 uppercase tracking-widest">
            © 2026 PTIT Club - CLB Truyền thông Sinh viên - Bảo lưu mọi quyền
          </div>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            {['Về chúng tôi', 'Điều khoản', 'Bảo mật', 'Liên hệ Admin'].map(
              (link) => (
                <a
                  key={link}
                  className="text-on-surface-variant hover:text-primary transition-transform hover:translate-x-1 text-xs font-bold hover:underline"
                  href="#"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
