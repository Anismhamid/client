import {Card, Tabs as MuiTabs, Tab} from "@mui/material";
import {FunctionComponent, SyntheticEvent} from "react";
import {Storefront, VerifiedUser, Star, ChatBubble} from "@mui/icons-material";

interface TabsProps {
	tabValue: number;
	handleTabChange: (event: SyntheticEvent, newValue: number) => void;
}

const CustomTabs: FunctionComponent<TabsProps> = ({handleTabChange, tabValue}) => {
	return (
		<Card sx={{mb: 4, borderRadius: 3}}>
			<MuiTabs
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
			</MuiTabs>
		</Card>
	);
};

export default CustomTabs;
