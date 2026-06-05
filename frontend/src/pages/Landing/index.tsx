import { history } from '@umijs/max';
import React, { useEffect, useState, useRef } from 'react';
import { isAuthenticated, getUser } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import '@/global.css';

// --- Splash Screen Component ---
const SplashScreen = ({ finishLoading }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => finishLoading(), 3000);
    return () => clearTimeout(timer);
  }, [finishLoading]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[1000] bg-[#050f1b] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.2, 1], opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="material-symbols-outlined text-[80px] text-[#00c2a3] opacity-20 absolute inset-0 flex items-center justify-center"
          >
            settings
          </motion.span>
          <span className="material-symbols-outlined text-[60px] text-[#00c2a3] relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
            videocam
          </span>
        </div>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '200px' }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#00c2a3] to-transparent"
        />
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: 'easeOut' }}
            className="text-3xl font-headline-lg font-bold text-white tracking-[0.2em]"
          >
            PTIT CLUB.
          </motion.h1>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Interactive Grid Component ---
const InteractiveGrid = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#16202e_1px,transparent_1px),linear-gradient(to_bottom,#16202e_1px,transparent_1px)] bg-[size:40px_40px]" 
      />
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0,194,163,0.15), transparent 80%)`,
        }}
      />
    </div>
  );
};

// --- Text Reveal Component (Reveals words on scroll) ---
const TextReveal = ({ children, className = '', delay = 0 }: any) => {
  const words = children.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      rotateX: 90,
    },
  };

  return (
    <motion.div
      style={{ display: 'flex', flexWrap: 'wrap', perspective: '1000px' }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={className}
    >
      {words.map((word: string, index: number) => (
        <motion.span
          variants={child}
          style={{ marginRight: '0.25em', display: 'inline-block' }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// --- Magnetic Button Component ---
const MagneticButton = ({ children, className = '', onClick }: any) => {
  const btnRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <motion.div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      <button onClick={onClick} className={className}>
        {children}
      </button>
    </motion.div>
  );
};

// --- Infinite Marquee Component ---
const InfiniteMarquee = ({ items, speed = 20 }: any) => {
  return (
    <div className="relative flex overflow-hidden py-10 select-none group">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ ease: 'linear', duration: speed, repeat: Infinity }}
        className="flex whitespace-nowrap gap-12 items-center min-w-full"
      >
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-4 px-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
             {item.icon && <span className="material-symbols-outlined text-[32px] text-[#00c2a3]">{item.icon}</span>}
             <span className="text-xl font-headline-md font-bold text-[#b9cac4]">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- Floating Particles Component ---
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-[#00c2a3]/10 to-transparent blur-3xl"
          animate={{
            x: [Math.random() * 1000, Math.random() * 1000],
            y: [Math.random() * 1000, Math.random() * 1000],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            width: 300 + Math.random() * 300,
            height: 300 + Math.random() * 300,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// --- Backlight Glow Component (Animated background glow) ---
const BacklightGlow = ({ color = '#00c2a3', size = '300px', opacity = 0.15, duration = 20 }: any) => {
  return (
    <motion.div
      animate={{
        x: [0, 50, -50, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="absolute pointer-events-none blur-[100px] rounded-full z-0"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        opacity,
      }}
    />
  );
};

// --- Animated Spotlight Card Component (Enhanced with 3D Tilt & Backlight) ---
const SpotlightCard = ({ children, className = '', variants }: any) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });

    const tiltX = (y / rect.height - 0.5) * 10;
    const tiltY = (x / rect.width - 0.5) * -10;
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setOpacity(0);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      variants={variants}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Integrated Backlight Glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-30 group-hover:opacity-100 transition-opacity duration-700">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00c2a3]/20 blur-[60px] rounded-full" />
      </div>

      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-10"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(0,194,163,.15), transparent 40%)`,
          transform: 'translateZ(20px)'
        }}
      />
      <div className="relative z-20 h-full flex flex-col" style={{ transform: 'translateZ(40px)' }}>{children}</div>
    </motion.div>
  );
};

