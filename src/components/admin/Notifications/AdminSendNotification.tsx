/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import SendIcon from '@mui/icons-material/Send';

import { useState } from 'react';

import {
    useUsers,
    AdminUserOption,
} from '../../../hooks/useUsers';

import {
    sendAdminNotification,
    AdminNotificationTarget,
} from '../../../services/notificationServices';

const AdminSendNotification = () => {
    const [target, setTarget] =
        useState<AdminNotificationTarget>('all');

    const [role, setRole] = useState<
        'Admin' | 'Moderator' | 'Client' | 'delivery'
    >('Client');

    const {
        users,
        loading: usersLoading,
        getUserName,
    } = useUsers();

    const [selectedUser, setSelectedUser] =
        useState<AdminUserOption | null>(null);

    const [userIds, setUserIds] =
        useState('');

    const [title, setTitle] =
        useState('');

    const [body, setBody] =
        useState('');

    const [screen, setScreen] =
        useState('');

    const [loading, setLoading] =
        useState(false);

    const [success, setSuccess] =
        useState<string | null>(null);

    const [error, setError] =
        useState<string | null>(null);

    const handleTargetChange = (
        value: AdminNotificationTarget,
    ) => {
        setTarget(value);

        // تنظيف الاختيارات القديمة
        setSelectedUser(null);
        setUserIds('');

        setSuccess(null);
        setError(null);
    };

    const handleSubmit = async (
        event: React.FormEvent,
    ) => {
        event.preventDefault();

        setSuccess(null);
        setError(null);

        if (!title.trim()) {
            setError('عنوان الإشعار مطلوب');
            return;
        }

        if (
            target === 'user' &&
            !selectedUser?._id
        ) {
            setError('اختر المستخدم المطلوب إرسال الإشعار إليه');
            return;
        }

        if (
            target === 'users' &&
            !userIds.trim()
        ) {
            setError('أدخل معرفات المستخدمين');
            return;
        }

        const parsedUserIds = userIds
            .split(/[\s,]+/)
            .map((id) => id.trim())
            .filter(Boolean);

        if (
            target === 'users' &&
            !parsedUserIds.length
        ) {
            setError('أدخل معرفات مستخدمين صحيحة');
            return;
        }

        try {
            setLoading(true);

            const response =
                await sendAdminNotification({
                    target,

                    ...(target === 'user' && {
                        userId:
                            selectedUser!._id,
                    }),

                    ...(target === 'users' && {
                        userIds:
                            parsedUserIds,
                    }),

                    ...(target === 'role' && {
                        role,
                    }),

                    title: title.trim(),

                    body: body.trim(),

                    data: screen.trim()
                        ? {
                              screen:
                                  screen.trim(),
                          }
                        : {},
                });

            setSuccess(
                `تم إرسال الإشعار بنجاح. تم الإرسال إلى ${response.sentCount} مستخدم.`,
            );

            // Reset
            setTitle('');
            setBody('');
            setScreen('');
            setSelectedUser(null);
            setUserIds('');
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                    'فشل إرسال الإشعار',
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            elevation={0}
            sx={{
                p: {
                    xs: 2,
                    md: 4,
                },

                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 4,
            }}
        >
            <Stack spacing={3}>
                {/* HEADER */}

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                    >
                        إرسال إشعار
                    </Typography>

                    <Typography
                        color="text.secondary"
                        sx={{
                            mt: 0.5,
                        }}
                    >
                        أرسل إشعارًا مباشرًا
                        للمستخدمين عبر التطبيق
                        والموقع.
                    </Typography>
                </Box>

                {/* ALERTS */}

                {error && (
                    <Alert
                        severity="error"
                        onClose={() =>
                            setError(null)
                        }
                    >
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert
                        severity="success"
                        onClose={() =>
                            setSuccess(null)
                        }
                    >
                        {success}
                    </Alert>
                )}

                {/* TARGET */}

                <FormControl fullWidth>
                    <InputLabel>
                        المستهدفون
                    </InputLabel>

                    <Select
                        value={target}
                        label="المستهدفون"
                        onChange={(event) =>
                            handleTargetChange(
                                event.target
                                    .value as AdminNotificationTarget,
                            )
                        }
                    >
                        <MenuItem value="all">
                            جميع المستخدمين
                        </MenuItem>

                        <MenuItem value="role">
                            حسب الدور
                        </MenuItem>

                        <MenuItem value="user">
                            مستخدم واحد
                        </MenuItem>

                        <MenuItem value="users">
                            عدة مستخدمين
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* ROLE */}

                {target === 'role' && (
                    <FormControl fullWidth>
                        <InputLabel>
                            الدور
                        </InputLabel>

                        <Select
                            value={role}
                            label="الدور"
                            onChange={(event) =>
                                setRole(
                                    event.target
                                        .value as
                                        | 'Admin'
                                        | 'Moderator'
                                        | 'Client'
                                        | 'delivery',
                                )
                            }
                        >
                            <MenuItem value="Client">
                                المستخدمون
                            </MenuItem>

                            <MenuItem value="delivery">
                                التوصيل
                            </MenuItem>

                            <MenuItem value="Moderator">
                                المشرفون
                            </MenuItem>

                            <MenuItem value="Admin">
                                المدراء
                            </MenuItem>
                        </Select>
                    </FormControl>
                )}

                {/* SINGLE USER */}

                {target === 'user' && (
                    <Autocomplete
                        fullWidth
                        options={users}
                        loading={usersLoading}
                        value={selectedUser}
                        onChange={(
                            _event,
                            user,
                        ) => {
                            setSelectedUser(
                                user,
                            );
                        }}
                        getOptionLabel={(user) => {
                            const name =
                                getUserName(
                                    user,
                                );

                            if (
                                user.email
                            ) {
                                return `${name} — ${user.email}`;
                            }

                            return name;
                        }}
                        isOptionEqualToValue={(
                            option,
                            value,
                        ) =>
                            option._id ===
                            value._id
                        }
                        filterOptions={(
                            options,
                            state,
                        ) => {
                            const search =
                                state.inputValue
                                    .trim()
                                    .toLowerCase();

                            if (!search) {
                                return options;
                            }

                            return options.filter(
                                (user) => {
                                    const name =
                                        getUserName(
                                            user,
                                        ).toLowerCase();

                                    const email =
                                        user.email?.toLowerCase() ??
                                        '';

                                    const username =
                                        user.username?.toLowerCase() ??
                                        '';

                                    return (
                                        name.includes(
                                            search,
                                        ) ||
                                        email.includes(
                                            search,
                                        ) ||
                                        username.includes(
                                            search,
                                        )
                                    );
                                },
                            );
                        }}
                        noOptionsText="لا يوجد مستخدمون"
                        loadingText="جاري تحميل المستخدمين..."
                        renderOption={(
                            props,
                            user,
                        ) => (
                            <Box
                                component="li"
                                {...props}
                                key={user._id}
                                sx={{
                                    direction:
                                        'rtl',
                                    display:
                                        'flex !important',
                                    flexDirection:
                                        'column',
                                    alignItems:
                                        'flex-start !important',
                                }}
                            >
                                <Typography
                                    fontWeight={
                                        700
                                    }
                                >
                                    {getUserName(
                                        user,
                                    )}
                                </Typography>

                                {user.email && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {
                                            user.email
                                        }
                                    </Typography>
                                )}

                                {user.username && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                    >
                                        @{user.username}
                                    </Typography>
                                )}
                            </Box>
                        )}
                        renderInput={(
                            params,
                        ) => (
                            <TextField
                                {...params}
                                label="اختر المستخدم"
                                placeholder="ابحث بالاسم أو البريد أو اسم المستخدم"
                                InputProps={{
                                    ...params.InputProps,

                                    endAdornment:
                                        (
                                            <>
                                                {usersLoading && (
                                                    <CircularProgress
                                                        size={
                                                            20
                                                        }
                                                    />
                                                )}

                                                {
                                                    params
                                                        .InputProps
                                                        .endAdornment
                                                }
                                            </>
                                        ),
                                }}
                            />
                        )}
                    />
                )}

                {/* MULTIPLE USERS */}

                {target === 'users' && (
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="معرفات المستخدمين"
                        placeholder="ID1, ID2, ID3"
                        value={userIds}
                        onChange={(event) =>
                            setUserIds(
                                event.target
                                    .value,
                            )
                        }
                        helperText="افصل بين المعرفات بفاصلة أو مسافة أو سطر جديد"
                    />
                )}

                {/* TITLE */}

                <TextField
                    fullWidth
                    required
                    label="عنوان الإشعار"
                    value={title}
                    onChange={(event) =>
                        setTitle(
                            event.target.value,
                        )
                    }
                    inputProps={{
                        maxLength: 200,
                    }}
                />

                {/* BODY */}

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="نص الإشعار"
                    value={body}
                    onChange={(event) =>
                        setBody(
                            event.target.value,
                        )
                    }
                    inputProps={{
                        maxLength: 2000,
                    }}
                />

                {/* SCREEN */}

                <TextField
                    fullWidth
                    label="المسار عند الضغط — اختياري"
                    placeholder="/jobs"
                    value={screen}
                    onChange={(event) =>
                        setScreen(
                            event.target.value,
                        )
                    }
                    helperText="مثال: /jobs أو /home"
                />

                {/* SUBMIT */}

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent:
                            'flex-start',
                    }}
                >
                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={20}
                                    color="inherit"
                                />
                            ) : (
                                <SendIcon />
                            )
                        }
                        sx={{
                            minWidth: 180,
                            borderRadius: 3,
                            py: 1.5,
                            fontWeight: 700,
                        }}
                    >
                        {loading
                            ? 'جاري الإرسال...'
                            : 'إرسال الإشعار'}
                    </Button>
                </Box>
            </Stack>
        </Paper>
    );
};

export default AdminSendNotification;