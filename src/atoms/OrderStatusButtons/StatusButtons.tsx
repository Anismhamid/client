import {FunctionComponent} from "react";
import {Button, CircularProgress} from "@mui/material";
import {useTranslation} from "react-i18next";

type MuiButtonColor =
	| "primary"
	| "secondary"
	| "success"
	| "error"
	| "info"
	| "warning"
	| "inherit";

interface StatusButton {
	value: string;
	label: string;
	color: MuiButtonColor;
}

interface OrderStatusButtonsProps {
	orderNumber: string;
	statusLoading: Record<string, boolean>;
	handleOrderStatus: (
		value: string,
		orderNumber: string,
		setOrderStatuses: React.Dispatch<React.SetStateAction<any>>,
		setStatusLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
	) => Promise<void>;
	setOrderStatuses: React.Dispatch<React.SetStateAction<any>>;
	setStatusLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
	showError: (err: any) => void;
	buttons?: StatusButton[];
	currentStatus: string;
}

const OrderStatusButtons: FunctionComponent<OrderStatusButtonsProps> = ({
	orderNumber,
	statusLoading,
	handleOrderStatus,
	setOrderStatuses,
	setStatusLoading,
	showError,
	currentStatus,
}) => {
	const {t} = useTranslation();

	const defaultButtons: StatusButton[] = [
		{value: t("Preparing"), label: t("orders.status.preparing"), color: "warning"},
		{value: t("Delivered"), label: t("orders.status.delivered"), color: "info"},
		{value: t("Shipped"), label: t("orders.status.shipped"), color: "success"},
	];

	let buttonsToRender: StatusButton[] = [];

	switch (currentStatus) {
		case "Pending":
			buttonsToRender = defaultButtons.filter((btn) => btn.value === "Preparing");
			break;
		case "Preparing":
			buttonsToRender = defaultButtons.filter((btn) => btn.value === "Delivered");
			break;
		case "Shipped":
			buttonsToRender = defaultButtons.filter((btn) => btn.value === "Shipped");
			break;
		case "Shipped":

	}

	if (buttonsToRender.length < 0) return [] ;

	return (
		<>
			{defaultButtons.map((button) => {
				const isDisabled =
					statusLoading[orderNumber] || currentStatus === "Shipped";

				return (
					<Button
						key={button.value}
						variant='contained'
						color={button.color}
						onClick={() =>
							handleOrderStatus(
								button.value,
								orderNumber,
								setOrderStatuses,
								setStatusLoading,
							).catch(showError)
						}
						disabled={isDisabled}
						sx={{mr: 1}}
					>
						{statusLoading[orderNumber] ? (
							<CircularProgress size={20} color='inherit' />
						) : (
							button.label
						)}
					</Button>
				);
			})}
		</>
	);
};

export default OrderStatusButtons;
