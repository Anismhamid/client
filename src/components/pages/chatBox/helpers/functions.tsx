import CheckIcon from '@mui/icons-material/Check';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { Dispatch, RefObject, SetStateAction } from 'react';
import { LocalMessage } from '../../../../interfaces/chat/localMessage';
import { BaseUser } from '../../../../interfaces/chat/chatUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import socket from '../../../../socket/globalSocket';
import axios from 'axios';
import { Typography } from '@mui/material';
import { UserMessage } from '../../../../interfaces/chat/usersMessages';

const api = import.meta.env.VITE_API_URL;

// تعريف نوع الحالة
type MessageStatus = 'seen' | 'delivered' | 'sent' | 'pending' | 'error';

export const getStatusIcon = (status: MessageStatus) => {
    console.log('Getting status icon for:', status);
    
    switch (status) {
        case 'seen':
            return <DoneAllIcon sx={{ fontSize: 14, color: '#2196f3' }} />;
        case 'delivered':
            return <DoneAllIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />;
        case 'sent':
            return <CheckIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />;
        case 'pending':
            return <AccessTimeIcon sx={{ fontSize: 12, color: '#9e9e9e' }} />;
        case 'error':
            return (
                <Typography sx={{ color: 'error.main', fontSize: 12 }}>
                    ⚠
                </Typography>
            );
        default:
            return <CheckIcon sx={{ fontSize: 14, color: '#9e9e9e' }} />;
    }
};

export const scrollToBottom = (
    behavior: ScrollBehavior = 'smooth',
    chatContainerRef: RefObject<HTMLDivElement | null>,
    delay: number = 0,
) => {
    if (!chatContainerRef.current) return;

    const scroll = () => {
        if (!chatContainerRef.current) return;
        chatContainerRef.current.scrollTo({
            top: chatContainerRef.current.scrollHeight,
            behavior,
        });
    };

    if (delay > 0) {
        setTimeout(scroll, delay);
    } else {
        requestAnimationFrame(scroll);
    }
};

/**
 * يوحّد منطق تحديث الرسالة عند وصول أحداث
 * message:sent / message:delivered / message:seen
 * بدلاً من تكرار نفس الـ .map() ثلاث مرات في ChatBox.
 */
export const reconcileMessage = (
    prev: LocalMessage[],
    incoming: LocalMessage,
): LocalMessage[] => {
    return prev.map((m): LocalMessage => {
        if (m.tempId && incoming.tempId && m.tempId === incoming.tempId) {
            return { ...incoming };
        }
        if (m._id === incoming._id) {
            return { ...m, status: incoming.status as MessageStatus };
        }
        return m;
    });
};

export const sendMessage = async (
    text: string,
    currentUser: BaseUser,
    otherUser: BaseUser,
    setInput: Dispatch<SetStateAction<string>>,
    chatContainerRef: RefObject<HTMLDivElement | null>,
    addMessageForUser: (userId: string, msg: LocalMessage) => void,
    token: string,
    setMessagesForUser?: (
        userId: string,
        updater: (prev: LocalMessage[]) => LocalMessage[],
    ) => void,
) => {
    if (!text.trim()) return;
    const messageText = text.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    console.log('Sending message:', { messageText, tempId });

    const tempMessage: LocalMessage = {
        _id: tempId,
        from: currentUser,
        to: otherUser,
        message: messageText,
        status: 'pending',
        createdAt: new Date(),
        fileType: undefined,
        fileUrl: undefined,
        warning: false,
        tempId,
        isImportant: false,
        text: '',
    };

    // إضافة الرسالة محلياً
    addMessageForUser(otherUser?._id ?? '', tempMessage);
    setInput('');
    
    // إيقاف حالة الكتابة
    if (socket) {
        socket.emit('user:stopTyping', {
            to: otherUser._id,
            from: currentUser._id,
        });
    }
    
    // التمرير للأسفل
    setTimeout(() => scrollToBottom('smooth', chatContainerRef), 0);

    try {
        const response = await axios.post(
            `${api}/messages`,
            { 
                toUserId: otherUser._id, 
                message: messageText, 
                tempId 
            },
            { 
                headers: { Authorization: token } 
            },
        );
        
        console.log('Message sent successfully:', response.data);
        
        // تحديث الرسالة بالـ ID الحقيقي والحالة
        if (response.data._id && setMessagesForUser) {
            setMessagesForUser(otherUser?._id ?? '', (prev: LocalMessage[]): LocalMessage[] => {
                return prev.map((m): LocalMessage => {
                    if (m.tempId === tempId) {
                        return { 
                            ...response.data, 
                            status: 'sent' as const,
                            tempId: tempId
                        };
                    }
                    return m;
                });
            });
        }
    } catch (err) {
        console.error('Failed to send message:', err);
        // نعلّم الرسالة كخطأ بدل ما تضل عالقة على "pending" للأبد
        setMessagesForUser?.(otherUser?._id ?? '', (prev: LocalMessage[]): LocalMessage[] => {
            return prev.map((m): LocalMessage => {
                if (m.tempId === tempId) {
                    return { ...m, status: 'error' as const };
                }
                return m;
            });
        });
    }
};

export const formatMessageTime = (dateString: Date) => {
    try {
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        return error;
    }
};

export const getUserName = (user: UserMessage) => {
    if (typeof user.name === 'string') return user.name;
    const first = user.name?.first || '';
    const last = user.name?.last || '';
    return `${first} ${last}`.trim() || 'User';
};

export const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    return date.toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
    });
};