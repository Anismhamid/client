import {useRef} from "react"; // Add useCallback
import {Box, Chip, IconButton, Typography} from "@mui/material";
import {ChevronLeftTwoTone, ChevronRightTwoTone} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {productsAndCategories} from "./navCategoryies";
import {useTranslation} from "react-i18next";
import JsonLd from "../../../utils/JsonLd";

const ChipNavigation = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const {t} = useTranslation();

	const scroll = (direction: "left" | "right") => {
		const container = containerRef.current;
		if (!container) return;
		const scrollAmount = container.clientWidth * 0.8;
		const newScrollLeft =
			direction === "left"
				? container.scrollLeft - scrollAmount
				: container.scrollLeft + scrollAmount;

		container.scrollTo({
			left: newScrollLeft,
			behavior: "smooth",
		});
	};

	return (
		<Box
			component='nav'
			aria-label='Main Categories'
			sx={{
				position: "sticky",
				top: 0,
				zIndex: 200,
				backgroundColor: "white",
				borderRadius: "0 0 20px 20px",
				py: 1,
				boxShadow: "0px 5px 5px rgba(59, 59, 59, 0.308)",
			}}
		>
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@type": "ItemList",
					name: "تصنيفات المنتجات",
					itemListElement: productsAndCategories.map((category, index) => ({
						"@type": "SiteNavigationElement",
						position: index + 1,
						name: t(category.labelKey),
						url: `${window.location.origin}${category.path}`,
					})),
				}}
			/>
			{/* Left Scroll Button */}
			<IconButton
				className='scroll-button'
				onClick={() => scroll("left")}
				sx={{
					position: "absolute",
					left: 0,
					transform: "translateY(-50%)",
					top: "50%",
					zIndex: 2,
					backgroundColor: "background.paper",
					color: "text.primary",
					boxShadow: 2,
					transition: "all 0.1s ease",
					"&:hover": {
						color: "white",
						backgroundColor: "warning.main",
						transform: "translateY(-50%) scale(1.3)",
					},
				}}
			>
				<ChevronLeftTwoTone />
			</IconButton>
			{/* Chip Container */}
			<Box
				ref={containerRef}
				component='ul'
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 2,
					px: 5,
					m: 0,
					p: 1,
					listStyle: "none",
					overflowX: "auto",
					scrollbarWidth: "none",

					"&::-webkit-scrollbar": {display: "none"},
					maskImage:
						"linear-gradient(to right, transparent, #fff 30px, #fff calc(100% - 30px), transparent)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent, #fff 30px, #fff calc(100% - 30px), transparent)",
				}}
			>
				{productsAndCategories.map((category) => (
					<Box
						key={category.value}
						component='li'
						role='listitem'
						sx={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							minWidth: 120,
						}}
					>
						<NavLink
							title={`${t("links.products")} - ${t(category.labelKey)}`}
							to={category.path}
							style={{textDecoration: "none"}}
						>
							{({isActive}) => (
								<Chip
									clickable
									sx={{
										width: 70,
										height: 70,
										borderRadius: "50%",
										backgroundColor: isActive
											? "primary.main"
											: "background.paper",
										boxShadow: isActive ? 8 : 3,
										border: "1px solid",
										borderColor: isActive
											? "primary.main"
											: "divider",
										transition: "all 0.3s ease",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										mt: 1,
										"&:hover": {
											transform: "scale(1.1)",
											boxShadow: 5,
										},
									}}
									label={
										<Box
											component='img'
											src={category.icon}
											alt={`${t(category.labelKey)} - تصنيف`}
											sx={{
												width: 43,
												objectFit: "cover",
											}}
										/>
									}
								/>
							)}
						</NavLink>

						<Typography
							component={"h2"}
							variant='body2'
							sx={{
								fontWeight: 600,
								fontSize: "0.75rem",
								color: "text.primary",
								mt: 0.5,
							}}
						>
							{t(category.labelKey)}
						</Typography>
					</Box>
				))}
			</Box>
			{/* Right Scroll Button */}
			<IconButton
				className='scroll-button'
				onClick={() => scroll("right")}
				sx={{
					position: "absolute",
					right: 0,
					top: "50%",
					transform: "translateY(-50%)",
					zIndex: 2,
					backgroundColor: "background.paper",
					color: "text.primary",
					boxShadow: 2,
					transition: "all 0.3s ease",
					"&:hover": {
						color: "white",
						backgroundColor: "warning.main",
						transform: "translateY(-50%) scale(1.3)",
					},
				}}
			>
				<ChevronRightTwoTone />
			</IconButton>
		</Box>
	);
};

export default ChipNavigation;
