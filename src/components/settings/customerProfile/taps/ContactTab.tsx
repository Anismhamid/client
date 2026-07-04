import {
    Button,
    Card,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { User } from '../../../../interfaces/chat/usersMessages';
import {
    Phone,
    WhatsApp,
    Facebook,
    Instagram,
    Twitter,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const BRAND_BROWN = '#8B4513';

interface ContactTabProps {
    handleWhatsApp: () => void;
    user: User;
}

const ContactTab: FunctionComponent<ContactTabProps> = ({
    user,
    handleWhatsApp,
}) => {
    const { t } = useTranslation();
    return (
        <Card sx={{ p: 3, borderRadius: 2 }}>
            <Typography
                variant='h6'
                gutterBottom
                sx={{ color: BRAND_BROWN, fontWeight: 700 }}
            >
                {t('messages.contactWith')} {user.name?.first}
            </Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Button
                        variant='contained'
                        fullWidth
                        size='large'
                        color='success'
                        startIcon={<WhatsApp />}
                        onClick={handleWhatsApp}
                        sx={{ py: 1.5, gap: 1 }}
                    >
                        مراسلة عبر واتساب
                    </Button>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant='subtitle2' gutterBottom color='text.secondary'>
                أو تواصل عبر:
            </Typography>
            <Stack direction='row' spacing={2} justifyContent='center'>
                <IconButton sx={{ color: '#1877F2' }}>
                    <Facebook />
                </IconButton>
                <IconButton sx={{ color: '#1DA1F2' }}>
                    <Twitter />
                </IconButton>
                <IconButton sx={{ color: '#E1306C' }}>
                    <Instagram />
                </IconButton>
                <IconButton
                    sx={{ color: BRAND_BROWN }}
                    onClick={() => window.open(`tel:${user.phone?.phone_1}`)}
                >
                    <Phone />
                </IconButton>
            </Stack>
        </Card>
    );
};

export default ContactTab;