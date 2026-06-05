import React, { useState, useEffect } from 'react';
import { Skeleton, Avatar, Tag, Space, Typography, Badge } from 'antd';
import { CommentOutlined, LikeOutlined, NotificationOutlined, MessageOutlined, ShareAltOutlined, UserOutlined } from '@ant-design/icons';
import { equipmentApi, postApi } from '@/services/api';

const { Text, Title } = Typography;

// --- Interfaces ---
export interface StatsData {
    availableCount: number;
    maintenanceCount: number;
    memberCount: number;
}

export interface ForumPost {
    id: number;
    authorName: string;
    authorAvatar?: string;
    tagType: 'Hỏi đáp' | 'Thông báo' | 'Chia sẻ';
    content: string;
    commentCount: number;
    likeCount: number;
    createdAt: string;
}

const ForumSidebar: React.FC<{ onNavigate?: (tab: string) => void }> = ({ onNavigate }) => {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchSidebarStats = async () => {
        try {
            // Mapping existing API to desired interface
            const res = await equipmentApi.getAll();
            const usersRes = { length: 156 }; // Simulator for member count if API not available
            
            setStats({
                availableCount: res.filter((e: any) => e.status === 'Available').length,
                maintenanceCount: res.filter((e: any) => e.status !== 'Available').length,
                memberCount: usersRes.length
            });
        } catch (e) {
            console.error("Error fetching stats:", e);
        }
    };

    const fetchRecentPosts = async () => {
        try {
            const res = await postApi.getAll();
            // Transform backend data to ForumPost interface
            const formattedPosts: ForumPost[] = (res || []).slice(0, 5).map((p: any) => ({
                id: p.id,
                authorName: p.author?.username || 'Thành viên',
                authorAvatar: p.author?.avatar,
                tagType: (p.category === 'Learning' ? 'Hỏi đáp' : p.category === 'Announcement' ? 'Thông báo' : 'Chia sẻ') as any,
                content: p.content,
                commentCount: p.comments || 0,
                likeCount: p.positive || 0,
                createdAt: p.createdAt
            }));
            setPosts(formattedPosts);
        } catch (e) {
            console.error("Error fetching posts:", e);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchSidebarStats(), fetchRecentPosts()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const getTagColor = (type: string) => {
        switch (type) {
            case 'Hỏi đáp': return 'orange';
            case 'Thông báo': return 'geekblue';
            case 'Chia sẻ': return 'cyan';
            default: return 'default';
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-right-4 duration-700">
            
            {/* Section 1: Stats Grid */}
            <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
                <Title level={5} className="!text-[#d9e3f6] !mb-4 !text-sm uppercase tracking-widest opacity-70">Thống kê hệ thống</Title>
                {loading ? (
                    <Skeleton active paragraph={{ rows: 2 }} />
                ) : (
                    <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <Text className="text-[10px] text-[#b9cac4] uppercase font-bold mb-1">Sẵn có</Text>
                            <Text className="text-xl font-bold text-[#00dfbe]">{stats?.availableCount}</Text>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <Text className="text-[10px] text-[#b9cac4] uppercase font-bold mb-1">Bảo trì</Text>
                            <Text className="text-xl font-bold text-[#ffb4ab]">{stats?.maintenanceCount}</Text>
                        </div>
                        <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/5">
                            <Text className="text-[10px] text-[#b9cac4] uppercase font-bold mb-1">Cộng đồng</Text>
                            <Text className="text-xl font-bold text-white">{stats?.memberCount}</Text>
                        </div>
                    </div>
                )}
            </div>

            {/* Section 2: Forum Feed */}
            <div className="bg-[#16202e]/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <div>
                        <Title level={5} className="!text-[#d9e3f6] !m-0">Diễn Đàn</Title>
                        <Text className="text-[11px] text-[#b9cac4]">{posts.length} bài viết mới nhất</Text>
                    </div>
                    <Badge status="processing" color="#00dfbe" text={<span className="text-[10px] text-[#00dfbe] font-bold uppercase animate-pulse">Live</span>} />
                </div>

                <div className="flex flex-col">
                    {loading ? (
                        <div className="p-5"><Skeleton active avatar paragraph={{ rows: 3 }} /></div>
                    ) : (
                        posts.map((post) => (
                            <div key={post.id} className="p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-all group">
                                <div className="flex gap-3 items-start mb-2">
                                    <Avatar size="small" src={post.authorAvatar} icon={<UserOutlined />} className="bg-[#2c3544] shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center mb-1">
                                            <Text className="text-[12px] font-bold text-[#d9e3f6] truncate mr-2">{post.authorName}</Text>
                                            <Tag color={getTagColor(post.tagType)} className="m-0 text-[9px] px-2 py-0 leading-normal border-0 rounded-full">{post.tagType}</Tag>
                                        </div>
                                        <Text className="text-[13px] text-[#b9cac4] line-clamp-2 leading-relaxed group-hover:text-white transition-colors">
                                            {post.content}
                                        </Text>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 ml-8 mt-2">
                                    <span className="flex items-center gap-1 text-[10px] text-[#b9cac4]">
                                        <CommentOutlined className="text-xs" /> {post.commentCount}
                                    </span>
                                    <span className="flex items-center gap-1 text-[10px] text-[#b9cac4]">
                                        <LikeOutlined className="text-xs" /> {post.likeCount}
                                    </span>
                                    <span className="text-[9px] text-[#b9cac4]/50 ml-auto italic">
                                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button onClick={() => onNavigate?.('community')} className="p-3 text-center bg-white/5 hover:bg-[#00dfbe]/10 text-[#00dfbe] text-[12px] font-bold transition-all">
                    Xem tất cả thảo luận
                </button>
            </div>

            {/* Quick Tips / Rules */}
            <div className="p-4 rounded-xl border border-[#00dfbe]/20 bg-[#00dfbe]/5">
                <div className="flex items-center gap-2 mb-2">
                    <NotificationOutlined className="text-[#00dfbe]" />
                    <Text className="text-xs font-bold text-[#00dfbe] uppercase">Lưu ý nhỏ</Text>
                </div>
                <Text className="text-[11px] text-[#b9cac4] leading-normal">
                    Hãy trả thiết bị đúng hạn để không bị trừ điểm uy tín thành viên bạn nhé!
                </Text>
            </div>
        </div>
    );
};

export default ForumSidebar;
