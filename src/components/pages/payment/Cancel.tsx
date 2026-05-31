import { Box, Typography, Button, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
    const navigate = useNavigate();
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
                <CancelIcon sx={{ fontSize: 80, color: '#f44336', mb: 2 }} />
                <Typography variant='h4' gutterBottom>
                    ❌ تم إلغاء الدفع
                </Typography>
                <Typography
                    variant='body1'
                    color='text.secondary'
                    sx={{ mb: 3 }}
                >
                    لم يتم تنفيذ أي عملية دفع. يمكنك المحاولة مرة أخرى عند
                    الرغبة.
                </Typography>
                <Button variant='contained' onClick={() => navigate('/')}>
                    العودة للرئيسية
                </Button>
            </Paper>
        </Box>
    );
}
