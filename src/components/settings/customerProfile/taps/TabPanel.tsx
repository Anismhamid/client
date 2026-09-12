import { Box } from '@mui/material';
import { FunctionComponent } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel: FunctionComponent<TabPanelProps> = ({ children, value, index }) => {
    if (value !== index) return null;

    return (
        <Box role='tabpanel' id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
            <Box sx={{ py: 3 }}>{children}</Box>
        </Box>
    );
};

export default TabPanel;