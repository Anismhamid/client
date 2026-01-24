// atoms/LikeButton.tsx
import {FunctionComponent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {IconButton, CircularProgress, Typography} from "@mui/material";
import {
	Favorite as FavoriteIcon,
	FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import {useUser} from "../context/useUSer";
import {HandleLikeParams, handleLike} from "../helpers/handleLike";
import {Products} from "../interfaces/Products";

interface LikeButtonProps {
	product: Products;
	setProduct?: (updater: (prev: Products) => Products) => void;
	onLikeToggle?: (productId: string, liked: boolean) => void;
}

const LikeButton: FunctionComponent<LikeButtonProps> = ({
	product,
	setProduct,
	onLikeToggle,
}) => {
	const [isLiking, setIsLiking] = useState(false);
	const navigate = useNavigate();
	const {isLoggedIn, auth} = useUser();

	// تحقق من وجود auth و _id
	const userLiked = auth?._id ? product.likes?.includes(auth._id) : false;

	const handleClick = async () => {
		// إذا لم يكن هناك auth، لا تفعل شيئاً
		if (!auth || !auth._id) {
			console.warn("User authentication data is not available");
			return;
		}

		const params: HandleLikeParams = {
			isLoggedIn,
			isLiking,
			navigate: (path: string) => navigate(path),
			setIsLiking,
			setProduct,
			product,
			auth,
			onLikeToggle,
		};

		await handleLike(params);
	};

	return (
		<IconButton
			aria-label={userLiked ? "remove from favorites" : "add to favorites"}
			onClick={handleClick}
			disabled={isLiking || !auth}
			sx={{
				position: "relative",
				padding: "8px",
			}}
		>
			{isLiking ? (
				<>
					<FavoriteBorderIcon sx={{opacity: 0.3}} />
					<CircularProgress
						size={20}
						sx={{
							position: "absolute",
							top: "50%",
							left: "50%",
							marginTop: "-10px",
							marginLeft: "-10px",
						}}
					/>
				</>
			) : userLiked ? (
				<>
					<FavoriteIcon
						sx={{
							color: "error.main",
							animation: "pulse 0.3s ease-in-out",
							"@keyframes pulse": {
								"0%": {transform: "scale(1)"},
								"50%": {transform: "scale(1.2)"},
								"100%": {transform: "scale(1)"},
							},
						}}
					/>
					<Typography
						sx={{
							ml: 0.5,
							fontSize: "0.875rem",
							color: "error.main",
							fontWeight: 500,
						}}
					>
						{product.likes?.length ?? 0}
					</Typography>
				</>
			) : (
				<>
					<FavoriteBorderIcon />
					<Typography sx={{ml: 0.5, fontSize: "0.875rem"}}>
						{product.likes?.length ?? 0}
					</Typography>
				</>
			)}
		</IconButton>
	);
};

export default LikeButton;
