import {Card, Tabs as MuiTabs, Tab} from "@mui/material";
import {FunctionComponent, SyntheticEvent} from "react";
import {Storefront, VerifiedUser, Star, ChatBubbleTwoTone} from "@mui/icons-material";

interface TabsProps {
	tabValue: number;
	handleTabChange: (event: SyntheticEvent, newValue: number) => void;
}

const CustomTabs: FunctionComponent<TabsProps> = ({handleTabChange, tabValue}) => {
	return (
		<Card>
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
				<Tab
					// label='المنشورات'
					title='المنشورات'
					aria-label='المنشورات'
					icon={<Storefront color='secondary' />}
					iconPosition='end'
				/>
				<Tab
					// label='المعلومات'
					title='المعلومات'
					aria-label='المعلومات'
					icon={<VerifiedUser color='info' />}
					iconPosition='start'
				/>
				<Tab
					// label='التقييمات'
					title='التقييمات'
					aria-label='التقييمات'
					icon={<Star color='warning' />}
					iconPosition='start'
				/>
				<Tab
					// label='التواصل'
					title='التواصل'
					aria-label='التواصل'
					icon={<ChatBubbleTwoTone color='secondary' />}
					iconPosition='start'
				/>
			</MuiTabs>
		</Card>
	);
};

export default CustomTabs;
