import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    // Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';
import { Box, Typography, useTheme } from '@mui/material';
import {
    ProductByDate,
    CategoryStats,
    CHART_COLORS,
    getCategoryName,
} from './statisticsUtils';

// ─── Growth line chart ────────────────────────────────────────────────────────

export const ProductsGrowthChart = ({ data }: { data: ProductByDate[] }) => {
    const theme = useTheme();

    const formatted = data.map((d) => ({
        date: new Date(d.date).toLocaleDateString('ar-SA', {
            weekday: 'short',
            day: 'numeric',
        }),
        count: d.count,
    }));

    return (
        <ResponsiveContainer width='100%' height={240}>
            <LineChart
                data={formatted}
                margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
            >
                <CartesianGrid
                    strokeDasharray='3 3'
                    stroke={theme.palette.divider}
                />
                <XAxis
                    dataKey='date'
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                />
                {/* <RechartsTooltip
                    formatter={(value: number) => [`${value} منتج`, 'المنتجات']}
                    contentStyle={{
                        borderRadius: 8,
                        border: `1px solid ${theme.palette.divider}`,
                        fontSize: 12,
                    }}
                /> */}
                <Line
                    type='monotone'
                    dataKey='count'
                    stroke={theme.palette.primary.main}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: theme.palette.primary.main }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

// ─── Category donut chart ─────────────────────────────────────────────────────

interface CategoryChartProps {
    data: CategoryStats[];
    totalProducts: number;
}

const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
}) => {
    if (percent < 0.06) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill='#fff'
            textAnchor='middle'
            dominantBaseline='central'
            fontSize={11}
            fontWeight='600'
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export const CategoryDonutChart = ({
    data,
    totalProducts,
}: CategoryChartProps) => {
    const top5 = data.slice(0, 5);

    return (
        <Box>
            <ResponsiveContainer width='100%' height={280}>
                <PieChart>
                    <Pie
                        data={top5}
                        cx='50%'
                        cy='50%'
                        outerRadius={100}
                        innerRadius={62}
                        dataKey='count'
                        paddingAngle={4}
                        labelLine={false}
                        label={CustomLabel as never}
                    >
                        {top5.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                                stroke='none'
                            />
                        ))}
                    </Pie>
                    {/* <RechartsTooltip
                        formatter={(value: number, _name: string, props: { payload: CategoryStats }) => [
                            `${value} منتج (${((value / (totalProducts || 1)) * 100).toFixed(1)}%)`,
                            getCategoryName(props.payload.category),
                        ]}
                    /> */}
                    <Legend
                        formatter={(value) => getCategoryName(value)}
                        verticalAlign='bottom'
                        height={36}
                        iconSize={10}
                        iconType='circle'
                        wrapperStyle={{ fontSize: 12 }}
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Center label */}
            <Box sx={{ textAlign: 'center', mt: -2 }}>
                <Typography variant='caption' color='text.secondary'>
                    إجمالي {totalProducts} منتج
                </Typography>
            </Box>
        </Box>
    );
};
