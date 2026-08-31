import {
    useCallback,
    useEffect,
    useState,
} from 'react';

import { getAuditLogs } from '../../../../services/messages';

import {
    AuditLog,
    AuditLogsPagination,
} from '../../../../interfaces/InvestigationMessage';

const DEFAULT_PAGINATION: AuditLogsPagination = {
    total: 0,
    limit: 50,
    skip: 0,
    hasMore: false,
};

const useMessageAuditLogs = () => {
    const [logs, setLogs] =
        useState<AuditLog[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [pagination, setPagination] =
        useState<AuditLogsPagination>(
            DEFAULT_PAGINATION,
        );

    const fetchAuditLogs = useCallback(
        async (
            limit = 50,
            skip = 0,
        ) => {
            try {
                setLoading(true);
                setError(null);

                const data =
                    await getAuditLogs(
                        limit,
                        skip,
                    );

                setLogs(
                    Array.isArray(data.logs)
                        ? data.logs
                        : [],
                );

                setPagination(
                    data.pagination ??
                        DEFAULT_PAGINATION,
                );
            } catch (error) {
                console.error(
                    'Failed to fetch message audit logs:',
                    error,
                );

                setLogs([]);

                setPagination(
                    DEFAULT_PAGINATION,
                );

                setError(
                    'Failed to load audit logs',
                );
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    return {
        logs,
        loading,
        error,
        pagination,
        fetchAuditLogs,
    };
};

export default useMessageAuditLogs;