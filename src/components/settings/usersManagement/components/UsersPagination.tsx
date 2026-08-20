import { FunctionComponent } from 'react';

import {
    Box,
    Pagination,
    Typography,
} from '@mui/material';

interface UsersPaginationProps {
    page: number;

    totalPages: number;

    totalItems: number;

    rowsPerPage: number;

    onPageChange: (
        page: number,
    ) => void;
}

const UsersPagination: FunctionComponent<
    UsersPaginationProps
> = ({
    page,
    totalPages,
    totalItems,
    rowsPerPage,
    onPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const start =
        (page - 1) * rowsPerPage + 1;

    const end = Math.min(
        page * rowsPerPage,
        totalItems,
    );

    return (
        <Box
            sx={{
                mt: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                عرض {start} - {end} من{' '}
                {totalItems}
            </Typography>

            <Pagination
                page={page}
                count={totalPages}
                color="primary"
                shape="rounded"
                onChange={(_, value) =>
                    onPageChange(value)
                }
            />
        </Box>
    );
};

export default UsersPagination;