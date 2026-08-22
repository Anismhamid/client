import { Card, CardContent, Typography } from '@mui/material';
import { FunctionComponent } from 'react';
import UserDetailTable from '../../../navbar/userManage/UesrDetailsTable';
import { User } from '../../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';
import handleRTL from '../../../../locales/handleRTL';

interface PersonalInformationProps {
    user: User;
}

const PersonalInformation: FunctionComponent<PersonalInformationProps> = ({
    user,
}) => {
    const { t } = useTranslation();
    const dir = handleRTL();

    return (
        <Card dir={dir} sx={{ mb: 3, borderRadius: 3 }}>
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
