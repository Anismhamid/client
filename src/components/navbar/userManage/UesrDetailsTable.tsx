import { FunctionComponent } from 'react';
import RoleType from '../../../interfaces/UserType';
import { Box, Stack, Typography, Divider, alpha, useTheme } from '@mui/material';
import {
    Person,
    Phone,
    PhoneAndroid,
    LocationOn,
    Email,
    VerifiedUser,
} from '@mui/icons-material';
import { User } from '../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';

interface UserDetailTableProps {
    user: User;
}

interface DetailRow {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

const UserDetailTable: FunctionComponent<UserDetailTableProps> = ({ user }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    const roleLabel =
        user.role === RoleType.Admin
            ? 'مدير ومشرف'
            : user.role === RoleType.Moderator
              ? 'مشرف'
              : 'مستخدم';

    const addressValue =
        user.address?.city && user.address?.street && user.address?.houseNumber
            ? `البلد: ${user.address.city} شارع: ${user.address.street} رقم البيت: ${user.address.houseNumber}`
            : '-';

    const rows: DetailRow[] = [
        {
            icon: <Person fontSize='small' />,
            label: t('fullName'),
            value: `${user.name?.first || ''} ${user.name?.last || ''}`.trim() || '-',
        },
        {
            icon: <Phone fontSize='small' />,
            label: t('phone'),
            value: user.phone?.phone_1 || '-',
        },
        ...(user.phone?.phone_2
            ? [
                  {
                      icon: <PhoneAndroid fontSize='small' />,
                      label: t('secondaryPhone'),
                      value: user.phone.phone_2,
                  },
              ]
            : []),
        {
            icon: <LocationOn fontSize='small' />,
            label: t('address'),
            value: addressValue,
        },
        {
            icon: <Email fontSize='small' />,
            label: t('email'),
            value: user.email,
        },
        {
            icon: <VerifiedUser fontSize='small' />,
            label: t('userType'),
            value: (
                <Typography component='span' fontWeight={700} color='success.main'>
                    {roleLabel}
                </Typography>
            ),
        },
    ];

    return (
        <Stack sx={{ width: '100%' }} divider={<Divider />}>
            {rows.map((row, i) => (
                <Stack
                    key={i}
                    direction='row'
                    alignItems='center'
                    spacing={2}
                    sx={{ py: 1.75 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 36,
                            height: 36,
                            flexShrink: 0,
                            borderRadius: '50%',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                        }}
                    >
                        {row.icon}
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant='caption' color='text.secondary'>
                            {row.label}
                        </Typography>
                        <Typography
                            variant='body1'
                            sx={{
                                fontWeight: 600,
                                overflowWrap: 'break-word',
                            }}
                        >
                            {row.value}
                        </Typography>
                    </Box>
                </Stack>
            ))}
        </Stack>
    );
};

export default UserDetailTable;