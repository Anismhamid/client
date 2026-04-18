import { FunctionComponent, useEffect, useState } from "react";
import { getAllPosts } from "../../../services/postsServices";
import { useUser } from "../../../context/useUSer";
import { Box, Grid, Typography } from "@mui/material";
import ProductCard from "./PostsCard";
// import JsonLd from "../../../../utils/JsonLd";
import { generateProductsItemListJsonLd } from "../../../../utils/structuredData";
import JsonLd from "../../../../utils/JsonLd";
import { useTranslation } from "react-i18next";
import handleRTL from "../../../locales/handleRTL";
import { useNavigate } from "react-router-dom";
import { path } from "../../../routes/routes";
import { Posts } from "../../../interfaces/Posts";

const FavoritesPosts: FunctionComponent = () => {
	const { t } = useTranslation();
	const [posts, setPosts] = useState<Posts[]>([]);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

	const { auth } = useUser();
	const navigate = useNavigate();
	useEffect(() => {
		if (!auth?._id) return;

		getAllPosts()
			.then((allPosts) => {
				const filtered = allPosts.filter(
					(posts) =>
						Array.isArray(posts.likes) && posts.likes.includes(auth._id!),
				);
				setPosts(filtered);
			})
			.catch(console.error);
	}, [auth?._id]);

	if (!posts.length) {
		return (
			<Box sx={{ textAlign: "center", py: 6 }}>
				<Typography variant='h6' color='text.secondary'>
					لا توجد منتجات مفضلة ❤️
				</Typography>
			</Box>
		);
	}

	const direction = handleRTL();

	const productsList = generateProductsItemListJsonLd(posts);

	const currentUrl = `https://client-qqq1.vercel.app/favorites`;

	const handleToggleLike = (productId: string, liked: boolean) => {
		if (!auth?._id) {
			navigate(path.Login);
			return;
		}

		const userId = auth._id;

		setPosts((prev) =>
			prev.map((p) =>
				p._id === productId
					? {
						...p,
						likes: liked
							? [...(p.likes || []), userId] // userId مؤكد كـ string
							: (p.likes || []).filter((id: string) => id !== userId),
					}
					: p,
			),
		);

		setPosts((prev) =>
			prev.map((p) =>
				p._id === productId
					? {
						...p,
						likes: liked
							? [...(p.likes || []), userId]
							: (p.likes || []).filter((id: string) => id !== userId),
					}
					: p,
			),
		);
	};

	return (
		<>
			<JsonLd data={productsList} />
			<link rel='canonical' href={currentUrl} />
			<title>{t("favorites")} | صفقه</title>
			<meta name='description' content={t("favorites")} />

			<Box dir={direction} sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
				<h1>{t("favorites")}</h1>
				<Grid container spacing={3}>
					{posts.map((Post) => (
						<Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={Post._id}>
							<ProductCard
								key={Post._id}
								product={Post}
								discountedPrice={Post.discount || 0}
								setProductIdToUpdate={() => { }}
								onShowUpdateProductModal={() => { }}
								openDeleteModal={() => { }}
								setLoadedImages={() =>
									setLoadedImages((prev) => ({
										...prev,
										[Post._id as string]: true,
									}))
								}
								loadedImages={loadedImages}
								category={Post.category}
								onLikeToggle={handleToggleLike}
							/>
						</Grid>
					))}
				</Grid>
			</Box>
		</>
	);
};

export default FavoritesPosts;
