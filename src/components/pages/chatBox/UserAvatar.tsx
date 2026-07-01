import { Avatar } from '@mui/material';

interface Props {
    user: {
        name?: { first?: string; last?: string };
        image?: { url?: string };
    };
    size?: number;
}

const UserAvatar = ({ user, size = 44 }: Props) => {
    const initial = user.name?.first?.charAt(0) || 'U';

    return (
        <Avatar src={user.image?.url} sx={{ width: size, height: size }}>
            {initial}
        </Avatar>
    );
};

export default UserAvatar;
