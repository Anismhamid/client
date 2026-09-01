import { useEffect, useState } from 'react';
import { IconButton, Tooltip, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { UserReportType } from '../../interfaces/report.types';
import useReport from '../../hooks/useReport';
import ReportModal from './ReportModal';
import { Report, ReportOutlined } from '@mui/icons-material';

interface ReportButtonProps {
    targetId: string;
    type: UserReportType;
    /** Hidden until the user hovers/focuses the parent (e.g. inside a PostCard) */
    subtle?: boolean;
    size?: 'small' | 'medium' | 'large';
}

const ReportButton = ({
    targetId,
    type,
    subtle = false,
    size = 'small',
}: ReportButtonProps) => {
    const { t } = useTranslation();
    const { hasUserReported } = useReport();
    const [open, setOpen] = useState(false);
    const [alreadyReported, setAlreadyReported] = useState(false);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let mounted = true;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChecking(true);

        hasUserReported(type, targetId).then((result) => {
            if (mounted) {
                setAlreadyReported(result);
                setChecking(false);
            }
        });

        return () => {
            mounted = false;
        };
    }, [targetId, type, hasUserReported]);

    if (checking) {
        return (
            <IconButton size={size} disabled>
                <CircularProgress size={16} />
            </IconButton>
        );
    }

    return (
        <>
            <Tooltip
                title={
                    alreadyReported
                        ? t('modals.report.alreadyReported')
                        : t('modals.report.reportThis')
                }
            >
                <span>
                    <IconButton
                        size={size}
                        disabled={alreadyReported}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpen(true);
                        }}
                        sx={{
                            color: alreadyReported
                                ? 'error.main'
                                : subtle
                                  ? 'text.disabled'
                                  : 'text.secondary',
                            opacity: subtle && !alreadyReported ? 0 : 1,
                            transition: 'opacity 0.15s ease, color 0.15s ease',
                            '.MuiPaper-root:hover &, .MuiCard-root:hover &':
                                subtle ? { opacity: 1 } : undefined,
                            '&:hover': {
                                color: 'error.main',
                            },
                        }}
                    >
                        {alreadyReported ? (
                            <Report
                                fontSize={size === 'large' ? 'medium' : 'small'}
                                sx={{ fontSize: 16, color: 'error.main' }}
                            />
                        ) : (
                            <ReportOutlined
                                fontSize={size === 'large' ? 'medium' : 'small'}
                                sx={{ fontSize: 16, color: 'error.main' }}
                            />
                        )}
                    </IconButton>
                </span>
            </Tooltip>

            <ReportModal
                open={open}
                onClose={() => setOpen(false)}
                targetId={targetId}
                type={type}
                onSuccess={() => setAlreadyReported(true)}
            />
        </>
    );
};

export default ReportButton;
