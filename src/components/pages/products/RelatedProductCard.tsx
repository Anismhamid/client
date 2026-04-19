import { Box, Card, CardMedia, Rating, Stack, Typography } from "@mui/material";
import { formatPrice } from "../../../helpers/dateAndPriceFormat";
import { memo, useCallback } from "react";
import { productsPathes } from "../../../routes/routes";
import { Posts } from "../../../interfaces/Posts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { categoryLabels } from "../../../interfaces/postsCategoeis";

const RelatedProductCard = memo(({ product }: { product: Posts }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const sectionCardSx = {
        borderRadius: 4,
        border: 1,
        borderColor: "divider",
        boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
    };


    const handleProductClick = useCallback(() => {
        navigate(`${productsPathes.postsDetails}/${product.category}/${product.brand}/${product._id}`);
    }, [navigate, product]);

    return (
        <Card
            sx={{
                ...sectionCardSx,
                cursor: "pointer",
                "&:hover": { boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)" },
            }}
            onClick={handleProductClick}
        >
            <CardMedia
                component='img'
                height='180'
                src={product.image?.url || "/placeholder-product.png"}
                alt={product.product_name}
                sx={{ objectFit: "cover", borderBottom: 1, borderColor: "divider" }}
            />
            <Box sx={{ p: 2 }}>
                <Typography variant='subtitle1' fontWeight={700} noWrap>
                    {product.product_name}
                </Typography>
                <Typography variant='body2' color='text.secondary' noWrap>
                    {categoryLabels[product.category] || t(product.category)}
                </Typography>
                <Stack direction='row' alignItems='center' spacing={1} mt={1}>
                    <Rating value={product.rating || 0} precision={0.5} readOnly size='small' />
                    <Typography variant='caption' color='text.secondary'>
                        ({typeof product.reviewCount === 'number' ? product.reviewCount : 0})
                    </Typography>
                </Stack>
                <Typography variant='h6' color='primary' fontWeight={700} mt={1}>
                    {formatPrice(product.price)}
                </Typography>
            </Box>
        </Card>
    );
});

export default RelatedProductCard;