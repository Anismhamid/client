import { FunctionComponent } from 'react';

import {
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';



import { useTranslation } from 'react-i18next';
import { User } from '../../../../interfaces/User';
import RoleType from '../../../../interfaces/UserType';

interface Props {
    user: User;
    onChange: (
        email: string,
        role: string,
    ) => Promise<void>;
}

const UserRoleSelect: FunctionComponent<Props> = ({
    user,
    onChange,
}) => {
    const { t } = useTranslation();

    const handleChange = (
        event: SelectChangeEvent,
    ) => {
        void onChange(
            user.email,
            event.target.value,
        );
    };

    return (
        <FormControl
            size="small"
            sx={{ minWidth: 150 }}
        >
            <Select
                value={user.role}
                onChange={handleChange}
                sx={{
                    borderRadius: 2,
                }}
            >
                <MenuItem
                    value={RoleType.Admin}
                >
                    {t(
                        'pages.usersManagement.roles.admin',
                    )}
                </MenuItem>

                <MenuItem
                    value={RoleType.Moderator}
                >
                    {t(
                        'pages.usersManagement.roles.moderator',
                    )}
                </MenuItem>

                <MenuItem
                    value={RoleType.Delivery}
                >
                    {t(
                        'pages.usersManagement.roles.delivery',
                    )}
                </MenuItem>

                <MenuItem
                    value={RoleType.Client}
                >
                    {t(
                        'pages.usersManagement.roles.client',
                    )}
                </MenuItem>
            </Select>
        </FormControl>
    );
};

export default UserRoleSelect;