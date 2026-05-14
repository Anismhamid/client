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
import { alpha, useTheme } from "@mui/material/styles";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavCategory } from "./navCategoryies";
import { matchPath } from 'react-router-dom';
import { useEffect } from "react";

interface MegaMenuProps {
	anchorEl: HTMLElement | null;
	open: boolean;
	categories: NavCategory[];
	onClose: () => void;
}

const MegaMenu = ({ anchorEl, open, categories, onClose }: MegaMenuProps) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { t } = useTranslation();
	const loc = useLocation();

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Escape') {
			onClose();
		}
	};

	useEffect(() => {
		console.log('Categories:', categories);
		categories.forEach(cat => {
			console.log(`Category ${cat.labelKey} has ${cat.subCategories?.length || 0} subcategories`);
		});
	}, [categories]);

	console.log('MegaMenu open:', open, 'anchorEl:', anchorEl);

	return (
		<Popper
			open={open}
			anchorEl={anchorEl}
			placement='bottom-start'
			sx={{ zIndex: 1300 }}
			onMouseLeave={!isMobile ? onClose : undefined}
			onKeyDown={handleKeyDown}

		>
			<Paper
				sx={{
					p: isMobile ? 2 : 3,
					maxWidth: isMobile ? '100vw' : 600,
					maxHeight: isMobile ? '80vh' : 'auto',
					overflow: 'auto',
				}}
			>
				<Grid container spacing={3}>
					{categories.map((cat) => (
						<Grid size={{ xs: 12, md: 4 }} key={`cat-${cat.value}`}>
							{/* Category Header */}
							<Box sx={{ mb: 2 }}>
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
											display: "flex",
											alignItems: "center",
											gap: 1,
											"&:focus-visible": {
												outline: `2px solid ${theme.palette.primary.main}`,
												outlineOffset: 2,
											},
											"&:hover": {
												backgroundColor: alpha(theme.palette.primary.main, 0.05),
											},
										}}
									>
										{cat.icon && (
											<Box
												component="img"
												src={cat.icon}
												alt=""
												sx={{ width: 24, height: 24 }}
											/>
										)}
										<Typography variant="h6" fontWeight={700} sx={{ color: "primary.main" }}>
											{t(cat.labelKey)}
										</Typography>
									</ButtonBase>
								) : (
									<Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1 }}>
										{cat.icon && (
											<Box
												component="img"
												src={cat.icon}
												alt=""
												sx={{ width: 24, height: 24 }}
											/>
										)}
										<Typography variant="h6" fontWeight={700} sx={{ color: "primary.main" }}>
											{t(cat.labelKey)}
										</Typography>
									</Box>
								)}
							</Box>

							{/* Subcategories List */}
							{/* Subcategories List */}
							<List disablePadding>
								{cat.subCategories && cat.subCategories.length > 0 ? (
									cat.subCategories.map((sub) => {
										const isActive = !!matchPath({ path: sub.path, end: false }, loc.pathname);

										return (
											<ListItem
												key={`sub-${cat.path}-${sub.path}`}
												disablePadding
												sx={{ mb: 0.5 }}
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
														// ... باقي الـ styles
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
																backgroundColor: "secondary.main",
																ml: 1,
															}}
														/>
													)}
												</ListItemButton>
											</ListItem>
										);
									})
								) : (
									<Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
										No subcategories available
									</Typography>
								)}
							</List>
						</Grid>
					))}
				</Grid>
			</Paper>
		</Popper>
	);
};

export default MegaMenu;
