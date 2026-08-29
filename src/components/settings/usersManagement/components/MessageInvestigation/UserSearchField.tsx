import {
    Autocomplete,
    Avatar,
    Box,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { useEffect, useState } from 'react';
import { InvestigationUser } from '../../../../../interfaces/InvestigationMessage';
import { searchInvestigationUsers } from '../../../../../services/messageInvestigationService';

interface UserSearchFieldProps {
    label: string;

    value: InvestigationUser | null;

    onChange: (
        user: InvestigationUser | null,
    ) => void;

    disabled?: boolean;
}

const UserSearchField = ({
    label,
    value,
    onChange,
    disabled = false,
}: UserSearchFieldProps) => {
    const [inputValue, setInputValue] =
        useState('');

    const [options, setOptions] =
        useState<InvestigationUser[]>([]);

    const [loading, setLoading] =
        useState(false);

    useEffect(() => {
        if (inputValue.trim().length < 2) {
            setOptions([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setLoading(true);

                const users =
                    await searchInvestigationUsers(
                        inputValue.trim(),
                    );

                setOptions(users);
            } catch (error) {
                console.error(
                    'User search error:',
                    error,
                );

                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [inputValue]);

    return (
        <Autocomplete
            fullWidth
            disabled={disabled}
            value={value}
            options={options}
            loading={loading}
            filterOptions={(x) => x}
            isOptionEqualToValue={(
                option,
                selected,
            ) => option._id === selected._id}
            getOptionLabel={(user) =>
                `${user.name.first} ${user.name.last} — ${user.email}`
            }
            onChange={(_, newValue) => {
                onChange(newValue);
            }}
            inputValue={inputValue}
            onInputChange={(
                _,
                newInputValue,
            ) => {
                setInputValue(newInputValue);
            }}
            noOptionsText="No users found"
            loadingText="Searching..."
            renderOption={(
                props,
                user,
            ) => (
                <Box
                    component="li"
                    {...props}
                    key={user._id}
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        alignItems: 'center',
                    }}
                >
                    <Avatar
                        src={
                            user.image?.url
                        }
                        alt={
                            user.image?.alt ||
                            user.name.first
                        }
                    >
                        {user.name.first?.[0]}
                    </Avatar>

                    <Box>
                        <Typography
                            variant="body2"
                            fontWeight={600}
                        >
                            {user.name.first}{' '}
                            {user.name.last}
                        </Typography>

                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {user.email}
                        </Typography>

                        <Typography
                            variant="caption"
                            display="block"
                            color="text.secondary"
                        >
                            {user.role}
                        </Typography>
                    </Box>
                </Box>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Search by name or email"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <SearchIcon
                                    sx={{
                                        mr: 1,
                                        color: 'text.secondary',
                                    }}
                                />

                                {
                                    params
                                        .InputProps
                                        .startAdornment
                                }
                            </>
                        ),
                        endAdornment: (
                            <>
                                {loading && (
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
    );
};

export default UserSearchField;