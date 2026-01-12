import {Fab, SpeedDial, SpeedDialAction, Zoom} from "@mui/material";
import {FunctionComponent, useEffect, useState} from "react";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import AddProdutModal from "./AddProdutModal";
import SettingsIcon from "@mui/icons-material/Settings";
import {useUser} from "../../context/useUSer";
import RoleType from "../../interfaces/UserType";
import {fontAwesomeIcon} from "../../FontAwesome/Icons";
import {useNavigate} from "react-router-dom";
import {path} from "../../routes/routes";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

interface SpeedDialComponentProps {}

const SpeedDialComponent: FunctionComponent<SpeedDialComponentProps> = () => {
	const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
	const {auth} = useUser();
	const navigate = useNavigate();
	const [visible, setVisible] = useState(false);
	const {t} = useTranslation();

	const handleScroll = () => {
		setVisible(window.scrollY > 300);
	};

	const handleClick = () => {
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	const isAdminAndModerator =
		(auth && auth.role === RoleType.Admin) ||
		(auth && auth.role === RoleType.Moderator);

	const showAddProductModal = () => setOnShowAddModal(true);
	const hideAddProductModal = () => setOnShowAddModal(false);

	const actions = [
		{
			icon: <AddSharpIcon />,
			name: t("SpeedDial.actions.addProduct"),
			addClick: () => showAddProductModal(),
		},
	];

	// Back to top button
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			{isAdminAndModerator ? (
				<>
					<SpeedDial
						ariaLabel='SpeedDial basic example'
						sx={{position: "fixed", bottom: 80, right: 10, zIndex: 1100}}
						icon={<SettingsIcon />}
					>
						{actions.map((action) => (
							<SpeedDialAction
								key={action.name}
								icon={action.icon}
								// tooltipOpen
								tooltipTitle={action.name}
								onClick={action.addClick}
							/>
						))}
					</SpeedDial>
					<SpeedDial
						ariaLabel='cart'
						sx={{position: "fixed", bottom: 16, right: 10, zIndex: 1100}}
						icon={fontAwesomeIcon.cartInoc}
						onClick={() => {
							navigate(path.Cart);
						}}
					/>
				</>
			) : (
				auth?._id && (
					<SpeedDial
						ariaLabel={t("SpeedDial.actions.cart")}
						sx={{position: "fixed", bottom: 16, right: 10, zIndex: 1100}}
						icon={fontAwesomeIcon.cartInoc}
						onClick={() => {
							navigate(path.Cart);
						}}
					/>
				)
			)}
			<Zoom in={visible}>
				<Fab
					color='primary'
					onClick={handleClick}
					style={{
						position: "fixed",
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
			<AddProdutModal
				show={onShowAddModal}
				onHide={hideAddProductModal}
				// refrehs={function (): void {
				// 	throw new Error("Function not implemented.");
				// }}
			/>
		</>
	);
};

export default SpeedDialComponent;
