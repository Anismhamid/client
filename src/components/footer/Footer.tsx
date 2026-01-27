import {FunctionComponent} from "react";
import {Box, Grid, Typography, Link as MuiLink, Container} from "@mui/material";
import {useTranslation} from "react-i18next";
import {Link as RouterLink} from "react-router-dom";
import {useUser} from "../../context/useUSer";
import {path} from "../../routes/routes";

interface FooterProps {
}

const Footer: FunctionComponent<FooterProps> = () => {
	const {t} = useTranslation();
	const {auth} = useUser();

	const quickLinks = [
		{label: t("footer.myAccount"), href: "/profile"},
		{
			label: t("footer.myListings"),
			href: `${path.myCustomerProfile}/${auth?.slug}`,
		},
		{label: t("footer.postListing"), href: "/"},
	];

	const socialLinks = [
		{label: "Facebook", href: "https://www.facebook.com/anis.mhamid.2025/"},
		{label: "Instagram", href: "https://instagram.com"},
		{label: "TikTok", href: "https://www.tiktok.com"},
	];

	return (
		<Box
			component='footer'
			sx={{
				borderTop: 2,
				borderColor: "primary.main",
				backgroundColor: "background.paper",
				mt: "auto",
				pt: 5,
				pb: 2,
			}}
		>
			<Container maxWidth='lg'>
				<Grid container spacing={4}>
					{/* Quick Links */}
					<Grid size={{xs: 12, md: 4}}>
						<Typography
							variant='h6'
							gutterBottom
							color='primary.main'
							fontWeight={600}
						>
							{t("footer.quickLinks")}
						</Typography>
						<Box display='flex' flexDirection='column' gap={1.5}>
							<MuiLink
								key={t("footer.marketplace")}
								component={RouterLink}
								to={"/"}
								underline='hover'
								color='text.secondary'
								sx={{
									fontSize: "0.95rem",
									transition: "color 0.2s",
									"&:hover": {
										color: "primary.main",
									},
								}}
							>
								{t("footer.marketplace")}
							</MuiLink>
							{auth?.slug &&
								quickLinks.map((link, idx) => (
									<MuiLink
										key={idx}
										component={RouterLink}
										to={link.href}
										underline='hover'
										color='text.secondary'
										sx={{
											fontSize: "0.95rem",
											transition: "color 0.2s",
											"&:hover": {
												color: "primary.main",
											},
										}}
									>
										{link.label}
									</MuiLink>
								))}
						</Box>
					</Grid>

					{/* {label: t("footer.marketplace"), href: "/"}, */}

					{/* About / Info */}
					<Grid size={{xs: 12, md: 5}}>
						<Typography
							variant='h6'
							gutterBottom
							color='primary.main'
							fontWeight={600}
						>
							{t("footer.siteName")}
						</Typography>
						<Typography
							variant='body2'
							color='text.secondary'
							paragraph
							sx={{lineHeight: 1.7}}
						>
							{t("footer.descriptionC2C")}
						</Typography>
						<Box mt={2}>
							<Typography
								variant='body2'
								color='text.secondary'
								gutterBottom
							>
								{t("footer.contact")}:
								<MuiLink
									href='mailto:support@sfqa.com'
									color='primary.main'
									sx={{ml: 1, textDecoration: "none"}}
								>
									support@sfqa.com
								</MuiLink>
							</Typography>
							<Typography variant='body2' color='text.secondary'>
								{t("footer.phone")}:
								<MuiLink
									href='tel:+9746310374'
									color='primary.main'
									sx={{ml: 1, textDecoration: "none"}}
								>
									046310374
								</MuiLink>
							</Typography>
						</Box>
					</Grid>

					{/* Social Media */}
					<Grid size={{xs: 12, md: 3}}>
						<Typography
							variant='h6'
							gutterBottom
							color='primary.main'
							fontWeight={600}
						>
							{t("footer.followUs")}
						</Typography>
						<Box display='flex' flexDirection='column' gap={1.5}>
							{socialLinks.map((social, idx) => (
								<MuiLink
									key={idx}
									href={social.href}
									target='_blank'
									rel='noopener noreferrer'
									color='text.secondary'
									underline='hover'
									sx={{
										fontSize: "0.95rem",
										transition: "color 0.2s",
										"&:hover": {
											color: "primary.main",
										},
									}}
								>
									{social.label}
								</MuiLink>
							))}
						</Box>
					</Grid>
				</Grid>

				{/* Footer Bottom */}
				<Box mt={5} pt={3} borderTop={1} borderColor='divider' textAlign='center'>
					<Typography variant='body2' color='text.secondary'>
						© {new Date().getFullYear()} {t("footer.siteName")} -{" "}
						{t("allRightsReserved")}
					</Typography>
					<Typography
						variant='caption'
						color='text.disabled'
						display='block'
						mt={1}
					>
						{t("footer.version") || "الإصدار 1.0.0"}
					</Typography>
				</Box>
			</Container>
		</Box>
	);
};

export default Footer;
