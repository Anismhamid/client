import { Fab, SpeedDial, SpeedDialAction, Zoom } from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import AddProductModal from './addAndUpdateProduct/CreatePostModal';
import SettingsIcon from '@mui/icons-material/Settings';
import { useUser } from '../../hooks/useUSer';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTranslation } from 'react-i18next';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SearchIcon from '@mui/icons-material/Search';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import { path } from '../../routes/routes';
import { useNavigate } from 'react-router-dom';
import { RoleType } from '../../interfaces/UserType';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

const SpeedDialComponent: FunctionComponent = () => {
    const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
    const { auth, isLoggedIn } = useUser();
    const [visible, setVisible] = useState(false);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const handleScroll = () => {
        setVisible(window.scrollY > 300);
    };

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // const isAdminAndModerator = auth && auth._id

    const showAddProductModal = () => setOnShowAddModal(true);
    const hideAddProductModal = () => setOnShowAddModal(false);

    const isAdmin = auth?.role === RoleType.Admin;

    const isModerator = auth?.role === RoleType.Moderator;
    const isManagement = isAdmin || isModerator;

    const actions = [
        {
            icon: <ManageAccountsIcon />,
            name: t('SpeedDial.actions.manageAccounts'),
            addClick: () => navigate(path.UsersManagement),
            show: isManagement,
        },

        {
            icon: <ReportGmailerrorredIcon />,
            name: t('SpeedDial.actions.reports'),
            addClick: () => navigate(path.ReportsManagement),
            show: isManagement,
        },

        {
            icon: <SearchIcon />,
            name: t('SpeedDial.actions.messageInvestigation'),
            addClick: () => navigate(path.MessageInvestigation),
            show: isManagement,
        },

        {
            /* ==========================================
                            Message Audit Logs
                        ========================================== */
            icon: <ImportContactsIcon />,
            name: t('SpeedDial.actions.messageAuditLogs'),
            addClick: () => navigate(path.MessageAuditLogs),
            show: isManagement,
        },
        {
            icon: <AddSharpIcon />,
            name: t('SpeedDial.actions.addProduct'),
            addClick: showAddProductModal,
            show: true,
        },
        {
            icon: <WorkOutlineIcon />,
            name: t('pages.jobs.actions.addJob'),
            addClick: () => navigate(path.createJob),
            show: true,
        },
    ];

    // Back to top button
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            {auth && isLoggedIn && (
                <SpeedDial
                    ariaLabel='SpeedDial basic example'
                    sx={{
                        position: 'fixed',
                        bottom: 10,
                        right: 10,
                        zIndex: 1100,
                    }}
                    icon={<SettingsIcon />}
                >
                    {actions
                        .filter((action) => action.show)
                        .map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={action.addClick}
                            />
                        ))}
                </SpeedDial>
            )}
            <Zoom in={visible}>
                <Fab
                    color='primary'
                    onClick={handleClick}
                    style={{
                        position: 'fixed',
                        bottom: 16,
                        left: 16,
                        zIndex: 1100,
                    }}
                    size='medium'
                    aria-label='Back to top'
                >
                    <KeyboardArrowUpIcon />
                </Fab>
            </Zoom>
            {/* Add product modal */}
            <AddProductModal
                show={onShowAddModal}
                onHide={() => hideAddProductModal()}
            />
        </>
    );
};

export default SpeedDialComponent;
