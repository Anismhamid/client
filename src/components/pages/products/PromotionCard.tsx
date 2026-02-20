import {FunctionComponent} from "react";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Button,
	Stack,
	Chip,
	Box,
	useTheme,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {motion} from "framer-motion";

interface PromotionProps {
	title: string;
	category: string;
	imageUrl?: string;
	sellerName: string;
	onViewPost: () => void;
	onPromotePost?: () => void;
	isPaid?: boolean;
}

const PromotionCard: FunctionComponent<PromotionProps> = ({
	title,
	category,
	imageUrl,
	sellerName,
	onViewPost,
	onPromotePost,
	isPaid = true,
}) => {
	const theme = useTheme();

	return (
		<motion.div
			initial={{opacity: 0, y: 20}}
			animate={{opacity: 1, y: 0}}
			transition={{duration: 0.5}}
		>
			<Card
				sx={{
					borderRadius: 3,
					overflow: "hidden",
					position: "relative",
					boxShadow: 3,
					mb: 3,
					border: `2px solid ${isPaid ? theme.palette.primary.main : "transparent"}`,
				}}
			>
				{imageUrl && (
					<CardMedia
						component='img'
						height='180'
						image={imageUrl}
						alt={title}
					/>
				)}

				<CardContent>
					<Stack spacing={1}>
						<Typography variant='subtitle2' color='text.secondary'>
							{sellerName}
						</Typography>

						<Typography variant='h6' fontWeight='bold'>
							{title}
						</Typography>

						<Chip
							icon={<LocalOfferIcon />}
							label={category}
							size='small'
							color='primary'
							variant='outlined'
							sx={{width: "fit-content"}}
						/>

						<Box sx={{mt: 2, display: "flex", gap: 1}}>
							<Button
								variant='contained'
								size='small'
								onClick={onViewPost}
								sx={{flex: 1}}
							>
								عرض المنشور
							</Button>

							{isPaid && onPromotePost && (
								<Button
									variant='outlined'
									size='small'
									color='secondary'
									onClick={onPromotePost}
									sx={{flex: 1}}
								>
									ترويج المنشور
								</Button>
							)}
						</Box>
					</Stack>
				</CardContent>
			</Card>
		</motion.div>
	);
};

export default PromotionCard;
