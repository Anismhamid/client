import {
	Avatar,
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	Chip,
	Grid,
	Rating,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import {motion} from "framer-motion";
import {FunctionComponent} from "react";
import {
	Share,
	Phone,
	Email,
	LocationOn,
	VerifiedUser,
	Storefront,
	WhatsApp,
	ChatBubble,
	ArrowRight,
} from "@mui/icons-material";
import {NavigateFunction} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {User} from "../../../interfaces/usersMessages";
import {Stats} from "./types/states";
import {Products} from "../../../interfaces/Products";

interface CustomerProfileHeaderProps {
	handleShareProfile: () => void;
	navigate: NavigateFunction;
	user: User;
	slug: string;
	stats: Stats;
	products: Products[];
	handleContactSeller: () => void;
	handleWhatsApp: () => void;
}

const CustomerProfileHeader: FunctionComponent<CustomerProfileHeaderProps> = ({
	handleShareProfile,
	handleContactSeller,
	handleWhatsApp,
	navigate,
	user,
	slug,
	stats,
	products,
}) => {
	const theme = useTheme();
	const {t} = useTranslation();

	return (
		<>
			<Button
				startIcon={<ArrowRight />}
				onClick={() => navigate(-1)}
				sx={{
					mb: 3,
					gap: 2,
					"&:hover": {
						transform: "scale(1.1)",
					},
				}}
			>
				{t("back")}
			</Button>

			{/* ENHANCED PROFILE HEADER */}
			<motion.div
				initial={{opacity: 0, y: 20}}
				animate={{opacity: 1, y: 0}}
				transition={{duration: 0.5}}
			>
				<Card
					sx={{
						mb: 4,
						borderRadius: 4,
						background: `linear-gradient(135deg, ${theme.palette.primary.light}15 0%, ${theme.palette.secondary.light}15 100%)`,
						position: "relative",
						overflow: "hidden",
						"&::before": {
							content: '""',
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							height: 4,
							background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
						},
					}}
				>
					<CardContent sx={{p: {xs: 2, md: 3}}}>
						<Grid container alignItems='center' spacing={3}>
							{/* Avatar Section */}
							<Grid size={{xs: 12, md: "auto"}}>
								<Box
									position='relative'
									sx={{display: "flex", justifyContent: "center"}}
								>
									<Badge
										overlap='circular'
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "right",
										}}
										badgeContent={
											<VerifiedUser
												sx={{
													color: "success.main",
													fontSize: 30,
													bgcolor: "white",
													borderRadius: "50%",
													p: 0.5,
												}}
											/>
										}
									>
										<Avatar
											src={
												user.image?.url
													? user.image.url
													: "/user.png"
											}
											sx={{
												width: {xs: 100, md: 120},
												height: {xs: 100, md: 120},
												fontSize: {xs: 36, md: 48},
												border: `4px solid ${theme.palette.background.paper}`,
												boxShadow: 3,
												bgcolor: theme.palette.primary.main,
											}}
										>
											{!user.image?.url &&
												user.name.first.charAt(0).toUpperCase()}
										</Avatar>
									</Badge>
								</Box>
							</Grid>

							{/* User Info */}
							<Grid size={{xs: 12, md: 6}}>
								<Typography variant='h4' fontWeight='bold' gutterBottom>
									{user.name?.first} {user.name?.last}
								</Typography>
								<Stack
									direction='row'
									alignItems='center'
									spacing={1}
									m={2}
									gap={1}
								>
									<Typography
										variant='subtitle1'
										color='text.secondary'
										fontWeight={"bold"}
									>
										@{slug}
									</Typography>
									<Chip
										icon={<Storefront />}
										label='بائع معتمد'
										size='small'
										color='primary'
										sx={{p: 2}}
										variant='outlined'
									/>
									{user.role === "Admin" && (
										<Chip
											label='مدير'
											size='small'
											color='warning'
											variant='outlined'
										/>
									)}
								</Stack>

								{/* Rating */}
								<Stack
									direction='row'
									alignItems='center'
									spacing={2}
									mb={2}
								>
									<Box>
										<Rating
											value={stats.rating}
											precision={0.1}
											readOnly
										/>
										<Typography
											variant='caption'
											color='text.secondary'
										>
											({stats.rating} من 5)
										</Typography>
									</Box>
									<Typography
										variant='body2'
										color='text.secondary'
										sx={{p: 0.4, border: 1, borderRadius: 5}}
									>
										{products.length} منتج
									</Typography>
								</Stack>

								{/* Contact Info */}
								<Stack
									direction='row'
									spacing={2}
									flexWrap='wrap'
									gap={1}
								>
									{user.email && (
										<Chip
											icon={<Email />}
											label={user.email}
											variant='outlined'
											sx={{p: 1}}
											size='small'
										/>
									)}
									{user.phone?.phone_1 && (
										<Chip
											icon={<Phone />}
											label={user.phone.phone_1}
											variant='outlined'
											sx={{p: 1}}
											size='small'
										/>
									)}
									{user.address?.city && (
										<Chip
											icon={<LocationOn />}
											label={user.address.city}
											variant='outlined'
											sx={{p: 1}}
											size='small'
										/>
									)}
								</Stack>
							</Grid>

							{/* Action Buttons */}
							<Grid size={{xs: 12, md: 6}}>
								<Stack spacing={2}>
									<Button
										variant='contained'
										size='large'
										startIcon={<ChatBubble />}
										fullWidth
										onClick={handleContactSeller}
										sx={{
											background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
											boxShadow: 3,
											gap: 1,
										}}
									>
										تواصل مع البائع عبر المنصه
									</Button>
									<Button
										variant='outlined'
										size='large'
										fullWidth
										sx={{gap: 1}}
										startIcon={<WhatsApp />}
										onClick={handleWhatsApp}
										color='success'
									>
										واتساب
									</Button>
									<Button
										variant='outlined'
										size='large'
										fullWidth
										sx={{gap: 1}}
										startIcon={<Share />}
										onClick={handleShareProfile}
									>
										مشاركة الملف
									</Button>
								</Stack>
							</Grid>
						</Grid>
					</CardContent>
				</Card>
			</motion.div>
		</>
	);
};

export default CustomerProfileHeader;
