import {Avatar, Box, Card, Grid, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import {Phone} from "@mui/icons-material";
import {useTranslation} from "react-i18next";
import {User} from "../../../../interfaces/usersMessages";
import {Link} from "react-router-dom";
import ContactTab from "./ContactTab";
interface ContactInfoTabProps {
	user: User;
}
/**
 * Users contact info tab
 * @param {user}
 * @returns ContactInfoTab
 */
const ContactInfoTab: FunctionComponent<ContactInfoTabProps> = ({user}) => {
	const {t} = useTranslation();

	return (
		<Grid container spacing={3}>
			<Grid size={{xs: 12, md: 12}}>
				<Typography
					variant='h6'
					gutterBottom
					color='primary'
					sx={{fontWeight: "bold"}}
				>
					{t("contact_info")}
				</Typography>
				{/* <Divider sx={{mb: 2, boxShadow: 1}} /> */}
				<Card sx={{p: 3}}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-around",
							flexWrap: "wrap",
							p: 5,
						}}
					>
						<Box display='flex' alignItems='center' gap={2}>
							<Avatar sx={{bgcolor: "success.light"}}>
								<Phone />
							</Avatar>
							<Box>
								<Typography variant='caption' color='text.secondary'>
									{t("phone")}
								</Typography>
								<Typography
									component={Link}
									to={`tel:+972${user.phone?.phone_1}`}
									variant='body1'
									sx={{
										p: 1.5,

										textDecoration: "none",
										color: "success",
									}}
								>
									{user.phone?.phone_1 ? user.phone.phone_1 : "-"}
								</Typography>
							</Box>
						</Box>
						{user.phone?.phone_2 && (
							<Box display='flex' alignItems='center' gap={2}>
								<Avatar sx={{bgcolor: "success.light"}}>
									<Phone />
								</Avatar>
								<Box>
									<Typography variant='caption' color='text.secondary'>
										{t("phone")}
									</Typography>
									<Typography
										component={Link}
										to={`tel:+972${user.phone?.phone_2}`}
										variant='body1'
										sx={{
											px: 1.5,
											py: 0.5,
											textDecoration: "none",
											color: "success",
										}}
									>
										{user.phone?.phone_2 ? user.phone?.phone_2 : "-"}
									</Typography>
								</Box>
							</Box>
						)}

						<Box display='flex' alignItems='center' gap={2}>
							<Avatar sx={{bgcolor: "info.light"}}>
								<a
									href={`https://waze.com/ul?q=${encodeURIComponent(
										user.address?.city || "",
									)}&navigate=yes`}
									target='_blank'
									rel='noopener noreferrer'
									style={{textDecoration: "none"}}
								>
									<img
										src='/waze.png'
										width={20}
										style={{fontSize: 10}}
									/>
								</a>
							</Avatar>
							<Box>
								<Typography variant='caption' color='text.secondary'>
									{t("modals.updateProductModal.location")}
								</Typography>
								<Typography variant='body1'>
									{user.address?.city}
								</Typography>
							</Box>
						</Box>
					</Box>
				</Card>
			</Grid>

			{/* <Grid size={{xs: 12, md: 6}}>
				<Card sx={{p: 3, borderRadius: 2, height: "100%"}}>
					<Typography
						variant='h6'
						gutterBottom
						color='primary'
						sx={{fontWeight: "bold"}}
					>
						{t("account_details")}
					</Typography>
					<Divider sx={{mb: 2}} />
					<Stack spacing={2}>
						<Box display='flex' justifyContent='space-between'>
							<Typography color='text.secondary'>
								{t("member_since")}:
							</Typography>
							<Typography fontWeight='medium'>
								{formatDate(user?.createdAt ?? "")}
							</Typography>
						</Box>
						<Box display='flex' justifyContent='space-between'>
							<Typography color='text.secondary'>
								{t("account_status")}:
							</Typography>
							<Chip label={t("verified")} size='small' color='success' />
						</Box>
					</Stack>
				</Card>
			</Grid> */}
			<Grid size={{xs: 12, lg: 6}}>
				<ContactTab
					user={user}
					handleContactSeller={function (): void {
						throw new Error("Function not implemented.");
					}}
					handleWhatsApp={function (): void {
						throw new Error("Function not implemented.");
					}}
				/>
			</Grid>
		</Grid>
	);
};

export default ContactInfoTab;
