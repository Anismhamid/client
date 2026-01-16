import {
	Box,
	Popper,
	Paper,
	Grid,
	Typography,
	useMediaQuery,
	ListItemText,
	ListItemButton,
	ListItem,
	List,
	ButtonBase,
} from "@mui/material";
import {alpha, useTheme} from "@mui/material/styles";
import {NavLink, useLocation} from "react-router-dom";
import {useTranslation} from "react-i18next";
import { CategoryEnum } from "./navCategoryies";

interface MegaMenuProps {
	anchorEl: HTMLElement | null;
	open: boolean;
	categories: CategoryEnum[];
	onClose: () => void;
}

const MegaMenu = ({anchorEl, open, categories, onClose}: MegaMenuProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const {t} = useTranslation();
	const loc = useLocation();

	return (
		<Popper
			open={open}
			anchorEl={anchorEl}
			placement='bottom-start'
			sx={{zIndex: 1300}}
			onMouseLeave={!isMobile ? onClose : undefined}
		>
			<Paper
				sx={{
					p: 3,
					maxWidth: 600,
				}}
			>
				<Grid container spacing={3}>
					{categories.map((cat) => (
						<Grid size={{xs: 12, md: 4}} key={`cat-${cat.path}`}>
							{/* Category Header */}
							<Box sx={{mb: 2}}>
								{cat.path ? (
									<ButtonBase
										component={NavLink}
										to={cat.path}
										onClick={onClose}
										sx={{
											textAlign: "left",
											width: "100%",
											p: 1,
											borderRadius: 1,
											"&:hover": {
												backgroundColor: alpha(
													theme.palette.primary.main,
													0.05,
												),
											},
										}}
									>
										<Typography
											variant='h6'
											fontWeight={700}
											sx={{
												color: "primary.main",
											}}
										>
											{t(cat.labelKey)}
										</Typography>
									</ButtonBase>
								) : (
									<Typography
										variant='h6'
										fontWeight={700}
										sx={{
											color: "primary.main",
											p: 1,
										}}
									>
										{t(cat.labelKey)}
									</Typography>
								)}
							</Box>

							{/* Subcategories List */}
							<List disablePadding>
								{cat.subCategories?.map((sub) => {
									const isActive = loc.pathname == sub.path;

									return (
										<ListItem
											key={`sub-${cat.path}-${sub.path}`}
											disablePadding
											sx={{
												mb: 0.5,
											}}
										>
											<ListItemButton
												component={NavLink}
												to={sub.path}
												onClick={onClose}
												selected={isActive}
												sx={{
													borderRadius: 1,
													py: 1,
													px: 2,
													color: isActive
														? "secondary.main"
														: "text.primary",
													backgroundColor: isActive
														? alpha(
																theme.palette.secondary
																	.main,
																0.1,
															)
														: "transparent",
													borderLeft: isActive
														? `3px solid ${theme.palette.secondary.main}`
														: "3px solid transparent",
													"&.Mui-selected": {
														backgroundColor: alpha(
															theme.palette.secondary.main,
															0.1,
														),
														"&:hover": {
															backgroundColor: alpha(
																theme.palette.secondary
																	.main,
																0.15,
															),
														},
													},
													"&:hover": {
														backgroundColor: alpha(
															theme.palette.secondary.main,
															0.05,
														),
														color: "secondary.main",
														transform: "translateX(4px)",
														transition: "all 0.2s ease",
													},
												}}
											>
												<ListItemText
													primary={t(sub.labelKey)}
													primaryTypographyProps={{
														fontWeight: isActive ? 600 : 400,
														fontSize: "0.95rem",
													}}
												/>
												{isActive && (
													<Box
														sx={{
															width: 8,
															height: 8,
															borderRadius: "50%",
															backgroundColor:
																"secondary.main",
															ml: 1,
														}}
													/>
												)}
											</ListItemButton>
										</ListItem>
									);
								})}
							</List>
						</Grid>
					))}
				</Grid>
			</Paper>
		</Popper>
	);
};

export default MegaMenu;
