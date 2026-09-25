import { Tabs as MuiTabs, Tab } from '@mui/material';
import { FunctionComponent, SyntheticEvent } from 'react';
import {
    Storefront,
    Star,
    ChatBubbleTwoTone,
    WorkOutlined,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

    return (
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
                label={t('common.tabs.posts')}
                icon={<Storefront sx={{ color: BRAND_GOLD }} />}
                iconPosition='end'
                sx={{ gap: 1 }}
            />
            <Tab
                label={t('common.tabs.jobs')}
                icon={<WorkOutlined sx={{ color: BRAND_BROWN }} />}
                iconPosition='end'
                sx={{ gap: 1 }}
            />
            <Tab
                label={t('common.tabs.ratings')}
                icon={<Star sx={{ color: BRAND_GOLD }} />}
                iconPosition='end'
                sx={{ gap: 1 }}
            />

            <Tab
                label={t('common.tabs.contact')}
                icon={<ChatBubbleTwoTone sx={{ color: BRAND_BROWN }} />}
                iconPosition='end'
                sx={{ gap: 1 }}
            />
        </MuiTabs>
    );
};

export default CustomTabs;
