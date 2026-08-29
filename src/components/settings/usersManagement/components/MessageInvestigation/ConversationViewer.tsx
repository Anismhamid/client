import {
    Avatar,
    Box,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { InvestigationMessage } from '../../../../../interfaces/InvestigationMessage';

interface ConversationViewerProps {
    messages: InvestigationMessage[];
}

const ConversationViewer = ({
    messages,
}: ConversationViewerProps) => {
    if (messages.length === 0) {
        return (
            <Paper
                elevation={0}
                sx={{
                    p: 5,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor:
                        'divider',
                }}
            >
                <Typography
                    color="text.secondary"
                >
                    No messages found in this
                    conversation.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    p: 2,
                    bgcolor:
                        'background.default',
                }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Conversation
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {messages.length} messages
                </Typography>
            </Box>

            <Divider />

            <Box
                sx={{
                    p: {
                        xs: 1.5,
                        md: 3,
                    },
                    maxHeight: 650,
                    overflowY: 'auto',
                }}
            >
                <Stack spacing={2}>
                    {messages.map(
                        (message) => {
                            const sender =
                                message.from;

                            return (
                                <Box
                                    key={
                                        message._id
                                    }
                                    sx={{
                                        display:
                                            'flex',
                                        gap: 1.5,
                                        alignItems:
                                            'flex-start',
                                    }}
                                >
                                    <Avatar
                                        src={
                                            sender
                                                .image
                                                ?.url
                                        }
                                        alt={
                                            sender
                                                .image
                                                ?.alt ||
                                            sender
                                                .name
                                                .first
                                        }
                                    >
                                        {
                                            sender
                                                .name
                                                .first?.[0]
                                        }
                                    </Avatar>

                                    <Box
                                        sx={{
                                            flex: 1,
                                            minWidth: 0,
                                        }}
                                    >
                                        <Stack
                                            direction="row"
                                            spacing={
                                                1
                                            }
                                            alignItems="center"
                                            flexWrap="wrap"
                                        >
                                            <Typography
                                                fontWeight={
                                                    700
                                                }
                                            >
                                                {
                                                    sender
                                                        .name
                                                        .first
                                                }{' '}
                                                {
                                                    sender
                                                        .name
                                                        .last
                                                }
                                            </Typography>

                                            <Chip
                                                size="small"
                                                label={
                                                    sender.role
                                                }
                                            />

                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                            >
                                                {new Date(
                                                    message.createdAt,
                                                ).toLocaleString()}
                                            </Typography>
                                        </Stack>

                                        <Paper
                                            elevation={
                                                0
                                            }
                                            sx={{
                                                mt: 1,
                                                p: 1.5,
                                                bgcolor:
                                                    'action.hover',
                                                borderRadius: 2,
                                            }}
                                        >
                                            {message.replyTo && (
                                                <Box
                                                    sx={{
                                                        mb: 1,
                                                        p: 1,
                                                        borderLeft:
                                                            '3px solid',
                                                        borderColor:
                                                            'primary.main',
                                                    }}
                                                >
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                    >
                                                        Reply:
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        {
                                                            message
                                                                .replyTo
                                                                .message
                                                        }
                                                    </Typography>
                                                </Box>
                                            )}

                                            <Typography
                                                sx={{
                                                    whiteSpace:
                                                        'pre-wrap',
                                                    overflowWrap:
                                                        'anywhere',
                                                }}
                                            >
                                                {
                                                    message.message
                                                }
                                            </Typography>

                                            {(message.warning ||
                                                message.isImportant) && (
                                                <Stack
                                                    direction="row"
                                                    spacing={
                                                        1
                                                    }
                                                    mt={
                                                        1
                                                    }
                                                >
                                                    {message.warning && (
                                                        <Chip
                                                            size="small"
                                                            color="warning"
                                                            label="Warning"
                                                        />
                                                    )}

                                                    {message.isImportant && (
                                                        <Chip
                                                            size="small"
                                                            color="error"
                                                            label="Important"
                                                        />
                                                    )}
                                                </Stack>
                                            )}
                                        </Paper>
                                    </Box>
                                </Box>
                            );
                        },
                    )}
                </Stack>
            </Box>
        </Paper>
    );
};

export default ConversationViewer;