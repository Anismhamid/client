import {FunctionComponent, useEffect, useState} from "react";
import {Products} from "../../../interfaces/Products";
import {getProductsInDiscount} from "../../../services/productsServices";
import {Link} from "react-router-dom";
import Loader from "../../../atoms/loader/Loader";
import {Skeleton, Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Scrollbar, Navigation, FreeMode, EffectCoverflow} from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import {generateDiscountsJsonLd} from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";

interface DiscountsAndOffersProps {}

/**
 * Products in discount
 * @returns Products in discount
 */
const DiscountsAndOffers: FunctionComponent<DiscountsAndOffersProps> = () => {
	const {t} = useTranslation();
	const [productsInDiscount, setProductsInDiscount] = useState<Products[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

	useEffect(() => {
		getProductsInDiscount()
			.then((res) => {
				setProductsInDiscount(res);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
			});
	}, []);

	const setImageLoaded = (id: string) => {
		setLoadedImages((prev) => ({...prev, [id]: true}));
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<Box
			component='section'
			className='border-bottom border-5 border-danger mt-5'
			aria-labelledby='discounts-heading'
		>
			<JsonLd data={generateDiscountsJsonLd(productsInDiscount)} />

			<Box textAlign='center' mb={4}>
				<Typography
					variant='h2'
					component='h2'
					id='discounts-heading'
					gutterBottom
					sx={{
						fontWeight: "bold",
						fontSize: {xs: "1.8rem", md: "2.5rem"},
					}}
				>
					{t("categories.discountsAndOffers.discountsAndOffersHeading")}
				</Typography>
				<Typography
					variant='h5'
					component='p'
					color='text.secondary'
					sx={{
						fontSize: {xs: "1rem", md: "1.25rem"},
						maxWidth: "800px",
						margin: "0 auto",
					}}
				>
					<Box component='span' display='block' mb={1}>
						{t("categories.discountsAndOffers.discountsAndOffersSpan")}
					</Box>
					{t("categories.discountsAndOffers.discountsAndOffersDescription")}
				</Typography>
			</Box>

			<Box>
				<Swiper
					modules={[Autoplay, Scrollbar, Navigation, FreeMode, EffectCoverflow]}
					pagination={{clickable: true}}
					autoplay={{
						delay: 3000,
						pauseOnMouseEnter: true,
						disableOnInteraction: false,
					}}
					loop={true}
					spaceBetween={20}
					// slidesPerView={3}
					breakpoints={{
						640: {
							slidesPerView: 2,
							spaceBetween: 20,
						},
						768: {
							slidesPerView: 3,
							spaceBetween: 30,
						},
						1024: {
							slidesPerView: 4,
							spaceBetween: 40,
						},
					}}
					freeMode={true}
					coverflowEffect={{
						rotate: 20,
						stretch: 0,
						depth: 35,
						modifier: 3,
						slideShadows: true,
					}}
					effect='coverflow'
					aria-label='قائمة المنتجات المعروضة'
				>
					{productsInDiscount.map((product: Products) => {
						const isLoaded = loadedImages[product.product_name];
						const discountedPrice =
							product.price - (product.price * product.discount) / 100;

						return (
							<SwiperSlide key={product._id}>
								<Box
									component='article'
									className='position-relative text-center'
									sx={{
										margin: "10px",
										padding: "10px",
										// border: "1px solid #e0e0e0",
										borderRadius: "8px",
										backgroundColor: "white",
										color: "ThreeDLightShadow",

										transition: "transform 0.3s ease",
										"&:hover": {
											transform: "scale(1.02)",
											boxShadow: "0 4px 20px rgb(0, 0, 0) inset",
										},
									}}
								>
									{!isLoaded && (
										<Skeleton
											variant='rectangular'
											width='100%'
											height='250px'
											sx={{
												bgcolor: "grey.300",
												borderRadius: "8px",
											}}
										/>
									)}
									<Link
										to={`/category/${product.category.toLocaleLowerCase()}`}
										aria-label={`عرض تفاصيل ${product.product_name} خصم ${product.discount}%`}
										style={{textDecoration: "none"}}
									>
										<Box sx={{position: "relative"}}>
											<img
												src={product.image_url}
												alt={`${product.product_name} - خصم ${product.discount}% - بيع وشراء`}
												className='img-fluid'
												style={{
													display: isLoaded ? "block" : "none",
													objectFit: "cover",
													height: "250px",
													width: "100%",
													margin: "auto",
													borderRadius: "8px",
												}}
												onLoad={() =>
													setImageLoaded(product.product_name)
												}
											/>

											{/* الخصم */}
											<Box
												sx={{
													position: "absolute",
													top: "10px",
													right: "10px",
													backgroundColor: "error.main",
													color: "white",
													padding: "5px 10px",
													borderRadius: "4px",
													fontWeight: "bold",
												}}
											>
												{product.discount}% خصم
											</Box>

											{/* السعر */}
											<Box
												sx={{
													position: "absolute",
													bottom: "10px",
													left: "10px",
													backgroundColor: "rgba(0,0,0,0.7)",
													color: "white",
													padding: "5px 10px",
													borderRadius: "4px",
												}}
											>
												<Box
													component='span'
													sx={{
														textDecoration: "line-through",
														marginRight: "8px",
														fontSize: "0.9rem",
													}}
												>
													{product.price} ₪
												</Box>
												<Box
													component='span'
													sx={{
														fontWeight: "bold",
														fontSize: "1.1rem",
													}}
												>
													{discountedPrice.toFixed(2)} ₪
												</Box>
											</Box>
										</Box>

										{/* اسم المنتج */}
										<Typography
											variant='h6'
											component='h3'
											sx={{
												marginTop: "10px",
												fontWeight: "bold",
												color: "primary.main",
											}}
										>
											{product.product_name}
										</Typography>

										{/* الفئة */}
										<Typography
											variant='body2'
											color='primary.secondary'
											sx={{marginBottom: "10px"}}
										>
											{product.category === "Fruit"
												? "فواكه"
												: "خضروات"}
										</Typography>
									</Link>
								</Box>
							</SwiperSlide>
						);
					})}
				</Swiper>
			</Box>

			{/* نص ترويجي إضافي للسيو */}
			<Box sx={{textAlign: "center", marginTop: "40px", padding: "20px"}}>
				<Typography
					variant='h5'
					component='h3'
					gutterBottom
					sx={{fontWeight: "bold"}}
				>
					استفد من أفضل العروض في بيع وشراء
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					نقدم لكم يومياً مجموعة مميزة من العروض والتخفيضات على أجود أنواع
					المنتجات. تسوق الآن ووفر أكثر مع ضمان الجودة في كل منتج.
				</Typography>
			</Box>
		</Box>
	);
};

export default DiscountsAndOffers;
