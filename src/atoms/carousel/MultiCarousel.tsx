import { FunctionComponent } from "react";
import Carousel from "react-multi-carousel";
import WithStyles from "react-multi-carousel";

interface MultiCarouselProps {
  
}
 
const MultiCarousel: FunctionComponent<MultiCarouselProps> = () => {
  return (
		<Carousel
			additionalTransfrom={0}
			arrows
			autoPlay
			autoPlaySpeed={1000}
			centerMode={false}
			className=''
			containerClass='container-with-dots'
			dotListClass=''
			draggable
			focusOnSelect={false}
			infinite={false}
			itemClass=''
			keyBoardControl
			minimumTouchDrag={80}
			pauseOnHover
			renderArrowsWhenDisabled={false}
			renderButtonGroupOutside={false}
			renderDotsOutside={false}
			responsive={{
				desktop: {
					breakpoint: {
						max: 3000,
						min: 1024,
					},
					items: 3,
					partialVisibilityGutter: 40,
				},
				mobile: {
					breakpoint: {
						max: 464,
						min: 0,
					},
					items: 1,
					partialVisibilityGutter: 30,
				},
				tablet: {
					breakpoint: {
						max: 1024,
						min: 464,
					},
					items: 2,
					partialVisibilityGutter: 30,
				},
			}}
			rewind
			rewindWithAnimation={false}
			rtl={false}
			shouldResetAutoplay
			showDots={false}
			sliderClass=''
			slidesToSlide={2}
			swipeable
		>
			<div className='card h-100 shadow-sm'>
				<Link to={categoryPath}>
					{!isLoaded && (
						<Skeleton
							variant='rectangular'
							width='100%'
							height={150}
							sx={{bgcolor: "grey.900"}}
						/>
					)}
					<img
						src={product.image_url}
						alt={product.product_name}
						className='card-img-top'
						style={{
							display: isLoaded ? "block" : "none",
							objectFit: "cover",
							height: "160px",
						}}
						onLoad={() => setImageLoaded(product.product_name)}
					/>
				</Link>

				<div className='card-body text-center'>
					<h5 className='card-title'>{product.product_name}</h5>
					<hr />
					<h5 className='text-danger'>
						{product.sale ? `הנחה ${product.discount}%` : "הצעות בשבילך"}
					</h5>
				</div>
			</div>
		</Carousel>
  );
}
 
export default MultiCarousel;