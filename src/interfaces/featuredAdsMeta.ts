import { SvgIconComponent } from '@mui/icons-material';
import HomeIcon from '@mui/icons-material/Home';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { AdType } from './featuredAd';

/**
 * Single source of truth for featured-ad pricing and tier styling.
 * Used by FeaturedAdCard, MyAdsDashboard, FeaturedAdsDashboard, TopAdsSection.
 * Colors follow the site brand gradient (gold → brown, #B8860B → #8B4513),
 * anchored on the MUI theme's primary amber (#f59f0b).
 */

export const FEATURED_AD_PRICES: Record<AdType, number> = {
    highlight: 10,
    top: 25,
    homepage: 50,
};

export const FEATURED_AD_EMOJI: Record<AdType, string> = {
    homepage: '🏠',
    top: '🚀',
    highlight: '✨',
};

export const FEATURED_AD_ICONS: Record<AdType, SvgIconComponent> = {
    homepage: HomeIcon,
    top: KeyboardArrowUpIcon,
    highlight: StarBorderIcon,
};

export interface FeaturedAdTier {
    label: string;
    color: string; // dark text color on light chip bg
    bg: string; // light chip background
    darkBg: string; // tinted background for dark-mode cards
    accent: string; // primary tier accent (drives borders, prices, icons)
}

export const FEATURED_AD_TIERS: Record<AdType, FeaturedAdTier> = {
    homepage: {
        label: 'Homepage',
        color: '#78350f',
        bg: '#FEF3C7',
        darkBg: '#3b2c0f',
        accent: '#f59f0b', // matches theme.palette.primary.main
    },
    top: {
        label: 'Top',
        color: '#7c2d12',
        bg: '#FFEDD5',
        darkBg: '#3a2211',
        accent: '#c2410c',
    },
    highlight: {
        label: 'Highlight',
        color: '#713f12',
        bg: '#FEF9C3',
        darkBg: '#332c08',
        accent: '#ca8a04',
    },
};