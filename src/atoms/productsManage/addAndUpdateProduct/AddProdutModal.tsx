import {FunctionComponent} from "react";
import {
	Modal,
	Box,
	IconButton,
	Typography,
	Paper,
	Fade,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {Close as CloseIcon} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import NewProductForm from "./ProductForm";
import useAddProductFormik from "../../../hooks/useAddProductFormik";

interface AddProductModalProps {
	show: boolean;
	onHide: () => void;
}

const AddProductModal: FunctionComponent<AddProductModalProps> = ({show, onHide}) => {
	const {t} = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const dir = handleRTL();

	const {formik, imageFile, setImageFile, imageData, setImageData} =
		useAddProductFormik(onHide);

	return (
		<Modal
			dir={dir}
			open={show}
			onClose={onHide}
			closeAfterTransition
			slotProps={{
				backdrop: {
					timeout: 300,
					sx: {
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						backdropFilter: isMobile ? "blur(2px)" : "blur(4px)",
					},
				},
			}}
			sx={{
				display: "flex",
				alignItems: isMobile ? "flex-end" : "center",
				justifyContent: "center",
				zIndex: 2000,
			}}
		>
			<Fade in={show} timeout={300}>
				<Paper
					elevation={isMobile ? 16 : 24}
					sx={{
						position: "relative",
						width: "100%",
						maxWidth: isMobile
							? "100%"
							: {
									xs: "95vw",
									sm: "90vw",
									md: "800px",
									lg: "900px",
								},
						maxHeight: isMobile ? "85vh" : "95vh",
						borderRadius: isMobile ? "20px 20px 0 0" : 4,
						overflow: "hidden",
						border: `1px solid ${theme.palette.divider}`,
						boxShadow: isMobile
							? `0 -10px 30px rgba(0, 0, 0, 0.3)`
							: `0 25px 50px -12px rgba(0, 0, 0, 0.5)`,
						background:
							theme.palette.mode === "dark"
								? `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[900]} 100%)`
								: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
					}}
				>
					{/* Header with swipe indicator for mobile */}
					{isMobile && (
						<Box
							sx={{
								display: "flex",
								justifyContent: "center",
								pt: 1,
								pb: 0.5,
							}}
						>
							<Box
								sx={{
									width: 40,
									height: 4,
									borderRadius: 2,
									backgroundColor: theme.palette.action.disabled,
								}}
							/>
						</Box>
					)}

					{/* Header */}
					<Box
						sx={{
							position: "sticky",
							top: 0,
							zIndex: 10,
							px: isMobile ? 2 : {xs: 2, sm: 3, md: 4},
							py: isMobile ? 2 : 3,
							background:
								theme.palette.mode === "dark"
									? `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
									: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
							color: theme.palette.primary.contrastText,
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							borderBottom: `1px solid ${theme.palette.divider}`,
						}}
					>
						<Typography
							variant='h4'
							component='h1'
							sx={{
								fontWeight: 800,
								fontSize: isMobile
									? "1.25rem"
									: {xs: "1.5rem", sm: "1.75rem", md: "2rem"},
								letterSpacing: "-0.5px",
								textShadow: "0 2px 4px rgba(0,0,0,0.2)",
							}}
						>
							{t("modals.addProductModal.title")}
						</Typography>
						<IconButton
							onClick={onHide}
							sx={{
								color: theme.palette.primary.contrastText,
								backgroundColor: "rgba(255, 255, 255, 0.1)",
								"&:hover": {
									backgroundColor: "rgba(255, 255, 255, 0.2)",
									transform: isMobile ? "scale(1.1)" : "rotate(90deg)",
								},
								transition: "all 0.3s ease",
								width: isMobile ? 36 : 40,
								height: isMobile ? 36 : 40,
								...(isMobile && {
									"&:active": {
										transform: "scale(0.95)",
									},
								}),
							}}
						>
							<CloseIcon fontSize={isMobile ? "small" : "medium"} />
						</IconButton>
					</Box>

					{/* Decorative element - hidden on mobile for simplicity */}
					{!isMobile && (
						<Box
							sx={{
								position: "absolute",
								top: 0,
								left: 0,
								right: 0,
								height: "4px",
								background: `linear-gradient(90deg, 
									${theme.palette.secondary.main} 0%, 
									${theme.palette.primary.main} 50%, 
									${theme.palette.success.main} 100%)`,
							}}
						/>
					)}

					{/* Body */}
					<Box
						sx={{
							p: isMobile ? 2 : {xs: 2, sm: 3, md: 4},
							maxHeight: isMobile
								? "calc(85vh - 100px)"
								: "calc(95vh - 120px)",
							overflowY: "auto",
							WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
							"&::-webkit-scrollbar": {
								width: isMobile ? "6px" : "8px",
							},
							"&::-webkit-scrollbar-track": {
								background:
									theme.palette.mode === "dark"
										? theme.palette.grey[900]
										: theme.palette.grey[100],
								borderRadius: 4,
							},
							"&::-webkit-scrollbar-thumb": {
								background: theme.palette.primary.main,
								borderRadius: 4,
								"&:hover": {
									background: theme.palette.primary.dark,
								},
							},
						}}
					>
						<Box
							sx={{
								background:
									theme.palette.mode === "dark"
										? "rgba(255, 255, 255, 0.02)"
										: "rgba(0, 0, 0, 0.01)",
								borderRadius: isMobile ? 2 : 3,
								p: isMobile ? 1.5 : {xs: 2, sm: 3},
								border: `1px solid ${theme.palette.divider}`,
								boxShadow:
									theme.palette.mode === "dark"
										? "inset 0 1px 0 rgba(255,255,255,0.05)"
										: "inset 0 1px 0 rgba(255,255,255,0.8)",
							}}
						>
							<NewProductForm
								formik={formik}
								imageFile={imageFile}
								setImageFile={setImageFile}
								imageData={imageData}
								setImageData={setImageData}
								onHide={onHide}
								mode='add'
							/>
						</Box>

						{/* Footer note - hidden on mobile to save space */}
						{!isMobile && (
							<Typography
								variant='caption'
								sx={{
									display: "block",
									textAlign: "center",
									mt: 3,
									pt: 2,
									borderTop: `1px dashed ${theme.palette.divider}`,
									color: theme.palette.text.secondary,
									fontStyle: "italic",
								}}
							>
								{t("modals.addProductModal.footerNote") ||
									"املأ جميع الحقول المطلوبة للإضافة"}
							</Typography>
						)}
					</Box>
				</Paper>
			</Fade>
		</Modal>
	);
};

export default AddProductModal;
