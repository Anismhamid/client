import {FunctionComponent} from "react";
import ProductCategory from "./PostsCategory";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router-dom";
import JsonLd from "../../../../utils/JsonLd";
import {generateCategoryJsonLd} from "../../../../utils/structuredData";
import {Box, Typography} from "@mui/material";
import {motion} from "framer-motion";
import ChepNavigation from "../../navbar/ChepNavigation";

interface ProductsProps {}
/**
 * Mains products
 * @returns products
 */
const Products: FunctionComponent<ProductsProps> = () => {
	const {t} = useTranslation();
	const {category} = useParams<{category: string}>();

	if (!category) {
		return <div className='text-center mt-4'>Category not found</div>;
	}

	const categoryData = generateCategoryJsonLd(category, []);

	const pageTitle = t(`categories.${category}.heading`);

	return (
		<>
				<JsonLd data={categoryData} />
				<title>{pageTitle}</title>
				<meta
					name='description'
					content={t(`categories.${category}.description`)}
				/>
			<Box
				className='container-fluid'
				sx={{
					py: {xs: 4, md: 6},
					position: "relative",
					overflow: "hidden",
				}}
			>
				{/* Animated Background Elements */}
				<Box
					sx={{
						position: "absolute",
						top: -100,
						right: -100,
						width: 300,
						height: 300,
						borderRadius: "50%",
						background: "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)",
						animation: "float 8s ease-in-out infinite",
						border: 1,
						borderColor: "rgba(0,0,0,0.05)",
						opacity: 0.8,
					}}
				/>
				<Box
					sx={{
						position: "absolute",
						bottom: -80,
						left: -80,
						width: 250,
						height: 250,
						borderRadius: "50%",
						background: "linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)",
						animation: "float 10s ease-in-out infinite 1s",
						opacity: 0.8,
					}}
				/>

				<Box
					sx={{
						position: "relative",
						zIndex: 1,
						textAlign: "center",
						p: 2,
						width: "100%",
						maxWidth: "100%",
						margin: "0 auto",
					}}
				>
					<motion.div
						initial={{opacity: 0, y: 30}}
						animate={{opacity: 1, y: 0}}
						transition={{duration: 0.8}}
					>
						<Typography
							variant='h1'
							sx={{
								mb: 4,
								color: "text.secondary",
								maxWidth: "600px",
								margin: "0 auto",
								fontSize: {xs: "1rem", sm: "1.25rem", md: "1.5rem"},
							}}
						>
							{t(`categories.${category}.heading`)}
						</Typography>
						<Typography
							variant='body1'
							sx={{
								color: "text.secondary",
								maxWidth: "800px",
								margin: "0 auto",
								mt: 4,
								fontSize: {xs: "1rem", sm: "1.25rem", md: "1.5rem"},
							}}
						>
							{t(`categories.${category}.description`)}
						</Typography>
					</motion.div>
				</Box>
			</Box>
			<ChepNavigation />
			<ProductCategory category={category} />
		</>
	);
};

export default Products;
