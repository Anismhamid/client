import {useCallback, useEffect, useRef, useState} from "react"; // Add useCallback
import {Box, Chip, IconButton, Typography} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {Link, NavLink} from "react-router-dom";
import {navbarCategoryLinks} from "../../components/settings/navbar/navCategoryies";
import {useTranslation} from "react-i18next";

const ChipNavigation = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [showControls, setShowControls] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(true);
	const {t} = useTranslation();

	const checkScroll = useCallback(() => {
		if (containerRef.current) {
			const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;
			setCanScrollLeft(scrollLeft < 10);
			setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
		}
	}, [setCanScrollLeft, setCanScrollRight]);

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
		setTimeout(checkScroll, 100);
	};

	useEffect(() => {
		const container = containerRef.current;
		if (container) {
			container.addEventListener("scroll", checkScroll);
			// checkScroll();
		}
		return () => {
			if (container) {
				container.removeEventListener("scroll", checkScroll);
			}
		};
	}, [containerRef.current, checkScroll]);

	return (
		<Box
			sx={{
				position: "sticky",
				top: 0,
				zIndex: 10,
				backgroundColor: "white",
				boxShadow: 9,
				m: 1,
				borderRadius: 5,
			}}
			onMouseEnter={() => setShowControls(true)}
			onMouseLeave={() => setShowControls(false)}
		>
			{/* Left Scroll Button */}
			{showControls && canScrollLeft && (
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
						transition: "all 0.3s ease",
						"&:hover": {
							color: "white",
							backgroundColor: "warning.main",
							transform: "translateY(-50%) scale(1.3)",
						},
					}}
				>
					<ChevronLeft />
				</IconButton>
			)}

			{/* Chip Container */}
			<Box
				ref={containerRef}
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-around",
					gap: 2,
					py: 1.5,
					px: 5,
					overflowX: "auto",
					scrollBehavior: "smooth",
					scrollbarWidth: "none",

					"&::-webkit-scrollbar": {display: "none"},
					maskImage:
						"linear-gradient(to right, transparent, #ff0101 30px, #ffffff calc(100% - 30px), transparent)",
					WebkitMaskImage:
						"linear-gradient(to right, transparent, #ff1010 30px, #ffffff calc(100% - 30px), transparent)",
				}}
			>
				<Link
					to='/'
					style={{
						textDecoration: "none",
						flexShrink: 0,
						marginLeft: "auto",
					}}
				>
					<Typography
						component='h1'
						variant='h6'
						color='error'
						sx={{
							fontWeight: "bold",
							ml: 1,
							fontFamily: "'Noto Sans Arabic', 'Hebbo', sans-serif",
							whiteSpace: "nowrap",
							direction: "rtl",
							textAlign: "right",
							"&:hover": {
								color: "warning.main",
								textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
							},
							transition: "all 0.3s ease",
						}}
					>
						الرئيسـيه
					</Typography>
				</Link>
				{navbarCategoryLinks.map((link) => (
					<NavLink to={link.path} key={link.path}>
						{({isActive}) => (
							<Chip
								label={t(link.labelKey)}
								clickable
								sx={{
									px: 2,
									backgroundColor: isActive ? "green" : "primary.main",
									boxShadow: 7,
									color: "white",

									"&:hover": {
										backgroundColor: "red",
										boxShadow: 100,
										transform: "scale(1.1)",
									},

									transition: "all 0.2s ease",
									transform: isActive ? "scale(1.1)" : "scale(1)",
								}}
							/>
						)}
					</NavLink>
				))}
			</Box>

			{/* Right Scroll Button */}
			{showControls && canScrollRight && (
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
					<ChevronRight />
				</IconButton>
			)}
		</Box>
	);
};

export default ChipNavigation;
