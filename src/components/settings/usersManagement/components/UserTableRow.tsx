import { FunctionComponent } from 'react';

import {
    TableCell,
    TableRow,
    Box,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';



import UserStatusChip from './UserStatusChip';
import UserRoleSelect from './UserRoleSelect';
import UserActions from './UserActions';
import { UserRegister } from '../../../../interfaces/User';
import { path } from '../../../../routes/routes';

interface Props {
    user: UserRegister;

    onEdit: (
        userId: string,
    ) => void;

    onDelete: (
        userId: string,
    ) => void;

    onRoleChange: (
        email: string,
        role: string,
    ) => Promise<void>;
}

const UserTableRow: FunctionComponent<Props> = ({
    user,
    onEdit,
    onDelete,
    onRoleChange,
}) => {
    const navigate = useNavigate();

    return (
        <TableRow
            hover
            sx={{
                '&:last-child td, &:last-child th': {
                    border: 0,
                },
            }}
        >
            <TableCell align="center">
                <Box
                    onClick={() =>
                        navigate(
                            `${path.CustomerProfile}/${user._id}`,
                        )
                    }
                    sx={{
                        display: 'flex',
                        alignItems:
                            'center',
                        justifyContent:
                            'center',
                        gap: 1,
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    <Box
                        sx={{
                            width: 10,
                            height: 10,
                            borderRadius:
                                '50%',
                            bgcolor:
                                user.status
                                    ? 'success.main'
                                    : 'error.main',
                        }}
                    />

                    {user.name.first}{' '}
                    {user.name.last}
                </Box>
            </TableCell>

            <TableCell align="center">
                {user.email}
            </TableCell>

            <TableCell align="center">
                <UserRoleSelect
                    user={user}
                    onChange={
                        onRoleChange
                    }
                />
            </TableCell>

            <TableCell align="center">
                <UserStatusChip
                    status={user.status}
                />
            </TableCell>

            <TableCell align="center">
                <UserActions
                    userId={user._id!}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </TableCell>
        </TableRow>
    );
};

export default UserTableRow;