import { Card, CardContent } from '@mui/material';
import { FunctionComponent } from 'react';
import { PersonOutline } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { User } from '../../../../interfaces/chat/usersMessages';
import UserDetailTable from '../../../navbar/userManage/UesrDetailsTable';
import handleRTL from '../../../../locales/handleRTL';
import { SectionHeader } from '../ProfileShared';

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
            sx={{ borderRadius: 3, overflow: 'hidden' }}
        >
            <SectionHeader
                icon={<PersonOutline />}
                title={t('personalInformation')}
            />
            <CardContent>
                <UserDetailTable user={user} />
            </CardContent>
        </Card>
    );
};

export default PersonalInformation;