import { FunctionComponent } from 'react';

import { Switch } from '@mui/material';

interface UserPermissionSwitchProps {
    userId: string;
    enabled: boolean;
    onChange: (
        userId: string,
        enabled: boolean,
    ) => Promise<boolean>;
}

const UserPermissionSwitch: FunctionComponent<
    UserPermissionSwitchProps
> = ({ userId, enabled, onChange }) => {
    const handleChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        await onChange(userId, event.target.checked);
    };

    return (
        <Switch
            checked={enabled}
            onChange={handleChange}
        />
    );
};

export default UserPermissionSwitch;