import { useState } from 'react';
import ChatModal from './ChatModal';
import MiniChat from './MiniChat';
import { BaseUser } from '../../../interfaces/chat/chatUser';
import { useUser } from '../../../context/useUSer';

const ChatManager = () => {
    const { auth } = useUser();

    const [activeUser, setActiveUser] = useState<BaseUser | null>(null);

    const [minimized, setMinimized] = useState(false);

    if (!auth?._id) return null;

    const currentUser: BaseUser = {
        _id: auth._id,
        name: auth.name,
        email: auth.email,
        role: auth.role,
        status: auth.status ? true : false,
    };

    return (
        <>
            {activeUser && (
                <ChatModal
                    open={!minimized}
                    currentUser={currentUser}
                    otherUser={activeUser}
                    token={localStorage.getItem('token') ?? ''}
                    onMinimize={() => {
                        setMinimized(true);
                    }}
                    onClose={() => {
                        setActiveUser(null);
                        setMinimized(false);
                    }}
                />
            )}

            {activeUser && minimized && (
                <MiniChat
                    user={activeUser}
                    onOpen={() => {
                        setMinimized(false);
                    }}
                />
            )}
        </>
    );
};

export default ChatManager;
