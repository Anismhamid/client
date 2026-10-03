import { FunctionComponent } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { useTranslation } from 'react-i18next';
import {
    UserFilterRole,
    UserFilterStatus,
} from '../types/usersManagement.types';

export interface UsersFiltersProps {
    search: string;
    status: UserFilterStatus;
    role: UserFilterRole;

    onSearch: (value: string) => void;
    onRoleChange: (value: UserFilterRole) => void;
    onReset: () => void;
}

const UsersFilters: FunctionComponent<UsersFiltersProps> = ({
    search,
    status,
    role,
    onSearch,
    onRoleChange,
    onReset,
}) => {
    const { t } = useTranslation();

    const dirty =
        Boolean(search) ||
        (status as string) !== 'all' ||
        (role as string) !== 'all';

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                flexWrap: 'wrap',
                alignItems: 'center',
            }}
        >
            <TextField
                size='small'
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder={t('pages.usersManagement.filters.search')}
                sx={{
                    flex: 1,
                    minWidth: 240,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2.5,
                        bgcolor: 'background.paper',
                    },
                }}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                        ),
                    },
                }}
            />

            <FormControl size='small' sx={{ minWidth: 170 }}>
                <InputLabel>{t('pages.usersManagement.filters.role')}</InputLabel>

                <Select
                    value={role}
                    label={t('pages.usersManagement.filters.role')}
                    onChange={(event) =>
                        onRoleChange(event.target.value as UserFilterRole)
                    }
                    sx={{ borderRadius: 2.5, bgcolor: 'background.paper' }}
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

            {dirty && (
                <Button
                    color='inherit'
                    onClick={onReset}
                    startIcon={<RestartAltIcon />}
                    sx={{ borderRadius: 2.5, whiteSpace: 'nowrap' }}
                >
                    {t('pages.usersManagement.filters.reset')}
                </Button>
            )}
        </Box>
    );
};

export default UsersFilters;