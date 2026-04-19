import {
	Box,
	Button,
	Card,
	CircularProgress,
	Grid,
	Typography,
	Container,
	Paper,
} from "@mui/material";
import { FunctionComponent, useEffect, useState, SyntheticEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../../../interfaces/usersMessages";
import { getCustomerProfileBySlug } from "../../../services/usersServices";
import { getCustomerProfilePostsBySlug } from "../../../services/postsServices";
import {
	Visibility,
	Star,
	LocalOffer,
	ThumbUp,
	// Comment,
	ArrowBack,
} from "@mui/icons-material";
import { Posts } from "../../../interfaces/Posts";
import { motion } from "framer-motion";
import { showSuccess, showError } from "../../../atoms/toasts/ReactToast";
import { path } from "../../../routes/routes";
import JsonLd from "../../../../utils/JsonLd";
import handleRTL from "../../../locales/handleRTL";
import TabPanel from "./taps/TabPanel";
import ProductsTab from "./taps/ProductsTap";
import CustomTabs from "./taps/Tabs";
import ContactInfoTab from "./taps/ContactInfoTab";
import { initStats, Stats } from "./types/states";
import RatingsTab from "./taps/RatingsTab";
import ContactTab from "./taps/ContactTab";
import UserInformation from "./taps/UserInformation";
import CustomerProfileHeader from "./CustomerProfileHeader";
import { AuthValues } from "../../../interfaces/authValues";
import { useUser } from "../../../context/useUSer";

const CustomerProfile: FunctionComponent = () => {
	const { slug } = useParams<{ slug: string }>();
	const navigate = useNavigate();
	const { isLoggedIn } = useUser();

	const [user, setUser] = useState<User | null>(null);
	const [posts, setPosts] = useState<Posts[]>([]);
	const [loading, setLoading] = useState(true);
	const [wishlist, setWishlist] = useState<Set<string>>(new Set());
	const [tabValue, setTabValue] = useState(0);
	const [stats, setStats] = useState<Stats>(initStats);

	const toggleWishlist = (productId: string) => {
		if (!isLoggedIn) {
			navigate(path.Login);
			return;
		}

		const newWishlist = new Set(wishlist);
		if (newWishlist.has(productId)) {
			newWishlist.delete(productId);
			showSuccess("تمت إزالة المنتج من المفضلة");
		} else {
			newWishlist.add(productId);
			showSuccess("تمت إضافة المنتج إلى المفضلة");
		}
		setWishlist(newWishlist);
	};

	const handleTabChange = (_: SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	useEffect(() => {
		if (!slug) return;
		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				const [profile, productsData] = await Promise.all([
					getCustomerProfileBySlug(slug),
					getCustomerProfilePostsBySlug(slug),
				]);

				setUser(profile);
				setPosts(productsData);

				// حساب الإحصائيات
				const totalLikes = productsData.reduce(
					(sum, post) => sum + (post.likes?.length || 0),
					0,
				);
				const totalViews = productsData.reduce(
					(sum, post) => sum + (Number(post.views) || 0),
					0,
				);

				setStats({
					totalProducts: productsData.length,
					totalLikes,
					totalViews,
					rating: profile.rating || 4.5,
				});
			} catch (error) {
				console.error(error);
				showError("حدث خطأ في تحميل بيانات المستخدم");
			} finally {
				setLoading(false);
			}
		};
		fetchData()
		return () => abortController.abort();
	}, [slug]);

	const handleShareProfile = () => {
		if (navigator.share) {
			navigator.share({
				title: `الملف الشخصي لـ ${user?.name?.first} ${user?.name?.last}`,
				text: `اطلع على منتجات ${user?.name?.first} على موقع صفقه`,
				url: window.location.href,
			});
		} else {
			navigator.clipboard.writeText(window.location.href);
			showSuccess("تم نسخ رابط الملف الشخصي");
		}
	};

	// TODO: Contact with seller with chat messages
	const handleContactSeller = () => {
		if (user?.phone?.phone_1) {
			window.open(`tel:${user.phone.phone_1}`, "_blank");
		} else {
			showError("لا يوجد رقم هاتف متوفر");
		}
	};

	const handleWhatsApp = () => {
		if (user?.phone?.phone_1) {
			const cleanNumber = user.phone.phone_1;

			const message = `مرحباً ${user?.name?.first}، أنا مهتم بمنتجاتك على موقع صفقه`;
			window.open(
				`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
				"_blank noopener noreferrer",

			);
		}
	};

	if (loading) {
		return (
			<Box
				display='flex'
				flexDirection='column'
				justifyContent='center'
				alignItems='center'
				minHeight='80vh'
				gap={3}
			>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
				>
					<CircularProgress size={60} />
				</motion.div>
				<Typography variant='h6' color='text.secondary'>
					جاري تحميل الملف الشخصي...
				</Typography>
			</Box>
		);
	}

	if (!user) {
		return (
			<Container maxWidth='md' sx={{ py: 8, textAlign: "center" }}>
				<Card sx={{ p: 4, borderRadius: 3 }}>
					<Box sx={{ fontSize: 80, mb: 3 }}>😔</Box>
					<Typography variant='h5' color='text.secondary' gutterBottom>
						المستخدم غير موجود
					</Typography>
					<Typography variant='body1' color='text.secondary' paragraph>
						الملف الشخصي الذي تبحث عنه غير موجود أو تم حذفه.
					</Typography>
					<Button
						variant='contained'
						startIcon={<ArrowBack />}
						onClick={() => navigate(-1)}
						sx={{ mt: 2 }}
					>
						العودة للخلف
					</Button>
				</Card>
			</Container>
		);
	}
	const currentUrl = `https://client-qqq1.vercel.app/users/customer/${slug}`;
	const dir = handleRTL();
	return (
		<>
			<link rel='canonical' href={currentUrl} />
			<title>{`منتجات ${user.name?.first} ${user.name?.last} للبيع في ${user.address?.city || "كافة البلاد"} | صفقة`}</title>
			<meta
				name='description'
				content={`تصفح أفضل العروض من البائع ${user.name?.first} في ${user.address?.city}. متوفر ${posts.length} منتجات تشمل ${posts
					.slice(0, 3)
					.map((p) => p.product_name)
					.join("، ")}. بيع وشراء آمن عبر صفقة.`}
			/>
			<meta
				property='og:title'
				content={`متجر ${user.name?.first} على صفقة - عروض لا تفوت`}
			/>
			<meta property='og:type' content='secondary_user.profile' />
			<meta property='og:url' content={window.location.href} />
			<meta property='og:image' content={user?.image?.url || "/user.png"} />
			<JsonLd
				data={{
					"@context": "https://schema.org",
					"@graph": [
						{
							"@type": "Person",
							"@id": `${currentUrl}#person`,
							name: `${user.name?.first} ${user.name?.last}`,
							image: user.image?.url || "/user.png",
							address: {
								"@type": "PostalAddress",
								addressLocality: user.address?.city,
								addressCountry: "IL",
							},
						},
						{
							"@type": "CollectionPage",
							name: `منتجات البائع ${user.name?.first}`,
							description: `قائمة المنتجات المعروضة بواسطة ${user.name?.first} على منصة صفقة`,
							mainEntity: {
								"@type": "ItemList",
								numberOfItems: posts.length,
								itemListElement: posts.map((post, index) => ({
									"@type": "ListItem",
									position: index + 1,
									url: `${window.location.origin}/product-details/${post.category}/${post.brand}/${post._id}`,
									name: post.product_name,
									image: post.image?.url,
								})),
							},
						},
					],
				}}
			/>

			<Container dir={dir} maxWidth='lg' sx={{ py: 4 }}>
				<CustomerProfileHeader
					dir={dir}
					handleContactSeller={handleContactSeller}
					handleShareProfile={handleShareProfile}
					handleWhatsApp={handleWhatsApp}
					navigate={navigate}
					products={posts}
					slug={slug as string}
					stats={stats}
					user={user}
				/>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<Grid container spacing={2} sx={{ mb: 4 }}>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
								<ThumbUp color='primary' sx={{ fontSize: 40, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalLikes}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									إعجاب
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
								<Visibility color='info' sx={{ fontSize: 40, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalViews}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									مشاهدة
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
								<LocalOffer color='success' sx={{ fontSize: 40, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.totalProducts}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									منتج
								</Typography>
							</Paper>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Paper sx={{ p: 2, textAlign: "center", borderRadius: 2 }}>
								<Star color='warning' sx={{ fontSize: 40, mb: 1 }} />
								<Typography variant='h4' fontWeight='bold'>
									{stats.rating}
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									تقييم
								</Typography>
							</Paper>
						</Grid>
					</Grid>
				</motion.div>

				{/* Tabs Section */}
				<Card sx={{ mb: 4, borderRadius: 3 }}>
					<CustomTabs handleTabChange={handleTabChange} tabValue={tabValue} />

					{/* Products */}
					<TabPanel value={tabValue} index={0}>
						<ProductsTab
							toggleWishlist={toggleWishlist}
							wishlist={wishlist}
							products={posts}
							tabValue={tabValue}
							user={user}
						/>
					</TabPanel>

					{/* User Information */}
					<TabPanel value={tabValue} index={1}>
						<UserInformation user={user as unknown as AuthValues} />
					</TabPanel>

					<TabPanel value={tabValue} index={2}>
						<ContactInfoTab user={user} />
					</TabPanel>

					{/* Ratings Tab */}
					<TabPanel value={tabValue} index={3}>
						<RatingsTab stats={stats} />
					</TabPanel>

					{/* Contact */}
					<TabPanel value={tabValue} index={4}>
						<ContactTab
							user={user}
							handleWhatsApp={handleWhatsApp}
						/>
					</TabPanel>
				</Card>
			</Container>
		</>
	);
};

export default CustomerProfile;
