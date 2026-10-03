import { FunctionComponent } from 'react';
import {
    Box,
    Button,
    FormControl,
    IconButton,
    MenuItem,
    Paper,
    Select,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CloseIcon from '@mui/icons-material/Close';

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
        <Paper
            dir={direction}
            elevation={8}
            sx={{
                position: 'fixed',
                bottom: { xs: 12, md: 24 },
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: theme.zIndex.modal - 1,
                width: 'max-content',
                maxWidth: 'calc(100vw - 24px)',
                px: 2,
                py: 1.25,
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                flexWrap: 'wrap',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title={t('pages.usersManagement.bulk.clear')}>
                    <IconButton size='small' onClick={onClear}>
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </Tooltip>

                <Typography fontWeight={800} noWrap>
                    {selectedCount} {t('pages.usersManagement.bulk.selected')}
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                    size='small'
                    color='success'
                    startIcon={<CheckCircleOutlineIcon />}
                    onClick={onActivate}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {t('pages.usersManagement.bulk.activate')}
                </Button>

                <Button
                    size='small'
                    color='warning'
                    startIcon={<BlockOutlinedIcon />}
                    onClick={onDeactivate}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {t('pages.usersManagement.bulk.deactivate')}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <FormControl size='small' sx={{ minWidth: 140 }}>
                    <Select
                        displayEmpty
                        value={selectedRole}
                        onChange={(event) =>
                            onRoleChange(event.target.value as RoleType)
                        }
                        sx={{ borderRadius: 2 }}
                    >
                        <MenuItem value=''>
                            {t('pages.usersManagement.bulk.selectRole')}
                        </MenuItem>
                        <MenuItem value={RoleType.Admin}>
                            {t('pages.usersManagement.roles.admin')}
                        </MenuItem>
                        <MenuItem value={RoleType.Moderator}>
                            {t('pages.usersManagement.roles.moderator')}
                        </MenuItem>
                        <MenuItem value={RoleType.Client}>
                            {t('pages.usersManagement.roles.client')}
                        </MenuItem>
                    </Select>
                </FormControl>

                <Button
                    size='small'
                    variant='contained'
                    disableElevation
                    disabled={!selectedRole}
                    onClick={onBulkRoleUpdate}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    {t('pages.usersManagement.bulk.updateRole')}
                </Button>
            </Box>

            <Button
                size='small'
                color='error'
                startIcon={<DeleteOutlineIcon />}
                onClick={onDelete}
                sx={{ borderRadius: 2, fontWeight: 700 }}
            >
                {t('pages.usersManagement.bulk.delete')}
            </Button>
        </Paper>
    );
};

export default BulkUserActions;