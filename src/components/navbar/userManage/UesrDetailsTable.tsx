import { FunctionComponent } from 'react';
import RoleType from '../../../interfaces/UserType';
import {
    styled,
    TableContainer,
    tableCellClasses,
    Table,
    TableCell,
    TableBody,
    TableRow,
    Paper,
} from '@mui/material';
import { User } from '../../../interfaces/chat/usersMessages';
import { useTranslation } from 'react-i18next';

interface UserDetailTableProps {
    user: User;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
    // إما حذف قسم الـ head أو تعديله:
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        fontWeight: 'bold',
        fontSize: '1rem',
    },
}));

const UserDetailTable: FunctionComponent<UserDetailTableProps> = ({ user }) => {
    const { t } = useTranslation();

    return (
        <TableContainer style={{ width: '100%' }} component={Paper}>
            <Table aria-label='user details table '>
                <TableBody>
                    <TableRow>
                        <StyledTableCell align='center'>
                            {t('fullName')}
                        </StyledTableCell>
                        <TableCell className=' fs-5'>
                            {user.name?.first} {user.name?.last}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <StyledTableCell align='center'>
                            {t('phone')}
                        </StyledTableCell>
                        <TableCell className=' fs-5'>
                            {user.phone?.phone_1 || '-'}
                        </TableCell>
                    </TableRow>

                    {user.phone?.phone_2 && (
                        <TableRow>
                            <StyledTableCell>
                                {t('secondaryPhone')}
                            </StyledTableCell>
                            <TableCell className=' fs-5'>
                                {user.phone.phone_2}
                            </TableCell>
                        </TableRow>
                    )}

                    <TableRow>
                        <StyledTableCell align='center'>
                            {t('address')}
                        </StyledTableCell>
                        <TableCell className='fs-5'>
                            {user.address?.city &&
                            user.address?.street &&
                            user.address?.houseNumber
                                ? `البلد: ${user.address.city} شارع: ${user.address.street} رقم البيت: ${user.address.houseNumber}`
                                : '-'}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <StyledTableCell align='center'>
                            {t('email')}
                        </StyledTableCell>
                        <TableCell className=' fs-5'>{user.email}</TableCell>
                    </TableRow>

                    <TableRow>
                        <StyledTableCell align='center'>
                            {t('userType')}
                        </StyledTableCell>
                        <TableCell
                            className='fs-5'
                            sx={{ color: 'success.main', fontWeight: 'bold' }}
                        >
                            {user.role === RoleType.Admin
                                ? 'مدير ومشرف'
                                : user.role === RoleType.Moderator
                                  ? 'مشرف'
                                  : 'مستخدم'}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserDetailTable;
