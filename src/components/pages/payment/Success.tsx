// src/pages/payment/Success.tsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';

const api = `${import.meta.env.VITE_API_URL}/featured-ads`;

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (sessionId) {
            verifyPayment(sessionId);
        }
    }, [sessionId]);

    const verifyPayment = async (sessionId: string) => {
        try {
            const { data } = await axios.get(
                `${api}/verify-session?session_id=${sessionId}`,
            );
            if (data.payment_status === 'paid') {
                setVerified(true);
            }
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                display='flex'
                justifyContent='center'
                alignItems='center'
                minHeight='60vh'
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            display='flex'
            justifyContent='center'
            alignItems='center'
            minHeight='60vh'
        >
            <Paper
                elevation={3}
                sx={{ p: 5, textAlign: 'center', maxWidth: 500 }}
            >
                {verified ? (
                    <>
                        <CheckCircleIcon
                            sx={{ fontSize: 80, color: '#4caf50', mb: 2 }}
                        />
                        <Typography variant='h4' gutterBottom>
                            ✅ تم الدفع بنجاح!
                        </Typography>
                        <Typography
                            variant='body1'
                            color='text.secondary'
                            sx={{ mb: 3 }}
                        >
                            تم تفعيل الإعلان المميز بنجاح. يمكنك الآن متابعة
                            إعلانك في لوحة التحكم.
                        </Typography>
                        <Button
                            variant='contained'
                            onClick={() => navigate('/my-ads-dashboard')}
                        >
                            عرض إعلاناتي
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant='h5' color='error' gutterBottom>
                            ⚠️ لم يتم تأكيد الدفع
                        </Typography>
                        <Typography variant='body2' sx={{ mb: 3 }}>
                            يرجى التحقق من بريدك الإلكتروني أو الاتصال بالدعم.
                        </Typography>
                        <Button
                            variant='outlined'
                            onClick={() => navigate('/')}
                        >
                            العودة للرئيسية
                        </Button>
                    </>
                )}
            </Paper>
        </Box>
    );
}
