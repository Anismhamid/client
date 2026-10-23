import { ElementType, FunctionComponent } from 'react';
import { SxProps, Theme } from '@mui/material';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import AgricultureOutlined from '@mui/icons-material/AgricultureOutlined';
import BrushOutlined from '@mui/icons-material/BrushOutlined';
import BusinessCenterOutlined from '@mui/icons-material/BusinessCenterOutlined';
import CleaningServicesOutlined from '@mui/icons-material/CleaningServicesOutlined';
import CodeOutlined from '@mui/icons-material/CodeOutlined';
import ConstructionOutlined from '@mui/icons-material/ConstructionOutlined';
import ContentCutOutlined from '@mui/icons-material/ContentCutOutlined';
import EngineeringOutlined from '@mui/icons-material/EngineeringOutlined';
import GavelOutlined from '@mui/icons-material/GavelOutlined';
import HandymanOutlined from '@mui/icons-material/HandymanOutlined';
import LocalHospitalOutlined from '@mui/icons-material/LocalHospitalOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import PrecisionManufacturingOutlined from '@mui/icons-material/PrecisionManufacturingOutlined';
import RestaurantOutlined from '@mui/icons-material/RestaurantOutlined';
import SchoolOutlined from '@mui/icons-material/SchoolOutlined';
import ShieldOutlined from '@mui/icons-material/ShieldOutlined';
import StorefrontOutlined from '@mui/icons-material/StorefrontOutlined';
import SupportAgentOutlined from '@mui/icons-material/SupportAgentOutlined';
import WorkOutline from '@mui/icons-material/WorkOutline';

import { JobCategory } from '../../../interfaces/jobs.types';

// eslint-disable-next-line react-refresh/only-export-components
export const CATEGORY_ICONS: Record<JobCategory, ElementType> = {
    hi_tech: CodeOutlined,
    engineering: EngineeringOutlined,
    construction: ConstructionOutlined,
    manufacturing: PrecisionManufacturingOutlined,
    agriculture: AgricultureOutlined,
    transport: LocalShippingOutlined,
    retail: StorefrontOutlined,
    hospitality: RestaurantOutlined,
    healthcare: LocalHospitalOutlined,
    education: SchoolOutlined,
    office: BusinessCenterOutlined,
    finance: AccountBalanceOutlined,
    customer_service: SupportAgentOutlined,
    security: ShieldOutlined,
    cleaning: CleaningServicesOutlined,
    maintenance: HandymanOutlined,
    beauty: ContentCutOutlined,
    media_design: BrushOutlined,
    legal: GavelOutlined,
    other: WorkOutline,
};

export const CategoryIcon: FunctionComponent<{
    category?: JobCategory;
    sx?: SxProps<Theme>;
}> = ({ category, sx }) => {
    const Icon = (category && CATEGORY_ICONS[category]) || WorkOutline;
    return <Icon fontSize='inherit' sx={sx} />;
};