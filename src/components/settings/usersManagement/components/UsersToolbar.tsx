import { FunctionComponent } from 'react';

import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

import RestartAltIcon from '@mui/icons-material/RestartAlt';


import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

import { useTranslation } from 'react-i18next';
import SearchBox from '../../../../atoms/productsManage/SearchBox';

interface Props {
    search: string;
    status: UserFilterStatus;
    role: UserFilterRole;

    onSearch: (value: string) => void;
    onStatusChange: (
        value: UserFilterStatus,
    ) => void;
    onRoleChange: (
        value: UserFilterRole,
    ) => void;

    onReset: () => void;
}

const UsersToolbar: FunctionComponent<Props> = ({
    search,
    status,
    role,
    onSearch,
    onStatusChange,
    onRoleChange,
    onReset,
}) => {
    const { t } = useTranslation();

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                alignItems: 'center',
                mb: 3,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    minWidth: 250,
                }}
            >
                <SearchBox
                    text={t(
                        'pages.usersManagement.search',
                    )}
                    setSearchQuery={onSearch}
                    searchQuery={search}
                />
            </Box>

            <FormControl
                size="small"
                sx={{ minWidth: 160 }}
            >
                <InputLabel>
                    {t(
                        'pages.usersManagement.filters.status',
                    )}
                </InputLabel>

                <Select
                    value={status}
                    label={t(
                        'pages.usersManagement.filters.status',
                    )}
                    onChange={(
                        event: SelectChangeEvent,
                    ) =>
                        onStatusChange(
                            event.target
                                .value as UserFilterStatus,
                        )
                    }
                >
                    <MenuItem value="all">
                        {t(
                            'pages.usersManagement.filters.all',
                        )}
                    </MenuItem>

                    <MenuItem value="active">
                        {t(
                            'pages.usersManagement.status.active',
                        )}
                    </MenuItem>

                    <MenuItem value="inactive">
                        {t(
                            'pages.usersManagement.status.inactive',
                        )}
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl
                size="small"
                sx={{ minWidth: 160 }}
            >
                <InputLabel>
                    {t(
                        'pages.usersManagement.filters.role',
                    )}
                </InputLabel>

                <Select
                    value={role}
                    label={t(
                        'pages.usersManagement.filters.role',
                    )}
                    onChange={(
                        event: SelectChangeEvent,
                    ) =>
                        onRoleChange(
                            event.target
                                .value as UserFilterRole,
                        )
                    }
                >
                    <MenuItem value="all">
                        {t(
                            'pages.usersManagement.filters.all',
                        )}
                    </MenuItem>

                    <MenuItem value="admin">
                        {t(
                            'pages.usersManagement.roles.admin',
                        )}
                    </MenuItem>

                    <MenuItem value="moderator">
                        {t(
                            'pages.usersManagement.roles.moderator',
                        )}
                    </MenuItem>

                    <MenuItem value="delivery">
                        {t(
                            'pages.usersManagement.roles.delivery',
                        )}
                    </MenuItem>

                    <MenuItem value="client">
                        {t(
                            'pages.usersManagement.roles.client',
                        )}
                    </MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={onReset}
                sx={{
                    borderRadius: 2,
                    minHeight: 40,
                }}
            >
                {t(
                    'pages.usersManagement.filters.reset',
                )}
            </Button>
        </Box>
    );
};

export default UsersToolbar;