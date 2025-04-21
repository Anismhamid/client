import {FunctionComponent} from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import styles from "./styles.module.css";
import { Button } from "@mui/material";

interface AlertDialogProps {
	openModal: () => void;
	show: boolean;
	handleDelete: () => void;
	onHide: () => void;
	title:string;
	description:string;
}

const AlertDialogs: FunctionComponent<AlertDialogProps> = ({title,description,openModal,show,onHide,handleDelete}) => {

	return (
		<AlertDialog.Root
			open={show}
			onOpenChange={(open) => (open ? openModal() : onHide())}
		>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className={styles.Overlay} />
				<AlertDialog.Content className={styles.Content}>
					<AlertDialog.Title dir='rtl' className={styles.Title}>
						{title}
					</AlertDialog.Title>
					<AlertDialog.Description dir='rtl' className={styles.Description}>
						{description}
					</AlertDialog.Description>
					<div style={{display: "flex", gap: 25, justifyContent: "flex-end"}}>
						<AlertDialog.Cancel asChild>
							<Button
							variant="contained"
							color="primary"
								className={`${styles.Button} ${styles.mauve}`}
								onClick={onHide}
							>
								ביטול
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action asChild>
							<Button
							variant="contained"
							color="error"
								className={`${styles.Button} ${styles.red}`}
								onClick={() => {
									handleDelete();
									onHide();
								}}
							>
								כן, מחק
							</Button>
						</AlertDialog.Action>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
};

export default AlertDialogs;
