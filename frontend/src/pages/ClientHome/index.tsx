import React, { useState, useEffect, useMemo } from 'react';
import { history } from '@umijs/max';
import { ConfigProvider, theme, message, Spin, Modal, Form, Input, Space, Tag, Avatar, Typography, DatePicker, Badge, Empty, Drawer, Button, Divider, Upload, UploadProps, Descriptions } from 'antd';
import { LikeOutlined, MessageOutlined, PlusOutlined, UserOutlined, SearchOutlined, BellOutlined, LogoutOutlined, CarryOutOutlined, FileTextOutlined, CommentOutlined, SendOutlined, CameraOutlined, MailOutlined, KeyOutlined, IdcardOutlined, UploadOutlined, DashboardOutlined, InfoCircleOutlined, CalendarOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { clearAuth, getUser, setAuth, equipmentApi, loanRequestApi, postApi, announcementApi, commentApi, userApi } from '@/services/api';
import ForumSidebar from './components/ForumSidebar';
import DashboardOverview from './components/DashboardOverview';

const { Paragraph, Title, Text } = Typography;

const ClientHome: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [equipments, setEquipments] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Modals & States
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isPostDetailOpen, setIsPostDetailOpen] = useState(false);
    const [isRequestDetailOpen, setIsRequestDetailOpen] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
    const [selectedPost, setSelectedPost] = useState<any>(null);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [commentLoading, setCommentLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [postForm] = Form.useForm();
    const [borrowForm] = Form.useForm();
    const [commentForm] = Form.useForm();
    const [profileForm] = Form.useForm();
    
    const [user, setUserState] = useState(getUser());

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'dashboard') {
                // Handled inside DashboardOverview component
            } else if (activeTab === 'equipment') {
                const eqRes = await equipmentApi.getAll();
                setEquipments(eqRes || []);
            } else if (activeTab === 'reservations') {
                const reqRes = await loanRequestApi.getMyRequests();
                setRequests(Array.isArray(reqRes) ? reqRes : []);
            } else if (activeTab === 'community') {
                const pRes = await postApi.getAll();
                setPosts(pRes || []);
            } else if (activeTab === 'account') {
                profileForm.setFieldsValue({
                    username: user?.username,
                    email: user?.email,
                });
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await announcementApi.getActive();
            setAnnouncements(res || []);
        } catch (e) {}
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleLogout = () => {
        clearAuth();
        history.push('/login');
    };

    // --- Equipment Actions ---
    const handleBorrowClick = (eq: any) => {
        setSelectedEquipment(eq);
        setIsBorrowModalOpen(true);
    };

    const handleBorrowSubmit = async () => {
        try {
            const values = await borrowForm.validateFields();
            const [borrowDate, returnDate] = values.dateRange;
            
            // Kiểm tra thời hạn mượn (Tối đa 7 ngày theo quy định hệ thống)
            const durationInDays = returnDate.diff(borrowDate, 'day');
            if (durationInDays > 7) {
                message.error('Thời gian mượn không được vượt quá 7 ngày theo quy định của Câu lạc bộ!');
                return;
            }

            await loanRequestApi.create({
                userId: user.id,
                equipmentId: selectedEquipment.id,
                borrowDate: borrowDate.format('YYYY-MM-DD'),
                returnDate: returnDate.format('YYYY-MM-DD'),
            });

            message.success('Đã gửi yêu cầu mượn thiết bị! Vui lòng chờ Admin phê duyệt.');
            setIsBorrowModalOpen(false);
            borrowForm.resetFields();
            fetchData();
        } catch (e: any) {
            const errorMsg = e?.response?.data?.message || 'Lỗi khi gửi yêu cầu mượn';
            if (errorMsg.includes('must date before')) {
                message.error('Ngày trả phải nằm trong giới hạn cho phép (Tối đa 7 ngày kể từ ngày mượn).');
            } else {
                message.error(errorMsg);
            }
        }
    };

    // --- Community Actions ---
    const handleCreatePost = async () => {
        try {
            const values = await postForm.validateFields();
            await postApi.create({
                ...values,
                tags: values.tags || 'Thảo luận',
            });
            message.success('Đã đăng bài viết mới thành công!');
            setIsPostModalOpen(false);
            postForm.resetFields();
            fetchData();
        } catch (e) {
            message.error('Lỗi khi đăng bài');
        }
    };

    const handlePostClick = async (post: any) => {
        setSelectedPost(post);
        setIsPostDetailOpen(true);
        setCommentLoading(true);
        try {
            const res = await commentApi.getByPost(post.id);
            setComments(res || []);
        } catch (e) {}
        setCommentLoading(false);
    };

    const handleCommentSubmit = async () => {
        try {
            const values = await commentForm.validateFields();
            await commentApi.create(selectedPost.id, { content: values.content });
            commentForm.resetFields();
            // Refresh comments
            const res = await commentApi.getByPost(selectedPost.id);
            setComments(res || []);
            message.success('Đã gửi bình luận');
            // Update local post comment count for UI consistency
            setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, comments: (p.comments || 0) + 1 } : p));
        } catch (e) {}
    };

    const handleLike = async (e: React.MouseEvent, postId: number) => {
        e.stopPropagation();
        try {
            await postApi.upvote(postId);
            // Cập nhật state cục bộ để UI thay đổi ngay lập tức
            setPosts(posts.map(p => p.id === postId ? { ...p, positive: (p.positive || 0) + 1 } : p));
            if (selectedPost?.id === postId) {
                setSelectedPost({ ...selectedPost, positive: (selectedPost.positive || 0) + 1 });
            }
        } catch (e) {
            console.error("Error liking post:", e);
        }
    };

    // --- Account Actions ---
    const handleUpdateProfile = async () => {
        try {
            const values = await profileForm.validateFields();
            const updatedUser = await userApi.updateProfile(user.id, values);
            message.success('Cập nhật hồ sơ thành công!');
            // Update local storage and state
            const token = localStorage.getItem('auth_token') || '';
            const refreshToken = localStorage.getItem('auth_refresh_token') || '';
            setAuth(token, refreshToken, updatedUser);
            setUserState(updatedUser);
        } catch (e: any) {
            message.error(e?.response?.data?.message || 'Lỗi khi cập nhật hồ sơ');
        }
    };

    const uploadProps: UploadProps = {
        name: 'file',
        showUploadList: false,
        customRequest: async ({ file, onSuccess, onError }: any) => {
            try {
                const formData = new FormData();
                formData.append('file', file);
                const updatedUser = await userApi.uploadAvatar(user.id, formData);
                onSuccess(updatedUser);
                message.success('Cập nhật ảnh đại diện thành công!');
                
                const token = localStorage.getItem('auth_token') || '';
                const refreshToken = localStorage.getItem('auth_refresh_token') || '';
                setAuth(token, refreshToken, updatedUser);
                setUserState(updatedUser);
            } catch (e) {
                onError(e);
                message.error('Lỗi khi tải ảnh lên');
            }
        },
    };

    // --- Search Filtering ---
    const filteredEquipments = useMemo(() => {
        return equipments.filter(eq => 
            eq.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            eq.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [equipments, searchQuery]);

    const filteredRequests = useMemo(() => {
        return requests.filter(req => 
            req.equipment?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.status?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [requests, searchQuery]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => 
            post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [posts, searchQuery]);

    const renderEquipment = () => (
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1440px] mx-auto animate-in fade-in duration-500">
            {/* CỘT TRÁI: Danh sách thiết bị */}
            <div className="flex-1 flex flex-col gap-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Kho Thiết Bị</h2>
                        <p className="text-sm text-[#b9cac4]">{filteredEquipments.length} thiết bị phù hợp - <span className="text-[#00dfbe] font-bold" style={{ textShadow: '0 0 10px rgba(0, 229, 195, 0.5)' }}>{filteredEquipments.filter(e => e.status === 'Available').length} sẵn sàng</span></p>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <button className="px-4 py-1.5 rounded-full bg-[#00dfbe]/10 border border-[#00dfbe] text-[#00dfbe] text-sm whitespace-nowrap shadow-[0px_0px_15px_rgba(0,229,195,0.3)]">Tất cả</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#16202e] border border-white/5 text-[#b9cac4] hover:bg-[#2c3544] text-sm whitespace-nowrap transition-colors">Máy ảnh</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#16202e] border border-white/5 text-[#b9cac4] hover:bg-[#2c3544] text-sm whitespace-nowrap transition-colors">Âm thanh</button>
                    </div>
                </div>

                {filteredEquipments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEquipments.map(eq => (
                            <div key={eq.id} className={`bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden group cursor-pointer hover:border-[#00dfbe]/30 hover:shadow-[0px_10px_30px_rgba(0,229,195,0.15)] hover:-translate-y-1 transition-all ${eq.status !== 'Available' ? 'opacity-75 grayscale-[20%]' : ''}`}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00dfbe]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex justify-between items-start">
                                    <div className={`flex items-center gap-1.5 ${eq.status === 'Available' ? 'bg-[#00dfbe]/10 border-[#00dfbe]/30 text-[#00dfbe]' : 'bg-[#ffb4ab]/10 border-[#ffb4ab]/30 text-[#ffb4ab]'} border px-2.5 py-1 rounded-full`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${eq.status === 'Available' ? 'bg-[#00dfbe] animate-pulse' : 'bg-[#ffb4ab]'}`}></div>
                                        <span className="text-[10px] font-bold uppercase">{eq.status === 'Available' ? 'Sẵn sàng' : 'Bảo trì'}</span>
                                    </div>
                                    <span className="material-symbols-outlined text-[#00e5c3] text-2xl">photo_camera</span>
                                </div>
                                <div className={`h-32 w-full flex flex-col items-center justify-center py-4 border-b border-white/5 bg-[#121c29]/30 rounded-lg my-2 ${eq.status !== 'Available' ? 'opacity-50' : ''}`}>
                                    <span className="text-4xl font-bold text-[#00dfbe]/40 tracking-tighter">EQ-{eq.id}</span>
                                    <span className="text-[10px] text-[#b9cac4] font-mono uppercase tracking-[0.2em]">{eq.category}</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-white mb-2">{eq.name}</h3>
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] font-mono text-[#b9cac4]">
                                        <div className="flex flex-col"><span className="text-[9px] text-[#00dfbe]/60 uppercase">Tổng số</span><span>{eq.total}</span></div>
                                        <div className="flex flex-col"><span className="text-[9px] text-[#00dfbe]/60 uppercase">Sẵn có</span><span>{eq.available}</span></div>
                                    </div>
                                </div>
                                <div className="mt-auto pt-4 border-t border-white/5 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-[10px] text-white">{eq.name?.charAt(0)}</div>
                                        <span className="text-[11px] text-[#b9cac4]">Admin</span>
                                    </div>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleBorrowClick(eq); }} 
                                        disabled={eq.status !== 'Available'}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${eq.status === 'Available' ? 'bg-[#00dfbe]/20 text-[#00dfbe] border-[#00dfbe]/30 hover:bg-[#00dfbe] hover:text-[#00201a]' : 'bg-[#2c3544] text-[#b9cac4] border-white/5 cursor-not-allowed'}`}
                                    >
                                        {eq.status === 'Available' ? 'Đăng ký mượn' : 'Không khả dụng'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty description={<span className="text-[#b9cac4]">Không tìm thấy thiết bị nào phù hợp.</span>} />
                )}
            </div>

            {/* CỘT PHẢI: Sidebar (Cố định chiều rộng khoảng 360px trên màn hình lớn) */}
            <div className="w-full lg:w-[360px] shrink-0">
                <ForumSidebar onNavigate={(tab) => setActiveTab(tab)} />
            </div>
        </div>
    );

    const renderReservations = () => {
        const activeCount = requests.filter(r => r.status === 'Approved').length;
        const pendingCount = requests.filter(r => r.status === 'Pending').length;

        return (
            <div className="flex flex-col gap-8 w-full max-w-[1280px] mx-auto animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-[#00e5c3] shadow-[0_0_8px_#00e5c3]"></div>
                            <span className="text-sm text-[#00e5c3] uppercase tracking-widest font-bold">Trạm Hoạt Động</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">Quản lý Đăng ký</h2>
                    </div>

                    <div className="flex gap-4 p-2 bg-[#16202e]/40 border border-white/10 rounded-lg backdrop-blur-md">
                        <div className="flex flex-col px-2 border-r border-white/10">
                            <span className="text-xs text-[#b9cac4]">Đang mượn</span>
                            <span className="text-2xl font-bold text-[#28fedc]">{activeCount}</span>
                        </div>
                        <div className="flex flex-col px-2">
                            <span className="text-xs text-[#b9cac4]">Đang chờ</span>
                            <span className="text-2xl font-bold text-[#b6c8e4]">{pendingCount}</span>
                        </div>
                    </div>
                </div>

                {filteredRequests.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredRequests.map(req => (
                            <div key={req.id} className="flex flex-col bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-[#00e5c3]/50 hover:shadow-[0_0_20px_rgba(0,229,195,0.05)] transition-all duration-300 group cursor-pointer">
                                <div className="p-4 flex justify-between items-start border-b border-white/10 bg-[#121c29]/50">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[32px] text-[#b6c8e4] font-light">videocam</span>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#84948f] uppercase tracking-wider">THIẾT BỊ</span>
                                            <span className="text-xl font-mono text-white font-bold">{req.equipment?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded border flex items-center gap-2 ${req.status === 'Approved' ? 'border-[#00e5c3]/30 bg-[#00e5c3]/10 text-[#00dfbe]' : req.status === 'Pending' ? 'border-[#b6c8e4]/30 bg-[#b6c8e4]/10 text-[#b6c8e4]' : 'border-gray-500/30 bg-gray-500/10 text-gray-500'}`}>
                                        {req.status === 'Pending' && <div className="w-1.5 h-1.5 rounded-full bg-[#b6c8e4] animate-pulse"></div>}
                                        <span className="text-[10px] uppercase font-bold">{req.status === 'Approved' ? 'Đã duyệt' : req.status === 'Pending' ? 'Đang chờ' : req.status}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex-1 flex flex-col gap-4">
                                    <div className="flex items-center justify-between text-[#b9cac4] bg-[#0a1421]/50 p-3 rounded-lg border border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase text-[#00dfbe]/60 mb-1">Ngày mượn</span>
                                            <span className="text-sm font-mono">{req.borrowDate}</span>
                                        </div>
                                        <div className="h-8 w-px bg-white/10"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[9px] uppercase text-[#ffb4ab]/60 mb-1">Ngày trả dự kiến</span>
                                            <span className="text-sm font-mono">{req.returnDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-2 border-t border-white/10 bg-[#050f1b]/50">
                                    <button 
                                        onClick={() => { setSelectedRequest(req); setIsRequestDetailOpen(true); }}
                                        className="w-full py-2 rounded bg-[#0a1421] border border-[#3b4a45] hover:border-[#42fdda]/50 hover:text-[#42fdda] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="col-span-full p-20 text-center bg-[#16202e]/30 rounded-3xl border border-dashed border-white/10">
                        <span className="material-symbols-outlined text-6xl text-white/10 mb-4">history</span>
                        <p className="text-[#b9cac4]">Không tìm thấy yêu cầu mượn nào.</p>
                    </div>
                )}
            </div>
        );
    };

    const renderCommunity = () => (
        <div className="flex flex-col gap-8 w-full max-w-[1280px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-1">Cộng đồng thảo luận</h2>
                    <p className="text-sm text-[#b9cac4]">Chia sẻ kinh nghiệm và trao đổi về thiết bị</p>
                </div>
                <button 
                    onClick={() => setIsPostModalOpen(true)}
                    className="bg-[#00dfbe] text-[#00201a] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-[0px_0px_20px_rgba(0,229,195,0.4)] transition-all"
                >
                    <PlusOutlined /> Đăng bài mới
                </button>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {filteredPosts.map(post => (
                        <div 
                            key={post.id} 
                            onClick={() => handlePostClick(post)}
                            className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-[#00dfbe]/30 transition-all group cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Avatar src={post.author?.avatar} icon={<UserOutlined />} className="bg-[#2c3544]" />
                                    <div>
                                        <h4 className="text-white font-bold m-0">{post.author?.username || 'Thành viên'}</h4>
                                        <span className="text-[10px] text-[#b9cac4] uppercase tracking-tighter">{post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}</span>
                                    </div>
                                </div>
                                <Tag color="cyan" className="bg-[#00dfbe]/10 border-[#00dfbe]/30 text-[#00dfbe] rounded-full px-3">{post.category}</Tag>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00dfbe] transition-colors">{post.title}</h3>
                            <Paragraph className="text-[#b9cac4] text-sm leading-relaxed mb-6 line-clamp-3">
                                {post.content}
                            </Paragraph>
                            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                                <span 
                                    onClick={(e) => handleLike(e, post.id)}
                                    className="flex items-center gap-2 text-[#b9cac4] text-xs hover:text-[#00dfbe] transition-colors cursor-pointer"
                                >
                                    <LikeOutlined /> {post.positive || 0} Thích
                                </span>
                                <span className="flex items-center gap-2 text-[#b9cac4] text-xs hover:text-[#00dfbe] transition-colors">
                                    <MessageOutlined /> {post.comments || 0} Bình luận
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Empty description={<span className="text-[#b9cac4]">Không tìm thấy bài viết nào.</span>} />
            )}
        </div>
    );

    const renderAccount = () => (
        <div className="flex flex-col gap-8 w-full max-w-[1000px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative h-48 w-full rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00dfbe] to-[#006152] opacity-80"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-6 translate-y-1/2 md:translate-y-0">
                    <div className="relative group">
                        <Avatar 
                            size={120} 
                            src={user?.avatar} 
                            icon={<UserOutlined />} 
                            className="border-4 border-[#0a1421] shadow-2xl bg-[#16202e]"
                        />
                        <Upload {...uploadProps}>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <CameraOutlined className="text-white text-2xl" />
                            </div>
                        </Upload>
                    </div>
                    <div className="flex-1 pb-4">
                        <h2 className="text-3xl font-bold text-white mb-1">{user?.username}</h2>
                        <div className="flex items-center gap-2">
                            <Tag color="cyan" className="bg-white/10 border-white/20 text-white rounded-full px-4">{user?.role || 'Sinh viên'}</Tag>
                            <span className="text-white/60 text-xs flex items-center gap-1"><IdcardOutlined /> ID: {user?.id}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 md:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <Title level={4} className="!text-white !mb-8 flex items-center gap-2">
                            <IdcardOutlined className="text-[#00dfbe]" /> Thông tin cá nhân
                        </Title>
                        <Form form={profileForm} layout="vertical" className="custom-dark-form">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                                <Form.Item name="username" label="Tên người dùng" rules={[{ required: true }]}>
                                    <Input prefix={<UserOutlined className="text-white/20" />} className="bg-white/5 border-white/10 text-white h-11 rounded-xl" />
                                </Form.Item>
                                <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email' }]}>
                                    <Input prefix={<MailOutlined className="text-white/20" />} className="bg-white/5 border-white/10 text-white h-11 rounded-xl" />
                                </Form.Item>
                            </div>
                            <Button 
                                type="primary" 
                                onClick={handleUpdateProfile}
                                className="mt-4 bg-[#00dfbe] text-[#00201a] border-none font-bold h-11 px-8 rounded-xl hover:shadow-[0_0_20px_rgba(0,229,195,0.4)]"
                            >
                                Lưu thay đổi
                            </Button>
                        </Form>
                    </div>

                    <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                        <Title level={4} className="!text-white !mb-8 flex items-center gap-2">
                            <KeyOutlined className="text-[#ffb4ab]" /> Bảo mật
                        </Title>
                        <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/5">
                            <div>
                                <h4 className="text-white font-bold mb-1">Mật khẩu</h4>
                                <p className="text-xs text-[#b9cac4] m-0">Thay đổi mật khẩu đăng nhập định kỳ để bảo vệ tài khoản</p>
                            </div>
                            <Button ghost className="border-[#00dfbe] text-[#00dfbe] rounded-xl font-bold">Đổi mật khẩu</Button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <Title level={5} className="!text-[#b9cac4] !mb-6 !text-xs uppercase tracking-widest opacity-70">Hoạt động</Title>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#b9cac4]">Ngày tham gia</span>
                                <span className="text-sm text-white font-mono">{user?.createdAt || '2024-01-15'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#b9cac4]">Số bài viết</span>
                                <span className="text-sm text-white font-bold">{posts.filter(p => p.author?.id === user?.id).length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#b9cac4]">Lượt mượn đồ</span>
                                <span className="text-sm text-white font-bold">{requests.length}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#16202e]/60 to-[#0a1421]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                            <SendOutlined style={{ fontSize: '100px' }} />
                        </div>
                        <h4 className="text-[#00dfbe] font-bold mb-2">Hỗ trợ sinh viên</h4>
                        <p className="text-xs text-[#b9cac4] leading-relaxed mb-4">Bạn gặp khó khăn trong việc mượn thiết bị? Liên hệ ngay với chúng tôi.</p>
                        <Button type="link" className="p-0 text-white font-bold hover:text-[#00dfbe]">Gửi yêu cầu hỗ trợ →</Button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm, token: { colorPrimary: '#00dfbe' } }}>
            <div className="flex h-screen overflow-hidden bg-[#0a1421] text-[#d9e3f6] font-sans" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 223, 190, 0.03) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                
                {/* Desktop SideNav */}
                <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 h-screen bg-[#050f1b] border-r border-white/5 p-6 z-40">
                    <div className="flex items-center gap-3 mb-12 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00dfbe] to-[#006152] flex items-center justify-center shadow-lg shadow-[#00dfbe]/20">
                            <span className="material-symbols-outlined text-white text-2xl">videocam</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white tracking-tight">PTIT Club</h1>
                            <p className="text-[9px] text-[#00dfbe] font-bold uppercase tracking-[0.2em]">User Portal</p>
                        </div>
                    </div>

                    <nav className="flex-1 flex flex-col gap-2">
                        <a onClick={() => setActiveTab('dashboard')} className={`flex items-center p-3 gap-3 rounded-xl transition-all cursor-pointer group ${activeTab === 'dashboard' ? 'bg-[#00dfbe]/10 text-[#00dfbe]' : 'text-[#b9cac4] hover:bg-white/5'}`}>
                            <DashboardOutlined className="text-xl" />
                            <span className="text-sm font-bold">Tổng quan</span>
                        </a>
                        <a onClick={() => setActiveTab('equipment')} className={`flex items-center p-3 gap-3 rounded-xl transition-all cursor-pointer group ${activeTab === 'equipment' ? 'bg-[#00dfbe]/10 text-[#00dfbe]' : 'text-[#b9cac4] hover:bg-white/5'}`}>
                            <CarryOutOutlined className="text-xl" />
                            <span className="text-sm font-bold">Kho thiết bị</span>
                        </a>
                        <a onClick={() => setActiveTab('reservations')} className={`flex items-center p-3 gap-3 rounded-xl transition-all cursor-pointer group ${activeTab === 'reservations' ? 'bg-[#00dfbe]/10 text-[#00dfbe]' : 'text-[#b9cac4] hover:bg-white/5'}`}>
                            <FileTextOutlined className="text-xl" />
                            <span className="text-sm font-bold">Yêu cầu mượn</span>
                        </a>
                        <a onClick={() => setActiveTab('community')} className={`flex items-center p-3 gap-3 rounded-xl transition-all cursor-pointer group ${activeTab === 'community' ? 'bg-[#00dfbe]/10 text-[#00dfbe]' : 'text-[#b9cac4] hover:bg-white/5'}`}>
                            <CommentOutlined className="text-xl" />
                            <span className="text-sm font-bold">Cộng đồng</span>
                        </a>
                        <a onClick={() => setActiveTab('account')} className={`flex items-center p-3 gap-3 rounded-xl transition-all cursor-pointer group ${activeTab === 'account' ? 'bg-[#00dfbe]/10 text-[#00dfbe]' : 'text-[#b9cac4] hover:bg-white/5'}`}>
                            <UserOutlined className="text-xl" />
                            <span className="text-sm font-bold">Tài khoản</span>
                        </a>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button onClick={handleLogout} className="w-full flex items-center p-3 gap-3 text-[#ffb4ab] hover:bg-[#ffb4ab]/10 rounded-xl transition-all cursor-pointer">
                            <LogoutOutlined className="text-xl" />
                            <span className="text-sm font-bold">Đăng xuất</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
                    <header className="h-20 bg-[#0a1421]/50 backdrop-blur-md border-b border-white/5 px-8 flex justify-between items-center z-30">
                        <div className="flex-1 max-w-xl relative group hidden md:block">
                            <SearchOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b9cac4] text-xl" />
                            <input 
                                className="w-full bg-[#16202e] border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#00dfbe]/50 focus:ring-4 focus:ring-[#00dfbe]/5 transition-all text-white" 
                                placeholder={`Tìm nhanh trong ${activeTab === 'dashboard' ? 'Tổng quan' : activeTab === 'equipment' ? 'Kho thiết bị' : activeTab === 'reservations' ? 'Yêu cầu' : activeTab === 'community' ? 'Cộng đồng' : 'Cài đặt'}...`} 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-6">
                            <Badge count={announcements.length} overflowCount={9} size="small">
                                <button 
                                    onClick={() => setIsNotificationOpen(true)}
                                    className="p-2.5 rounded-xl bg-[#16202e] border border-white/5 text-[#b9cac4] hover:text-[#00dfbe] transition-all"
                                >
                                    <BellOutlined className="text-xl" />
                                </button>
                            </Badge>
                            <div className="flex items-center gap-4 pl-4 border-l border-white/5">
                                <div className="flex flex-col items-right text-right hidden sm:block">
                                    <span className="text-sm font-bold text-white leading-none mb-1">{user?.username}</span>
                                    <span className="text-[10px] text-[#00dfbe] font-bold uppercase tracking-wider">{user?.role || 'Sinh viên'}</span>
                                </div>
                                <div onClick={() => setActiveTab('account')} className="w-10 h-10 rounded-xl bg-[#2c3544] border border-white/10 flex items-center justify-center font-bold text-[#00dfbe] cursor-pointer hover:border-[#00dfbe]/50 transition-all overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.username?.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </header>
                    
                    <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                        <Spin spinning={loading} size="large">
                            {activeTab === 'dashboard' && <DashboardOverview onNavigate={(tab) => setActiveTab(tab)} />}
                            {activeTab === 'equipment' && renderEquipment()}
                            {activeTab === 'reservations' && renderReservations()}
                            {activeTab === 'community' && renderCommunity()}
                            {activeTab === 'account' && renderAccount()}
                        </Spin>
                    </main>
                </div>
            </div>

            {/* Notification Drawer */}
            <Drawer
                title={<span className="text-white font-bold flex items-center gap-2"><BellOutlined /> Thông báo từ Admin</span>}
                placement="right"
                onClose={() => setIsNotificationOpen(false)}
                open={isNotificationOpen}
                className="custom-dark-drawer"
                width={400}
            >
                <div className="flex flex-col gap-4">
                    {announcements.length > 0 ? (
                        announcements.map(ann => (
                            <div key={ann.id} className="p-4 rounded-2xl bg-[#16202e] border border-white/10 hover:border-[#00dfbe]/30 transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-[#00dfbe] font-bold m-0">{ann.title}</h4>
                                    <Tag color="blue" className="text-[9px] m-0">{new Date(ann.createdAt).toLocaleDateString('vi-VN')}</Tag>
                                </div>
                                <p className="text-sm text-[#b9cac4] leading-relaxed m-0">{ann.content}</p>
                            </div>
                        ))
                    ) : (
                        <Empty description={<span className="text-[#b9cac4]">Không có thông báo mới.</span>} />
                    )}
                </div>
            </Drawer>

            {/* Post Detail & Comments Modal */}
            <Modal
                title={<span className="text-white font-bold">Thảo luận cộng đồng</span>}
                open={isPostDetailOpen}
                onCancel={() => setIsPostDetailOpen(false)}
                footer={null}
                centered
                width={800}
                className="custom-dark-modal no-footer-modal"
            >
                {selectedPost && (
                    <div className="flex flex-col gap-6 py-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar src={selectedPost.author?.avatar} icon={<UserOutlined />} className="bg-[#2c3544]" />
                                <div>
                                    <h4 className="text-white font-bold m-0">{selectedPost.author?.username}</h4>
                                    <span className="text-xs text-[#b9cac4]">{new Date(selectedPost.createdAt).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </div>
                            <Tag color="cyan">{selectedPost.category}</Tag>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
                            <Paragraph className="text-[#b9cac4] text-base leading-relaxed">
                                {selectedPost.content}
                            </Paragraph>
                        </div>
                        
                        <div className="flex items-center gap-6 py-2">
                            <span 
                                onClick={(e) => handleLike(e, selectedPost.id)}
                                className="flex items-center gap-2 text-[#b9cac4] text-sm hover:text-[#00dfbe] transition-colors cursor-pointer"
                            >
                                <LikeOutlined /> {selectedPost.positive || 0} Thích
                            </span>
                            <span className="flex items-center gap-2 text-[#b9cac4] text-sm">
                                <MessageOutlined /> {comments.length} Bình luận
                            </span>
                        </div>
                        
                        <Divider className="border-white/10 my-0" />
                        
                        <div className="flex flex-col gap-4">
                            <h3 className="text-white font-bold m-0 flex items-center gap-2">
                                <MessageOutlined /> Bình luận ({comments.length})
                            </h3>
                            
                            <Form form={commentForm} onFinish={handleCommentSubmit} className="flex gap-2">
                                <Form.Item name="content" className="flex-1 m-0" rules={[{ required: true, message: 'Nhập bình luận...' }]}>
                                    <Input 
                                        placeholder="Viết bình luận của bạn..." 
                                        className="bg-[#16202e] border-white/10 text-white py-2 rounded-xl"
                                        onPressEnter={() => commentForm.submit()}
                                    />
                                </Form.Item>
                                <Button type="primary" htmlType="submit" icon={<SendOutlined />} className="h-auto px-6 rounded-xl bg-[#00dfbe] text-[#00201a] border-none font-bold">
                                    Gửi
                                </Button>
                            </Form>

                            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mt-4">
                                <Spin spinning={commentLoading}>
                                    {comments.length > 0 ? (
                                        comments.map(c => (
                                            <div key={c.id} className="flex gap-3 animate-in slide-in-from-bottom-2 duration-300">
                                                <Avatar size="small" icon={<UserOutlined />} className="bg-[#2c3544] shrink-0" />
                                                <div className="flex-1 bg-white/5 rounded-2xl p-3 border border-white/5">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-xs font-bold text-[#00dfbe]">{c.author?.username}</span>
                                                        <span className="text-[10px] text-[#b9cac4]">{new Date(c.createdAt).toLocaleString('vi-VN')}</span>
                                                    </div>
                                                    <p className="text-sm text-white m-0 leading-relaxed">{c.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-[#b9cac4] text-sm">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
                                    )}
                                </Spin>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Loan Request Detail Modal */}
            <Modal
                title={<span className="text-white font-bold flex items-center gap-2"><InfoCircleOutlined /> Chi tiết yêu cầu mượn</span>}
                open={isRequestDetailOpen}
                onCancel={() => setIsRequestDetailOpen(false)}
                footer={null}
                centered
                width={600}
                className="custom-dark-modal no-footer-modal"
            >
                {selectedRequest && (
                    <div className="py-4">
                        <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="w-16 h-16 rounded-xl bg-[#00dfbe]/20 flex items-center justify-center">
                                <CarryOutOutlined className="text-3xl text-[#00dfbe]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white m-0">{selectedRequest.equipment?.name}</h3>
                                <Text className="text-[#b9cac4] text-xs uppercase tracking-wider">{selectedRequest.equipment?.category}</Text>
                            </div>
                        </div>

                        <Descriptions column={1} className="custom-dark-descriptions">
                            <Descriptions.Item label={<span className="flex items-center gap-2"><IdcardOutlined /> Mã yêu cầu</span>}>
                                <span className="text-white font-mono">REQ-{selectedRequest.id}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className="flex items-center gap-2"><CalendarOutlined /> Thời gian mượn</span>}>
                                <div className="flex flex-col">
                                    <Text className="text-white font-bold">{selectedRequest.borrowDate}</Text>
                                    <Text className="text-[10px] text-[#b9cac4]">đến {selectedRequest.returnDate}</Text>
                                </div>
                            </Descriptions.Item>
                            <Descriptions.Item label={<span className="flex items-center gap-2"><InfoCircleOutlined /> Trạng thái</span>}>
                                <Tag 
                                    color={selectedRequest.status === 'Approved' ? 'success' : selectedRequest.status === 'Pending' ? 'processing' : 'error'}
                                    className="rounded-full px-3"
                                    icon={selectedRequest.status === 'Approved' ? <CheckCircleOutlined /> : selectedRequest.status === 'Pending' ? <ClockCircleOutlined /> : <CloseCircleOutlined />}
                                >
                                    {selectedRequest.status === 'Approved' ? 'Đã phê duyệt' : selectedRequest.status === 'Pending' ? 'Đang chờ xử lý' : selectedRequest.status === 'Rejected' ? 'Bị từ chối' : 'Đã trả'}
                                </Tag>
                            </Descriptions.Item>
                            {selectedRequest.rejectReason && (
                                <Descriptions.Item label={<span className="flex items-center gap-2 text-[#ffb4ab]"><CloseCircleOutlined /> Lý do từ chối</span>}>
                                    <div className="p-3 bg-[#ffb4ab]/10 border border-[#ffb4ab]/20 rounded-xl">
                                        <Text className="text-[#ffb4ab] text-sm">{selectedRequest.rejectReason}</Text>
                                    </div>
                                </Descriptions.Item>
                            )}
                            <Descriptions.Item label={<span className="flex items-center gap-2"><ClockCircleOutlined /> Ngày tạo</span>}>
                                <span className="text-[#b9cac4]">{new Date(selectedRequest.createdAt).toLocaleString('vi-VN')}</span>
                            </Descriptions.Item>
                        </Descriptions>

                        <div className="mt-8 flex gap-3">
                            <Button block onClick={() => setIsRequestDetailOpen(false)} className="h-11 rounded-xl bg-white/5 border-white/10 text-white font-bold">
                                Đóng
                            </Button>
                            {selectedRequest.status === 'Pending' && (
                                <Button block danger className="h-11 rounded-xl font-bold">
                                    Hủy yêu cầu
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Borrow Modal */}
            <Modal
                title={<span className="text-white font-bold">Mượn thiết bị</span>}
                open={isBorrowModalOpen}
                onOk={handleBorrowSubmit}
                onCancel={() => setIsBorrowModalOpen(false)}
                okText="Gửi yêu cầu"
                cancelText="Hủy"
                centered
                className="custom-dark-modal"
            >
                <div className="mb-6 mt-4">
                    <p className="text-[#b9cac4] text-xs uppercase font-bold mb-1">Thiết bị đang chọn</p>
                    <p className="text-white font-bold text-lg">{selectedEquipment?.name}</p>
                </div>
                <Form form={borrowForm} layout="vertical">
                    <Form.Item 
                        name="dateRange" 
                        label="Thời gian mượn - trả" 
                        rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                    >
                        <DatePicker.RangePicker 
                            className="w-full bg-[#16202e] border-white/10 text-white" 
                            format="YYYY-MM-DD"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Create Post Modal */}
            <Modal
                title={<span className="text-white font-bold">Soạn bài thảo luận mới</span>}
                open={isPostModalOpen}
                onOk={handleCreatePost}
                onCancel={() => setIsPostModalOpen(false)}
                okText="Đăng bài"
                cancelText="Hủy"
                centered
                width={600}
                className="custom-dark-modal"
            >
                <Form form={postForm} layout="vertical" className="mt-6">
                    <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                        <Input placeholder="Nhập tiêu đề thảo luận..." className="bg-[#16202e] border-white/10 text-white" />
                    </Form.Item>
                    <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}>
                        <Input placeholder="Ví dụ: Review máy ảnh, Hỏi đáp..." className="bg-[#16202e] border-white/10 text-white" />
                    </Form.Item>
                    <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                        <Input.TextArea rows={6} placeholder="Chia sẻ ý kiến của bạn..." className="bg-[#16202e] border-white/10 text-white" />
                    </Form.Item>
                </Form>
            </Modal>

            <style>{`
                .custom-dark-modal .ant-modal-content, .custom-dark-drawer .ant-drawer-content {
                    background: #0a1421 !important;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .custom-dark-modal .ant-modal-content {
                    border-radius: 24px;
                }
                .custom-dark-drawer .ant-drawer-header {
                    background: #050f1b !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .custom-dark-modal .ant-modal-header {
                    background: transparent !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                }
                .custom-dark-modal .ant-form-item-label label {
                    color: #b9cac4 !important;
                }
                .custom-dark-modal .ant-modal-footer .ant-btn-default {
                    background: transparent !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                    color: white !important;
                }
                .custom-dark-modal .ant-picker {
                    background: #16202e !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
                .custom-dark-modal .ant-picker-input > input {
                    color: white !important;
                }
                .custom-dark-modal .ant-picker-separator {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 223, 190, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 223, 190, 0.3);
                }
                .custom-dark-drawer .ant-drawer-body {
                    background: #0a1421;
                }
                .no-footer-modal .ant-modal-footer {
                    display: none;
                }
                .custom-dark-form .ant-form-item-label label {
                    color: #b9cac4 !important;
                    font-weight: 600;
                    font-size: 13px;
                }
                .custom-dark-descriptions .ant-descriptions-item-label {
                    color: #b9cac4 !important;
                    padding-bottom: 16px;
                }
                .custom-dark-descriptions .ant-descriptions-item-content {
                    color: white !important;
                    padding-bottom: 16px;
                }
            `}</style>
        </ConfigProvider>
    );
﻿import React, { useMemo, useState, useEffect } from 'react';
import { ProLayout, PageContainer } from '@ant-design/pro-components';
import { Typography, Button, Row, Col, Card, Tag, Space, Dropdown, Alert, Skeleton, Empty, Avatar, Form, Input, Modal, message, Drawer, Badge } from 'antd';
import { history, useLocation } from '@umijs/max';
import { 
  LaptopOutlined, 
  HistoryOutlined, 
  LogoutOutlined,
  UserOutlined,
  RocketOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { clearAuth, getUser, loanRequestApi, penaltyApi, announcementApi, postApi } from '@/services/api';

import EquipmentList from './equipment';
import BorrowHistory from './history';
import ClientAccount from './account';
import ClientPenalties from './penalties';

const { Paragraph } = Typography;

// CSS Animations
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
  }

  .animateIn {
    animation: fadeInUp 0.6s ease-out;
  }

  .animateInDelay1 {
    animation: fadeInUp 0.6s ease-out 0.1s both;
  }

  .animateInDelay2 {
    animation: fadeInUp 0.6s ease-out 0.2s both;
  }

  .animateInDelay3 {
    animation: fadeInUp 0.6s ease-out 0.3s both;
  }

  .cardHover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .cardHover:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

  .statCard {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    padding: 24px;
    color: white;
    transition: all 0.3s ease;
  }

  .statCard:hover {
    transform: scale(1.05);
  }

  .statCard:nth-child(2) {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .heroSection {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
  }

  .heroSection::before {
    content: '';
    position: absolute;
    top: 0;
    right: -100px;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }

  .featureCard {
    border: none;
    border-radius: 16px;
    transition: all 0.3s ease;
    overflow: hidden;
  }

  .featureCard::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .featureCard:hover::before {
    opacity: 1;
  }
`;

const normalizeStatus = (status: string | undefined) => status?.toString().trim().toLowerCase();

const ClientHome: React.FC = () => {
  const location = useLocation();
  const currentUser = getUser();
  const currentUserLabel =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    currentUser?.email ||
    'Sinh viên';

  const currentTab = useMemo(() => {
    const query = new URLSearchParams(location.search);
    const tab = query.get('tab');
    if (tab === 'equipment' || tab === 'history' || tab === 'account' || tab === 'penalties') {
      return tab;
    }
    return 'dashboard';
  }, [location.search]);

  const handleLogout = () => {
    clearAuth();
    history.push('/login');
  };

  // States for dashboard data
  const [loans, setLoans] = useState<any[]>([]);
  const [penalties, setPenalties] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [createPostLoading, setCreatePostLoading] = useState(false);
  const [postForm] = Form.useForm();

  const loadAnnouncements = async () => {
    try {
      setNotificationsLoading(true);
      const data = await announcementApi.getActive();
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(true);
    if (!announcements.length) {
      loadAnnouncements();
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [loansData, penaltiesData, announcementsData, postsData] = await Promise.all([
          loanRequestApi.getMyRequests(),
          penaltyApi.getMyPenalties(),
          announcementApi.getActive(),
          postApi.getAll(),
        ]);
        setLoans(Array.isArray(loansData) ? loansData : []);
        setPenalties(Array.isArray(penaltiesData) ? penaltiesData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
        setPosts(Array.isArray(postsData) ? postsData : []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (currentTab === 'dashboard') {
      fetchData();
    }
  }, [currentTab]);

  useEffect(() => {
    if (!announcements.length) {
      loadAnnouncements();
    }
  }, []);

  const handleCreatePost = async () => {
    try {
      const values = await postForm.validateFields();
      const user = getUser();
      if (!user) {
        message.error('Vui lòng đăng nhập để đăng bài');
        return;
      }
      setCreatePostLoading(true);
      await postApi.create({
        title: values.title,
        content: values.content,
        category: values.category,
        tags: values.tags || 'Thảo luận',
      });
      message.success('Đã đăng bài viết mới thành công!');
      postForm.resetFields();
      setPostModalOpen(false);
      const refreshedPosts = await postApi.getAll();
      setPosts(Array.isArray(refreshedPosts) ? refreshedPosts : []);
    } catch (error: any) {
      console.error(error);
      message.error(error?.message || 'Đăng bài thất bại');
    } finally {
      setCreatePostLoading(false);
    }
  };

  const renderContent = () => {
    if (currentTab === 'equipment') {
      return <EquipmentList />;
    }
    if (currentTab === 'history') {
      return <BorrowHistory />;
    }
    if (currentTab === 'account') {
      return <ClientAccount />;
    }
    if (currentTab === 'penalties') {
      return <ClientPenalties />;
    }

    return (
      <>
        <style>{animationStyles}</style>
        
        {/* Hero Section */}
        <div className="animateIn" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '48px 32px',
          color: 'white',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Typography.Title level={1} style={{ margin: '0 0 16px', color: 'white', fontSize: '2.5rem' }}>
              Chào mừng, {currentUserLabel}! 👋
            </Typography.Title>
            <Typography.Paragraph style={{ fontSize: '18px', lineHeight: 1.8, marginBottom: '32px', color: 'rgba(255, 255, 255, 0.9)' }}>
              Quản lý mượn trả thiết bị nhanh chóng, dễ dàng và hiệu quả. Theo dõi yêu cầu, lịch sử mượn và nhận thông báo tức thời.
            </Typography.Paragraph>
            <Space wrap style={{ gap: '12px' }}>
              <Button type="primary" size="large" onClick={() => history.push('/client-home?tab=equipment')} style={{
                backgroundColor: '#fff',
                color: '#667eea',
                border: 'none',
                fontWeight: '600',
                height: '44px'
              }}>
                🎁 Đăng ký mượn thiết bị
              </Button>
              <Button size="large" onClick={() => history.push('/client-home?tab=history')} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                fontWeight: '600',
                height: '44px'
              }}>
                📋 Xem lịch sử mượn
              </Button>
            </Space>
          </div>
          <div style={{
            position: 'absolute',
            top: '-100px',
            right: '-50px',
            width: '400px',
            height: '400px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            filter: 'blur(40px)'
          }} />
        </div>

        {/* Stats Section */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={24} sm={8}>
            <div className="animateInDelay1 statCard">
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>📌 Đang mượn</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : loans.filter((l: any) => normalizeStatus(l.status) === 'approved').length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>thiết bị</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="animateInDelay2 statCard">
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>⏳ Chờ duyệt</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : loans.filter((l: any) => normalizeStatus(l.status) === 'pending').length}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>phiếu</div>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="animateInDelay3 statCard" style={{ background: penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') ? 'linear-gradient(135deg, #f5576c 0%, #fd7272 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
              <div style={{ marginBottom: '12px', fontSize: '14px', opacity: 0.9 }}>💸 Nợ phạt</div>
              <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '4px' }}>
                {loading ? <Skeleton active /> : penalties.filter((p: any) => normalizeStatus(p.status) === 'unpaid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>đ</div>
            </div>
          </Col>
        </Row>

        {/* Alert Section */}
        {!loading && (penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') || loans.some((l: any) => normalizeStatus(l.status) === 'approved' && new Date(l.returnDate) < new Date())) && (
          <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
            {penalties.some((p: any) => normalizeStatus(p.status) === 'unpaid') && (
              <Col xs={24}>
                <Alert
                  message="⚠️ Bạn có tiền phạt chưa nộp"
                  description={`Tổng tiền phạt nợ: ${penalties.filter((p: any) => normalizeStatus(p.status) === 'unpaid').reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toLocaleString()} đ. Vui lòng liên hệ Admin để giải quyết.`}
                  type="error"
                  showIcon
                  action={<Button size="small" danger onClick={() => history.push('/client-home?tab=penalties')}>Xem chi tiết</Button>}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            )}
            {loans.some((l: any) => normalizeStatus(l.status) === 'approved' && new Date(l.returnDate) < new Date()) && (
              <Col xs={24}>
                <Alert
                  message="❗ Bạn có thiết bị sắp/quá hạn trả"
                  description="Vui lòng trả thiết bị sớm để tránh bị phạt."
                  type="warning"
                  showIcon
                  action={<Button size="small" onClick={() => history.push('/client-home?tab=history')}>Xem lịch sử</Button>}
                  style={{ borderRadius: '8px' }}
                />
              </Col>
            )}
          </Row>
        )}

        {/* Features Grid */}
        <div style={{ marginBottom: '32px' }}>
          <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>✨ Tính năng nổi bật</Typography.Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card className="animateInDelay1 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<LaptopOutlined style={{ fontSize: 32, color: '#667eea' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Quản lý thiết bị</span>}
                  description="Tìm kiếm, xem chi tiết và gửi yêu cầu mượn trực tiếp trong hệ thống."
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card className="animateInDelay2 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<HistoryOutlined style={{ fontSize: 32, color: '#f5576c' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Theo dõi lịch sử</span>}
                  description="Xem toàn bộ lịch sử mượn trả, trạng thái duyệt và thời hạn trả."
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card id="systemNotificationsSection" className="animateInDelay3 featureCard cardHover" bordered={false} style={{ 
                borderRadius: '16px',
                height: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                position: 'relative'
              }}>
                <Card.Meta
                  avatar={<BellOutlined style={{ fontSize: 32, color: '#faad14' }} />}
                  title={<span style={{ fontSize: '16px', fontWeight: '600' }}>Thông báo hệ thống</span>}
                  description="Nhận tin quan trọng từ Admin về lịch nghỉ, quy định và cập nhật kho."
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* Community Section */}
        <div style={{ marginBottom: '32px' }}>
          <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>💬 Cộng đồng thảo luận</Typography.Title>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button type="primary" onClick={() => setPostModalOpen(true)}>
              <RocketOutlined /> Đăng bài nhanh
            </Button>
            {loading ? (
              <Skeleton active />
            ) : posts.length > 0 ? (
              posts.slice(0, 3).map((post: any) => (
                <Card className="cardHover" key={post.id} style={{ borderRadius: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>{post.title}</Typography.Title>
                      <Space size="small" wrap>
                        <Tag color="magenta">{post.category}</Tag>
                        {(post.tags || 'Chia sẻ').split(',').map((tag: string) => (
                          <Tag key={tag}>{tag.trim()}</Tag>
                        ))}
                      </Space>
                      <Typography.Paragraph style={{ margin: '10px 0 0 0', color: '#555' }} ellipsis={{ rows: 2, expandable: false }}>
                        {post.content}
                      </Typography.Paragraph>
                    </div>
                    <Avatar size="large" icon={<UserOutlined />} />
                  </div>
                </Card>
              ))
            ) : (
              <Empty description="Chưa có bài viết nào. Hãy tạo bài đầu tiên!" />
            )}
            <Button type="link" onClick={() => history.push('/forum')}>
              Xem toàn bộ bài viết cộng đồng →
            </Button>
          </Space>
        </div>

        <Modal
          title="Tạo bài thảo luận mới"
          open={postModalOpen}
          onOk={handleCreatePost}
          onCancel={() => setPostModalOpen(false)}
          confirmLoading={createPostLoading}
          okText="Đăng bài"
          cancelText="Hủy"
          destroyOnClose
        >
          <Form form={postForm} layout="vertical">
            <Form.Item
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input placeholder="Tiêu đề bài viết" />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}
            >
              <Input placeholder="Ví dụ: Kinh nghiệm mượn, Báo lỗi thiết bị" />
            </Form.Item>
            <Form.Item name="tags" label="Nhãn tags">
              <Input placeholder="Ví dụ: màn hình, laptop, máy chiếu" />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <Input.TextArea rows={4} placeholder="Mô tả chi tiết vấn đề hoặc chia sẻ của bạn" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Announcements Section */}
        {!loading && announcements && announcements.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <Typography.Title level={3} style={{ marginBottom: '20px', fontSize: '20px' }}>ℹ️ Thông báo từ Admin</Typography.Title>
            <Row gutter={[24, 24]}>
              {announcements.slice(0, 3).map((announcement: any) => (
                <Col xs={24} key={announcement.id}>
                  <Card className="cardHover" style={{ borderRadius: '12px', borderLeft: '4px solid #667eea' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <Typography.Title level={4} style={{ margin: '0 0 8px 0' }}>
                          📰 {announcement.title}
                        </Typography.Title>
                        <Typography.Paragraph style={{ margin: '0 0 8px 0', color: '#666' }}>
                          {announcement.content?.substring(0, 100)}...
                        </Typography.Paragraph>
                        <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                          {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                        </Typography.Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        <Drawer
          title={`Thông báo hệ thống (${announcements.length})`}
          placement="right"
          width={420}
          onClose={() => setNotificationsOpen(false)}
          open={notificationsOpen}
        >
          {notificationsLoading ? (
            <Skeleton active />
          ) : announcements.length > 0 ? (
            announcements.map((announcement: any) => (
              <Card
                key={announcement.id}
                size="small"
                style={{ marginBottom: 16, borderRadius: 12 }}
                bodyStyle={{ padding: 16 }}
              >
                <Typography.Title level={5} style={{ marginBottom: 8 }}>
                  📰 {announcement.title}
                </Typography.Title>
                <Typography.Paragraph style={{ marginBottom: 12, color: '#555' }}>
                  {announcement.content}
                </Typography.Paragraph>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(announcement.createdAt).toLocaleDateString('vi-VN')}
                </Typography.Text>
              </Card>
            ))
          ) : (
            <Empty description="Không có thông báo mới" />
          )}
        </Drawer>

        {/* Footer */}
        <div style={{ marginTop: '40px', textAlign: 'center', color: '#8c8c8c', animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
          <Paragraph>© 2026 Hệ thống quản lý mượn trả thiết bị — Tiện lợi, trực quan và chính xác.</Paragraph>
        </div>
      </>
    );
  };

  return (
    <div style={{ height: '100vh', background: '#f5f7fa' }}>
      <ProLayout
        title="CLB Thiết Bị"
        logo="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
        layout="top"
        navTheme="light"
        fixedHeader
        selectedKeys={[currentTab]}
        menuDataRender={() => []}
        avatarProps={{
          icon: <UserOutlined />,
          size: 'small',
          title: currentUserLabel,
          render: (_, avatarDom) => (
            <Space size="middle">
              <Badge count={announcements.length} size="small">
                <Button
                  type="text"
                  icon={<BellOutlined style={{ fontSize: 18, color: '#1890ff' }} />}
                  onClick={handleNotificationsClick}
                />
              </Badge>
              <Dropdown
                menu={{
                  items: [
                  {
                    key: 'info',
                    label: (
                      <div style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>
                          {currentUser?.fullName || currentUser?.username || 'Người dùng'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                          <Tag color="blue" style={{ marginRight: 0 }}>
                            {currentUser?.role || 'Student'}
                          </Tag>
                        </div>
                        {currentUser?.email && (
                          <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                            ✉️ {currentUser.email}
                          </div>
                        )}
                      </div>
                    ),
                    disabled: true,
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'account',
                    label: '⚙️ Cài đặt tài khoản',
                    onClick: () => history.push('/client-home?tab=account'),
                  },
                  {
                    key: 'forum',
                    label: '💬 Diễn đàn sinh viên',
                    onClick: () => history.push('/forum'),
                  },
                  {
                    key: 'penalties',
                    label: '💳 Phiếu phạt & Vi phạm',
                    onClick: () => history.push('/client-home?tab=penalties'),
                  },
                  {
                    type: 'divider',
                  },
                  {
                    key: 'logout',
                    label: (
                      <Button
                        type="text"
                        danger
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ width: '100%', textAlign: 'left' }}
                      >
                        Đăng xuất
                      </Button>
                    ),
                    disabled: false,
                  },
                ],
              }}
            >
              {avatarDom}
            </Dropdown>
          </Space>
          ),
        }}
      >
        <PageContainer
        title={
          currentTab === 'equipment' ? 'Đăng ký mượn thiết bị' : 
          currentTab === 'history' ? 'Nhật ký mượn đồ cá nhân' :
          currentTab === 'account' ? 'Cài đặt tài khoản' :
          currentTab === 'penalties' ? 'Lịch sử vi phạm & Phạt' : 'Bảng điều khiển'
        }
      >
          {renderContent()}
        </PageContainer>
      </ProLayout>
    </div>
  );
};

export default ClientHome;

