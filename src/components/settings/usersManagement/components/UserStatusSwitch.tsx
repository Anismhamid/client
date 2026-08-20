import React from 'react';
import Switch from '@mui/material/Switch';

interface UserStatusSwitchProps {
    userId: string;
    isActive: boolean;
    onChange: (
        userId: string,
        isActive: boolean,
    ) => Promise<boolean>;
    disabled?: boolean;
}

const UserStatusSwitch: React.FC<
    UserStatusSwitchProps
> = ({
    userId,
    isActive,
    onChange,
    disabled = false,
}) => {
    const handleChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const newStatus = event.target.checked;

        await onChange(userId, newStatus);
    };

    return (
        <Switch
            checked={isActive}
            onChange={handleChange}
            disabled={disabled}
            color="success"
        />
    );
};

export default UserStatusSwitch;