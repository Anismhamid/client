import {FunctionComponent, useEffect, useState} from "react";
import {Products} from "../../../interfaces/Products";
import {getProductsInDiscount} from "../../../services/productsServices";
import {Link} from "react-router-dom";
import Loader from "../../../atoms/loader/Loader";
import {Chip, Skeleton} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Scrollbar, Navigation, FreeMode, EffectCoverflow} from "swiper/modules";
import "swiper/css";
import "swiper/css/scrollbar";

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
		<div className=' border-bottom border-5 border-danger mt-5'>
			<div>
				<h1 className='text-center mb-4 display-5 fw-bold'>
					{t("categories.discountsAndOffers.discountsAndOffersHeading")}
				</h1>
				<p className='text-center lead mb-5'>
					<span className='d-block'>
						{t("categories.discountsAndOffers.discountsAndOffersSpan")}
					</span>
					{t("categories.discountsAndOffers.discountsAndOffersDescription")}
				</p>
			</div>

			<div>
				<Swiper
					modules={[Autoplay, Scrollbar, Navigation, FreeMode, EffectCoverflow]}
					pagination={{clickable: true}}
					autoplay={{delay: 3000}}
					loop={true}
					spaceBetween={1}
					slidesPerView={3}
					freeMode={true}
					coverflowEffect={{
						rotate: 20,
						stretch: 0,
						depth: 35,
						modifier: 3,
						slideShadows: true,
					}}
					effect='coverflow'
				>
					{productsInDiscount.map((product: Products) => {
						const isLoaded = loadedImages[product.product_name];

						return (
							<SwiperSlide key={product._id}>
								<div className='position-relative text-center'>
									{!isLoaded && (
										<Skeleton
											variant='rectangular'
											width='100%'
											height='250px'
											sx={{bgcolor: "grey.900"}}
										/>
									)}
									<Link to={product.category}>
										<img
											src={product.image_url}
											alt={product.product_name}
											className='img-fluid'
											style={{
												display: isLoaded ? "block" : "none",
												objectFit: "scale-down",
												height: "250px",
												width: "250px",
												margin: "auto",
											}}
											onLoad={() =>
												setImageLoaded(product.product_name)
											}
										/>

										{/* טקסט */}
										<div style={{
											top:"90%"
										}} className='position-absolute top-75 start-50 translate-middle text-white'>
											<Chip
												label={`${product.discount}% הנחה`}
												color='error'
											/>
										</div>
									</Link>
								</div>
							</SwiperSlide>
						);
					})}
				</Swiper>
			</div>
		</div>
	);
};

export default DiscountsAndOffers;
