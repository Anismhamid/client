import {Box} from "@mui/material";
import {FunctionComponent} from "react";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel: FunctionComponent<TabPanelProps> = ({children, value, index}) => {
	return (
		<Box role='tabpanel' hidden={value !== index}>
			{value === index && <Box sx={{py: 3}}>{children}</Box>}
		</Box>
	);
};

export default TabPanel;
