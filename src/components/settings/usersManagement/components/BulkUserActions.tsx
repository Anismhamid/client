import { FunctionComponent } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    useTheme,
} from '@mui/material';

import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import ClearIcon from '@mui/icons-material/Clear';

import RoleType from '../../../../interfaces/UserType';

interface BulkUserActionsProps {
    selectedCount: number;

    selectedRole: string;

    onRoleChange: (role: RoleType | '') => void;

    onBulkRoleUpdate: () => Promise<void>;

    onActivate: () => Promise<void>;

    onDeactivate: () => Promise<void>;

    onDelete: () => Promise<void>;

    onClear: () => void;

    t: (key: string) => string;

    direction: 'rtl' | 'ltr';
}

const BulkUserActions: FunctionComponent<BulkUserActionsProps> = ({
    selectedCount,
    selectedRole,
    onRoleChange,
    onBulkRoleUpdate,
    onActivate,
    onDeactivate,
    onDelete,
    onClear,
    t,
    direction,
}) => {
    const theme = useTheme();

    if (selectedCount === 0) {
        return null;
    }

    return (
        <Box
            dir={direction}
            sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: theme.palette.background.paper,

                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
            }}
        >
            <Typography
                sx={{
                    fontWeight: 800,
                    mr: 'auto',
                }}
            >
                {selectedCount}{' '}
                {t('pages.usersManagement.bulk.selected')}
            </Typography>

            <Button
                variant="outlined"
                color="success"
                startIcon={<CheckCircleOutlineIcon />}
                onClick={onActivate}
                sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                }}
            >
                {t('pages.usersManagement.bulk.activate')}
            </Button>

            <Button
                variant="outlined"
                color="warning"
                startIcon={<BlockOutlinedIcon />}
                onClick={onDeactivate}
                sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                }}
            >
                {t('pages.usersManagement.bulk.deactivate')}
            </Button>

            <FormControl
                size="small"
                sx={{
                    minWidth: 160,
                }}
            >
                <InputLabel>
                    {t('pages.usersManagement.bulk.role')}
                </InputLabel>

                <Select
                    value={selectedRole}
                    label={t(
                        'pages.usersManagement.bulk.role',
                    )}
                    onChange={(event) =>
                        onRoleChange(
                            event.target.value as RoleType,
                        )
                    }
                    sx={{
                        borderRadius: 2,
                    }}
                >
                    <MenuItem value="">
                        {t(
                            'pages.usersManagement.bulk.selectRole',
                        )}
                    </MenuItem>

                    <MenuItem value={RoleType.Admin}>
                        {t(
                            'pages.usersManagement.roles.admin',
                        )}
                    </MenuItem>

                    <MenuItem value={RoleType.Moderator}>
                        {t(
                            'pages.usersManagement.roles.moderator',
                        )}
                    </MenuItem>

                    <MenuItem value={RoleType.Delivery}>
                        {t(
                            'pages.usersManagement.roles.delivery',
                        )}
                    </MenuItem>

                    <MenuItem value={RoleType.Client}>
                        {t(
                            'pages.usersManagement.roles.client',
                        )}
                    </MenuItem>
                </Select>
            </FormControl>

            <Button
                variant="contained"
                disabled={!selectedRole}
                onClick={onBulkRoleUpdate}
                sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                }}
            >
                {t(
                    'pages.usersManagement.bulk.updateRole',
                )}
            </Button>

            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverOutlinedIcon />}
                onClick={onDelete}
                sx={{
                    borderRadius: 2,
                    fontWeight: 700,
                }}
            >
                {t(
                    'pages.usersManagement.bulk.delete',
                )}
            </Button>

            <Button
                variant="text"
                startIcon={<ClearIcon />}
                onClick={onClear}
                sx={{
                    borderRadius: 2,
                }}
            >
                {t(
                    'pages.usersManagement.bulk.clear',
                )}
            </Button>
        </Box>
    );
};

export default BulkUserActions;