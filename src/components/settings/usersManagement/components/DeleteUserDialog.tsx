import { FunctionComponent } from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';

import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { useTranslation } from 'react-i18next';

interface Props {
    open: boolean;
    userName?: string;

    onClose: () => void;
    onConfirm: () => void;
}

const DeleteUserDialog: FunctionComponent<Props> = ({
    open,
    userName,
    onClose,
    onConfirm,
}) => {
    const theme = useTheme();
    const { t } = useTranslation();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='xs'
            fullWidth
            slotProps={{ paper: { sx: { borderRadius: 4 } } }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'error.main',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                    }}
                >
                    <DeleteOutlineIcon fontSize='large' />
                </Box>
            </Box>

            <DialogTitle align='center' fontWeight={800}>
                {t('pages.usersManagement.actions.delete')}
            </DialogTitle>

            <DialogContent>
                <Typography align='center' color='text.secondary'>
                    {t('pages.usersManagement.actions.deleteMessage', {
                        name: userName || '',
                    })}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3, px: 3 }}>
                <Button
                    fullWidth
                    variant='outlined'
                    color='inherit'
                    onClick={onClose}
                    sx={{ borderRadius: 2 }}
                >
                    {t('pages.usersManagement.actions.cancelDelete')}
                </Button>

                <Button
                    fullWidth
                    variant='contained'
                    color='error'
                    disableElevation
                    onClick={onConfirm}
                    sx={{ borderRadius: 2 }}
                >
                    {t('pages.usersManagement.actions.confirmDelete')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteUserDialog;