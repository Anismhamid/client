import {Fab, SpeedDial, SpeedDialAction, Zoom} from "@mui/material";
import {FunctionComponent, useEffect, useState} from "react";
import AddSharpIcon from "@mui/icons-material/AddSharp";
import AddProductModal from "./addAndUpdateProduct/AddProdutModal";
import SettingsIcon from "@mui/icons-material/Settings";
import {useUser} from "../../context/useUSer";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {useTranslation} from "react-i18next";

interface SpeedDialComponentProps {}

const SpeedDialComponent: FunctionComponent<SpeedDialComponentProps> = () => {
	const [onShowAddModal, setOnShowAddModal] = useState<boolean>(false);
	const {auth, isLoggedIn} = useUser();
	const [visible, setVisible] = useState(false);
	const {t} = useTranslation();

	const handleScroll = () => {
		setVisible(window.scrollY > 300);
	};

	const handleClick = () => {
		window.scrollTo({top: 0, behavior: "smooth"});
	};

	// const isAdminAndModerator = auth && auth._id

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
			{auth && isLoggedIn && (
				<SpeedDial
					ariaLabel='SpeedDial basic example'
					sx={{position: "fixed", bottom: 10, right: 10, zIndex: 1100}}
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
			<AddProductModal show={onShowAddModal} onHide={() => hideAddProductModal()} />
		</>
	);
};

export default SpeedDialComponent;
