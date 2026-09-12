import { Card, CardContent, Typography, Box, alpha } from '@mui/material';
import { FunctionComponent } from 'react';
import UserDetailTable from '../../../navbar/userManage/UesrDetailsTable';
import { User } from '../../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../../locales/handleRTL';
import { PersonOutline } from '@mui/icons-material';

interface PersonalInformationProps {
    user: User;
}

const PersonalInformation: FunctionComponent<PersonalInformationProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const dir = handleRTL();

    return (
        <Card
            dir={dir}
            variant='outlined'
            sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}
        >
            <Box
                sx={(theme) => ({
                    px: 3,
                    py: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    background: `linear-gradient(90deg, ${alpha(
                        theme.palette.primary.main,
                        0.06,
                    )}, transparent)`,
                })}
            >
                <PersonOutline color='primary' />
                <Typography variant='h6' fontWeight={800}>
                    {t('personalInformation')}
                </Typography>
            </Box>
            <CardContent>
                <UserDetailTable user={user} />
            </CardContent>
        </Card>
    );
};

export default PersonalInformation;