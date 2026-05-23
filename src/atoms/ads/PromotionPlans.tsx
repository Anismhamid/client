import { Box, Button, Card, Chip, Grid, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";

interface PromotionPlansProps {
    onSelect: (
        type: string,
        days: number,
        price: number
    ) => void;
}

const plans = [
    {
        id: "highlight",
        title: "Highlight",
        description: "تمييز الإعلان داخل القوائم",
        days: 7,
        price: 10,
        icon: <BoltIcon />,
        color: "#ff9800",
    },

    {
        id: "top",
        title: "Top Search",
        description: "الظهور أعلى نتائج البحث",
        days: 7,
        price: 25,
        icon: <TrendingUpIcon />,
        color: "#2196f3",
    },

    {
        id: "homepage",
        title: "Homepage",
        description: "ظهور في الصفحة الرئيسية",
        days: 7,
        price: 50,
        icon: <StarIcon />,
        color: "#7b61ff",
        featured: true,
    },
];

const PromotionPlans = ({
    onSelect,
}: PromotionPlansProps) => {
    return (
        <Grid container spacing={3}>
            {plans.map((plan) => (
                <Grid
                    size={{ xs: 12, md: 4 }}
                    key={plan.id}
                >
                    <Card
                        sx={{
                            p: 4,
                            borderRadius: 6,
                            height: "100%",
                            position: "relative",
                            overflow: "hidden",
                            backdropFilter:
                                "blur(20px)",

                            background:
                                "rgba(255,255,255,.8)",

                            boxShadow:
                                "0 15px 40px rgba(0,0,0,.08)",

                            transition: ".4s",

                            "&:hover": {
                                transform:
                                    "translateY(-10px)",
                            },
                        }}
                    >
                        {plan.featured && (
                            <Chip
                                label="Most Popular"
                                color="secondary"
                                sx={{
                                    position:
                                        "absolute",

                                    top: 15,
                                    right: 15,
                                }}
                            />
                        )}

                        <Box
                            sx={{
                                width: 70,
                                height: 70,
                                display: "flex",
                                alignItems:
                                    "center",

                                justifyContent:
                                    "center",

                                borderRadius:
                                    "50%",

                                bgcolor:
                                    `${plan.color}20`,

                                color: plan.color,

                                mb: 3,
                            }}
                        >
                            {plan.icon}
                        </Box>

                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            {plan.title}
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mt={1}
                            mb={3}
                        >
                            {plan.description}
                        </Typography>

                        <Typography
                            variant="h3"
                            fontWeight={900}
                        >
                            ₪{plan.price}
                        </Typography>

                        <Typography
                            color="text.secondary"
                            mb={3}
                        >
                            لمدة {plan.days} أيام
                        </Typography>

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{
                                borderRadius:
                                    "20px",

                                py: 1.5,
                            }}
                            onClick={() =>
                                onSelect(
                                    plan.id,
                                    plan.days,
                                    plan.price
                                )
                            }
                        >
                            شراء الآن
                        </Button>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default PromotionPlans;