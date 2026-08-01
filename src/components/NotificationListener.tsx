// src/components/notifications/NotificationListener.tsx
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const NotificationListener = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        // ✅ مستمع للإشعارات الواردة
        const handleNotification = (event: CustomEvent) => {
            const notification = event.detail;
            console.log('📨 In-app notification received:', notification);

            // عرض الإشعار داخل التطبيق باستخدام react-toastify
            toast.info(notification.title || '📬 إشعار جديد', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                onClick: () => {
                    // التنقل عند الضغط على الإشعار
                    if (notification.data?.screen) {
                        navigate(notification.data.screen);
                    } else if (notification.data?.type === 'chat' && notification.data?.userId) {
                        navigate(`/chat/${notification.data.userId}`);
                    } else if (notification.data?.type === 'order' && notification.data?.orderId) {
                        navigate(`/orders/${notification.data.orderId}`);
                    } else if (notification.data?.type === 'product' && notification.data?.productId) {
                        navigate(`/product/${notification.data.productId}`);
                    } else if (notification.data?.type === 'profile' && notification.data?.userId) {
                        navigate(`/profile/${notification.data.userId}`);
                    }
                }
            });
        };

        // ✅ مستمع عند الضغط على الإشعار
        const handleNotificationClick = (event: CustomEvent) => {
            const data = event.detail;
            console.log('👆 Notification clicked:', data);
            
            // التنقل حسب نوع الإشعار
            if (data?.screen) {
                navigate(data.screen);
            } else if (data?.type === 'chat' && data?.userId) {
                navigate(`/chat/${data.userId}`);
            } else if (data?.type === 'order' && data?.orderId) {
                navigate(`/orders/${data.orderId}`);
            } else if (data?.type === 'product' && data?.productId) {
                navigate(`/product/${data.productId}`);
            } else if (data?.type === 'profile' && data?.userId) {
                navigate(`/profile/${data.userId}`);
            }
        };

        // إضافة المستمعين
        window.addEventListener('push-notification-received', handleNotification as EventListener);
        window.addEventListener('push-notification-clicked', handleNotificationClick as EventListener);

        // تنظيف
        return () => {
            window.removeEventListener('push-notification-received', handleNotification as EventListener);
            window.removeEventListener('push-notification-clicked', handleNotificationClick as EventListener);
        };
    }, [navigate]);

    return null; // هذا المكون لا يعرض أي شيء
};

export default NotificationListener;