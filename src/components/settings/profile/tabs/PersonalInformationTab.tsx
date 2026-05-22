import { Card, CardContent, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import UserDetailTable from '../../../../atoms/userManage/UesrDetailsTable';
import { User } from '../../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';

interface PersonalInformationProps {
    user: User;
}

const PersonalInformation: FunctionComponent<PersonalInformationProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    return (
        <Card sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent>
                <Typography
                    variant='h5'
                    gutterBottom
                    fontWeight='bold'
                    color='primary'
                >
                    {t('personalInformation')}
                </Typography>
                <UserDetailTable user={user} />
            </CardContent>
        </Card>
    );
};

export default PersonalInformation;
