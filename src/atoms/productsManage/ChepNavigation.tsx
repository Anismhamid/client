import {useRef, useState, useEffect, useCallback} from "react"; // Add useCallback
import {Box, Chip, IconButton} from "@mui/material";
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import {NavLink} from "react-router-dom";
import {navbarCategoryLinks} from "../../helpers/navCategoryies";
import {useTranslation} from "react-i18next";

const ChipNavigation = () => {
	const containerRef = useRef<HTMLDivElement>(null); // Specify type for ref
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
			checkScroll();
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
				"& .scroll-button": {
					opacity: 1,
				},
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
						top: "50%",
						transform: "translateY(-50%)",
						zIndex: 2,
						backgroundColor: "background.paper",
						color: "text.primary",
						boxShadow: 2,
						transition: "all 0.3s ease",
						"&:hover": {
							backgroundColor: "primary.main",
							color: "white",
							transform: "translateY(-50%) scale(1.1)",
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
					gap: 1,
					py: 1.5,
					px: 1,
					overflowX: "auto",
					scrollBehavior: "smooth",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {display: "none"},
					maskImage:
						"linear-gradient(to right, transparent, white 50px, white 90%, transparent)",
				}}
			>
				{navbarCategoryLinks.map((link) => (
					<NavLink to={link.path} key={link.path}>
						{({isActive}) => (
							<Chip
								label={t(link.labelKey)}
								clickable
								sx={{
									px: 2,
									backgroundColor: isActive ? "black" : "primary.main",
									color: isActive ? "white" : "white",
									"&:hover": {
										backgroundColor: isActive
											? "primary.dark"
											: "deafult.main",
										boxShadow: 7,
										color: "primary.main",
									},
									boxShadow: 5,
									transition: "all 0.2s ease",
									transform: isActive ? "scale(1.05)" : "scale(1)",
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
							backgroundColor: "primary.main",
							color: "white",
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
