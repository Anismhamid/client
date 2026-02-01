import {Button, Card, Divider, Grid, IconButton, Stack, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import {User} from "../../../../interfaces/usersMessages";
import {
	Phone,
	Email,
	WhatsApp,
	Facebook,
	Instagram,
	Twitter,
	ChatBubble,
} from "@mui/icons-material";

interface ContactTabProps {
	handleContactSeller: () => void;
	handleWhatsApp: () => void;
	user: User;
}

const ContactTab: FunctionComponent<ContactTabProps> = ({
	user,
	handleContactSeller,
	handleWhatsApp,
}) => {
	return (
		<Card sx={{p: 3, borderRadius: 2}}>
			<Typography variant='h6' gutterBottom color='primary'>
				تواصل مع {user.name?.first}
			</Typography>
			<Grid container spacing={3}>
				<Grid size={{xs: 12, md: 6}}>
					<Button
						variant='contained'
						fullWidth
						size='large'
						startIcon={<ChatBubble />}
						onClick={handleContactSeller}
						sx={{py: 1.5, gap: 1}}
					>
						مراسلة مباشرة
					</Button>
				</Grid>
				<Grid size={{xs: 12, md: 6}}>
					<Button
						variant='contained'
						fullWidth
						size='large'
						color='success'
						startIcon={<WhatsApp />}
						onClick={handleWhatsApp}
						sx={{py: 1.5, gap: 1}}
					>
						مراسلة عبر واتساب
					</Button>
				</Grid>
			</Grid>

			<Divider sx={{my: 3}} />

			<Typography variant='subtitle2' gutterBottom color='text.secondary'>
				أو تواصل عبر:
			</Typography>
			<Stack direction='row' spacing={2} justifyContent='center'>
				<IconButton color='primary'>
					<Facebook />
				</IconButton>
				<IconButton color='primary'>
					<Twitter />
				</IconButton>
				<IconButton color='primary'>
					<Instagram />
				</IconButton>
				<IconButton
					color='primary'
					onClick={() => window.open(`mailto:${user.email}`)}
				>
					<Email />
				</IconButton>
				<IconButton
					color='primary'
					onClick={() => window.open(`tel:${user.phone?.phone_1}`)}
				>
					<Phone />
				</IconButton>
			</Stack>
		</Card>
	);
};

export default ContactTab;
