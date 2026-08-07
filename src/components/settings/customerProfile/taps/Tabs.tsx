import { Card, Tabs as MuiTabs, Tab } from '@mui/material';
import { FunctionComponent, SyntheticEvent } from 'react';
import {
    Storefront,
    VerifiedUser,
    Star,
    ChatBubbleTwoTone,
} from '@mui/icons-material';

const BRAND_GOLD = '#B8860B';
const BRAND_BROWN = '#8B4513';

interface TabsProps {
    tabValue: number;
    handleTabChange: (event: SyntheticEvent, newValue: number) => void;
}

const CustomTabs: FunctionComponent<TabsProps> = ({
    handleTabChange,
    tabValue,
}) => {
    return (
        <Card >
            <MuiTabs
                value={tabValue}
                onChange={handleTabChange}
                variant='scrollable'
                scrollButtons='auto'
                sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                        fontWeight: 600,
                        minHeight: 60,
                    },
                    '& .MuiTabs-indicator': {
                        height: 3,
                        borderRadius: 2,
                        background: `linear-gradient(90deg, ${BRAND_GOLD}, ${BRAND_BROWN})`,
                    },
                }}
            >
                <Tab
                    title='المنشورات'
                    aria-label='المنشورات'
                    icon={<Storefront sx={{ color: BRAND_GOLD }} />}
                    iconPosition='end'
                />
                <Tab
                    title='المعلومات'
                    aria-label='المعلومات'
                    icon={<VerifiedUser sx={{ color: BRAND_BROWN }} />}
                    iconPosition='start'
                />
                <Tab
                    title='التقييمات'
                    aria-label='التقييمات'
                    icon={<Star sx={{ color: BRAND_GOLD }} />}
                    iconPosition='start'
                />
                <Tab
                    title='التواصل'
                    aria-label='التواصل'
                    icon={<ChatBubbleTwoTone sx={{ color: BRAND_BROWN }} />}
                    iconPosition='start'
                />
            </MuiTabs>
        </Card>
    );
};

export default CustomTabs;