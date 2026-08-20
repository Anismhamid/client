import { FunctionComponent } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { useTranslation } from 'react-i18next';
import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

export type UserStatusFilter = 'all' | 'active' | 'inactive';

export interface UsersFiltersProps {
    search: string;
    status: UserFilterStatus;
    role: UserFilterRole;

    onSearch: (value: string) => void;

    onStatusChange: (value: UserFilterStatus) => void;

    onRoleChange: (value: UserFilterRole) => void;

    onReset: () => void;
}

const UsersFilters: FunctionComponent<UsersFiltersProps> = ({
    search,
    status,
    role,
    onSearch,
    onStatusChange,
    onRoleChange,
    onReset,
}) => {
    const { t } = useTranslation();

    const handleStatusChange = (event: SelectChangeEvent) => {
        onStatusChange(event.target.value as UserFilterStatus);
    };

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: '2fr 1fr 1fr auto',
                },
                gap: 2,
                mb: 3,
                p: 2,
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <TextField
                fullWidth
                size='small'
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder={t('pages.usersManagement.filters.search')}
                InputProps={{
                    startAdornment: (
                        <SearchIcon
                            sx={{
                                mr: 1,
                                color: 'text.secondary',
                            }}
                        />
                    ),
                }}
            />

            <FormControl fullWidth size='small'>
                <InputLabel>
                    {t('pages.usersManagement.filters.status')}
                </InputLabel>

                <Select
                    value={status}
                    label={t('pages.usersManagement.filters.status')}
                    onChange={handleStatusChange}
                >
                    <MenuItem value='all'>
                        {t('pages.usersManagement.status.all')}
                    </MenuItem>

                    <MenuItem value='active'>
                        {t('pages.usersManagement.status.active')}
                    </MenuItem>

                    <MenuItem value='inactive'>
                        {t('pages.usersManagement.status.inactive')}
                    </MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth size='small'>
                <InputLabel>
                    {t('pages.usersManagement.filters.role')}
                </InputLabel>

                <Select
                    value={role}
                    label={t('pages.usersManagement.filters.role')}
                    onChange={(event) =>
                        onRoleChange(event.target.value as UserFilterRole)
                    }
                >
                    <MenuItem value='all'>
                        {t('pages.usersManagement.roles.all')}
                    </MenuItem>

                    <MenuItem value='Admin'>
                        {t('pages.usersManagement.roles.admin')}
                    </MenuItem>

                    <MenuItem value='Moderator'>
                        {t('pages.usersManagement.roles.moderator')}
                    </MenuItem>

                    <MenuItem value='Client'>
                        {t('pages.usersManagement.roles.client')}
                    </MenuItem>
                </Select>
            </FormControl>

            <Button
                variant='outlined'
                color='inherit'
                onClick={onReset}
                startIcon={<RestartAltIcon />}
                sx={{
                    minHeight: 40,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                }}
            >
                {t('pages.usersManagement.filters.reset')}
            </Button>
        </Box>
    );
};

export default UsersFilters;
