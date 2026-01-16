import {FunctionComponent} from "react";
import {Box, Grid, Typography, Link as MuiLink} from "@mui/material";
import {useTranslation} from "react-i18next";

interface FooterProps {
	isSeller?: boolean; // true إذا المستخدم بائع، false/undefined للمشتري أو زائر
}

const Footer: FunctionComponent<FooterProps> = ({isSeller}) => {
	const {t} = useTranslation();

	const quickLinks = [
		{label: t("footer.myAccount"), href: "/account"},
		{label: t("footer.myListings"), href: "/my-listings"},
		{label: t("footer.postListing"), href: "/post-listing"},
		{label: t("footer.marketplace"), href: "/marketplace"},
	];

	const socialLinks = [
		{label: "Facebook", href: "https://www.facebook.com/shokshknini/?locale=ar_AR"},
		{label: "Instagram", href: "https://instagram.com"},
		{label: "TikTok", href: "https://www.tiktok.com"},
	];

	return (
		<Box
			component='footer'
			sx={{
				borderTop: "2px solid #0966FF",
				// bgcolor: "#f9f9f9",
				mt: 5,
				pt: 5,
			}}
		>
			<Box className='container'>
				<Grid container spacing={4}>
					{/* Quick Links */}
					<Grid size={{xs: 12, md: 4}}>
						<Typography variant='h6' gutterBottom>
							{t("footer.quickLinks")}
						</Typography>
						<Box display='flex' flexDirection='column' gap={1}>
							{quickLinks.map((link, idx) =>
								!isSeller &&
								link.label === t("footer.postListing") ? null : (
									<MuiLink
										key={idx}
										href={link.href}
										underline='none'
										color='primary'
									>
										{link.label}
									</MuiLink>
								),
							)}
						</Box>
					</Grid>

					{/* About / Info */}
					<Grid size={{xs: 12, md: 5}}>
						<Typography variant='h6' gutterBottom>
							{t("footer.siteName")}
						</Typography>
						<Typography variant='body2' gutterBottom>
							{t("footer.descriptionC2C")}
						</Typography>
						<Box mt={2}>
							<Typography variant='body2'>
								{t("footer.contact")}:
								<MuiLink
									href='mailto:support@sfqa.com'
									color='primary'
									sx={{ml: 1}}
								>
									support@sfqa.com
								</MuiLink>
							</Typography>
							<Typography variant='body2'>
								{t("footer.phone")}:
								<MuiLink
									href='tel:+9746310374'
									color='primary'
									sx={{ml: 1}}
								>
									046310374
								</MuiLink>
							</Typography>
						</Box>
					</Grid>

					{/* Social Media */}
					<Grid size={{xs: 12, md: 3}}>
						<Typography variant='h6' gutterBottom>
							{t("footer.followUs")}
						</Typography>
						<Box display='flex' flexDirection='column' gap={1}>
							{socialLinks.map((social, idx) => (
								<MuiLink
									key={idx}
									href={social.href}
									target='_blank'
									rel='noopener noreferrer'
									color='primary'
									underline='none'
								>
									{social.label}
								</MuiLink>
							))}
						</Box>
					</Grid>
				</Grid>

				{/* Footer Bottom */}
				<Box mt={5} py={2} textAlign='center' borderTop='1px solid #0966FF'>
					<Typography variant='body2'>
						&copy; {new Date().getFullYear()} {t("footer.siteName")} - جميع
						الحقوق محفوظة
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default Footer;
