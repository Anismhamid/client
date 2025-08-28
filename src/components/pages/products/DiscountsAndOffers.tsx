import {FunctionComponent, useEffect, useState} from "react";
import {Products} from "../../../interfaces/Products";
import {getProductsInDiscount} from "../../../services/productsServices";
import {Link} from "react-router-dom";
import Loader from "../../../atoms/loader/Loader";
import { Skeleton, Box, Typography} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Scrollbar, Navigation, FreeMode, EffectCoverflow} from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";
import ProductDiscountStructuredData from "../../../atoms/structuredData.ts/ProductDiscountStructuredData";

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
			{/* تحسين العناوين للسيو */}
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

			{/* إضافة بيانات منظمة للعروض */}
			{/* <script type='application/ld+json'>
				{`
          {
            "@context": "https://schema.org",
            "@type": "OfferCatalog",
            "name": "عروض وتخفيضات سوق السخنيني",
            "description": "أفضل العروض والتخفيضات على الفواكه والخضروات في سوق السخنيني",
            "numberOfItems": "${productsInDiscount.length}",
            "itemListElement": [
              ${productsInDiscount
					.map(
						(product, index) => `
                {
                  "@type": "Offer",
                  "position": "${index + 1}",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "${product.product_name}",
                    "description": "${product.product_name} بجودة عالية مع خصم ${product.discount}%",
                    "image": "${product.image_url}",
                    "category": "${product.category}"
                  },
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "priceCurrency": "ILS",
                    "price": "${product.price - (product.price * product.discount) / 100}",
                    "referenceQuantity": {
                      "@type": "QuantitativeValue",
                      "value": "1",
                      "unitCode": "KGM"
                    }
                  },
                  "price": "${product.price - (product.price * product.discount) / 100}",
                  "priceCurrency": "ILS",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "GroceryStore",
                    "name": "سوق السخنيني"
                  }
                }
              `,
					)
					.join(",")}
            ]
          }
        `}
			</script> */}
			<ProductDiscountStructuredData products={productsInDiscount} />

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
					slidesPerView={1}
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
										border: "1px solid #e0e0e0",
										borderRadius: "8px",
										backgroundColor: "white",
										transition: "transform 0.3s ease",
										"&:hover": {
											transform: "scale(1.02)",
											boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
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
										to={`/category/${product.category}`}
										aria-label={`عرض تفاصيل ${product.product_name} مع خصم ${product.discount}%`}
										style={{textDecoration: "none"}}
									>
										<Box sx={{position: "relative"}}>
											<img
												src={product.image_url}
												alt={`${product.product_name} - خصم ${product.discount}% - سوق السخنيني`}
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
												loading='lazy'
											/>

											{/* شريط الخصم */}
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

											{/* معلومات السعر */}
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
												color: "text.primary",
											}}
										>
											{product.product_name}
										</Typography>

										{/* الفئة */}
										<Typography
											variant='body2'
											color='text.secondary'
											sx={{marginBottom: "10px"}}
										>
											{product.category}
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
					استفد من أفضل العروض في سوق السخنيني
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					نقدم لكم يومياً مجموعة مميزة من العروض والتخفيضات على أجود أنواع
					الفواكه والخضروات. تسوق الآن ووفر أكثر مع ضمان الجودة والطزاجة في كل
					منتج.
				</Typography>
			</Box>
		</Box>
	);
};

export default DiscountsAndOffers;
