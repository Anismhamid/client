import { Avatar, Box, Card, Chip, Grid, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../../interfaces/chat/usersMessages';
import { Link } from 'react-router-dom';
import MdPhone from '@mui/icons-material/Phone';

interface ContactInfoTabProps {
    user: User;
}

const ContactInfoTab: FunctionComponent<ContactInfoTabProps> = ({ user }) => {
    const { t } = useTranslation();

    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 12 }}>
                <Card sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            flexWrap: 'wrap',
                            p: 5,
                        }}
                    >
                        <Box display='flex' alignItems='center'>
                            <Chip
                            
                                title={t('common.phone')}
                                data-testid='phone-chip'
                                aria-label={t('common.phone')}
                                icon={<MdPhone />}
                                sx={{ bgcolor: 'success.light' }}
                                label={t('common.phone')}
                            />

                            <Typography
                                data-testid='phone-typography'
                                title={t('common.phone')}
                                aria-label={t('common.phone')}
                                component={Link}
                                to={`tel:+972${user.phone?.phone_1}`}
                                variant='body1'
                                sx={{
                                    p: 1.5,
                                    textDecoration: 'none',
                                    color: 'success.main',
                                }}
                            >
                                {user.phone?.phone_1 || '-'}
                            </Typography>
                        </Box>

                        {user.phone?.phone_2 && (
                            <Box display='flex' alignItems='center'>
                                <Chip
                                aria-label={t('common.phone')}
                                    title={t('common.phone')}
                                    data-testid='phone2-chip'
                                    icon={<MdPhone />}
                                    sx={{ bgcolor: 'success.light' }}
                                    label={t('common.phone')}
                                />

                                <Typography
                                    title={t('common.phone')}
                                    data-testid='phone2-typography'
                                    component={Link}
                                    to={`tel:+972${user.phone.phone_2}`}
                                    variant='body1'
                                    sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        textDecoration: 'none',
                                        color: 'success.main',
                                    }}
                                >
                                    {user.phone.phone_2}
                                </Typography>
                            </Box>
                        )}

                        <Box display='flex' alignItems='center' gap={2}>
                            <Avatar sx={{ bgcolor: 'info.light' }}>
                                <a
                                    href={`https://waze.com/ul?q=${encodeURIComponent(
                                        user.address?.city || '',
                                    )}&navigate=yes`}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    style={{ textDecoration: 'none' }}
                                >
                                    <img
                                        src='/waze.png'
                                        width={20}
                                        alt='Waze'
                                        style={{ fontSize: 10 }}
                                    />
                                </a>
                            </Avatar>
                            <Box>
                                <Typography
                                    data-testid='city-typography'
                                    title={t(
                                        'modals.updateProductModal.location',
                                    )}
                                    aria-label={t(
                                        'modals.updateProductModal.location',
                                    )}
                                    component='span'
                                    variant='caption'
                                    color='text.secondary'
                                >
                                    {t('modals.updateProductModal.location')}
                                </Typography>
                                <Typography
                                    variant='body1'
                                    data-testid='city-typography'
                                    title={user.address?.city}
                                    aria-label={user.address?.city}
                                >
                                    {user.address?.city}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Grid>

            {/* <Grid size={{ xs: 12, lg: 6 }}>
                <ContactTab user={user} handleWhatsApp={handleWhatsApp} />
            </Grid> */}
        </Grid>
    );
};

export default ContactInfoTab;
