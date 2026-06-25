import ChatBox from './ChatBox';
import { FunctionComponent } from 'react';
import { UserMessage } from '../../../interfaces/chat/usersMessages';
import { useUser } from '../../../context/useUSer';
import { Navigate } from 'react-router-dom';
import { path } from '../../../routes/routes';

const mapUserMessageToChatBox = (user: UserMessage) => ({
    _id: user.from._id,
    name: {
        first: user.to?.first ?? '',
        last: user.to?.last ?? '',
    },
    email: user.to.email ?? '',
    role: user.to.role ?? 'Client',
});

interface ChatBoxWrapperProps {
    user: UserMessage;
}

const ChatBoxWrapper: FunctionComponent<ChatBoxWrapperProps> = ({ user }) => {
    const { auth } = useUser();
    const token = localStorage.getItem('token');

    if (!auth?._id) return <Navigate to={path.Login} replace />;

    return (
        <ChatBox
            currentUser={{
                _id: auth._id,
                name: {
                    first: auth.name.first ?? '',
                    last: auth.name.last ?? '',
                },

                email: auth.email ?? '',
                role: auth.role ?? 'Client',
            }}
            otherUser={{
                ...mapUserMessageToChatBox(user),
                status: user.to.status,
            }}
            token={token || ''}
        />
    );
};

export default ChatBoxWrapper;
