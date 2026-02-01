import {Box, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {Stats} from "../types/states";
import {Star} from "@mui/icons-material";
interface RatingsTabProps {
	stats: Stats;
}

const RatingsTab: FunctionComponent<RatingsTabProps> = ({stats}) => {
	const {t} = useTranslation();
	return (
		<Box textAlign='center' py={5}>
			<Star sx={{fontSize: 60, color: "warning.main", mb: 2}} />
			<Typography variant='h5' gutterBottom>
				{stats.rating} / 5
			</Typography>
			<Typography color='text.secondary'>
				{t("based_on_customer_feedback")}
			</Typography>
			{/* You can map actual reviews here if your API supports it */}
		</Box>
	);
};

export default RatingsTab;
