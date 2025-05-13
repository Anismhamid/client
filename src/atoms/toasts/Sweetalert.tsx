import {FunctionComponent, useEffect} from "react";
import Swal from "sweetalert2";


interface AlertDialogProps {
	show: boolean;
	handleDelete: () => void;
	onHide: () => void;
	title: string;
	description: string;
}

const AlertDialogs: FunctionComponent<AlertDialogProps> = ({
	title,
	description,
	show,
	onHide,
	handleDelete,
}) => {
	useEffect(() => {
		if (show) {
			const swalWithBootstrapButtons = Swal.mixin({
				customClass: {
					confirmButton: "btn btn-success",
					cancelButton: "btn btn-danger",
				},
				buttonsStyling: false,
			});

			swalWithBootstrapButtons
				.fire({
					title,
					text: description,
					icon: "warning",
					confirmButtonText: "כן, מחק",
					showCancelButton: true,
					cancelButtonText: "ביטול",
					reverseButtons: false,
				})
				.then((result) => {
					if (result.isConfirmed) {
						handleDelete();
						swalWithBootstrapButtons.fire({
							title: "נמחק!",
							text: "הפריט נמחק בהצלחה.",
							icon: "success",
						});
					}
					onHide();
				});
		}
	}, [show]);
	return null
};

export default AlertDialogs;
