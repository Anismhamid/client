import { useEffect } from 'react';
import { patchUserStatus } from '../../../../services/usersServices';
import socket from '../../../../socket/globalSocket';



export const useUsersRealtime = (
    updateUserStatus: (
        userId: string,
        status: boolean,
    ) => void,
) => {
    useEffect(() => {
        const handleConnected = async ({
            userId,
        }: {
            userId: string;
        }) => {
            try {
                await patchUserStatus(
                    userId,
                    true,
                );

                updateUserStatus(
                    userId,
                    true,
                );
            } catch (error) {
                console.error(
                    'User connection update failed:',
                    error,
                );
            }
        };

        const handleDisconnected = async ({
            userId,
        }: {
            userId: string;
        }) => {
            try {
                await patchUserStatus(
                    userId,
                    false,
                );

                updateUserStatus(
                    userId,
                    false,
                );
            } catch (error) {
                console.error(
                    'User disconnection update failed:',
                    error,
                );
            }
        };

        socket.on(
            'user:newUserLoggedIn',
            handleConnected,
        );

        socket.on(
            'user:disconnected',
            handleDisconnected,
        );

        return () => {
            socket.off(
                'user:newUserLoggedIn',
                handleConnected,
            );

            socket.off(
                'user:disconnected',
                handleDisconnected,
            );
        };
    }, [updateUserStatus]);
};