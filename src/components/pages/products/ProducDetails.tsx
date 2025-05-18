import {FunctionComponent, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {getProductByspicificName} from "../../../services/productsServices";
import {Products} from "../../../interfaces/Products";
import {Box, CircularProgress, Typography, Paper, Button} from "@mui/material";

interface ProducDetailsProps {}

const ProducDetails: FunctionComponent<ProducDetailsProps> = () => {
	const {productName} = useParams<{productName: string}>();
	const [product, setProduct] = useState<Products | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string>("");
	const navigate = useNavigate();

	useEffect(() => {
		if (productName) {
			const decodedName = decodeURIComponent(productName);
			setLoading(true);
			getProductByspicificName(decodedName)
				.then((res) => {
					if (!res) {
						setError("המוצר לא נמצא");
						setProduct(null);
					} else {
						setProduct(res);
						setError("");
					}
				})
				.catch(() => {
					setError("אירעה שגיאה בטעינת המוצר");
					setProduct(null);
				})
				.finally(() => setLoading(false));
		}
	}, [productName]);

	if (loading)
		return (
			<Box display='flex' justifyContent='center' mt={5}>
				<CircularProgress />
			</Box>
		);

	if (error)
		return (
			<Box textAlign='center' mt={5}>
				<Typography variant='h6' color='error' gutterBottom>
					{error}
				</Typography>
				<Button variant='contained' onClick={() => navigate(-1)}>
					חזור אחורה
				</Button>
			</Box>
		);

	if (!product) return null;

	return (
		<Box component={"main"}>
			<Paper
				elevation={3}
				sx={{maxWidth: 600, margin: "30px auto", padding: 3, direction: "rtl"}}
			>
				<Typography variant='h4' gutterBottom>
					{product.product_name}
				</Typography>

				{product.image_url && (
					<Box
						component='img'
						src={product.image_url}
						alt={product.product_name}
						sx={{
							width: "100%",
							height: "auto",
							maxHeight: 300,
							objectFit: "contain",
							mb: 2,
							borderRadius: 1,
						}}
					/>
				)}

				{product.description && (
					<Typography variant='body1' paragraph>
						{product.description}
					</Typography>
				)}

				{product.price && (
					<Typography variant='h6' color='primary' gutterBottom>
						מחיר: ₪{product.price.toFixed(2)}
					</Typography>
				)}

				{product.category && (
					<Typography variant='subtitle1' color='text.secondary'>
						קטגוריה: {product.category}
					</Typography>
				)}

				<Box mt={3}>
					<Button
						variant='contained'
						color='error'
						onClick={() => alert("הוספה לעגלה (לא ממומש)")}
					>
						הוסף לסל
					</Button>
				</Box>
			</Paper>
		</Box>
	);
};

export default ProducDetails;