// --- Mock Data ---
const NAVIGATION_LINKS = [
  { label: 'Tính năng', id: 'features' },
  { label: 'Kho thiết bị', id: 'inventory' },
  { label: 'Quy trình', id: 'how-it-works' },
  { label: 'Cộng đồng', id: 'community' },
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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhDuc',
    time: '2 giờ',
    type: 'Q&A',
    content:
      'Cần mượn Sony A7 IV cho đồ án cuối kỳ tuần sau — Thứ Hai đến Thứ Tư. Có ai đang giữ hay biết lịch trình của nó không?',
    stats: { comments: 8, likes: 14 },
  },
  {
    id: 2,
    author: 'Club Admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
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
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoaPhuong',
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
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const textRevealContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const textRevealChild = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
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

const InteractiveTimeline = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: 'Tìm kiếm thiết bị',
      desc: 'Khám phá toàn bộ kho thiết bị với trạng thái thời gian thực. Lọc theo danh mục, kiểm tra thông số kỹ thuật.',
      icon: 'search',
      tag: 'Tìm kiếm & lọc 24+ thiết bị',
    },
    {
      title: 'Gửi yêu cầu mượn',
      desc: 'Chọn ngày của bạn, thêm một ghi chú dự án ngắn gọn và gửi. Quản trị viên duyệt trong vài giờ.',
      icon: 'event',
      tag: 'Chọn ngày · Gửi yêu cầu',
    },
    {
      title: 'Nhận máy & Sử dụng',
      desc: 'Nhận thông báo tức thì khi được duyệt. Đến phòng sinh hoạt, ký nhận thiết bị và bắt đầu sáng tạo.',
      icon: 'task_alt',
      tag: 'Phê duyệt trong < 2 giờ',
    },
  ];

  useEffect(() => {
    const duration = 5000; // 5 seconds per step
    const interval = 50; // update progress every 50ms
    const stepAmount = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((current) => (current + 1) % steps.length);
          return 0;
        }
        return prev + stepAmount;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [activeStep, steps.length]);

  return (
    <div className="flex flex-col md:flex-row gap-12 mt-12 items-center">
      {/* Left: Step Details */}
      <div className="md:w-1/2 flex flex-col gap-6 text-left">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          return (
            <div
              key={idx}
              onClick={() => {
                setActiveStep(idx);
                setProgress(0);
              }}
              className={`relative p-6 rounded-[24px] cursor-pointer transition-all duration-500 overflow-hidden ${
                isActive
                  ? 'glass-panel border-[#00c2a3]/50 shadow-[0_0_30px_rgba(0,194,163,0.15)] scale-105 z-10'
                  : 'bg-surface-container-low border border-transparent hover:border-white/10 opacity-60 hover:opacity-100 scale-100'
              }`}
            >
              {isActive && (
                <div
                  className="absolute top-0 left-0 h-1 bg-[#00c2a3] transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
              <div className="flex items-start gap-4 relative z-10">
                <div
                  className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                    isActive
                      ? 'bg-[#00c2a3] text-[#001a14] shadow-[0_0_15px_rgba(0,194,163,0.5)]'
                      : 'bg-surface-variant text-[#b9cac4]'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <h3
                    className={`text-xl font-headline-md font-bold mb-2 transition-colors ${
                      isActive ? 'text-white' : 'text-[#b9cac4]'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#b9cac4] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Visual Showcase */}
      <div className="md:w-1/2 w-full h-[400px] relative rounded-[32px] overflow-hidden glass-panel border border-white/10 p-8 flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1421] via-[#16202e] to-[#004d40] opacity-50" />
        
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: activeStep === idx ? 1 : 0,
              scale: activeStep === idx ? 1 : 0.9,
              y: activeStep === idx ? 0 : 20,
              zIndex: activeStep === idx ? 10 : 0
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none p-8"
          >
            <div className="w-full h-full max-w-sm bg-surface-container rounded-[24px] border border-[#00c2a3]/30 shadow-[0_0_40px_rgba(0,194,163,0.2)] flex flex-col items-center justify-center p-6 gap-6 relative overflow-hidden">
               {/* Decorative background glow inside the mock card */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#00c2a3]/20 blur-[50px] rounded-full" />
               
               <div className="w-20 h-20 rounded-full bg-[#00c2a3]/20 flex items-center justify-center text-[#00c2a3] border border-[#00c2a3]/50 relative z-10">
                  <span className="material-symbols-outlined text-[40px]">
                    {step.icon}
                  </span>
               </div>
               
               <div className="text-center relative z-10">
                  <div className="text-white font-bold text-lg mb-2">{step.title}</div>
                  <div className="inline-flex px-3 py-1 rounded-full bg-[#00c2a3]/10 text-[#00c2a3] text-xs font-bold border border-[#00c2a3]/30">
                    {step.tag}
                  </div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
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

  // Scroll Spy & Progress
  useEffect(() => {
    const handleScroll = () => {
      // Progress Bar
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalScroll) * 100;
      setScrollProgress(progress);

      // Scroll Spy
      const sections = NAVIGATION_LINKS.map((link) => link.id);
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'auto' });
    }
  };

  const handleExploreClick = () => {
    const el = document.getElementById('inventory');
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'auto' });
    }
  };

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

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen relative">
      <AnimatePresence>
        {loading && <SplashScreen finishLoading={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <InteractiveGrid />
          
          {/* Scroll Progress Bar */}
          <div 
            className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#00dfbe] to-[#00c2a3] z-[100] transition-all duration-75"
            style={{ width: `${scrollProgress}%` }}
          />

          {/* TopNavBar */}
          <nav className="fixed top-0 w-full flex justify-between items-center px-gutter py-stack-sm max-w-[1280px] left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-md border-b border-white/10 shadow-md z-40">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}
            >
              <span
                className="material-symbols-outlined text-[#00c2a3]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                videocam
              </span>
              <span className="text-[24px] font-headline-md font-bold text-[#00c2a3]">
                PTIT Club.
              </span>
            </div>

            <div className="hidden md:flex gap-gutter items-center">
              {NAVIGATION_LINKS.map((link) => (
                <a
                  key={link.label}
                  className={`${
                    activeSection === link.id
                      ? 'text-[#00c2a3] font-bold border-b-2 border-[#00c2a3] pb-1'
                      : 'text-[#b9cac4] hover:text-[#00c2a3] transition-colors'
                  } font-label-md text-sm`}
                  href={`#${link.id}`}
                  onClick={(e) => handleNavClick(e, link.id)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex gap-4 items-center">
              <button
                onClick={handleLogin}
                className="hidden md:block text-[#b9cac4] hover:text-[#00c2a3] transition-colors font-label-md text-sm"
              >
                Đăng nhập
              </button>
              <button
                onClick={handleSignUp}
                className="bg-[#00b398] text-[#001a14] px-5 py-2 rounded-full font-label-md text-sm hover:bg-[#00c2a3] transition-all shadow-[0_0_15px_rgba(0,194,163,0.4)]"
              >
                Tham gia ngay
              </button>
            </div>
          </nav>

          <main className="pt-[80px] relative z-10">
            {/* Hero Section */}
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-stack-xl px-margin-mobile md:px-margin-desktop overflow-hidden">
          <FloatingParticles />
          <BacklightGlow color="#00c2a3" size="500px" opacity={0.1} duration={25} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00c2a3]/5 via-transparent to-background pointer-events-none" />

          <div className="max-w-[1280px] mx-auto grid md:grid-cols-2 gap-stack-lg items-center relative z-10 text-left">
            <motion.div
              initial={{ opacity: 0, x: -40, filter: 'blur(5px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="space-y-stack-md"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00c2a3]/30 bg-[#00c2a3]/10 text-[#00c2a3] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#00c2a3] animate-pulse" />
                18 thiết bị đang sẵn sàng - PTIT Club
              </div>

              <div className="font-headline-xl text-[40px] md:text-[64px] leading-tight font-bold text-on-background">
                <TextReveal>Mượn Thiết Bị Chuyên Nghiệp.</TextReveal>
                <TextReveal className="bg-gradient-to-r from-[#00e5c3] to-[#009e86] bg-clip-text text-transparent" delay={0.5}>
                  Sáng Tạo Không Giới Hạn.
                </TextReveal>
              </div>

              <TextReveal delay={0.8} className="text-lg text-on-surface-variant max-w-xl">
                Truy cập kho máy ảnh, drone, thiết bị âm thanh và ánh sáng từ câu lạc bộ sinh viên của bạn. Miễn phí, dễ dàng yêu cầu, hỗ trợ cộng đồng.
              </TextReveal>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <MagneticButton
                  onClick={handleExploreClick}
                  className="bg-gradient-to-r from-[#00b398] to-[#008f79] text-[#001a14] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_4px_20px_rgba(0,194,163,0.3)]"
                >
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                  Khám phá kho thiết bị
                </MagneticButton>
                <MagneticButton 
                  onClick={(e: any) => handleNavClick(e as any, 'how-it-works')}
                  className="px-6 py-3 rounded-full border border-outline text-[#b9cac4] hover:border-[#00c2a3] hover:text-[#00c2a3] transition-colors font-bold flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Xem cách hoạt động
                </MagneticButton>
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
                  <div className="text-xs text-[#b9cac4] font-semibold">
                    Thiết bị Pro
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-headline-md font-bold text-[#00c2a3]">
                    <AnimatedCounter from={0} to={142} />
                  </div>
                  <div className="text-xs text-[#b9cac4] font-semibold">
                    Thành viên
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-headline-md font-bold text-on-background">
                    <AnimatedCounter from={0} to={500} />+
                  </div>
                  <div className="text-xs text-[#b9cac4] font-semibold">
                    Lượt mượn
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="relative group/hero"
              style={{ perspective: 1200 }}
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
                  transform: `rotateY(${
                    mousePos.x * 20
                  }deg) rotateX(${-mousePos.y * 20}deg) scale(${
                    isHovering ? 1.02 : 1
                  })`,
                }}
              >
                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container/60 backdrop-blur-md border border-white/10 text-[#00c2a3] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-[#00c2a3] hover:text-[#001a14]"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-surface-container/60 backdrop-blur-md border border-white/10 text-[#00c2a3] flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity hover:bg-[#00c2a3] hover:text-[#001a14]"
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
                        className="max-h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(0,194,163,0.2)]"
                        src={item.img}
                      />
                      {idx === heroIndex && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-4">
                          <div className="text-[#00c2a3] font-bold text-lg drop-shadow-[0_0_8px_rgba(0,194,163,0.5)]">
                            {item.name}
                          </div>
                          <div className="text-[#b9cac4] text-xs">
                            {item.desc}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="absolute top-8 right-8 bg-surface-container/80 backdrop-blur-md border border-white/10 rounded-lg p-3 flex items-center gap-3 z-20 shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-[#00c2a3]/20 flex items-center justify-center text-[#00c2a3]">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      bolt
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      Vừa được mượn!
                    </div>
                    <div className="text-[10px] text-[#b9cac4]">
                      GoPro Hero 12 - 2 phút trước
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Brand Marquee */}
        <div className="bg-surface-container-lowest border-y border-white/5">
          <InfiniteMarquee
            items={[
              { label: 'Sony', icon: 'camera_enhance' },
              { label: 'DJI', icon: 'flight_takeoff' },
              { label: 'Rode', icon: 'mic' },
              { label: 'Canon', icon: 'photo_camera' },
              { label: 'Nikon', icon: 'camera' },
              { label: 'Apple', icon: 'laptop_mac' },
              { label: 'Adobe', icon: 'auto_fix_high' },
            ]}
          />
        </div>

        {/* Feature Grid */}
        <section
          id="features"
          className="relative py-stack-xl px-margin-mobile md:px-margin-desktop overflow-hidden"
        >
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2">
             <BacklightGlow color="#00c2a3" size="600px" opacity={0.05} duration={30} />
          </div>
          <div className="max-w-[1280px] mx-auto text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUpVariant}
              className="mb-stack-lg"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface-container text-[#b9cac4] text-xs mb-4">
                <span
                  className="material-symbols-outlined text-[#00c2a3] text-[14px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                Tính năng nền tảng
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-white mb-4">
                <TextReveal>Mọi thứ Câu lạc bộ cần</TextReveal>
              </h2>
              <TextReveal className="text-[#b9cac4] max-w-2xl mx-auto text-base">
                Từ theo dõi kho thiết bị thông minh đến diễn đàn chia sẻ trong cộng đồng — tất cả trong một nền tảng dành riêng cho sinh viên.
              </TextReveal>
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
                  className="glass-panel p-6 rounded-[24px] group hover:border-[#00c2a3]/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-container border border-white/5 flex items-center justify-center text-[#00c2a3] group-hover:scale-110 transition-transform mb-4 shadow-[0_0_10px_rgba(0,194,163,0.1)]">
                    <span className="material-symbols-outlined">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-xl font-headline-md font-semibold text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-[#b9cac4] flex-grow text-sm leading-relaxed mb-4">
                    {feature.desc}
                  </p>
                  <div className="mt-auto p-3 rounded-lg bg-surface-container border border-[#00c2a3]/20 flex items-center gap-2 w-fit">
                    <span className="w-2 h-2 rounded-full bg-[#00c2a3]" />
                    <span className="text-xs font-bold text-[#00c2a3] uppercase tracking-wider">
                      {feature.tag}
                    </span>
                  </div>
                </SpotlightCard>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Inventory Showcase */}
        <section 
          id="inventory"
          className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-background relative overflow-hidden"
        >
          <div className="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4">
             <BacklightGlow color="#00c2a3" size="700px" opacity={0.08} duration={35} />
          </div>
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00c2a3]/30 bg-[#00c2a3]/10 text-[#00c2a3] text-xs font-bold mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00c2a3] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00c2a3]"></span>
                  </span>
                  Kho thiết bị trực tuyến
                </div>
                <h2 className="text-3xl md:text-4xl font-headline-lg font-bold text-white">
                  <TextReveal>Thiết bị sẵn có</TextReveal>
                </h2>
                <TextReveal className="text-[#b9cac4] mt-2 text-base">
                  Khám phá kho thiết bị hiện đại, luôn sẵn sàng cho dự án của bạn.
                </TextReveal>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
                {['Tất cả', 'Máy ảnh', 'Âm thanh', 'Ánh sáng'].map((cat, i) => (
                  <button
                    key={cat}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      i === 0
                        ? 'bg-[#00c2a3]/20 text-[#00c2a3] border border-[#00c2a3]/50'
                        : 'bg-surface-container border border-white/10 text-white hover:text-[#00c2a3]'
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
                  className={`glass-panel rounded-[16px] group hover:border-white/20 ${
                    item.status === 'maintenance' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="h-48 relative bg-surface-container-low p-4 flex items-center justify-center overflow-hidden">
                    <div
                      className={`absolute top-4 right-4 ${
                        item.status === 'available'
                          ? 'bg-[#00c2a3]/20 text-[#00c2a3] border-[#00c2a3]/50'
                          : 'bg-[#ffb4ab]/20 text-[#ffb4ab] border-[#ffb4ab]/50'
                      } border px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg z-20`}
                    >
                      {item.status === 'available' ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00c2a3]" />
                      ) : (
                        <span className="material-symbols-outlined text-[12px]">
                          build
                        </span>
                      )}
                      {item.statusText}
                    </div>
                    <img
                      alt={item.name}
                      className={`h-full w-full object-cover transition-transform duration-700 ${
                        item.status === 'available'
                          ? 'group-hover:scale-110'
                          : 'grayscale'
                      }`}
                      src={item.img}
                    />
                  </div>
                  <div className="p-4 border-t border-white/5 bg-surface-container-highest">
                    <h4 className="text-sm font-bold text-white">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#b9cac4] mt-1">
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
                            <span className="text-xs text-[#b9cac4]">
                              {item.user}
                            </span>
                          </div>
                          <button
                            onClick={handleLogin}
                            className="bg-[#00b398] text-[#001a14] px-4 py-1.5 rounded-md text-xs font-bold hover:bg-[#00c2a3] transition-colors relative z-20 shadow-md"
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
                onClick={handleExploreClick}
                className="px-6 py-2 rounded-full border border-white/10 text-white hover:border-[#00c2a3] hover:text-[#00c2a3] transition-colors font-bold flex items-center gap-2 text-sm"
              >
                Xem tất cả 24 thiết bị{' '}
                <span className="material-symbols-outlined">expand_more</span>
              </button>
            </div>
          </div>
        </section>

        {/* How It Works Interactive Timeline */}
        <section
          id="how-it-works"
          className="py-stack-xl px-margin-mobile md:px-margin-desktop relative overflow-hidden text-center"
        >
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00c2a3]/30 to-transparent hidden md:block" />
          <div className="max-w-[1280px] mx-auto relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={fadeUpVariant}
              className="mb-stack-xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-surface-container text-[#b9cac4] text-xs mb-4 font-bold">
                <span className="material-symbols-outlined text-[14px] text-[#00c2a3]">
                  route
                </span>
                Cách hoạt động
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-white mb-4">
                <TextReveal>Mượn thiết bị trong 3 bước đơn giản</TextReveal>
              </h2>
              <TextReveal className="text-[#b9cac4] max-w-2xl mx-auto text-base">
                Từ việc duyệt qua danh sách đến lúc mượn, toàn bộ quá trình mất chưa tới 2 phút.
              </TextReveal>
            </motion.div>

            <InteractiveTimeline />
          </div>
        </section>

        {/* Community Feed */}
        <section id="community" className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-surface-container-lowest text-left">
          <div className="max-w-[1280px] mx-auto grid md:grid-cols-3 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUpVariant}
              className="md:col-span-1 space-y-6 md:sticky md:top-24 self-start"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00c2a3]/30 bg-[#00c2a3]/10 text-[#00c2a3] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00c2a3] animate-pulse" />
                Cộng đồng trực tuyến
              </div>
              <h2 className="text-3xl font-headline-lg font-bold text-white">
                <TextReveal>Cộng đồng nói gì về PTIT Club</TextReveal>
              </h2>
              <TextReveal className="text-[#b9cac4] text-base">
                Nguồn cấp dữ liệu thời gian thực về câu hỏi, đánh giá, mẹo, và hợp tác dự án.
              </TextReveal>
              <button
                onClick={handleSignUp}
                className="w-full bg-[#00b398] text-[#001a14] py-3 rounded-xl font-bold hover:bg-[#00c2a3] transition-colors flex items-center justify-center gap-2 mt-4 shadow-md"
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
                      className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border overflow-hidden ${
                        post.isAlert
                          ? 'bg-[#ffb4ab]/20 border-[#ffb4ab]/30 text-[#ffb4ab]'
                          : 'bg-surface-variant border-white/10'
                      }`}
                    >
                      {post.isAlert ? (
                        <span className="material-symbols-outlined text-[20px]">
                          admin_panel_settings
                        </span>
                      ) : (
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              post.isAlert
                                ? 'text-[#ffb4ab]'
                                : 'text-white'
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
                        <span className="text-xs text-[#b9cac4]">
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
                        <div className="flex items-center gap-4 mt-3 text-[#b9cac4] text-xs font-semibold">
                          <span className="flex items-center gap-1 hover:text-[#00c2a3] cursor-pointer relative z-20 transition-colors">
                            <span className="material-symbols-outlined text-[16px]">
                              chat_bubble_outline
                            </span>{' '}
                            {post.stats.comments}
                          </span>
                          <span className="flex items-center gap-1 hover:text-[#00c2a3] cursor-pointer relative z-20 transition-colors">
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
        <section className="py-stack-xl px-margin-mobile md:px-margin-desktop bg-grid-pattern relative overflow-hidden">
          <FloatingParticles />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center relative z-10 glass-panel p-8 md:p-12 rounded-[32px] shadow-[0_0_40px_rgba(0,194,163,0.1)] border-[#00c2a3]/20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00c2a3]/30 bg-[#00c2a3]/10 text-[#00c2a3] text-xs font-bold mb-6">
              <span className="material-symbols-outlined text-[14px]">
                card_membership
              </span>
              Miễn phí cho mọi thành viên
            </div>
            <h2 className="text-3xl md:text-[48px] font-headline-xl font-bold text-white mb-6 leading-tight">
              <TextReveal>Sẵn sàng mượn thiết bị đầu tiên?</TextReveal>
            </h2>
            <TextReveal className="text-lg text-[#b9cac4] mb-8">
              Tham gia cùng 142 sinh viên sáng tạo đang sử dụng PTIT Club để hiện thực hóa dự án của họ — hoàn toàn miễn phí.
            </TextReveal>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <MagneticButton
                onClick={handleSignUp}
                className="bg-gradient-to-r from-[#00b398] to-[#008f79] text-[#001a14] px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(0,194,163,0.3)] w-full sm:w-auto"
              >
                <span className="material-symbols-outlined">person_add</span>
                Tham gia PTIT Club ngay
              </MagneticButton>
              <MagneticButton
                className="px-8 py-4 rounded-full border border-outline text-white hover:border-[#00c2a3] hover:text-[#00c2a3] transition-colors font-bold flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined">mail</span>
                Liên hệ Admin
              </MagneticButton>
            </div>

            <div className="mt-8 flex items-center justify-center gap-3">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-surface-variant border-2 border-surface overflow-hidden"
                  >
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Student${i}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
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
              <span className="text-xs text-[#b9cac4] font-semibold">
                Được tin dùng bởi 142+ sinh viên
              </span>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5 w-full px-margin-desktop py-stack-xl flex flex-col md:flex-row justify-between gap-gutter mt-12 text-left">
        <div className="flex flex-col gap-4 max-w-xs">
          <div className="flex items-center gap-2" onClick={() => window.scrollTo({ top: 0, behavior: 'auto' })}>
            <span
              className="material-symbols-outlined text-[#00c2a3]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              videocam
            </span>
            <span className="text-2xl font-headline-md font-bold text-[#00c2a3] cursor-pointer">
              PTIT Club.
            </span>
          </div>
          <p className="text-[#b9cac4] text-sm leading-relaxed">
            Nền tảng mượn thiết bị dành cho sinh viên. Mượn đồ chuyên nghiệp,
            xây dựng dự án tuyệt vời, cùng nhau phát triển.
          </p>
          <div className="text-[10px] font-bold text-[#b9cac4] mt-4 uppercase tracking-widest">
            © 2026 PTIT Club - CLB Truyền thông Sinh viên - Bảo lưu mọi quyền
          </div>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            {['Về chúng tôi', 'Điều khoản', 'Bảo mật', 'Liên hệ Admin'].map(
              (link) => (
                <a
                  key={link}
                  className="text-[#b9cac4] hover:text-[#00c2a3] transition-transform hover:translate-x-1 text-xs font-bold hover:underline"
                  href="#"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage;