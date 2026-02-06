import {FunctionComponent, useEffect, useState, useCallback} from "react";
import {Products} from "../../../interfaces/Products";
import {getProductsInDiscount} from "../../../services/productsServices";
import {Link} from "react-router-dom";
import Loader from "../../../atoms/loader/Loader";
import {Skeleton, Box, Typography, useTheme, useMediaQuery} from "@mui/material";
import {useTranslation} from "react-i18next";

import "swiper/css";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, EffectCoverflow} from "swiper/modules";
import "swiper/css";
import JsonLd from "../../../../utils/JsonLd";
import {formatPrice} from "../../../helpers/dateAndPriceFormat";
import {generateDiscountsJsonLd} from "../../../../utils/structuredData";
import {path} from "../../../routes/routes";

interface DiscountsAndOffersProps {}

/**
 * Products in discount component
 * @returns Products in discount section with swiper carousel
 */
const DiscountsAndOffers: FunctionComponent<DiscountsAndOffersProps> = () => {
	const {t} = useTranslation();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

	const [productsInDiscount, setProductsInDiscount] = useState<Products[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await getProductsInDiscount();
				setProductsInDiscount(data);
			} catch (err) {
				console.error("Failed to fetch discounted products:", err);
				setError(t("common.errors.fetchFailed") || "Failed to load products");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [t]);

	const setImageLoaded = useCallback((id: string) => {
		setLoadedImages((prev) => new Set(prev).add(id));
	}, []);

	const calculateDiscountedPrice = (price: number, discount: number): number => {
		return price - (price * discount) / 100;
	};

	// Determine swiper parameters based on screen size
	// تحديد نوع للـ Swiper parameters
	interface SwiperParams {
		slidesPerView: number;
		spaceBetween: number;
		effect: "slide" | "coverflow";
		coverflowEffect?: {
			rotate: number;
			stretch: number;
			depth: number;
			modifier: number;
			slideShadows: boolean;
		};
	}

	// ثم أصلح الدالة getSwiperParams
	const getSwiperParams = (): SwiperParams => {
		if (isMobile) {
			return {
				slidesPerView: 1,
				spaceBetween: 16,
				effect: "slide",
			};
		}

		if (isTablet) {
			return {
				slidesPerView: 2,
				spaceBetween: 24,
				effect: "coverflow",
			};
		}

		return {
			slidesPerView: 3,
			spaceBetween: 32,
			effect: "coverflow",
		};
	};

	const swiperParams = getSwiperParams();

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return (
			<Box
				component='section'
				aria-labelledby='discounts'
				textAlign='center'
				py={4}
			>
				<Typography color='error' variant='body1'>
					{error}
				</Typography>
			</Box>
		);
	}

	if (productsInDiscount.length === 0 && !loading) {
		return null;
	}

	const productsList = generateDiscountsJsonLd(productsInDiscount);

	const currentUrl = `https://client-qqq1.vercel.app/dicounts-and-offers`;

	return (
		<>
			<JsonLd data={productsList} />
			<link rel='canonical' href={currentUrl} />

			<title>
				{t(`categories.discountsAndOffers.categories.discountsAndOffers.title`)}|
				صفقة
			</title>
			<meta
				name='description'
				content={t(
					`categories.discountsAndOffers.categories.discountsAndOffers.title`,
				)}
			/>

			<Box
				component='section'
				aria-labelledby='discounts-heading'
				sx={{
					py: {xs: 3, md: 5},
					px: {xs: 2, sm: 3, md: 4},
				}}
			>
				{/* Header Section */}
				<Box textAlign='center' mb={{xs: 3, md: 5}}>
					<Typography
						variant='h4'
						component='h2'
						id='discounts-heading'
						gutterBottom
						sx={{
							fontWeight: "bold",
							color: "primary",
							mb: 2,
						}}
					>
						{t(
							"categories.discountsAndOffers.categories.discountsAndOffers.title",
						)}
					</Typography>

					<Box sx={{maxWidth: "800px", margin: "0 auto", px: 2}}>
						<Typography
							variant='h6'
							component='p'
							color='text.secondary'
							sx={{
								fontSize: {xs: "1rem", md: "1.25rem"},
								lineHeight: 1.6,
								mb: 2,
							}}
						>
							{t(
								"categories.discountsAndOffers.categories.discountsAndOffers.description",
							)}
						</Typography>

						<Typography
							variant='body1'
							color='text.secondary'
							sx={{opacity: 0.8}}
						>
							{t(
								"categories.discountsAndOffers.categories.discountsAndOffers.subtitle",
							)}
						</Typography>
					</Box>
				</Box>

				{/* Products Slider */}
				<Box sx={{position: "relative"}}>
					<Swiper
						modules={[Autoplay, Navigation, EffectCoverflow]}
						autoplay={{
							delay: 4000,
							disableOnInteraction: false,
							pauseOnMouseEnter: true,
						}}
						loop={productsInDiscount.length > 1}
						navigation={!isMobile}
						centeredSlides={true}
						grabCursor={true}
						{...swiperParams}
						coverflowEffect={
							swiperParams.effect === "coverflow"
								? {
										rotate: 20,
										stretch: 0,
										depth: 100,
										modifier: 1,
										slideShadows: true,
									}
								: undefined
						}
						className='discounts-swiper'
						aria-label={
							t("categories.discountsAndOffers.ariaLabel") ||
							"Discounted products carousel"
						}
					>
						{productsInDiscount.map((product) => {
							const isLoaded = loadedImages.has(product._id as string);
							const discountedPrice = calculateDiscountedPrice(
								product.price,
								product.discount,
							);
							const productUrl = `/category/${product.category.toLocaleLowerCase()}/${product._id}`;

							return (
								<SwiperSlide key={product._id}>
									<Box
										component='article'
										sx={{
											height: "100%",
											bgcolor: "background.paper",
											borderRadius: 2,
											overflow: "hidden",
											boxShadow: theme.shadows[2],
											transition:
												"transform 0.3s ease, box-shadow 0.3s ease",
											"&:hover": {
												transform: "translateY(-4px)",
												boxShadow: theme.shadows[8],
											},
										}}
									>
										<Link
											to={productUrl}
											aria-label={`${product.product_name} - ${product.discount}% ${t("categories.discountsAndOffers.common.discount")} - ${formatPrice(discountedPrice)}`}
											style={{
												textDecoration: "none",
												color: "inherit",
											}}
										>
											{/* Image Container */}
											<Box
												sx={{
													position: "relative",
													overflow: "hidden",
													aspectRatio: "4/3",
												}}
											>
												{!isLoaded && (
													<Skeleton
														variant='rectangular'
														width='100%'
														height='100%'
														sx={{bgcolor: "grey.200"}}
													/>
												)}

												<img
													src={product.image.url}
													alt={`${product.product_name} - ${product.discount}% ${t("categories.discountsAndOffers.common.discount")}`}
													style={{
														display: isLoaded
															? "block"
															: "none",
														width: "100%",
														height: "100%",
														objectFit: "cover",
														transition: "transform 0.5s ease",
													}}
													onLoad={() =>
														setImageLoaded(
															product._id as string,
														)
													}
													loading='lazy'
												/>

												{/* Discount Badge */}
												<Box
													sx={{
														position: "absolute",
														top: 12,
														right: 12,
														bgcolor: "error.main",
														color: "white",
														px: 1.5,
														py: 0.5,
														borderRadius: 1,
														fontWeight: "bold",
														fontSize: "0.875rem",
														zIndex: 2,
													}}
												>
													{product.discount}%{" "}
													{t(
														"categories.discountsAndOffers.common.discount",
													)}
												</Box>
											</Box>

											{/* Product Info */}
											<Box sx={{p: 3}}>
												{/* Product Name */}
												<Typography
													variant='h6'
													component='h3'
													sx={{
														fontWeight: 600,
														mb: 1,
														color: "text.primary",
														height: "3em",
														overflow: "hidden",
														display: "-webkit-box",
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
													}}
												>
													{product.product_name}
												</Typography>

												{/* Category */}
												<Typography
													variant='body2'
													color='text.secondary'
													sx={{mb: 2, fontSize: "0.875rem"}}
												>
													{product.category}
												</Typography>

												{/* Price */}
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 1.5,
													}}
												>
													<Typography
														variant='h6'
														component='span'
														sx={{
															color: "primary.main",
															fontWeight: "bold",
															fontSize: "1.25rem",
														}}
													>
														{formatPrice(discountedPrice)}
													</Typography>

													<Typography
														variant='body2'
														component='span'
														sx={{
															color: "text.disabled",
															textDecoration:
																"line-through",
															fontSize: "0.875rem",
														}}
													>
														{formatPrice(product.price)}
													</Typography>

													<Box
														component='span'
														sx={{
															ml: "auto",
															color: "success.main",
															fontWeight: "medium",
															fontSize: "0.875rem",
														}}
													>
														{t(
															"categories.discountsAndOffers.common.save",
														)}{" "}
														{formatPrice(
															product.price -
																discountedPrice,
														)}
													</Box>
												</Box>
											</Box>
										</Link>
									</Box>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</Box>

				{/* View All Link (optional) */}
				{productsInDiscount.length > 3 && (
					<Box textAlign='center' mt={4}>
						<Link
							to={path.DiscountsAndOffers}
							style={{
								textDecoration: "none",
								color: theme.palette.primary.main,
								fontWeight: 500,
								fontSize: "1rem",
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
							}}
						>
							{t("categories.discountsAndOffers.categories.viewAll") ||
								"View All Offers"}
							<span aria-hidden='true'>→</span>
						</Link>
					</Box>
				)}
			</Box>
		</>
	);
};

export default DiscountsAndOffers;
