// hooks/usePostReviewNotifications.ts
// يسمع على 'notification:new' ويعرض توست لما الإعلان ينقبل/ينرفض.
// الـ socket singleton من globalSocket، والـ toast بيجي كبارامتر لأني ما أعرف مكتبتك.
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/globalSocket'; // ⚠️ عدّل المسار حسب مكان الملف

export interface AppNotification {
    _id: string;
    type: 'post_approved' | 'post_rejected' | 'post_pending_review';
    title: string;
    body?: string;
    data?: { postId?: string };
    readAt?: string | null;
    createdAt: string;
}

type ToastFn = (
    message: string,
    severity: 'success' | 'error' | 'info',
    onClick?: () => void,
) => void;

interface Options {
    /** true لما المستخدم مسجّل دخول */
    enabled: boolean;
    toast: ToastFn;
    /** مثلًا لتحديث عدّاد الإشعارات أو إعادة جلب "إعلاناتي" */
    onReceive?: (n: AppNotification) => void;
}

export function usePostReviewNotifications({ enabled, toast, onReceive }: Options) {
    const navigate = useNavigate();

    // refs عشان الـ listener يتسجّل مرة وحدة بدون ما يتأثر بتغيّر الدوال
    const toastRef = useRef(toast);
    const onReceiveRef = useRef(onReceive);
    const navigateRef = useRef(navigate);

    // تحديث الـ refs بعد الـ render (مو أثناءه) — يتنفّذ قبل effect الاشتراك تحت
    useEffect(() => {
        toastRef.current = toast;
        onReceiveRef.current = onReceive;
        navigateRef.current = navigate;
    }, [toast, onReceive, navigate]);

    // لتفادي توست مكرر لو وصل نفس الإشعار مرتين (reconnect مثلًا)
    const seenRef = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!enabled) return;

        const handler = (n: AppNotification) => {
            if (seenRef.current.has(n._id)) return;
            seenRef.current.add(n._id);

            onReceiveRef.current?.(n);

            if (n.type === 'post_approved') {
                const postId = n.data?.postId;
                toastRef.current(
                    `${n.title} — ${n.body ?? ''}`,
                    'success',
                    postId
                        ? () => navigateRef.current(`/post-details/${postId}`) // ⚠️ عدّل المسار
                        : undefined,
                );
            } else if (n.type === 'post_rejected') {
                toastRef.current(
                    `${n.title}. ${n.body ?? ''}`,
                    'error',
                    () => navigateRef.current('/my-posts'), // ⚠️ عدّل المسار
                );
            }
        };

        socket.on('notification:new', handler);
        return () => {
            socket.off('notification:new', handler);
        };
    }, [enabled]);
}

/* ────────────────────────────────────────────────────────────────────────────
   استعمله مرة وحدة بمكان المستخدم مسجّل فيه دايمًا (بجانب useSocketEvents):

   usePostReviewNotifications({
       enabled: Boolean(auth?._id),
       toast: (msg, severity) => showToast(msg, severity),   // مكتبة التوست تبعتك
       onReceive: () => refetchMyPosts(),
   });
   ──────────────────────────────────────────────────────────────────────────── */