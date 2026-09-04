import { FunctionComponent, useEffect } from 'react';
import Swal from 'sweetalert2';

interface AlertDialogProps {
    show: boolean;
    onConfirm: () => void;
    onHide: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    successText?: string;
}

const AlertDialogs: FunctionComponent<AlertDialogProps> = ({
    title,
    description,
    show,
    onHide,
    onConfirm,
    confirmText = 'Yes',
    cancelText = 'Cancel',
    successText = 'Done',
}) => {
    useEffect(() => {
        if (!show) return;

        let isMounted = true;

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-outline-success',
                cancelButton: 'btn btn-outline-danger ms-5',
            },
            buttonsStyling: true,
        });

        swalWithBootstrapButtons
            .fire({
                title,
                text: description,
                icon: 'warning',
                confirmButtonText: confirmText,
                showCancelButton: true,
                cancelButtonText: cancelText,
                reverseButtons: false,
            })
            .then(async (result) => {
                if (!isMounted) return;

                if (result.isConfirmed) {
                    onConfirm();

                    await swalWithBootstrapButtons.fire({
                        text: successText,
                        icon: 'success',
                    });
                }

                onHide();
            });

        return () => {
            isMounted = false;
        };
    }, [
        description,
        onConfirm,
        onHide,
        show,
        title,
        confirmText,
        cancelText,
        successText,
    ]);

    return null;
};

export default AlertDialogs;