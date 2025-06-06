import {Box, Button, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {useTranslation} from "react-i18next";

interface DeleteAccountBoxProps {
	onDelete: () => void;
}

const DeleteAccountBox: FunctionComponent<DeleteAccountBoxProps> = ({onDelete}) => {
	const {t} = useTranslation();

	return (
		<Box
			sx={{
				textAlign: "center",
				mt: 15,
				maxWidth: "100%",
				backdropFilter: "blur(5px)",
				border: "2px solid #ff4b2b",
				boxShadow: "0 0 2px rgb(255, 75, 43)",
				borderBottom: 0,
			}}
			className=' rounded-4 mx-auto p-3 lead'
		>
			<Typography className=' fs-2 lead' variant='h5' fontWeight='bold' mb={2}>
				{t("removeAccount.heading")}
			</Typography>
			<Typography className='fs-5 lead' variant='body1' mb={3}>
				{t("removeAccount.description")}
			</Typography>
			<Button
				variant='contained'
				color='error'
				startIcon={<DeleteIcon />}
				onClick={onDelete}
				size='small'
				sx={{
					px: 2,
					fontWeight: "bold",
					borderRadius: 2,
					fontSize: "1rem",
					transition: "0.1s",
					"&:hover": {
						backgroundColor: "#ff0000",
					},
				}}
			>
				{t("removeAccount.buttonText")}
			</Button>
		</Box>
	);
};

export default DeleteAccountBox;
