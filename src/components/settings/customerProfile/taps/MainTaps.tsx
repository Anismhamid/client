import {Box, Card, Tab, Tabs} from "@mui/material";
import {FunctionComponent, SyntheticEvent, useState} from "react";
import {
	// FavoriteBorder,
	// Favorite,
	// Share,
	// Visibility,
	Star,
	// LocalOffer,
	// Phone,
	// Email,
	// LocationOn,
	VerifiedUser,
	Storefront,
	// ThumbUp,
	// Comment,
	// ArrowBack,
	// WhatsApp,
	// Facebook,
	// Instagram,
	// Twitter,
	ChatBubble,
} from "@mui/icons-material";

interface MainTapsProps {}



const MainTaps: FunctionComponent<MainTapsProps> = () => {
	const [tabValue, setTabValue] = useState<number>(0);

	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};
	return (
		<Card sx={{mb: 4, borderRadius: 3}}>
			<Tabs
				value={tabValue}
				onChange={handleTabChange}
				variant='scrollable'
				scrollButtons='auto'
				sx={{
					borderBottom: 1,
					borderColor: "divider",
					"& .MuiTab-root": {
						fontWeight: 600,
						minHeight: 60,
					},
				}}
			>
				<Tab label='المنتجات' icon={<Storefront />} iconPosition='start' />
				<Tab label='المعلومات' icon={<VerifiedUser />} iconPosition='start' />
				<Tab label='التقييمات' icon={<Star />} iconPosition='start' />
				<Tab label='التواصل' icon={<ChatBubble />} iconPosition='start' />
			</Tabs>
		</Card>
	);
};

export default MainTaps;
