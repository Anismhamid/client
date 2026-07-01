import { Button, Card, CardContent, Grid, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import {
    Security as SecurityIcon,
    SupportAgent as SupportIcon,
    QrCode,
    Download,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { path } from '../../../../routes/routes';
import { showSuccess } from '../../../../atoms/toasts/ReactToast';
import { User } from '../../../../interfaces/chat/usersMessages';

interface QuickActionsTabProps {
    user: User;
}

const QuickActionsTab: FunctionComponent<QuickActionsTabProps> = ({ user }) => {
    const navigate = useNavigate();

    const contactSupport = () => {
        navigate(path.Contact);
    };

    const handleExportData = () => {
        showSuccess('سيتم تحميل بياناتك قريباً');
    };

    return (
        <Card variant='outlined' sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent>
                <Typography variant='h6' gutterBottom fontWeight={800}>
                    إجراءات سريعة
                </Typography>
                <Grid container spacing={1.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            variant='outlined'
                            fullWidth
                            disabled
                            startIcon={<SecurityIcon />}
                            sx={{ py: 1.25, justifyContent: 'flex-start', gap: 2, borderRadius: 999 }}
                        >
                            تغيير كلمة المرور (قريبأ)
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            variant='outlined'
                            fullWidth
                            startIcon={<SupportIcon />}
                            onClick={contactSupport}
                            sx={{ py: 1.25, justifyContent: 'flex-start', gap: 2, borderRadius: 999 }}
                        >
                            دعم فني
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            variant='outlined'
                            fullWidth
                            disabled
                            startIcon={<Download />}
                            onClick={handleExportData}
                            sx={{ py: 1.25, justifyContent: 'flex-start', gap: 2, borderRadius: 999 }}
                        >
                            تصدير البيانات (قريبأ)
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <Button
                            variant='outlined'
                            fullWidth
                            startIcon={<QrCode />}
                            onClick={() => navigate(`/users/customer/${user?.slug}`)}
                            sx={{ py: 1.25, justifyContent: 'flex-start', gap: 2, borderRadius: 999 }}
                        >
                            الصفحتي التجارية
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default QuickActionsTab;