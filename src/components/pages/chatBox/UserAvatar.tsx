import { Avatar } from '@mui/material';
import { useState } from 'react';

interface Props {
    user: {
        name?: { first?: string; last?: string };
        image?: { url?: string };
    };
    size?: number;
}

const UserAvatar = ({ user, size = 44 }: Props) => {
    const [error, setError] = useState(false);
    const [cacheTime] = useState(() => Date.now());

    const safeImage = (url?: string) => {
        if (!url) return undefined;
        if (url.includes('googleusercontent')) {
            return url + '&cache=' + cacheTime;
        }
        return url;
    };

    //   const name =
    //     `${user.name?.first ?? ''} ${user.name?.last ?? ''}`.trim();

    const initial = user.name?.first?.charAt(0) || 'U';

    return (
        <Avatar
            src={!error ? safeImage(user.image?.url) : undefined}
            onError={() => setError(true)}
            sx={{ width: size, height: size }}
        >
            {initial}
        </Avatar>
    );
};

export default UserAvatar;
