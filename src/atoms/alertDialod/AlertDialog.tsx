import {FunctionComponent} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";

interface AlertDialogProps {
	openModal: () => void;
	show: boolean;
	handleDelete: () => void;
	onHide: () => void;
}

const AlertDialogs: FunctionComponent<AlertDialogProps> = ({openModal,show,onHide,handleDelete}) => {

	return (
		<AlertDialog.Root
			open={show}
			onOpenChange={(open) => (open ? openModal() : onHide())}
		>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className={styles.Overlay} />
				<AlertDialog.Content className={styles.Content}>
					<AlertDialog.Title className={styles.Title}>
						Are you absolutely sure?
					</AlertDialog.Title>
					<AlertDialog.Description className={styles.Description}>
						This action cannot be undone. This will permanently delete your
						account and remove your data from our servers.
					</AlertDialog.Description>
					<div style={{display: "flex", gap: 25, justifyContent: "flex-end"}}>
						<AlertDialog.Cancel asChild>
							<button
								className={`${styles.Button} ${styles.mauve}`}
								onClick={onHide}
							>
								Cancel
							</button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<button
								className={`${styles.Button} ${styles.red}`}
								onClick={() => {
									handleDelete();
									onHide();
								}}
							>
								Yes, delete
							</button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};

export default AlertDialogs;
