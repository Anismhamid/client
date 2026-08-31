import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import LockIcon from '@mui/icons-material/Lock';

import { useState } from 'react';

import UserSearchField from './UserSearchField';

import ConversationViewer from './ConversationViewer';
import handleRTL from '../../../../../locales/handleRTL';
import {
    InvestigationMessage,
    InvestigationUser,
} from '../../../../../interfaces/InvestigationMessage';
import { viewInvestigationConversation } from '../../../../../services/messageInvestigationService';

const MessageInvestigation = () => {
    const direction = handleRTL();

    const [user1, setUser1] = useState<InvestigationUser | null>(null);

    const [user2, setUser2] = useState<InvestigationUser | null>(null);

    const [reason, setReason] = useState('');

    const [messages, setMessages] = useState<InvestigationMessage[]>([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const [investigated, setInvestigated] = useState(false);

    const handleViewConversation = async () => {
        setError('');

        if (!user1 || !user2) {
            setError('Please select both users.');
            return;
        }

        if (user1._id === user2._id) {
            setError('Users must be different.');
            return;
        }

        const trimmedReason = reason.trim();

        if (trimmedReason.length < 5) {
            setError(
                'Please provide a valid reason for accessing this conversation.',
            );
            return;
        }

        try {
            setLoading(true);

            const response = await viewInvestigationConversation(
                user1._id,
                user2._id,
                trimmedReason,
            );

            setMessages(response.messages || []);

            setInvestigated(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error('Investigation error:', error);

            setError(
                error?.response?.data?.message ||
                    'Failed to retrieve conversation.',
            );

            setInvestigated(false);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setUser1(null);
        setUser2(null);
        setReason('');
        setMessages([]);
        setError('');
        setInvestigated(false);
    };

    return (
        <Box
            dir={direction}
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                py: {
                    xs: 3,
                    md: 5,
                },
                px: {
                    xs: 2,
                    md: 4,
                },
            }}
        >
            <Stack spacing={3}>
                {/* ========================================== */}
                {/* Header */}
                {/* ========================================== */}

                <Box>
                    <Stack direction='row' spacing={1.5} alignItems='center'>
                        <LockIcon color='warning' />

                        <Typography variant='h4' fontWeight={800}>
                            Message Investigation
                        </Typography>
                    </Stack>

                    <Typography mt={1} color='text.secondary'>
                        Authorized access to user conversations. Every access is
                        recorded in the audit log.
                    </Typography>
                </Box>

                {/* ========================================== */}
                {/* Warning */}
                {/* ========================================== */}

                <Alert severity='warning'>
                    Message access is a privileged administrative action. A
                    reason is required and every access is logged.
                </Alert>

                {/* ========================================== */}
                {/* Search */}
                {/* ========================================== */}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 2,
                            md: 3,
                        },
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Stack spacing={3}>
                        <Typography variant='h6' fontWeight={700}>
                            Select conversation
                        </Typography>

                        <UserSearchField
                            label='User A'
                            value={user1}
                            onChange={setUser1}
                            disabled={loading}
                        />

                        <UserSearchField
                            label='User B'
                            value={user2}
                            onChange={setUser2}
                            disabled={loading}
                        />

                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            label='Reason for access'
                            placeholder='Explain why you need to access this conversation...'
                            value={reason}
                            disabled={loading}
                            onChange={(event) => setReason(event.target.value)}
                            helperText={`${reason.length}/1000`}
                            inputProps={{
                                maxLength: 1000,
                            }}
                        />

                        {error && <Alert severity='error'>{error}</Alert>}

                        <Stack
                            direction={{
                                xs: 'column',
                                sm: 'row',
                            }}
                            spacing={2}
                        >
                            <Button
                                variant='contained'
                                color='warning'
                                startIcon={
                                    loading ? (
                                        <CircularProgress
                                            size={18}
                                            color='inherit'
                                        />
                                    ) : (
                                        <LockIcon />
                                    )
                                }
                                disabled={
                                    loading ||
                                    !user1 ||
                                    !user2 ||
                                    reason.trim().length < 5
                                }
                                onClick={handleViewConversation}
                            >
                                {loading ? 'Loading...' : 'View Conversation'}
                            </Button>

                            <Button
                                variant='outlined'
                                disabled={loading}
                                onClick={handleReset}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* ========================================== */}
                {/* Conversation */}
                {/* ========================================== */}

                {investigated && <ConversationViewer messages={messages} />}
            </Stack>
        </Box>
    );
};

export default MessageInvestigation;
