// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FunctionComponent, useCallback, useEffect, useState } from 'react';
// import { Download } from '@mui/icons-material';
// import * as XLSX from 'xlsx';
// import {
//     PieChart,
//     Pie,
//     Cell,
//     ResponsiveContainer,
//     Tooltip as RechartsTooltip,
//     Legend,
// } from 'recharts';

// import {
//     Box,
//     Card,
//     CardContent,
//     Typography,
//     Grid,
//     Select,
//     MenuItem,
//     FormControl,
//     InputLabel,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Paper,
//     Chip,
//     CircularProgress,
//     alpha,
//     useTheme,
//     Avatar,
//     LinearProgress,
//     Tooltip,
//     IconButton,
//     Fade,
//     Grow,
//     Zoom,
//     Button,
//     Container,
// } from '@mui/material';
// import {
//     TrendingUp,
//     People,
//     ShoppingCart,
//     MonetizationOn,
//     Visibility,
//     ThumbUp,
//     AccessTime,
//     AttachMoney,
//     Refresh,
//     Category,
//     Star,
//     Verified,
//     Percent,
//     AdminPanelSettings,
//     SupervisorAccount,
//     Person,
// } from '@mui/icons-material';
// import { Posts } from '../../../interfaces/Posts';
// import { getAllUsers } from '../../../services/usersServices';
// import { getAllPosts } from '../../../services/postsServices';
// import { User } from '../../../interfaces/chat/usersMessages';
// import { useUser } from '../../../context/useUSer';
// import { formatPrice } from '../../../helpers/dateAndPriceFormat';
// import RoleType from '../../../interfaces/UserType';
// import { Link } from 'react-router-dom';
// import { productsPathes } from '../../../routes/routes';

// // Helper function to safely get number from views
// const getViewsAsNumber = (views: any): number => {
//     if (typeof views === 'number') return views;
//     if (typeof views === 'string') return parseInt(views, 10) || 0;
//     return 0;
// };

// // Helper function to safely get createdAt as string
// const getCreatedAtAsString = (createdAt: any): string => {
//     if (typeof createdAt === 'string') return createdAt;
//     if (createdAt instanceof Date) return createdAt.toISOString();
//     return new Date().toISOString();
// };

// // Extended interface for Post with user data
// interface PostWithUser extends Posts {
//     userData?: User;
// }

// // Interface for most popular products
// interface MostPopularProduct {
//     id: string;
//     name: string;
//     image?: string;
//     likes: number;
//     views: number;
//     price: number;
//     status: string;
//     seller: {
//         name: string;
//         slug: string;
//         user: string;
//         link: string;
//     };
//     category: string;
//     createdAt: string;
// }

// // Interface for category statistics
// interface CategoryStats {
//     category: string;
//     count: number;
//     percentage: number;
//     totalValue: number;
// }

// // Interface for top category
// interface TopCategory {
//     category: string;
//     count: number;
//     likes: number;
// }

// // Interface for top seller
// interface TopSeller {
//     _id: string;
//     name: string;
//     avatar?: string;
//     productsCount: number;
//     totalLikes: number;
//     totalViews: number;
//     totalValue: number;
//     role: string;
// }

// // Interface for product by date
// interface ProductByDate {
//     date: string;
//     count: number;
// }

// // Main statistics interface
// interface Statistics {
//     totalProducts: number;
//     activeProducts: number;
//     soldPosts: number;
//     newProductsToday: number;
//     newProductsMonth: number;
//     onlineUsers: number;
//     totalUsers: number;
//     newUsersToday: number;
//     newUsersMonth: number;
//     activeSellers: number;
//     totalAdmins: number;
//     totalModerators: number;
//     totalClients: number;
//     totalLikes: number;
//     totalViews: number;
//     averageLikesPerProduct: number;
//     averageViewsPerProduct: number;
//     totalProductValue: number;
//     averageProductPrice: number;
//     highestPricedProduct: number;
//     lowestPricedProduct: number;
//     totalDiscountValue: number;
//     productsByCategory: CategoryStats[];
//     topCategories: TopCategory[];
//     mostPopularProducts: MostPopularProduct[];
//     topSellers: TopSeller[];
//     productsByDate: ProductByDate[];
// }

// // Interface for seller data map
// interface SellerData {
//     productsCount: number;
//     totalLikes: number;
//     totalViews: number;
//     totalValue: number;
//     user: User;
// }

// // Interface for category data map
// interface CategoryData {
//     count: number;
//     likes: number;
//     totalValue: number;
// }

// // Enhanced Colors for PieChart and gradients
// const COLORS: string[] = [
//     '#6366F1', // Indigo
//     '#10B981', // Emerald
//     '#F59E0B', // Amber
//     '#EF4444', // Red
//     '#8B5CF6', // Violet
//     '#EC4899', // Pink
//     '#06B6D4', // Cyan
//     '#84CC16', // Lime
// ];

// // Interface for auth values
// interface AuthValues {
//     role: string;
//     name?: {
//         first: string;
//         last: string;
//     };
//     status?: boolean;
//     createdAt?: string;
//     _id?: string;
//     image?: {
//         url?: string;
//     };
// }

// const StatBadge = ({
//     icon,
//     label,
//     value,
//     color,
// }: {
//     icon: React.ReactNode;
//     label: string;
//     value: string | number;
//     color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
// }) => (
//     <Card
//         sx={{
//             // bgcolor: color ? alpha(theme.palette[color].main, 0.1) : 'background.paper',
//             borderRadius: 2,
//             minWidth: 150,
//         }}
//     >
//         <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
//             <Box display='flex' alignItems='center' gap={1}>
//                 <Box sx={{ color: color ? `${color}.main` : 'text.secondary' }}>
//                     {icon}
//                 </Box>
//                 <Box>
//                     <Typography variant='caption' color='text.secondary'>
//                         {label}
//                     </Typography>
//                     <Typography variant='subtitle1' fontWeight='bold'>
//                         {value}
//                     </Typography>
//                 </Box>
//             </Box>
//         </CardContent>
//     </Card>
// );

// const StatisticsPanel: FunctionComponent = () => {
//     const { auth } = useUser();
//     const theme = useTheme();

//     const [timeFrame, setTimeFrame] = useState<string>('today');
//     const [statistics, setStatistics] = useState<Statistics>({
//         totalProducts: 0,
//         activeProducts: 0,
//         soldPosts: 0,
//         newProductsToday: 0,
//         newProductsMonth: 0,
//         onlineUsers: 0,
//         totalUsers: 0,
//         newUsersToday: 0,
//         newUsersMonth: 0,
//         activeSellers: 0,
//         totalAdmins: 0,
//         totalModerators: 0,
//         totalClients: 0,
//         totalLikes: 0,
//         totalViews: 0,
//         averageLikesPerProduct: 0,
//         averageViewsPerProduct: 0,
//         totalProductValue: 0,
//         averageProductPrice: 0,
//         highestPricedProduct: 0,
//         lowestPricedProduct: 0,
//         totalDiscountValue: 0,
//         productsByCategory: [],
//         topCategories: [],
//         mostPopularProducts: [],
//         topSellers: [],
//         productsByDate: [],
//     });
//     const [loading, setLoading] = useState<boolean>(true);
//     const [refreshing, setRefreshing] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     const fetchData = useCallback(async (): Promise<void> => {
//         setLoading(true);
//         setError(null);
//         try {
//             const [usersRes, productsRes] = await Promise.all([
//                 getAllUsers(),
//                 getAllPosts(),
//             ]);

//             const usersData: AuthValues[] = (usersRes as AuthValues[]) || [];
//             const postsData: Posts[] = (productsRes as Posts[]) || [];

//             const postsWithUserData: PostWithUser[] = postsData
//                 .filter((post) => post && post.seller)
//                 .map((post: Posts) => ({
//                     ...post,
//                     userData: usersData.find(
//                         (user: AuthValues) =>
//                             user._id === post.seller?.user?._id,
//                     ) as User,
//                 }));

//             calculateStatistics(usersData, postsWithUserData);
//         } catch (err) {
//             console.error('Error fetching data:', err);
//             setError('فشل تحميل البيانات. يرجى المحاولة مرة أخرى');
//         } finally {
//             setLoading(false);
//             setRefreshing(false);
//         }
//     }, []);

//     useEffect(() => {
//         if (auth.role !== RoleType.Admin && auth.role !== RoleType.Moderator)
//             return;
//         fetchData();
//     }, [auth.role, fetchData]);

//     const handleRefresh = (): void => {
//         setRefreshing(true);
//         fetchData();
//     };

//     // حساب جميع الإحصائيات لموقع C2C
//     const calculateStatistics = (
//         users: AuthValues[],
//         posts: PostWithUser[],
//     ): void => {
//         const now: Date = new Date();
//         const todayStart: Date = new Date(
//             now.getFullYear(),
//             now.getMonth(),
//             now.getDate(),
//         );
//         const monthStart: Date = new Date(now.getFullYear(), now.getMonth(), 1);

//         // إحصائيات المستخدمين
//         const newUsersToday: number = users.filter((user: AuthValues) => {
//             const createdAt = user.createdAt ? new Date(user.createdAt) : now;
//             return createdAt >= todayStart;
//         }).length;

//         const newUsersMonth: number = users.filter((user: AuthValues) => {
//             const createdAt = user.createdAt ? new Date(user.createdAt) : now;
//             return createdAt >= monthStart;
//         }).length;

//         // إحصائيات المستخدمين حسب الدور
//         const totalAdmins: number = users.filter(
//             (u: AuthValues) => u.role === 'Admin',
//         ).length;
//         const totalModerators: number = users.filter(
//             (u: AuthValues) => u.role === 'Moderator',
//         ).length;
//         const totalClients: number = users.filter(
//             (u: AuthValues) => u.role === 'Client',
//         ).length;

//         // إحصائيات المنشورات حسب الوقت
//         const newPostsToday: number = posts.filter((post: PostWithUser) => {
//             const createdAt = post.createdAt
//                 ? new Date(getCreatedAtAsString(post.createdAt))
//                 : now;
//             return createdAt >= todayStart;
//         }).length;

//         const newPostsMonth: number = posts.filter((post: PostWithUser) => {
//             const createdAt = post.createdAt
//                 ? new Date(getCreatedAtAsString(post.createdAt))
//                 : now;
//             return createdAt >= monthStart;
//         }).length;

//         // إحصائيات حالة المنشورات
//         const activePosts: number = posts.filter(
//             (p: PostWithUser) => p.in_stock === true,
//         ).length;

//         // حساب البائعين النشطين
//         const sellersMap = new Map<string, SellerData>();

//         posts.forEach((post: PostWithUser) => {
//             const sellerId = post.seller?.user?._id;

//             if (sellerId && post.userData) {
//                 const existing = sellersMap.get(sellerId);

//                 const seller: SellerData = existing || {
//                     productsCount: 0,
//                     totalLikes: 0,
//                     totalViews: 0,
//                     totalValue: 0,
//                     user: post.userData,
//                 };

//                 sellersMap.set(sellerId, {
//                     ...seller,
//                     productsCount: seller.productsCount + 1,
//                     totalLikes: seller.totalLikes + (post.likes?.length || 0),
//                     totalViews: seller.totalViews + (post.reviews?.length || 0),
//                     totalValue: seller.totalValue + (post.price || 0),
//                 });
//             }
//         });

//         const activeSellers: number = sellersMap.size;

//         // إحصائيات التفاعل
//         const totalLikes: number = posts.reduce(
//             (sum: number, post: PostWithUser) =>
//                 sum + (post.likes?.length || 0),
//             0,
//         );
//         const totalViews: number = posts.reduce(
//             (sum: number, post: PostWithUser) =>
//                 sum + getViewsAsNumber(post.reviews),
//             0,
//         );

//         const averageLikesPerProduct: number =
//             posts.length > 0
//                 ? Math.round((totalLikes / posts.length) * 10) / 10
//                 : 0;
//         const averageViewsPerProduct: number =
//             posts.length > 0
//                 ? Math.round((totalViews / posts.length) * 10) / 10
//                 : 0;

//         // إحصائيات القيمة
//         const postPrices: number[] = posts.map(
//             (p: PostWithUser) => p.price || 0,
//         );
//         const totalProductValue: number = postPrices.reduce(
//             (sum: number, price: number) => sum + price,
//             0,
//         );
//         const averageProductPrice: number =
//             posts.length > 0 ? Math.round(totalProductValue / posts.length) : 0;
//         const highestPricedProduct: number =
//             postPrices.length > 0 ? Math.max(...postPrices) : 0;
//         const lowestPricedProduct: number =
//             postPrices.length > 0
//                 ? Math.min(...postPrices.filter((p: number) => p > 0))
//                 : 0;

//         // حساب قيمة الخصومات
//         const totalDiscountValue: number = posts.reduce(
//             (sum: number, post: PostWithUser) => {
//                 if (post.sale && post.discount && post.price) {
//                     return sum + (post.price * post.discount) / 100;
//                 }
//                 return sum;
//             },
//             0,
//         );

//         // إحصائيات الفئات
//         const categoryMap = new Map<string, CategoryData>();
//         posts.forEach((post: PostWithUser) => {
//             if (post.category) {
//                 const existing = categoryMap.get(post.category);
//                 const data: CategoryData = existing || {
//                     count: 0,
//                     likes: 0,
//                     totalValue: 0,
//                 };
//                 categoryMap.set(post.category, {
//                     count: data.count + 1,
//                     likes: data.likes + (post.likes?.length || 0),
//                     totalValue: data.totalValue + (post.price || 0),
//                 });
//             }
//         });

//         const totalPostsCount: number = posts.length;
//         const productsByCategory: CategoryStats[] = Array.from(
//             categoryMap.entries(),
//         )
//             .map(([category, data]: [string, CategoryData]) => ({
//                 category,
//                 count: data.count,
//                 percentage:
//                     totalPostsCount > 0
//                         ? (data.count / totalPostsCount) * 100
//                         : 0,
//                 totalValue: data.totalValue,
//             }))
//             .sort((a: CategoryStats, b: CategoryStats) => b.count - a.count);

//         // أكثر الفئات شعبية
//         const topCategories: TopCategory[] = Array.from(categoryMap.entries())
//             .map(([category, data]: [string, CategoryData]) => ({
//                 category,
//                 count: data.count,
//                 likes: data.likes,
//             }))
//             .sort((a: TopCategory, b: TopCategory) => b.likes - a.likes)
//             .slice(0, 5);

//         // أكثر المنشورات تفاعلاً
//         const mostPopularProducts: MostPopularProduct[] = [...posts]
//             .map((post: PostWithUser) => ({
//                 id: post._id || '',
//                 name: post.product_name || 'منتج بدون اسم',
//                 image: post.image?.url,
//                 likes: post.likes?.length || 0,
//                 views: post.reviews?.length || 0,
//                 price: post.price || 0,
//                 status: post.in_stock ? 'active' : 'sold',
//                 seller: {
//                     name:
//                         post.seller?.user?.name ||
//                         `${post.userData?.name?.first || ''} ${post.userData?.name?.last || ''}`.trim() ||
//                         'بائع غير معروف',
//                     link: `/customer-profile/${post.seller?.user?.slug || ''}`,
//                     slug: post.seller?.user?.slug || '',
//                     user: post.seller?.user?.user || '',
//                 },
//                 category: post.category || 'غير مصنف',
//                 createdAt: getCreatedAtAsString(post.createdAt),
//             }))
//             .sort((a: MostPopularProduct, b: MostPopularProduct) => {
//                 const aScore = a.likes * 2 + a.views;
//                 const bScore = b.likes * 2 + b.views;
//                 return bScore - aScore;
//             })
//             .slice(0, 5);

//         // أكثر البائعين نشاطاً
//         const topSellers: TopSeller[] = Array.from(sellersMap.entries())
//             .map(([userId, data]: [string, SellerData]) => ({
//                 _id: userId,
//                 name: `${data.user.name?.first || 'مستخدم'} ${data.user.name?.last || ''}`.trim(),
//                 avatar: data.user.image?.url,
//                 productsCount: data.productsCount,
//                 totalLikes: data.totalLikes,
//                 totalViews: data.totalViews,
//                 totalValue: data.totalValue,
//                 role: data.user.role || 'Client',
//             }))
//             .sort((a: TopSeller, b: TopSeller) => {
//                 if (b.productsCount !== a.productsCount) {
//                     return b.productsCount - a.productsCount;
//                 }
//                 return (
//                     b.totalLikes + b.totalViews - (a.totalLikes + a.totalViews)
//                 );
//             })
//             .slice(0, 5);

//         // توزيع المنتجات حسب التاريخ (آخر 7 أيام)
//         const last7Days: string[] = Array.from(
//             { length: 7 },
//             (_, i: number) => {
//                 const date = new Date();
//                 date.setDate(date.getDate() - i);
//                 return date.toISOString().split('T')[0];
//             },
//         ).reverse();

//         const productsByDate: ProductByDate[] = last7Days.map(
//             (date: string) => {
//                 const count: number = posts.filter((post: PostWithUser) => {
//                     if (!post.createdAt) return false;
//                     const postDate: string = new Date(
//                         getCreatedAtAsString(post.createdAt),
//                     )
//                         .toISOString()
//                         .split('T')[0];
//                     return postDate === date;
//                 }).length;
//                 return { date, count };
//             },
//         );

//         const soldPosts: number = posts.filter(
//             (p: PostWithUser) => p.in_stock === false,
//         ).length;

//         const onlineUsers = users.filter((user) => user.status === true).length;

//         setStatistics({
//             totalProducts: posts.length,
//             activeProducts: activePosts,
//             soldPosts: soldPosts,
//             newProductsToday: newPostsToday,
//             newProductsMonth: newPostsMonth,
//             onlineUsers: onlineUsers,
//             totalUsers: users.length,
//             newUsersToday,
//             newUsersMonth,
//             activeSellers,
//             totalAdmins,
//             totalModerators,
//             totalClients,
//             totalLikes,
//             totalViews,
//             averageLikesPerProduct,
//             averageViewsPerProduct,
//             totalProductValue,
//             averageProductPrice,
//             highestPricedProduct,
//             lowestPricedProduct,
//             totalDiscountValue,
//             productsByCategory,
//             topCategories,
//             mostPopularProducts,
//             topSellers,
//             productsByDate,
//         });
//     };

//     const getStatusColor = (
//         status: string,
//     ): 'success' | 'warning' | 'error' | 'default' => {
//         switch (status) {
//             case 'active':
//                 return 'success';
//             case 'pending':
//                 return 'warning';
//             case 'sold':
//                 return 'error';
//             default:
//                 return 'default';
//         }
//     };

//     const getStatusLabel = (status: string): string => {
//         switch (status) {
//             case 'active':
//                 return 'متاح';
//             case 'pending':
//                 return 'قيد المراجعة';
//             case 'sold':
//                 return 'تم البيع';
//             default:
//                 return status;
//         }
//     };

//     const getRoleColor = (
//         role: string,
//     ): 'error' | 'warning' | 'success' | 'info' | 'default' => {
//         switch (role) {
//             case 'Admin':
//                 return 'error';
//             case 'Moderator':
//                 return 'warning';
//             case 'Client':
//                 return 'success';
//             case 'delivery':
//                 return 'info';
//             default:
//                 return 'default';
//         }
//     };

//     const getRoleIcon = (role: string) => {
//         switch (role) {
//             case 'Admin':
//                 return <AdminPanelSettings fontSize='small' />;
//             case 'Moderator':
//                 return <SupervisorAccount fontSize='small' />;
//             case 'Client':
//                 return <Person fontSize='small' />;
//             default:
//                 return <Person fontSize='small' />;
//         }
//     };

//     const getCategoryName = (category: string): string => {
//         const categories: Record<string, string> = {
//             House: 'بيت',
//             Garden: 'حديقة',
//             Cars: 'سيارات',
//             Bikes: 'دراجات',
//             Trucks: 'شاحنات',
//             ElectricVehicles: 'مركبات كهربائية',
//             MenClothes: 'ملابس رجالية',
//             WomenClothes: 'ملابس نسائية',
//             Baby: 'أطفال',
//             Kids: 'ألعاب',
//             Health: 'صحة',
//             Beauty: 'جمال',
//             Watches: 'ساعات',
//             Cleaning: 'تنظيف',
//         };
//         return categories[category] || category;
//     };

//     // Check if user has access
//     if (auth.role !== 'Admin' && auth.role !== 'Moderator') {
//         return (
//             <Box component='main' className='container mt-5 text-center'>
//                 <Typography variant='h4' color='error'>
//                     غير مصرح لك بالوصول إلى هذه الصفحة
//                 </Typography>
//             </Box>
//         );
//     }

//     if (error) {
//         return (
//             <Box textAlign='center' py={8}>
//                 <Typography color='error' variant='h5' gutterBottom>
//                     {error}
//                 </Typography>
//                 <Button
//                     variant='contained'
//                     onClick={handleRefresh}
//                     startIcon={<Refresh />}
//                     sx={{ mt: 2 }}
//                 >
//                     إعادة المحاولة
//                 </Button>
//             </Box>
//         );
//     }

//     const exportToExcel = (data: Statistics) => {
//         const exportData = {
//             'إجمالي المنتجات': data.totalProducts,
//             'المنتجات النشطة': data.activeProducts,
//             'المنتجات المباعة': data.soldPosts,
//             'إجمالي المستخدمين': data.totalUsers,
//             'المستخدمين النشطين': data.onlineUsers,
//             'إجمالي الإعجابات': data.totalLikes,
//             'القيمة الإجمالية': data.totalProductValue,
//         };

//         const ws = XLSX.utils.json_to_sheet([exportData]);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'إحصائيات المنصة');
//         XLSX.writeFile(
//             wb,
//             `تقرير_صفقة_${new Date().toLocaleDateString()}.xlsx`,
//         );
//     };

//     return (
//         <>
//             <title>لوحة تحكم الإدارة | صفقة - منصة C2C</title>
//             <meta
//                 name='description'
//                 content='لوحة تحكم إدارة منصة بيع وشراء C2C | صفقة'
//             />
//             <main>
//                 <Container>
//                     <Box
//                         sx={{
//                             display: 'flex',
//                             gap: 2,
//                             mb: 3,
//                             flexWrap: 'wrap',
//                         }}
//                     >
//                         <StatBadge
//                             icon={<People />}
//                             label='إجمالي المستخدمين'
//                             value={statistics.totalUsers}
//                             color='primary'
//                         />
//                         <StatBadge
//                             icon={<ShoppingCart />}
//                             label='المنتجات'
//                             value={statistics.totalProducts}
//                             color='success'
//                         />
//                         <StatBadge
//                             icon={<AttachMoney />}
//                             label='القيمة'
//                             value={formatPrice(statistics.totalProductValue)}
//                             color='warning'
//                         />
//                     </Box>
//                     <Button
//                         startIcon={<Download />}
//                         onClick={() => exportToExcel(statistics)}
//                         variant='outlined'
//                         size='small'
//                     >
//                         تصدير تقرير
//                     </Button>
//                     {/* العنوان الرئيسي مع تأثير متحرك */}
//                     <Grow in={true} timeout={500}>
//                         <Box
//                             display='flex'
//                             justifyContent='space-between'
//                             alignItems='center'
//                             mb={4}
//                             flexWrap='wrap'
//                             gap={2}
//                         >
//                             <Box>
//                                 <Typography
//                                     variant='h3'
//                                     component='h1'
//                                     sx={{
//                                         backgroundClip: 'text',
//                                         WebkitBackgroundClip: 'text',
//                                         WebkitTextFillColor: 'transparent',
//                                         fontWeight: 800,
//                                         letterSpacing: '-0.5px',
//                                     }}
//                                 >
//                                     لوحة تحكم إدارة منصة صفقه
//                                 </Typography>
//                                 <Typography
//                                     variant='subtitle1'
//                                     color='text.secondary'
//                                     sx={{ mt: 1 }}
//                                 >
//                                     إحصائيات وتحليلات المنصة في الوقت الفعلي
//                                 </Typography>
//                             </Box>
//                             <Tooltip title='تحديث البيانات'>
//                                 <IconButton
//                                     onClick={handleRefresh}
//                                     disabled={refreshing}
//                                     sx={{
//                                         bgcolor: alpha(
//                                             theme.palette.primary.main,
//                                             0.1,
//                                         ),
//                                         '&:hover': {
//                                             bgcolor: alpha(
//                                                 theme.palette.primary.main,
//                                                 0.2,
//                                             ),
//                                             transform: 'rotate(180deg)',
//                                             transition: 'transform 0.5s',
//                                         },
//                                     }}
//                                 >
//                                     <Refresh
//                                         className={refreshing ? 'spin' : ''}
//                                     />
//                                 </IconButton>
//                             </Tooltip>
//                         </Box>
//                     </Grow>

//                     {/* فلترة الوقت ومعلومات المسؤول */}
//                     <Fade in={true} timeout={800}>
//                         <Box
//                             display='flex'
//                             justifyContent='space-between'
//                             alignItems='center'
//                             mb={4}
//                             flexWrap='wrap'
//                             gap={2}
//                             sx={{
//                                 p: 2,
//                                 bgcolor: alpha(
//                                     theme.palette.background.paper,
//                                     0.6,
//                                 ),
//                                 borderRadius: 3,
//                                 backdropFilter: 'blur(10px)',
//                             }}
//                         >
//                             <Box>
//                                 <Typography
//                                     variant='body1'
//                                     color='text.secondary'
//                                 >
//                                     مرحباً، {auth.name?.first} {auth.name?.last}
//                                 </Typography>
//                                 <Chip
//                                     icon={getRoleIcon(auth.role)}
//                                     label={
//                                         auth.role === 'Admin'
//                                             ? 'مدير النظام'
//                                             : 'مشرف'
//                                     }
//                                     size='small'
//                                     color={
//                                         auth.role === 'Admin'
//                                             ? 'error'
//                                             : 'warning'
//                                     }
//                                     variant='filled'
//                                     sx={{ mt: 0.5, fontWeight: 600 }}
//                                 />
//                             </Box>
//                             <FormControl sx={{ minWidth: 150 }}>
//                                 <InputLabel>الفترة الزمنية</InputLabel>
//                                 <Select
//                                     value={timeFrame}
//                                     label='الفترة الزمنية'
//                                     onChange={(e) =>
//                                         setTimeFrame(e.target.value)
//                                     }
//                                     sx={{ borderRadius: 3 }}
//                                 >
//                                     <MenuItem value='today'>اليوم</MenuItem>
//                                     <MenuItem value='month'>هذا الشهر</MenuItem>
//                                     <MenuItem value='all'>الكل</MenuItem>
//                                 </Select>
//                             </FormControl>
//                         </Box>
//                     </Fade>

//                     {loading ? (
//                         <Box
//                             display='flex'
//                             justifyContent='center'
//                             alignItems='center'
//                             height='50vh'
//                         >
//                             <CircularProgress size={60} thickness={4} />
//                         </Box>
//                     ) : (
//                         <>
//                             {/* إحصائيات سريعة */}
//                             <Typography
//                                 variant='h5'
//                                 gutterBottom
//                                 sx={{
//                                     mt: 4,
//                                     mb: 3,
//                                     fontWeight: 700,
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: 1,
//                                 }}
//                             >
//                                 <TrendingUp
//                                     sx={{ color: theme.palette.primary.main }}
//                                 />
//                                 نظرة عامة على المنصة
//                             </Typography>

//                             <Grid container spacing={3}>
//                                 {/* بطاقة المستخدمون */}
//                                 <Grid size={{ xs: 12, md: 6, lg: 3 }}>
//                                     <Zoom in={true} timeout={300}>
//                                         <Card
//                                             sx={{
//                                                 color: 'primary',
//                                                 borderRadius: 4,
//                                                 transition: 'all 0.3s',
//                                                 cursor: 'pointer',
//                                                 '&:hover': {
//                                                     transform:
//                                                         'translateY(-8px)',
//                                                     boxShadow:
//                                                         '0 20px 40px rgba(0,0,0,0.2)',
//                                                 },
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                 >
//                                                     <Box>
//                                                         <People
//                                                             sx={{
//                                                                 fontSize: 48,
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                     <Box textAlign='right'>
//                                                         <Typography
//                                                             variant='h3'
//                                                             fontWeight='bold'
//                                                         >
//                                                             {
//                                                                 statistics.totalUsers
//                                                             }
//                                                         </Typography>
//                                                         <Typography
//                                                             variant='body2'
//                                                             sx={{
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         >
//                                                             إجمالي المستخدمين
//                                                         </Typography>
//                                                     </Box>
//                                                 </Box>
//                                                 <Box mt={2}>
//                                                     <Typography
//                                                         variant='caption'
//                                                         sx={{ opacity: 0.8 }}
//                                                     >
//                                                         +
//                                                         {
//                                                             statistics.newUsersToday
//                                                         }{' '}
//                                                         اليوم
//                                                     </Typography>
//                                                     <LinearProgress
//                                                         variant='determinate'
//                                                         value={
//                                                             (statistics.onlineUsers /
//                                                                 statistics.totalUsers) *
//                                                             100
//                                                         }
//                                                         sx={{
//                                                             mt: 1,
//                                                             height: 6,
//                                                             borderRadius: 3,
//                                                             bgcolor: alpha(
//                                                                 '#fff',
//                                                                 0.2,
//                                                             ),
//                                                             '& .MuiLinearProgress-bar':
//                                                                 {
//                                                                     bgcolor:
//                                                                         '#fff',
//                                                                 },
//                                                         }}
//                                                     />
//                                                     <Typography
//                                                         variant='caption'
//                                                         sx={{ opacity: 0.8 }}
//                                                     >
//                                                         {statistics.onlineUsers}{' '}
//                                                         متصل الآن
//                                                     </Typography>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Zoom>
//                                 </Grid>

//                                 {/* بطاقة المنتجات */}
//                                 <Grid size={{ xs: 12, md: 6, lg: 3 }}>
//                                     <Zoom in={true} timeout={400}>
//                                         <Card
//                                             sx={{
//                                                 color: 'primary',
//                                                 borderRadius: 4,
//                                                 transition: 'all 0.3s',
//                                                 cursor: 'pointer',
//                                                 '&:hover': {
//                                                     transform:
//                                                         'translateY(-8px)',
//                                                     boxShadow:
//                                                         '0 20px 40px rgba(0,0,0,0.2)',
//                                                 },
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                 >
//                                                     <Box>
//                                                         <ShoppingCart
//                                                             sx={{
//                                                                 fontSize: 48,
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                     <Box textAlign='right'>
//                                                         <Typography
//                                                             variant='h3'
//                                                             fontWeight='bold'
//                                                         >
//                                                             {
//                                                                 statistics.totalProducts
//                                                             }
//                                                         </Typography>
//                                                         <Typography
//                                                             variant='body2'
//                                                             sx={{
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         >
//                                                             إجمالي المنتجات
//                                                         </Typography>
//                                                     </Box>
//                                                 </Box>
//                                                 <Box mt={2}>
//                                                     <Box
//                                                         display='flex'
//                                                         gap={1}
//                                                         justifyContent='space-between'
//                                                     >
//                                                         <Chip
//                                                             size='small'
//                                                             label={`${statistics.activeProducts} نشط`}
//                                                             sx={{
//                                                                 bgcolor: alpha(
//                                                                     '#fff',
//                                                                     0.2,
//                                                                 ),
//                                                                 color: 'primary',
//                                                             }}
//                                                         />
//                                                         <Chip
//                                                             size='small'
//                                                             label={`${statistics.soldPosts} مباع`}
//                                                             sx={{
//                                                                 bgcolor: alpha(
//                                                                     '#fff',
//                                                                     0.2,
//                                                                 ),
//                                                                 color: 'primary',
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                     <Typography
//                                                         variant='caption'
//                                                         sx={{
//                                                             opacity: 0.8,
//                                                             display: 'block',
//                                                             mt: 1,
//                                                         }}
//                                                     >
//                                                         +
//                                                         {
//                                                             statistics.newProductsToday
//                                                         }{' '}
//                                                         اليوم
//                                                     </Typography>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Zoom>
//                                 </Grid>

//                                 {/* بطاقة القيمة الإجمالية */}
//                                 <Grid size={{ xs: 12, md: 6, lg: 3 }}>
//                                     <Zoom in={true} timeout={500}>
//                                         <Card
//                                             sx={{
//                                                 color: 'primary',
//                                                 borderRadius: 4,
//                                                 transition: 'all 0.3s',
//                                                 cursor: 'pointer',
//                                                 '&:hover': {
//                                                     transform:
//                                                         'translateY(-8px)',
//                                                     boxShadow:
//                                                         '0 20px 40px rgba(0,0,0,0.2)',
//                                                 },
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                 >
//                                                     <Box>
//                                                         <AttachMoney
//                                                             sx={{
//                                                                 fontSize: 48,
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                     <Box textAlign='right'>
//                                                         <Typography
//                                                             variant='h4'
//                                                             fontWeight='bold'
//                                                         >
//                                                             {formatPrice(
//                                                                 statistics.totalProductValue,
//                                                             )}
//                                                         </Typography>
//                                                         <Typography
//                                                             variant='body2'
//                                                             sx={{
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         >
//                                                             القيمة الإجمالية
//                                                         </Typography>
//                                                     </Box>
//                                                 </Box>
//                                                 <Box mt={2}>
//                                                     <Typography
//                                                         variant='caption'
//                                                         sx={{ opacity: 0.8 }}
//                                                     >
//                                                         متوسط:{' '}
//                                                         {formatPrice(
//                                                             statistics.averageProductPrice,
//                                                         )}
//                                                     </Typography>
//                                                     <Box
//                                                         display='flex'
//                                                         gap={1}
//                                                         mt={1}
//                                                     >
//                                                         <Chip
//                                                             size='small'
//                                                             icon={
//                                                                 <TrendingUp
//                                                                     sx={{
//                                                                         fontSize: 16,
//                                                                     }}
//                                                                 />
//                                                             }
//                                                             label={`أعلى: ${formatPrice(statistics.highestPricedProduct)}`}
//                                                             sx={{
//                                                                 color: 'primary',
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Zoom>
//                                 </Grid>

//                                 {/* بطاقة التفاعل */}
//                                 <Grid size={{ xs: 12, md: 6, lg: 3 }}>
//                                     <Zoom in={true} timeout={600}>
//                                         <Card
//                                             sx={{
//                                                 color: 'primary',
//                                                 borderRadius: 4,
//                                                 transition: 'all 0.3s',
//                                                 cursor: 'pointer',
//                                                 '&:hover': {
//                                                     transform:
//                                                         'translateY(-8px)',
//                                                     boxShadow:
//                                                         '0 20px 40px rgba(0,0,0,0.2)',
//                                                 },
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                 >
//                                                     <Box>
//                                                         <ThumbUp
//                                                             sx={{
//                                                                 fontSize: 48,
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                     <Box textAlign='right'>
//                                                         <Typography
//                                                             variant='h3'
//                                                             fontWeight='bold'
//                                                         >
//                                                             {statistics.totalLikes.toLocaleString()}
//                                                         </Typography>
//                                                         <Typography
//                                                             variant='body2'
//                                                             sx={{
//                                                                 opacity: 0.9,
//                                                             }}
//                                                         >
//                                                             إجمالي التفاعلات
//                                                         </Typography>
//                                                     </Box>
//                                                 </Box>
//                                                 <Box mt={2}>
//                                                     <Box
//                                                         display='flex'
//                                                         gap={1}
//                                                         justifyContent='space-between'
//                                                     >
//                                                         <Chip
//                                                             size='small'
//                                                             label={`${statistics.averageLikesPerProduct} / منتج`}
//                                                             sx={{
//                                                                 color: 'primary',
//                                                             }}
//                                                         />
//                                                         <Chip
//                                                             size='small'
//                                                             label={`${statistics.activeSellers} بائع`}
//                                                             sx={{
//                                                                 bgcolor: alpha(
//                                                                     '#fff',
//                                                                     0.2,
//                                                                 ),
//                                                                 color: 'primary',
//                                                             }}
//                                                         />
//                                                     </Box>
//                                                 </Box>
//                                             </CardContent>
//                                         </Card>
//                                     </Zoom>
//                                 </Grid>
//                             </Grid>

//                             {/* المخطط البياني لتوزيع الفئات - محسن */}
//                             {/* <Grow in={true} timeout={700}>
//                                 <Card
//                                     sx={{
//                                         borderRadius: 4,
//                                         mt: 5,
//                                         overflow: 'hidden',
//                                     }}
//                                 >
//                                     <CardContent>
//                                         <Typography
//                                             variant='h5'
//                                             gutterBottom
//                                             sx={{
//                                                 mb: 3,
//                                                 fontWeight: 700,
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: 1,
//                                             }}
//                                         >
//                                             <Category color='primary' />
//                                             توزيع المنتجات حسب الفئة
//                                         </Typography>
//                                         <Grid container spacing={3}>
//                                             <Grid size={{ xs: 12, md: 6 }}>
//                                                 <ResponsiveContainer
//                                                     width='100%'
//                                                     height={320}
//                                                 >
//                                                     <PieChart>
//                                                         <Pie
//                                                             data={statistics.productsByCategory.slice(
//                                                                 0,
//                                                                 5,
//                                                             )}
//                                                             cx='50%'
//                                                             cy='50%'
//                                                             labelLine={false}
//                                                             label={(
//                                                                 entry: any,
//                                                             ) =>
//                                                                 `${getCategoryName(entry.category)}`
//                                                             }
//                                                             outerRadius={100}
//                                                             innerRadius={60}
//                                                             fill='#8884d8'
//                                                             dataKey='count'
//                                                             paddingAngle={5}
//                                                         >
//                                                             {statistics.productsByCategory
//                                                                 .slice(0, 5)
//                                                                 .map(
//                                                                     (
//                                                                         _entry: CategoryStats,
//                                                                         index: number,
//                                                                     ) => (
//                                                                         <Cell
//                                                                             key={`cell-${index}`}
//                                                                             fill={
//                                                                                 COLORS[
//                                                                                     index %
//                                                                                         COLORS.length
//                                                                                 ]
//                                                                             }
//                                                                             stroke='none'
//                                                                         />
//                                                                     ),
//                                                                 )}
//                                                         </Pie>
//                                                         <RechartsTooltip
//                                                             formatter={(
//                                                                 value: any,
//                                                                 props: any,
//                                                             ) => [
//                                                                 `${value} منتج (${((props.payload.count / statistics.totalProducts) * 100).toFixed(1)}%)`,
//                                                                 getCategoryName(
//                                                                     props
//                                                                         .payload
//                                                                         .category,
//                                                                 ),
//                                                             ]}
//                                                         />
//                                                         <Legend
//                                                             formatter={(
//                                                                 value: any,
//                                                             ) =>
//                                                                 getCategoryName(
//                                                                     value,
//                                                                 )
//                                                             }
//                                                             verticalAlign='bottom'
//                                                             height={36}
//                                                         />
//                                                     </PieChart>
//                                                 </ResponsiveContainer>
//                                             </Grid>
//                                             <Grid size={{ xs: 12, md: 6 }}>
//                                                 <Box>
//                                                     <Typography
//                                                         variant='h6'
//                                                         gutterBottom
//                                                         fontWeight={600}
//                                                     >
//                                                         تفصيل الفئات
//                                                     </Typography>
//                                                     {statistics.productsByCategory
//                                                         .slice(0, 5)
//                                                         .map(
//                                                             (
//                                                                 category: CategoryStats,
//                                                                 index: number,
//                                                             ) => (
//                                                                 <Box
//                                                                     key={index}
//                                                                     mb={2.5}
//                                                                 >
//                                                                     <Box
//                                                                         display='flex'
//                                                                         justifyContent='space-between'
//                                                                         mb={0.5}
//                                                                     >
//                                                                         <Box
//                                                                             display='flex'
//                                                                             alignItems='center'
//                                                                         >
//                                                                             <Box
//                                                                                 sx={{
//                                                                                     width: 12,
//                                                                                     height: 12,
//                                                                                     bgcolor:
//                                                                                         COLORS[
//                                                                                             index %
//                                                                                                 COLORS.length
//                                                                                         ],
//                                                                                     borderRadius:
//                                                                                         '50%',
//                                                                                     mr: 1,
//                                                                                     boxShadow: `0 0 0 2px ${alpha(COLORS[index % COLORS.length], 0.2)}`,
//                                                                                 }}
//                                                                             />
//                                                                             <Typography
//                                                                                 variant='body2'
//                                                                                 fontWeight={
//                                                                                     600
//                                                                                 }
//                                                                             >
//                                                                                 {getCategoryName(
//                                                                                     category.category,
//                                                                                 )}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                         <Typography
//                                                                             variant='body2'
//                                                                             fontWeight={
//                                                                                 600
//                                                                             }
//                                                                             color='primary'
//                                                                         >
//                                                                             {
//                                                                                 category.count
//                                                                             }{' '}
//                                                                             منتج
//                                                                         </Typography>
//                                                                     </Box>
//                                                                     <LinearProgress
//                                                                         variant='determinate'
//                                                                         value={
//                                                                             category.percentage
//                                                                         }
//                                                                         sx={{
//                                                                             height: 8,
//                                                                             borderRadius: 4,
//                                                                             bgcolor:
//                                                                                 alpha(
//                                                                                     COLORS[
//                                                                                         index %
//                                                                                             COLORS.length
//                                                                                     ],
//                                                                                     0.1,
//                                                                                 ),
//                                                                             '& .MuiLinearProgress-bar':
//                                                                                 {
//                                                                                     bgcolor:
//                                                                                         COLORS[
//                                                                                             index %
//                                                                                                 COLORS.length
//                                                                                         ],
//                                                                                     borderRadius: 4,
//                                                                                 },
//                                                                         }}
//                                                                     />
//                                                                     <Box
//                                                                         display='flex'
//                                                                         justifyContent='space-between'
//                                                                         mt={0.5}
//                                                                     >
//                                                                         <Typography
//                                                                             variant='caption'
//                                                                             color='text.secondary'
//                                                                         >
//                                                                             {category.percentage.toFixed(
//                                                                                 1,
//                                                                             )}
//                                                                             % من
//                                                                             الإجمالي
//                                                                         </Typography>
//                                                                         <Typography
//                                                                             variant='caption'
//                                                                             fontWeight={
//                                                                                 600
//                                                                             }
//                                                                             color='success.main'
//                                                                         >
//                                                                             {formatPrice(
//                                                                                 category.totalValue,
//                                                                             )}
//                                                                         </Typography>
//                                                                     </Box>
//                                                                 </Box>
//                                                             ),
//                                                         )}
//                                                 </Box>
//                                             </Grid>
//                                         </Grid>
//                                     </CardContent>
//                                 </Card>
//                             </Grow> */}

//                             {statistics.productsByCategory &&
//                                 statistics.productsByCategory.length > 0 && (
//                                     <Grow in={true} timeout={700}>
//                                         <Card
//                                             sx={{
//                                                 borderRadius: 4,
//                                                 mt: 5,
//                                                 overflow: 'hidden',
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Typography
//                                                     variant='h5'
//                                                     gutterBottom
//                                                     sx={{
//                                                         mb: 3,
//                                                         fontWeight: 700,
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                         gap: 1,
//                                                     }}
//                                                 >
//                                                     <Category color='primary' />
//                                                     توزيع المنتجات حسب الفئة
//                                                 </Typography>
//                                                 <Grid container spacing={3}>
//                                                     <Grid
//                                                         size={{ xs: 12, md: 6 }}
//                                                     >
//                                                         <ResponsiveContainer
//                                                             width='100%'
//                                                             height={320}
//                                                         >
//                                                             <PieChart>
//                                                                 <Pie
//                                                                     data={statistics.productsByCategory.slice(
//                                                                         0,
//                                                                         5,
//                                                                     )}
//                                                                     cx='50%'
//                                                                     cy='50%'
//                                                                     labelLine={
//                                                                         false
//                                                                     }
//                                                                     label={(
//                                                                         entry: any,
//                                                                     ) =>
//                                                                         `${getCategoryName(entry.category)}`
//                                                                     }
//                                                                     outerRadius={
//                                                                         100
//                                                                     }
//                                                                     innerRadius={
//                                                                         60
//                                                                     }
//                                                                     fill='#8884d8'
//                                                                     dataKey='count'
//                                                                     paddingAngle={
//                                                                         5
//                                                                     }
//                                                                 >
//                                                                     {statistics.productsByCategory
//                                                                         .slice(
//                                                                             0,
//                                                                             5,
//                                                                         )
//                                                                         .map(
//                                                                             (
//                                                                                 _entry: CategoryStats,
//                                                                                 index: number,
//                                                                             ) => (
//                                                                                 <Cell
//                                                                                     key={`cell-${index}`}
//                                                                                     fill={
//                                                                                         COLORS[
//                                                                                             index %
//                                                                                                 COLORS.length
//                                                                                         ]
//                                                                                     }
//                                                                                     stroke='none'
//                                                                                 />
//                                                                             ),
//                                                                         )}
//                                                                 </Pie>
//                                                                 <RechartsTooltip
//                                                                     formatter={(
//                                                                         value: any,
//                                                                         props: any,
//                                                                     ) => [
//                                                                         `${value} منتج (${((props.payload.count / (statistics.totalProducts || 1)) * 100).toFixed(1)}%)`,
//                                                                         getCategoryName(
//                                                                             props
//                                                                                 .payload
//                                                                                 .category,
//                                                                         ),
//                                                                     ]}
//                                                                 />
//                                                                 <Legend
//                                                                     formatter={(
//                                                                         value: any,
//                                                                     ) =>
//                                                                         getCategoryName(
//                                                                             value,
//                                                                         )
//                                                                     }
//                                                                     verticalAlign='bottom'
//                                                                     height={36}
//                                                                 />
//                                                             </PieChart>
//                                                         </ResponsiveContainer>
//                                                     </Grid>
//                                                     <Grid
//                                                         size={{ xs: 12, md: 6 }}
//                                                     >
//                                                         <Box>
//                                                             <Typography
//                                                                 variant='h6'
//                                                                 gutterBottom
//                                                                 fontWeight={600}
//                                                             >
//                                                                 تفصيل الفئات
//                                                             </Typography>
//                                                             {statistics.productsByCategory
//                                                                 .slice(0, 5)
//                                                                 .map(
//                                                                     (
//                                                                         category: CategoryStats,
//                                                                         index: number,
//                                                                     ) => (
//                                                                         <Box
//                                                                             key={
//                                                                                 index
//                                                                             }
//                                                                             mb={
//                                                                                 2.5
//                                                                             }
//                                                                         >
//                                                                             <Box
//                                                                                 display='flex'
//                                                                                 justifyContent='space-between'
//                                                                                 mb={
//                                                                                     0.5
//                                                                                 }
//                                                                             >
//                                                                                 <Box
//                                                                                     display='flex'
//                                                                                     alignItems='center'
//                                                                                 >
//                                                                                     <Box
//                                                                                         sx={{
//                                                                                             width: 12,
//                                                                                             height: 12,
//                                                                                             bgcolor:
//                                                                                                 COLORS[
//                                                                                                     index %
//                                                                                                         COLORS.length
//                                                                                                 ],
//                                                                                             borderRadius:
//                                                                                                 '50%',
//                                                                                             mr: 1,
//                                                                                             boxShadow: `0 0 0 2px ${alpha(COLORS[index % COLORS.length], 0.2)}`,
//                                                                                         }}
//                                                                                     />
//                                                                                     <Typography
//                                                                                         variant='body2'
//                                                                                         fontWeight={
//                                                                                             600
//                                                                                         }
//                                                                                     >
//                                                                                         {getCategoryName(
//                                                                                             category.category,
//                                                                                         )}
//                                                                                     </Typography>
//                                                                                 </Box>
//                                                                                 <Typography
//                                                                                     variant='body2'
//                                                                                     fontWeight={
//                                                                                         600
//                                                                                     }
//                                                                                     color='primary'
//                                                                                 >
//                                                                                     {
//                                                                                         category.count
//                                                                                     }{' '}
//                                                                                     منتج
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                             <LinearProgress
//                                                                                 variant='determinate'
//                                                                                 value={
//                                                                                     category.percentage
//                                                                                 }
//                                                                                 sx={{
//                                                                                     height: 8,
//                                                                                     borderRadius: 4,
//                                                                                     bgcolor:
//                                                                                         alpha(
//                                                                                             COLORS[
//                                                                                                 index %
//                                                                                                     COLORS.length
//                                                                                             ],
//                                                                                             0.1,
//                                                                                         ),
//                                                                                     '& .MuiLinearProgress-bar':
//                                                                                         {
//                                                                                             bgcolor:
//                                                                                                 COLORS[
//                                                                                                     index %
//                                                                                                         COLORS.length
//                                                                                                 ],
//                                                                                             borderRadius: 4,
//                                                                                         },
//                                                                                 }}
//                                                                             />
//                                                                             <Box
//                                                                                 display='flex'
//                                                                                 justifyContent='space-between'
//                                                                                 mt={
//                                                                                     0.5
//                                                                                 }
//                                                                             >
//                                                                                 <Typography
//                                                                                     variant='caption'
//                                                                                     color='text.secondary'
//                                                                                 >
//                                                                                     {category.percentage.toFixed(
//                                                                                         1,
//                                                                                     )}

//                                                                                     %
//                                                                                     من
//                                                                                     الإجمالي
//                                                                                 </Typography>
//                                                                                 <Typography
//                                                                                     variant='caption'
//                                                                                     fontWeight={
//                                                                                         600
//                                                                                     }
//                                                                                     color='success.main'
//                                                                                 >
//                                                                                     {formatPrice(
//                                                                                         category.totalValue,
//                                                                                     )}
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     ),
//                                                                 )}
//                                                         </Box>
//                                                     </Grid>
//                                                 </Grid>
//                                             </CardContent>
//                                         </Card>
//                                     </Grow>
//                                 )}

//                             {/* أكثر المنتجات تفاعلاً - محسن */}
//                             <Grow in={true} timeout={800}>
//                                 <Card sx={{ borderRadius: 4, mt: 5 }}>
//                                     <CardContent>
//                                         <Typography
//                                             variant='h5'
//                                             gutterBottom
//                                             sx={{
//                                                 mb: 3,
//                                                 fontWeight: 700,
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: 1,
//                                             }}
//                                         >
//                                             <Star color='warning' />
//                                             أكثر المنتجات تفاعلاً
//                                         </Typography>
//                                         {statistics.mostPopularProducts.length >
//                                         0 ? (
//                                             <TableContainer
//                                                 component={Paper}
//                                                 elevation={0}
//                                                 sx={{ borderRadius: 3 }}
//                                             >
//                                                 <Table>
//                                                     <TableHead
//                                                         sx={{
//                                                             bgcolor: alpha(
//                                                                 theme.palette
//                                                                     .secondary
//                                                                     .main,
//                                                                 0.05,
//                                                             ),
//                                                         }}
//                                                     >
//                                                         <TableRow>
//                                                             <TableCell
//                                                                 width='5%'
//                                                                 align='center'
//                                                             >
//                                                                 #
//                                                             </TableCell>
//                                                             <TableCell width='30%'>
//                                                                 المنتج
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='15%'
//                                                             >
//                                                                 البائع
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='15%'
//                                                             >
//                                                                 الفئة
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='15%'
//                                                             >
//                                                                 التفاعل
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='10%'
//                                                             >
//                                                                 السعر
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='10%'
//                                                             >
//                                                                 الحالة
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {statistics.mostPopularProducts.map(
//                                                             (
//                                                                 product: MostPopularProduct,
//                                                                 index: number,
//                                                             ) => (
//                                                                 <TableRow
//                                                                     key={
//                                                                         product.id
//                                                                     }
//                                                                     sx={{
//                                                                         '&:hover':
//                                                                             {
//                                                                                 bgcolor:
//                                                                                     alpha(
//                                                                                         theme
//                                                                                             .palette
//                                                                                             .primary
//                                                                                             .main,
//                                                                                         0.02,
//                                                                                     ),
//                                                                                 transition:
//                                                                                     'background-color 0.2s',
//                                                                             },
//                                                                     }}
//                                                                 >
//                                                                     <TableCell align='center'>
//                                                                         <Avatar
//                                                                             sx={{
//                                                                                 width: 32,
//                                                                                 height: 32,
//                                                                                 bgcolor:
//                                                                                     index ===
//                                                                                     0
//                                                                                         ? '#FFD700'
//                                                                                         : index ===
//                                                                                             1
//                                                                                           ? '#C0C0C0'
//                                                                                           : index ===
//                                                                                               2
//                                                                                             ? '#CD7F32'
//                                                                                             : theme
//                                                                                                   .palette
//                                                                                                   .grey[400],
//                                                                                 color:
//                                                                                     index <
//                                                                                     3
//                                                                                         ? '#000'
//                                                                                         : '#fff',
//                                                                                 fontWeight:
//                                                                                     'bold',
//                                                                             }}
//                                                                         >
//                                                                             {index +
//                                                                                 1}
//                                                                         </Avatar>
//                                                                     </TableCell>
//                                                                     <TableCell>
//                                                                         <Box
//                                                                             display='flex'
//                                                                             alignItems='center'
//                                                                         >
//                                                                             <Link
//                                                                                 to={`${productsPathes.postsDetails}/${product.category}/${product.name}/${product.id}`}
//                                                                             >
//                                                                                 {product.image && (
//                                                                                     <Avatar
//                                                                                         src={
//                                                                                             product.image
//                                                                                         }
//                                                                                         alt={
//                                                                                             product.name
//                                                                                         }
//                                                                                         sx={{
//                                                                                             width: 50,
//                                                                                             height: 50,
//                                                                                             mr: 2,
//                                                                                             borderRadius: 2,
//                                                                                         }}
//                                                                                     />
//                                                                                 )}
//                                                                             </Link>
//                                                                             <Box>
//                                                                                 <Typography
//                                                                                     variant='body2'
//                                                                                     fontWeight={
//                                                                                         600
//                                                                                     }
//                                                                                 >
//                                                                                     {
//                                                                                         product.name
//                                                                                     }
//                                                                                 </Typography>
//                                                                                 <Box
//                                                                                     display='flex'
//                                                                                     alignItems='center'
//                                                                                     mt={
//                                                                                         0.5
//                                                                                     }
//                                                                                     gap={
//                                                                                         1
//                                                                                     }
//                                                                                 >
//                                                                                     <Box
//                                                                                         display='flex'
//                                                                                         alignItems='center'
//                                                                                     >
//                                                                                         <ThumbUp
//                                                                                             sx={{
//                                                                                                 fontSize: 14,
//                                                                                                 color: 'text.secondary',
//                                                                                             }}
//                                                                                         />
//                                                                                         <Typography
//                                                                                             variant='caption'
//                                                                                             color='text.secondary'
//                                                                                             sx={{
//                                                                                                 mr: 1,
//                                                                                             }}
//                                                                                         >
//                                                                                             {
//                                                                                                 product.likes
//                                                                                             }
//                                                                                         </Typography>
//                                                                                     </Box>
//                                                                                     <Box
//                                                                                         display='flex'
//                                                                                         alignItems='center'
//                                                                                     >
//                                                                                         <Visibility
//                                                                                             sx={{
//                                                                                                 fontSize: 14,
//                                                                                                 color: 'text.secondary',
//                                                                                             }}
//                                                                                         />
//                                                                                         <Typography
//                                                                                             variant='caption'
//                                                                                             color='text.secondary'
//                                                                                         >
//                                                                                             {
//                                                                                                 product.views
//                                                                                             }
//                                                                                         </Typography>
//                                                                                     </Box>
//                                                                                 </Box>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Typography
//                                                                             variant='caption'
//                                                                             color='text.secondary'
//                                                                         >
//                                                                             @
//                                                                             {product
//                                                                                 .seller
//                                                                                 .slug ||
//                                                                                 'غير محدد'}
//                                                                         </Typography>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Chip
//                                                                             label={getCategoryName(
//                                                                                 product.category,
//                                                                             )}
//                                                                             size='small'
//                                                                             variant='outlined'
//                                                                             sx={{
//                                                                                 borderRadius: 2,
//                                                                             }}
//                                                                         />
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Box
//                                                                             display='flex'
//                                                                             flexDirection='column'
//                                                                             alignItems='center'
//                                                                         >
//                                                                             <Chip
//                                                                                 label={`${product.likes} إعجاب`}
//                                                                                 size='small'
//                                                                                 icon={
//                                                                                     <ThumbUp
//                                                                                         sx={{
//                                                                                             fontSize: 14,
//                                                                                         }}
//                                                                                     />
//                                                                                 }
//                                                                                 color='primary'
//                                                                                 variant='outlined'
//                                                                                 sx={{
//                                                                                     mb: 0.5,
//                                                                                 }}
//                                                                             />
//                                                                             <Chip
//                                                                                 label={`${product.views} مشاهدة`}
//                                                                                 size='small'
//                                                                                 icon={
//                                                                                     <Visibility
//                                                                                         sx={{
//                                                                                             fontSize: 14,
//                                                                                         }}
//                                                                                     />
//                                                                                 }
//                                                                                 variant='outlined'
//                                                                             />
//                                                                         </Box>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Typography
//                                                                             variant='body2'
//                                                                             fontWeight={
//                                                                                 700
//                                                                             }
//                                                                             color='primary'
//                                                                         >
//                                                                             {formatPrice(
//                                                                                 product.price,
//                                                                             )}
//                                                                         </Typography>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Chip
//                                                                             label={getStatusLabel(
//                                                                                 product.status,
//                                                                             )}
//                                                                             color={getStatusColor(
//                                                                                 product.status,
//                                                                             )}
//                                                                             size='small'
//                                                                             sx={{
//                                                                                 fontWeight: 600,
//                                                                             }}
//                                                                         />
//                                                                     </TableCell>
//                                                                 </TableRow>
//                                                             ),
//                                                         )}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         ) : (
//                                             <Box py={6} textAlign='center'>
//                                                 <Typography color='text.secondary'>
//                                                     لا توجد منتجات حتى الآن
//                                                 </Typography>
//                                             </Box>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </Grow>

//                             {/* أكثر البائعين نشاطاً - محسن */}
//                             <Grow in={true} timeout={900}>
//                                 <Card sx={{ borderRadius: 4, mt: 5 }}>
//                                     <CardContent>
//                                         <Typography
//                                             variant='h5'
//                                             gutterBottom
//                                             sx={{
//                                                 mb: 3,
//                                                 fontWeight: 700,
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: 1,
//                                             }}
//                                         >
//                                             <Verified color='success' />
//                                             أكثر البائعين نشاطاً
//                                         </Typography>
//                                         {statistics.topSellers.length > 0 ? (
//                                             <TableContainer
//                                                 component={Paper}
//                                                 elevation={0}
//                                                 sx={{ borderRadius: 3 }}
//                                             >
//                                                 <Table>
//                                                     <TableHead
//                                                         sx={{
//                                                             bgcolor: alpha(
//                                                                 theme.palette
//                                                                     .primary
//                                                                     .main,
//                                                                 0.05,
//                                                             ),
//                                                         }}
//                                                     >
//                                                         <TableRow>
//                                                             <TableCell
//                                                                 width='5%'
//                                                                 align='center'
//                                                             >
//                                                                 #
//                                                             </TableCell>
//                                                             <TableCell width='30%'>
//                                                                 البائع
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='15%'
//                                                             >
//                                                                 المنتجات
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='25%'
//                                                             >
//                                                                 التفاعل
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='15%'
//                                                             >
//                                                                 القيمة الإجمالية
//                                                             </TableCell>
//                                                             <TableCell
//                                                                 align='center'
//                                                                 width='10%'
//                                                             >
//                                                                 الدور
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     </TableHead>
//                                                     <TableBody>
//                                                         {statistics.topSellers.map(
//                                                             (
//                                                                 seller: TopSeller,
//                                                                 index: number,
//                                                             ) => (
//                                                                 <TableRow
//                                                                     key={
//                                                                         seller._id
//                                                                     }
//                                                                     sx={{
//                                                                         '&:hover':
//                                                                             {
//                                                                                 bgcolor:
//                                                                                     alpha(
//                                                                                         theme
//                                                                                             .palette
//                                                                                             .primary
//                                                                                             .main,
//                                                                                         0.02,
//                                                                                     ),
//                                                                                 transition:
//                                                                                     'background-color 0.2s',
//                                                                             },
//                                                                     }}
//                                                                 >
//                                                                     <TableCell align='center'>
//                                                                         <Avatar
//                                                                             sx={{
//                                                                                 width: 32,
//                                                                                 height: 32,
//                                                                                 bgcolor:
//                                                                                     index ===
//                                                                                     0
//                                                                                         ? '#FFD700'
//                                                                                         : index ===
//                                                                                             1
//                                                                                           ? '#C0C0C0'
//                                                                                           : index ===
//                                                                                               2
//                                                                                             ? '#CD7F32'
//                                                                                             : theme
//                                                                                                   .palette
//                                                                                                   .grey[400],
//                                                                                 color:
//                                                                                     index <
//                                                                                     3
//                                                                                         ? '#000'
//                                                                                         : '#fff',
//                                                                                 fontWeight:
//                                                                                     'bold',
//                                                                             }}
//                                                                         >
//                                                                             {index +
//                                                                                 1}
//                                                                         </Avatar>
//                                                                     </TableCell>
//                                                                     <TableCell>
//                                                                         <Box
//                                                                             display='flex'
//                                                                             alignItems='center'
//                                                                         >
//                                                                             <Avatar
//                                                                                 src={
//                                                                                     seller.avatar
//                                                                                 }
//                                                                                 alt={
//                                                                                     seller.name
//                                                                                 }
//                                                                                 sx={{
//                                                                                     width: 45,
//                                                                                     height: 45,
//                                                                                     mr: 2,
//                                                                                 }}
//                                                                             >
//                                                                                 {seller.name.charAt(
//                                                                                     0,
//                                                                                 )}
//                                                                             </Avatar>
//                                                                             <Box>
//                                                                                 <Typography
//                                                                                     variant='body2'
//                                                                                     fontWeight={
//                                                                                         600
//                                                                                     }
//                                                                                 >
//                                                                                     {
//                                                                                         seller.name
//                                                                                     }
//                                                                                 </Typography>
//                                                                                 <Typography
//                                                                                     variant='caption'
//                                                                                     color='text.secondary'
//                                                                                 >
//                                                                                     {
//                                                                                         seller.productsCount
//                                                                                     }{' '}
//                                                                                     منتج
//                                                                                 </Typography>
//                                                                             </Box>
//                                                                         </Box>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Chip
//                                                                             label={
//                                                                                 seller.productsCount
//                                                                             }
//                                                                             color='primary'
//                                                                             size='medium'
//                                                                             sx={{
//                                                                                 fontWeight: 700,
//                                                                                 minWidth: 50,
//                                                                             }}
//                                                                         />
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Box>
//                                                                             <Box
//                                                                                 display='flex'
//                                                                                 alignItems='center'
//                                                                                 justifyContent='center'
//                                                                                 gap={
//                                                                                     1
//                                                                                 }
//                                                                             >
//                                                                                 <Chip
//                                                                                     size='small'
//                                                                                     icon={
//                                                                                         <ThumbUp
//                                                                                             sx={{
//                                                                                                 fontSize: 14,
//                                                                                             }}
//                                                                                         />
//                                                                                     }
//                                                                                     label={
//                                                                                         seller.totalLikes
//                                                                                     }
//                                                                                     variant='outlined'
//                                                                                 />
//                                                                                 <Chip
//                                                                                     size='small'
//                                                                                     icon={
//                                                                                         <Visibility
//                                                                                             sx={{
//                                                                                                 fontSize: 14,
//                                                                                             }}
//                                                                                         />
//                                                                                     }
//                                                                                     label={seller.totalViews.toLocaleString()}
//                                                                                     variant='outlined'
//                                                                                 />
//                                                                             </Box>
//                                                                             <Typography
//                                                                                 variant='caption'
//                                                                                 color='text.secondary'
//                                                                             >
//                                                                                 متوسط:{' '}
//                                                                                 {Math.round(
//                                                                                     (seller.totalLikes +
//                                                                                         seller.totalViews) /
//                                                                                         seller.productsCount,
//                                                                                 )}
//                                                                             </Typography>
//                                                                         </Box>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Typography
//                                                                             variant='body2'
//                                                                             fontWeight={
//                                                                                 700
//                                                                             }
//                                                                             color='primary'
//                                                                         >
//                                                                             {formatPrice(
//                                                                                 seller.totalValue,
//                                                                             )}
//                                                                         </Typography>
//                                                                         <Typography
//                                                                             variant='caption'
//                                                                             color='text.secondary'
//                                                                         >
//                                                                             {formatPrice(
//                                                                                 Math.round(
//                                                                                     seller.totalValue /
//                                                                                         seller.productsCount,
//                                                                                 ),
//                                                                             )}{' '}
//                                                                             متوسط
//                                                                         </Typography>
//                                                                     </TableCell>
//                                                                     <TableCell align='center'>
//                                                                         <Chip
//                                                                             icon={getRoleIcon(
//                                                                                 seller.role,
//                                                                             )}
//                                                                             label={
//                                                                                 seller.role
//                                                                             }
//                                                                             color={getRoleColor(
//                                                                                 seller.role,
//                                                                             )}
//                                                                             size='small'
//                                                                             variant='filled'
//                                                                         />
//                                                                     </TableCell>
//                                                                 </TableRow>
//                                                             ),
//                                                         )}
//                                                     </TableBody>
//                                                 </Table>
//                                             </TableContainer>
//                                         ) : (
//                                             <Box py={6} textAlign='center'>
//                                                 <Typography color='text.secondary'>
//                                                     لا يوجد بائعين نشطين حتى
//                                                     الآن
//                                                 </Typography>
//                                             </Box>
//                                         )}
//                                     </CardContent>
//                                 </Card>
//                             </Grow>

//                             {/* ملخص إضافي محسن */}
//                             <Grid container spacing={3} sx={{ mt: 3 }}>
//                                 <Grid size={{ xs: 12, md: 4 }}>
//                                     <Fade in={true} timeout={1000}>
//                                         <Card
//                                             sx={{
//                                                 borderRadius: 4,

//                                                 color: 'primary',
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                     mb={2}
//                                                 >
//                                                     <Box
//                                                         display='flex'
//                                                         alignItems='center'
//                                                         gap={1}
//                                                     >
//                                                         <Percent
//                                                             sx={{
//                                                                 fontSize: 28,
//                                                             }}
//                                                         />
//                                                         <Typography
//                                                             variant='h6'
//                                                             fontWeight={600}
//                                                         >
//                                                             قيمة الخصومات
//                                                         </Typography>
//                                                     </Box>
//                                                     <MonetizationOn
//                                                         sx={{
//                                                             fontSize: 32,
//                                                             opacity: 0.8,
//                                                         }}
//                                                     />
//                                                 </Box>
//                                                 <Typography
//                                                     variant='h3'
//                                                     fontWeight='bold'
//                                                     gutterBottom
//                                                 >
//                                                     {formatPrice(
//                                                         statistics.totalDiscountValue,
//                                                     )}
//                                                 </Typography>
//                                                 <Typography
//                                                     variant='body2'
//                                                     sx={{ opacity: 0.9 }}
//                                                 >
//                                                     إجمالي قيمة التخفيضات
//                                                     المقدمة
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Fade>
//                                 </Grid>
//                                 <Grid size={{ xs: 12, md: 4 }}>
//                                     <Fade in={true} timeout={1100}>
//                                         <Card
//                                             sx={{
//                                                 borderRadius: 4,

//                                                 color: 'primary',
//                                             }}
//                                         >
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                     mb={2}
//                                                 >
//                                                     <Box
//                                                         display='flex'
//                                                         alignItems='center'
//                                                         gap={1}
//                                                     >
//                                                         <TrendingUp
//                                                             sx={{
//                                                                 fontSize: 28,
//                                                             }}
//                                                         />
//                                                         <Typography
//                                                             variant='h6'
//                                                             fontWeight={600}
//                                                         >
//                                                             متوسط التفاعل
//                                                         </Typography>
//                                                     </Box>
//                                                     <ThumbUp
//                                                         sx={{
//                                                             fontSize: 32,
//                                                             opacity: 0.8,
//                                                         }}
//                                                     />
//                                                 </Box>
//                                                 <Typography
//                                                     variant='h3'
//                                                     fontWeight='bold'
//                                                     gutterBottom
//                                                 >
//                                                     {statistics.averageLikesPerProduct.toFixed(
//                                                         1,
//                                                     )}
//                                                 </Typography>
//                                                 <Typography
//                                                     variant='body2'
//                                                     sx={{ opacity: 0.9 }}
//                                                 >
//                                                     متوسط الإعجابات لكل منتج
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Fade>
//                                 </Grid>
//                                 <Grid size={{ xs: 12, md: 4 }}>
//                                     <Fade in={true} timeout={1200}>
//                                         <Card sx={{ borderRadius: 2 }}>
//                                             <CardContent>
//                                                 <Box
//                                                     display='flex'
//                                                     alignItems='center'
//                                                     justifyContent='space-between'
//                                                     mb={2}
//                                                 >
//                                                     <Box
//                                                         display='flex'
//                                                         alignItems='center'
//                                                         gap={1}
//                                                     >
//                                                         <AccessTime
//                                                             sx={{
//                                                                 fontSize: 28,
//                                                             }}
//                                                         />
//                                                         <Typography
//                                                             variant='h6'
//                                                             fontWeight={600}
//                                                         >
//                                                             نشاط اليوم
//                                                         </Typography>
//                                                     </Box>
//                                                     <ShoppingCart
//                                                         sx={{
//                                                             fontSize: 32,
//                                                             opacity: 0.8,
//                                                         }}
//                                                     />
//                                                 </Box>
//                                                 <Typography
//                                                     variant='h3'
//                                                     fontWeight='bold'
//                                                     gutterBottom
//                                                 >
//                                                     {statistics.newProductsToday +
//                                                         statistics.newUsersToday}
//                                                 </Typography>
//                                                 <Typography
//                                                     variant='body2'
//                                                     sx={{ opacity: 0.9 }}
//                                                 >
//                                                     {
//                                                         statistics.newProductsToday
//                                                     }{' '}
//                                                     منتج +{' '}
//                                                     {statistics.newUsersToday}{' '}
//                                                     مستخدم
//                                                 </Typography>
//                                             </CardContent>
//                                         </Card>
//                                     </Fade>
//                                 </Grid>
//                             </Grid>
//                         </>
//                     )}
//                 </Container>
//             </main>
//         </>
//     );
// };

// export default StatisticsPanel;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { Download } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend,
} from 'recharts';

import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    alpha,
    useTheme,
    Avatar,
    LinearProgress,
    Tooltip,
    IconButton,
    Fade,
    Grow,
    Zoom,
    Button,
    Container,
} from '@mui/material';
import {
    TrendingUp,
    People,
    ShoppingCart,
    MonetizationOn,
    Visibility,
    ThumbUp,
    AccessTime,
    AttachMoney,
    Refresh,
    Category,
    Star,
    Verified,
    Percent,
    AdminPanelSettings,
    SupervisorAccount,
    Person,
} from '@mui/icons-material';
import { Posts } from '../../interfaces/Posts';
import { getAllUsers } from '../../services/usersServices';
import { getAllPosts } from '../../services/postsServices';
import { User } from '../../interfaces/chat/usersMessages';
import { useUser } from '../../context/useUSer';
import { formatPrice } from '../../helpers/dateAndPriceFormat';
import RoleType from '../../interfaces/UserType';
import { Link } from 'react-router-dom';
import { productsPathes } from '../../routes/routes';

// Helper function to safely get number from views
const getViewsAsNumber = (views: any): number => {
    if (typeof views === 'number') return views;
    if (typeof views === 'string') return parseInt(views, 10) || 0;
    return 0;
};

// Helper function to safely get createdAt as string
const getCreatedAtAsString = (createdAt: any): string => {
    if (typeof createdAt === 'string') return createdAt;
    if (createdAt instanceof Date) return createdAt.toISOString();
    return new Date().toISOString();
};

// Extended interface for Post with user data
interface PostWithUser extends Posts {
    userData?: User;
}

// Interface for most popular products
interface MostPopularProduct {
    id: string;
    name: string;
    image?: string;
    likes: number;
    views: number;
    price: number;
    status: string;
    seller: {
        name: string;
        slug: string;
        user: string;
        link: string;
    };
    category: string;
    createdAt: string;
}

// Interface for category statistics
interface CategoryStats {
    category: string;
    count: number;
    percentage: number;
    totalValue: number;
}

// Interface for top category
interface TopCategory {
    category: string;
    count: number;
    likes: number;
}

// Interface for top seller
interface TopSeller {
    _id: string;
    name: string;
    avatar?: string;
    productsCount: number;
    totalLikes: number;
    totalViews: number;
    totalValue: number;
    role: string;
}

// Interface for product by date
interface ProductByDate {
    date: string;
    count: number;
}

// Main statistics interface
interface Statistics {
    totalProducts: number;
    activeProducts: number;
    soldPosts: number;
    newProductsToday: number;
    newProductsMonth: number;
    onlineUsers: number;
    totalUsers: number;
    newUsersToday: number;
    newUsersMonth: number;
    activeSellers: number;
    totalAdmins: number;
    totalModerators: number;
    totalClients: number;
    totalLikes: number;
    totalViews: number;
    averageLikesPerProduct: number;
    averageViewsPerProduct: number;
    totalProductValue: number;
    averageProductPrice: number;
    highestPricedProduct: number;
    lowestPricedProduct: number;
    totalDiscountValue: number;
    productsByCategory: CategoryStats[];
    topCategories: TopCategory[];
    mostPopularProducts: MostPopularProduct[];
    topSellers: TopSeller[];
    productsByDate: ProductByDate[];
}

// Interface for seller data map
interface SellerData {
    productsCount: number;
    totalLikes: number;
    totalViews: number;
    totalValue: number;
    user: User;
}

// Interface for category data map
interface CategoryData {
    count: number;
    likes: number;
    totalValue: number;
}

// Enhanced Colors for PieChart and gradients
const COLORS: string[] = [
    '#6366F1', // Indigo
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

// Interface for auth values
interface AuthValues {
    role: string;
    name?: {
        first: string;
        last: string;
    };
    status?: boolean;
    createdAt?: string;
    _id?: string;
    image?: {
        url?: string;
    };
}

const StatBadge = ({
    icon,
    label,
    value,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
}) => (
    <Card
        sx={{
            // bgcolor: color ? alpha(theme.palette[color].main, 0.1) : 'background.paper',
            borderRadius: 2,
            minWidth: 150,
        }}
    >
        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
            <Box display='flex' alignItems='center' gap={1}>
                <Box sx={{ color: color ? `${color}.main` : 'text.secondary' }}>
                    {icon}
                </Box>
                <Box>
                    <Typography variant='caption' color='text.secondary'>
                        {label}
                    </Typography>
                    <Typography variant='subtitle1' fontWeight='bold'>
                        {value}
                    </Typography>
                </Box>
            </Box>
        </CardContent>
    </Card>
);

const StatisticsPanel: FunctionComponent = () => {
    const { auth } = useUser();
    const theme = useTheme();

    const [timeFrame, setTimeFrame] = useState<string>('today');
    const [statistics, setStatistics] = useState<Statistics>({
        totalProducts: 0,
        activeProducts: 0,
        soldPosts: 0,
        newProductsToday: 0,
        newProductsMonth: 0,
        onlineUsers: 0,
        totalUsers: 0,
        newUsersToday: 0,
        newUsersMonth: 0,
        activeSellers: 0,
        totalAdmins: 0,
        totalModerators: 0,
        totalClients: 0,
        totalLikes: 0,
        totalViews: 0,
        averageLikesPerProduct: 0,
        averageViewsPerProduct: 0,
        totalProductValue: 0,
        averageProductPrice: 0,
        highestPricedProduct: 0,
        lowestPricedProduct: 0,
        totalDiscountValue: 0,
        productsByCategory: [],
        topCategories: [],
        mostPopularProducts: [],
        topSellers: [],
        productsByDate: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const [usersRes, productsRes] = await Promise.all([
                getAllUsers(),
                getAllPosts(),
            ]);

            const usersData: AuthValues[] = (usersRes as AuthValues[]) || [];
            const postsData: Posts[] = (productsRes as Posts[]) || [];

            const postsWithUserData: PostWithUser[] = postsData
                .filter((post) => post && post.seller)
                .map((post: Posts) => ({
                    ...post,
                    userData: usersData.find(
                        (user: AuthValues) =>
                            user._id === post.seller?.user?._id,
                    ) as User,
                }));

            calculateStatistics(usersData, postsWithUserData);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('فشل تحميل البيانات. يرجى المحاولة مرة أخرى');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        if (auth.role !== RoleType.Admin && auth.role !== RoleType.Moderator)
            return;
        fetchData();
    }, [auth.role, fetchData]);

    const handleRefresh = (): void => {
        setRefreshing(true);
        fetchData();
    };

    // حساب جميع الإحصائيات لموقع C2C
    const calculateStatistics = (
        users: AuthValues[],
        posts: PostWithUser[],
    ): void => {
        const now: Date = new Date();
        const todayStart: Date = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );
        const monthStart: Date = new Date(now.getFullYear(), now.getMonth(), 1);

        // إحصائيات المستخدمين
        const newUsersToday: number = users.filter((user: AuthValues) => {
            const createdAt = user.createdAt ? new Date(user.createdAt) : now;
            return createdAt >= todayStart;
        }).length;

        const newUsersMonth: number = users.filter((user: AuthValues) => {
            const createdAt = user.createdAt ? new Date(user.createdAt) : now;
            return createdAt >= monthStart;
        }).length;

        // إحصائيات المستخدمين حسب الدور
        const totalAdmins: number = users.filter(
            (u: AuthValues) => u.role === 'Admin',
        ).length;
        const totalModerators: number = users.filter(
            (u: AuthValues) => u.role === 'Moderator',
        ).length;
        const totalClients: number = users.filter(
            (u: AuthValues) => u.role === 'Client',
        ).length;

        // إحصائيات المنشورات حسب الوقت
        const newPostsToday: number = posts.filter((post: PostWithUser) => {
            const createdAt = post.createdAt
                ? new Date(getCreatedAtAsString(post.createdAt))
                : now;
            return createdAt >= todayStart;
        }).length;

        const newPostsMonth: number = posts.filter((post: PostWithUser) => {
            const createdAt = post.createdAt
                ? new Date(getCreatedAtAsString(post.createdAt))
                : now;
            return createdAt >= monthStart;
        }).length;

        // إحصائيات حالة المنشورات
        const activePosts: number = posts.filter(
            (p: PostWithUser) => p.in_stock === true,
        ).length;

        // حساب البائعين النشطين
        const sellersMap = new Map<string, SellerData>();

        posts.forEach((post: PostWithUser) => {
            const sellerId = post.seller?.user?._id;

            if (sellerId && post.userData) {
                const existing = sellersMap.get(sellerId);

                const seller: SellerData = existing || {
                    productsCount: 0,
                    totalLikes: 0,
                    totalViews: 0,
                    totalValue: 0,
                    user: post.userData,
                };

                sellersMap.set(sellerId, {
                    ...seller,
                    productsCount: seller.productsCount + 1,
                    totalLikes: seller.totalLikes + (post.likes?.length || 0),
                    totalViews: seller.totalViews + (post.reviews?.length || 0),
                    totalValue: seller.totalValue + (post.price || 0),
                });
            }
        });

        const activeSellers: number = sellersMap.size;

        // إحصائيات التفاعل
        const totalLikes: number = posts.reduce(
            (sum: number, post: PostWithUser) =>
                sum + (post.likes?.length || 0),
            0,
        );
        const totalViews: number = posts.reduce(
            (sum: number, post: PostWithUser) =>
                sum + getViewsAsNumber(post.reviews),
            0,
        );

        const averageLikesPerProduct: number =
            posts.length > 0
                ? Math.round((totalLikes / posts.length) * 10) / 10
                : 0;
        const averageViewsPerProduct: number =
            posts.length > 0
                ? Math.round((totalViews / posts.length) * 10) / 10
                : 0;

        // إحصائيات القيمة
        const postPrices: number[] = posts.map(
            (p: PostWithUser) => p.price || 0,
        );
        const totalProductValue: number = postPrices.reduce(
            (sum: number, price: number) => sum + price,
            0,
        );
        const averageProductPrice: number =
            posts.length > 0 ? Math.round(totalProductValue / posts.length) : 0;
        const highestPricedProduct: number =
            postPrices.length > 0 ? Math.max(...postPrices) : 0;
        const lowestPricedProduct: number =
            postPrices.length > 0
                ? Math.min(...postPrices.filter((p: number) => p > 0))
                : 0;

        // حساب قيمة الخصومات
        const totalDiscountValue: number = posts.reduce(
            (sum: number, post: PostWithUser) => {
                if (post.sale && post.discount && post.price) {
                    return sum + (post.price * post.discount) / 100;
                }
                return sum;
            },
            0,
        );

        // إحصائيات الفئات
        const categoryMap = new Map<string, CategoryData>();
        posts.forEach((post: PostWithUser) => {
            if (post.category) {
                const existing = categoryMap.get(post.category);
                const data: CategoryData = existing || {
                    count: 0,
                    likes: 0,
                    totalValue: 0,
                };
                categoryMap.set(post.category, {
                    count: data.count + 1,
                    likes: data.likes + (post.likes?.length || 0),
                    totalValue: data.totalValue + (post.price || 0),
                });
            }
        });

        const totalPostsCount: number = posts.length;
        const productsByCategory: CategoryStats[] = Array.from(
            categoryMap.entries(),
        )
            .map(([category, data]: [string, CategoryData]) => ({
                category,
                count: data.count,
                percentage:
                    totalPostsCount > 0
                        ? (data.count / totalPostsCount) * 100
                        : 0,
                totalValue: data.totalValue,
            }))
            .sort((a: CategoryStats, b: CategoryStats) => b.count - a.count);

        // أكثر الفئات شعبية
        const topCategories: TopCategory[] = Array.from(categoryMap.entries())
            .map(([category, data]: [string, CategoryData]) => ({
                category,
                count: data.count,
                likes: data.likes,
            }))
            .sort((a: TopCategory, b: TopCategory) => b.likes - a.likes)
            .slice(0, 5);

        // أكثر المنشورات تفاعلاً
        const mostPopularProducts: MostPopularProduct[] = [...posts]
            .map((post: PostWithUser) => ({
                id: post._id || '',
                name: post.product_name || 'منتج بدون اسم',
                image: post.image?.url,
                likes: post.likes?.length || 0,
                views: post.reviews?.length || 0,
                price: post.price || 0,
                status: post.in_stock ? 'active' : 'sold',
                seller: {
                    name:
                        post.seller?.user?.name ||
                        `${post.userData?.name?.first || ''} ${post.userData?.name?.last || ''}`.trim() ||
                        'بائع غير معروف',
                    link: `/customer-profile/${post.seller?.user?.slug || ''}`,
                    slug: post.seller?.user?.slug || '',
                    user: post.seller?.user?.user || '',
                },
                category: post.category || 'غير مصنف',
                createdAt: getCreatedAtAsString(post.createdAt),
            }))
            .sort((a: MostPopularProduct, b: MostPopularProduct) => {
                const aScore = a.likes * 2 + a.views;
                const bScore = b.likes * 2 + b.views;
                return bScore - aScore;
            })
            .slice(0, 5);

        // أكثر البائعين نشاطاً
        const topSellers: TopSeller[] = Array.from(sellersMap.entries())
            .map(([userId, data]: [string, SellerData]) => ({
                _id: userId,
                name: `${data.user.name?.first || 'مستخدم'} ${data.user.name?.last || ''}`.trim(),
                avatar: data.user.image?.url,
                productsCount: data.productsCount,
                totalLikes: data.totalLikes,
                totalViews: data.totalViews,
                totalValue: data.totalValue,
                role: data.user.role || 'Client',
            }))
            .sort((a: TopSeller, b: TopSeller) => {
                if (b.productsCount !== a.productsCount) {
                    return b.productsCount - a.productsCount;
                }
                return (
                    b.totalLikes + b.totalViews - (a.totalLikes + a.totalViews)
                );
            })
            .slice(0, 5);

        // توزيع المنتجات حسب التاريخ (آخر 7 أيام)
        const last7Days: string[] = Array.from(
            { length: 7 },
            (_, i: number) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            },
        ).reverse();

        const productsByDate: ProductByDate[] = last7Days.map(
            (date: string) => {
                const count: number = posts.filter((post: PostWithUser) => {
                    if (!post.createdAt) return false;
                    const postDate: string = new Date(
                        getCreatedAtAsString(post.createdAt),
                    )
                        .toISOString()
                        .split('T')[0];
                    return postDate === date;
                }).length;
                return { date, count };
            },
        );

        const soldPosts: number = posts.filter(
            (p: PostWithUser) => p.in_stock === false,
        ).length;

        const onlineUsers = users.filter((user) => user.status === true).length;

        setStatistics({
            totalProducts: posts.length,
            activeProducts: activePosts,
            soldPosts: soldPosts,
            newProductsToday: newPostsToday,
            newProductsMonth: newPostsMonth,
            onlineUsers: onlineUsers,
            totalUsers: users.length,
            newUsersToday,
            newUsersMonth,
            activeSellers,
            totalAdmins,
            totalModerators,
            totalClients,
            totalLikes,
            totalViews,
            averageLikesPerProduct,
            averageViewsPerProduct,
            totalProductValue,
            averageProductPrice,
            highestPricedProduct,
            lowestPricedProduct,
            totalDiscountValue,
            productsByCategory,
            topCategories,
            mostPopularProducts,
            topSellers,
            productsByDate,
        });
    };

    const getStatusColor = (
        status: string,
    ): 'success' | 'warning' | 'error' | 'default' => {
        switch (status) {
            case 'active':
                return 'success';
            case 'pending':
                return 'warning';
            case 'sold':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case 'active':
                return 'متاح';
            case 'pending':
                return 'قيد المراجعة';
            case 'sold':
                return 'تم البيع';
            default:
                return status;
        }
    };

    const getRoleColor = (
        role: string,
    ): 'error' | 'warning' | 'success' | 'info' | 'default' => {
        switch (role) {
            case 'Admin':
                return 'error';
            case 'Moderator':
                return 'warning';
            case 'Client':
                return 'success';
            case 'delivery':
                return 'info';
            default:
                return 'default';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Admin':
                return <AdminPanelSettings fontSize='small' />;
            case 'Moderator':
                return <SupervisorAccount fontSize='small' />;
            case 'Client':
                return <Person fontSize='small' />;
            default:
                return <Person fontSize='small' />;
        }
    };

    const getCategoryName = (category: string): string => {
        const categories: Record<string, string> = {
            House: 'بيت',
            Garden: 'حديقة',
            Cars: 'سيارات',
            Bikes: 'دراجات',
            Trucks: 'شاحنات',
            ElectricVehicles: 'مركبات كهربائية',
            MenClothes: 'ملابس رجالية',
            WomenClothes: 'ملابس نسائية',
            Baby: 'أطفال',
            Kids: 'ألعاب',
            Health: 'صحة',
            Beauty: 'جمال',
            Watches: 'ساعات',
            Cleaning: 'تنظيف',
        };
        return categories[category] || category;
    };

    // Check if user has access
    if (auth.role !== 'Admin' && auth.role !== 'Moderator') {
        return (
            <Box component='main' className='container mt-5 text-center'>
                <Typography variant='h4' color='error'>
                    غير مصرح لك بالوصول إلى هذه الصفحة
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign='center' py={8}>
                <Typography color='error' variant='h5' gutterBottom>
                    {error}
                </Typography>
                <Button
                    variant='contained'
                    onClick={handleRefresh}
                    startIcon={<Refresh />}
                    sx={{ mt: 2 }}
                >
                    إعادة المحاولة
                </Button>
            </Box>
        );
    }

    const exportToExcel = (data: Statistics) => {
        const exportData = {
            'إجمالي المنتجات': data.totalProducts,
            'المنتجات النشطة': data.activeProducts,
            'المنتجات المباعة': data.soldPosts,
            'إجمالي المستخدمين': data.totalUsers,
            'المستخدمين النشطين': data.onlineUsers,
            'إجمالي الإعجابات': data.totalLikes,
            'القيمة الإجمالية': data.totalProductValue,
        };

        const ws = XLSX.utils.json_to_sheet([exportData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'إحصائيات المنصة');
        XLSX.writeFile(
            wb,
            `تقرير_صفقة_${new Date().toLocaleDateString()}.xlsx`,
        );
    };

    return (
        <>
            <title>لوحة تحكم الإدارة | صفقة - منصة C2C</title>
            <meta
                name='description'
                content='لوحة تحكم إدارة منصة بيع وشراء C2C | صفقة'
            />
            <main>
                <Container>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            mb: 3,
                            flexWrap: 'wrap',
                        }}
                    >
                        <StatBadge
                            icon={<People />}
                            label='إجمالي المستخدمين'
                            value={statistics.totalUsers}
                            color='primary'
                        />
                        <StatBadge
                            icon={<ShoppingCart />}
                            label='المنتجات'
                            value={statistics.totalProducts}
                            color='success'
                        />
                        <StatBadge
                            icon={<AttachMoney />}
                            label='القيمة'
                            value={formatPrice(statistics.totalProductValue)}
                            color='warning'
                        />
                    </Box>
                    <Button
                        startIcon={<Download />}
                        onClick={() => exportToExcel(statistics)}
                        variant='outlined'
                        size='small'
                    >
                        تصدير تقرير
                    </Button>
                    {/* العنوان الرئيسي مع تأثير متحرك */}
                    <Grow in={true} timeout={500}>
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={4}
                            flexWrap='wrap'
                            gap={2}
                        >
                            <Box>
                                <Typography
                                    variant='h3'
                                    component='h1'
                                    sx={{
                                        backgroundClip: 'text',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        fontWeight: 800,
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    لوحة تحكم إدارة منصة صفقه
                                </Typography>
                                <Typography
                                    variant='subtitle1'
                                    color='text.secondary'
                                    sx={{ mt: 1 }}
                                >
                                    إحصائيات وتحليلات المنصة في الوقت الفعلي
                                </Typography>
                            </Box>
                            <Tooltip title='تحديث البيانات'>
                                <IconButton
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    sx={{
                                        bgcolor: alpha(
                                            theme.palette.primary.main,
                                            0.1,
                                        ),
                                        '&:hover': {
                                            bgcolor: alpha(
                                                theme.palette.primary.main,
                                                0.2,
                                            ),
                                            transform: 'rotate(180deg)',
                                            transition: 'transform 0.5s',
                                        },
                                    }}
                                >
                                    <Refresh
                                        className={refreshing ? 'spin' : ''}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grow>

                    {/* فلترة الوقت ومعلومات المسؤول */}
                    <Fade in={true} timeout={800}>
                        <Box
                            display='flex'
                            justifyContent='space-between'
                            alignItems='center'
                            mb={4}
                            flexWrap='wrap'
                            gap={2}
                            sx={{
                                p: 2,
                                bgcolor: alpha(
                                    theme.palette.background.paper,
                                    0.6,
                                ),
                                borderRadius: 3,
                                backdropFilter: 'blur(10px)',
                            }}
                        >
                            <Box>
                                <Typography
                                    variant='body1'
                                    color='text.secondary'
                                >
                                    مرحباً، {auth.name?.first} {auth.name?.last}
                                </Typography>
                                <Chip
                                    icon={getRoleIcon(auth.role)}
                                    label={
                                        auth.role === 'Admin'
                                            ? 'مدير النظام'
                                            : 'مشرف'
                                    }
                                    size='small'
                                    color={
                                        auth.role === 'Admin'
                                            ? 'error'
                                            : 'warning'
                                    }
                                    variant='filled'
                                    sx={{ mt: 0.5, fontWeight: 600 }}
                                />
                            </Box>
                            <FormControl sx={{ minWidth: 150 }}>
                                <InputLabel>الفترة الزمنية</InputLabel>
                                <Select
                                    value={timeFrame}
                                    label='الفترة الزمنية'
                                    onChange={(e) =>
                                        setTimeFrame(e.target.value)
                                    }
                                    sx={{ borderRadius: 3 }}
                                >
                                    <MenuItem value='today'>اليوم</MenuItem>
                                    <MenuItem value='month'>هذا الشهر</MenuItem>
                                    <MenuItem value='all'>الكل</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Fade>

                    {loading ? (
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            height='50vh'
                        >
                            <CircularProgress size={60} thickness={4} />
                        </Box>
                    ) : (
                        <>
                            {/* إحصائيات سريعة */}
                            <Typography
                                variant='h5'
                                gutterBottom
                                sx={{
                                    mt: 4,
                                    mb: 3,
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <TrendingUp
                                    sx={{ color: theme.palette.primary.main }}
                                />
                                نظرة عامة على المنصة
                            </Typography>

                            <Grid container spacing={3}>
                                {/* بطاقة المستخدمون */}
                                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                    <Zoom in={true} timeout={300}>
                                        <Card
                                            sx={{
                                                color: 'primary',
                                                borderRadius: 4,
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px)',
                                                    boxShadow:
                                                        '0 20px 40px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                >
                                                    <Box>
                                                        <People
                                                            sx={{
                                                                fontSize: 48,
                                                                opacity: 0.9,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box textAlign='right'>
                                                        <Typography
                                                            variant='h3'
                                                            fontWeight='bold'
                                                        >
                                                            {
                                                                statistics.totalUsers
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            sx={{
                                                                opacity: 0.9,
                                                            }}
                                                        >
                                                            إجمالي المستخدمين
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box mt={2}>
                                                    <Typography
                                                        variant='caption'
                                                        sx={{ opacity: 0.8 }}
                                                    >
                                                        +
                                                        {
                                                            statistics.newUsersToday
                                                        }{' '}
                                                        اليوم
                                                    </Typography>
                                                    <LinearProgress
                                                        variant='determinate'
                                                        value={
                                                            (statistics.onlineUsers /
                                                                statistics.totalUsers) *
                                                            100
                                                        }
                                                        sx={{
                                                            mt: 1,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: alpha(
                                                                '#fff',
                                                                0.2,
                                                            ),
                                                            '& .MuiLinearProgress-bar':
                                                                {
                                                                    bgcolor:
                                                                        '#fff',
                                                                },
                                                        }}
                                                    />
                                                    <Typography
                                                        variant='caption'
                                                        sx={{ opacity: 0.8 }}
                                                    >
                                                        {statistics.onlineUsers}{' '}
                                                        متصل الآن
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                {/* بطاقة المنتجات */}
                                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                    <Zoom in={true} timeout={400}>
                                        <Card
                                            sx={{
                                                color: 'primary',
                                                borderRadius: 4,
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px)',
                                                    boxShadow:
                                                        '0 20px 40px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                >
                                                    <Box>
                                                        <ShoppingCart
                                                            sx={{
                                                                fontSize: 48,
                                                                opacity: 0.9,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box textAlign='right'>
                                                        <Typography
                                                            variant='h3'
                                                            fontWeight='bold'
                                                        >
                                                            {
                                                                statistics.totalProducts
                                                            }
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            sx={{
                                                                opacity: 0.9,
                                                            }}
                                                        >
                                                            إجمالي المنتجات
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box mt={2}>
                                                    <Box
                                                        display='flex'
                                                        gap={1}
                                                        justifyContent='space-between'
                                                    >
                                                        <Chip
                                                            size='small'
                                                            label={`${statistics.activeProducts} نشط`}
                                                            sx={{
                                                                bgcolor: alpha(
                                                                    '#fff',
                                                                    0.2,
                                                                ),
                                                                color: 'primary',
                                                            }}
                                                        />
                                                        <Chip
                                                            size='small'
                                                            label={`${statistics.soldPosts} مباع`}
                                                            sx={{
                                                                bgcolor: alpha(
                                                                    '#fff',
                                                                    0.2,
                                                                ),
                                                                color: 'primary',
                                                            }}
                                                        />
                                                    </Box>
                                                    <Typography
                                                        variant='caption'
                                                        sx={{
                                                            opacity: 0.8,
                                                            display: 'block',
                                                            mt: 1,
                                                        }}
                                                    >
                                                        +
                                                        {
                                                            statistics.newProductsToday
                                                        }{' '}
                                                        اليوم
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                {/* بطاقة القيمة الإجمالية */}
                                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                    <Zoom in={true} timeout={500}>
                                        <Card
                                            sx={{
                                                color: 'primary',
                                                borderRadius: 4,
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px)',
                                                    boxShadow:
                                                        '0 20px 40px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                >
                                                    <Box>
                                                        <AttachMoney
                                                            sx={{
                                                                fontSize: 48,
                                                                opacity: 0.9,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box textAlign='right'>
                                                        <Typography
                                                            variant='h4'
                                                            fontWeight='bold'
                                                        >
                                                            {formatPrice(
                                                                statistics.totalProductValue,
                                                            )}
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            sx={{
                                                                opacity: 0.9,
                                                            }}
                                                        >
                                                            القيمة الإجمالية
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box mt={2}>
                                                    <Typography
                                                        variant='caption'
                                                        sx={{ opacity: 0.8 }}
                                                    >
                                                        متوسط:{' '}
                                                        {formatPrice(
                                                            statistics.averageProductPrice,
                                                        )}
                                                    </Typography>
                                                    <Box
                                                        display='flex'
                                                        gap={1}
                                                        mt={1}
                                                    >
                                                        <Chip
                                                            size='small'
                                                            icon={
                                                                <TrendingUp
                                                                    sx={{
                                                                        fontSize: 16,
                                                                    }}
                                                                />
                                                            }
                                                            label={`أعلى: ${formatPrice(statistics.highestPricedProduct)}`}
                                                            sx={{
                                                                color: 'primary',
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>

                                {/* بطاقة التفاعل */}
                                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                    <Zoom in={true} timeout={600}>
                                        <Card
                                            sx={{
                                                color: 'primary',
                                                borderRadius: 4,
                                                transition: 'all 0.3s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    transform:
                                                        'translateY(-8px)',
                                                    boxShadow:
                                                        '0 20px 40px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                >
                                                    <Box>
                                                        <ThumbUp
                                                            sx={{
                                                                fontSize: 48,
                                                                opacity: 0.9,
                                                            }}
                                                        />
                                                    </Box>
                                                    <Box textAlign='right'>
                                                        <Typography
                                                            variant='h3'
                                                            fontWeight='bold'
                                                        >
                                                            {statistics.totalLikes.toLocaleString()}
                                                        </Typography>
                                                        <Typography
                                                            variant='body2'
                                                            sx={{
                                                                opacity: 0.9,
                                                            }}
                                                        >
                                                            إجمالي التفاعلات
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Box mt={2}>
                                                    <Box
                                                        display='flex'
                                                        gap={1}
                                                        justifyContent='space-between'
                                                    >
                                                        <Chip
                                                            size='small'
                                                            label={`${statistics.averageLikesPerProduct} / منتج`}
                                                            sx={{
                                                                color: 'primary',
                                                            }}
                                                        />
                                                        <Chip
                                                            size='small'
                                                            label={`${statistics.activeSellers} بائع`}
                                                            sx={{
                                                                bgcolor: alpha(
                                                                    '#fff',
                                                                    0.2,
                                                                ),
                                                                color: 'primary',
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Zoom>
                                </Grid>
                            </Grid>

                            {/* المخطط البياني لتوزيع الفئات - محسن */}
                            {/* <Grow in={true} timeout={700}>
                                <Card
                                    sx={{
                                        borderRadius: 4,
                                        mt: 5,
                                        overflow: 'hidden',
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant='h5'
                                            gutterBottom
                                            sx={{
                                                mb: 3,
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Category color='primary' />
                                            توزيع المنتجات حسب الفئة
                                        </Typography>
                                        <Grid container spacing={3}>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <ResponsiveContainer
                                                    width='100%'
                                                    height={320}
                                                >
                                                    <PieChart>
                                                        <Pie
                                                            data={statistics.productsByCategory.slice(
                                                                0,
                                                                5,
                                                            )}
                                                            cx='50%'
                                                            cy='50%'
                                                            labelLine={false}
                                                            label={(
                                                                entry: any,
                                                            ) =>
                                                                `${getCategoryName(entry.category)}`
                                                            }
                                                            outerRadius={100}
                                                            innerRadius={60}
                                                            fill='#8884d8'
                                                            dataKey='count'
                                                            paddingAngle={5}
                                                        >
                                                            {statistics.productsByCategory
                                                                .slice(0, 5)
                                                                .map(
                                                                    (
                                                                        _entry: CategoryStats,
                                                                        index: number,
                                                                    ) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={
                                                                                COLORS[
                                                                                    index %
                                                                                        COLORS.length
                                                                                ]
                                                                            }
                                                                            stroke='none'
                                                                        />
                                                                    ),
                                                                )}
                                                        </Pie>
                                                        <RechartsTooltip
                                                            formatter={(
                                                                value: any,
                                                                props: any,
                                                            ) => [
                                                                `${value} منتج (${((props.payload.count / statistics.totalProducts) * 100).toFixed(1)}%)`,
                                                                getCategoryName(
                                                                    props
                                                                        .payload
                                                                        .category,
                                                                ),
                                                            ]}
                                                        />
                                                        <Legend
                                                            formatter={(
                                                                value: any,
                                                            ) =>
                                                                getCategoryName(
                                                                    value,
                                                                )
                                                            }
                                                            verticalAlign='bottom'
                                                            height={36}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 6 }}>
                                                <Box>
                                                    <Typography
                                                        variant='h6'
                                                        gutterBottom
                                                        fontWeight={600}
                                                    >
                                                        تفصيل الفئات
                                                    </Typography>
                                                    {statistics.productsByCategory
                                                        .slice(0, 5)
                                                        .map(
                                                            (
                                                                category: CategoryStats,
                                                                index: number,
                                                            ) => (
                                                                <Box
                                                                    key={index}
                                                                    mb={2.5}
                                                                >
                                                                    <Box
                                                                        display='flex'
                                                                        justifyContent='space-between'
                                                                        mb={0.5}
                                                                    >
                                                                        <Box
                                                                            display='flex'
                                                                            alignItems='center'
                                                                        >
                                                                            <Box
                                                                                sx={{
                                                                                    width: 12,
                                                                                    height: 12,
                                                                                    bgcolor:
                                                                                        COLORS[
                                                                                            index %
                                                                                                COLORS.length
                                                                                        ],
                                                                                    borderRadius:
                                                                                        '50%',
                                                                                    mr: 1,
                                                                                    boxShadow: `0 0 0 2px ${alpha(COLORS[index % COLORS.length], 0.2)}`,
                                                                                }}
                                                                            />
                                                                            <Typography
                                                                                variant='body2'
                                                                                fontWeight={
                                                                                    600
                                                                                }
                                                                            >
                                                                                {getCategoryName(
                                                                                    category.category,
                                                                                )}
                                                                            </Typography>
                                                                        </Box>
                                                                        <Typography
                                                                            variant='body2'
                                                                            fontWeight={
                                                                                600
                                                                            }
                                                                            color='primary'
                                                                        >
                                                                            {
                                                                                category.count
                                                                            }{' '}
                                                                            منتج
                                                                        </Typography>
                                                                    </Box>
                                                                    <LinearProgress
                                                                        variant='determinate'
                                                                        value={
                                                                            category.percentage
                                                                        }
                                                                        sx={{
                                                                            height: 8,
                                                                            borderRadius: 4,
                                                                            bgcolor:
                                                                                alpha(
                                                                                    COLORS[
                                                                                        index %
                                                                                            COLORS.length
                                                                                    ],
                                                                                    0.1,
                                                                                ),
                                                                            '& .MuiLinearProgress-bar':
                                                                                {
                                                                                    bgcolor:
                                                                                        COLORS[
                                                                                            index %
                                                                                                COLORS.length
                                                                                        ],
                                                                                    borderRadius: 4,
                                                                                },
                                                                        }}
                                                                    />
                                                                    <Box
                                                                        display='flex'
                                                                        justifyContent='space-between'
                                                                        mt={0.5}
                                                                    >
                                                                        <Typography
                                                                            variant='caption'
                                                                            color='text.secondary'
                                                                        >
                                                                            {category.percentage.toFixed(
                                                                                1,
                                                                            )}
                                                                            % من
                                                                            الإجمالي
                                                                        </Typography>
                                                                        <Typography
                                                                            variant='caption'
                                                                            fontWeight={
                                                                                600
                                                                            }
                                                                            color='success.main'
                                                                        >
                                                                            {formatPrice(
                                                                                category.totalValue,
                                                                            )}
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            ),
                                                        )}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grow> */}

                            {statistics.productsByCategory &&
                                statistics.productsByCategory.length > 0 && (
                                    <Grow in={true} timeout={700}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,
                                                mt: 5,
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant='h5'
                                                    gutterBottom
                                                    sx={{
                                                        mb: 3,
                                                        fontWeight: 700,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <Category color='primary' />
                                                    توزيع المنتجات حسب الفئة
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid
                                                        size={{ xs: 12, md: 6 }}
                                                    >
                                                        <ResponsiveContainer
                                                            width='100%'
                                                            height={320}
                                                        >
                                                            <PieChart>
                                                                <Pie
                                                                    data={statistics.productsByCategory.slice(
                                                                        0,
                                                                        5,
                                                                    )}
                                                                    cx='50%'
                                                                    cy='50%'
                                                                    labelLine={
                                                                        false
                                                                    }
                                                                    label={(
                                                                        entry: any,
                                                                    ) =>
                                                                        `${getCategoryName(entry.category)}`
                                                                    }
                                                                    outerRadius={
                                                                        100
                                                                    }
                                                                    innerRadius={
                                                                        60
                                                                    }
                                                                    fill='#8884d8'
                                                                    dataKey='count'
                                                                    paddingAngle={
                                                                        5
                                                                    }
                                                                >
                                                                    {statistics.productsByCategory
                                                                        .slice(
                                                                            0,
                                                                            5,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                _entry: CategoryStats,
                                                                                index: number,
                                                                            ) => (
                                                                                <Cell
                                                                                    key={`cell-${index}`}
                                                                                    fill={
                                                                                        COLORS[
                                                                                            index %
                                                                                                COLORS.length
                                                                                        ]
                                                                                    }
                                                                                    stroke='none'
                                                                                />
                                                                            ),
                                                                        )}
                                                                </Pie>
                                                                <RechartsTooltip
                                                                    formatter={(
                                                                        value: any,
                                                                        props: any,
                                                                    ) => [
                                                                        `${value} منتج (${((props.payload.count / (statistics.totalProducts || 1)) * 100).toFixed(1)}%)`,
                                                                        getCategoryName(
                                                                            props
                                                                                .payload
                                                                                .category,
                                                                        ),
                                                                    ]}
                                                                />
                                                                <Legend
                                                                    formatter={(
                                                                        value: any,
                                                                    ) =>
                                                                        getCategoryName(
                                                                            value,
                                                                        )
                                                                    }
                                                                    verticalAlign='bottom'
                                                                    height={36}
                                                                />
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </Grid>
                                                    <Grid
                                                        size={{ xs: 12, md: 6 }}
                                                    >
                                                        <Box>
                                                            <Typography
                                                                variant='h6'
                                                                gutterBottom
                                                                fontWeight={600}
                                                            >
                                                                تفصيل الفئات
                                                            </Typography>
                                                            {statistics.productsByCategory
                                                                .slice(0, 5)
                                                                .map(
                                                                    (
                                                                        category: CategoryStats,
                                                                        index: number,
                                                                    ) => (
                                                                        <Box
                                                                            key={
                                                                                index
                                                                            }
                                                                            mb={
                                                                                2.5
                                                                            }
                                                                        >
                                                                            <Box
                                                                                display='flex'
                                                                                justifyContent='space-between'
                                                                                mb={
                                                                                    0.5
                                                                                }
                                                                            >
                                                                                <Box
                                                                                    display='flex'
                                                                                    alignItems='center'
                                                                                >
                                                                                    <Box
                                                                                        sx={{
                                                                                            width: 12,
                                                                                            height: 12,
                                                                                            bgcolor:
                                                                                                COLORS[
                                                                                                    index %
                                                                                                        COLORS.length
                                                                                                ],
                                                                                            borderRadius:
                                                                                                '50%',
                                                                                            mr: 1,
                                                                                            boxShadow: `0 0 0 2px ${alpha(COLORS[index % COLORS.length], 0.2)}`,
                                                                                        }}
                                                                                    />
                                                                                    <Typography
                                                                                        variant='body2'
                                                                                        fontWeight={
                                                                                            600
                                                                                        }
                                                                                    >
                                                                                        {getCategoryName(
                                                                                            category.category,
                                                                                        )}
                                                                                    </Typography>
                                                                                </Box>
                                                                                <Typography
                                                                                    variant='body2'
                                                                                    fontWeight={
                                                                                        600
                                                                                    }
                                                                                    color='primary'
                                                                                >
                                                                                    {
                                                                                        category.count
                                                                                    }{' '}
                                                                                    منتج
                                                                                </Typography>
                                                                            </Box>
                                                                            <LinearProgress
                                                                                variant='determinate'
                                                                                value={
                                                                                    category.percentage
                                                                                }
                                                                                sx={{
                                                                                    height: 8,
                                                                                    borderRadius: 4,
                                                                                    bgcolor:
                                                                                        alpha(
                                                                                            COLORS[
                                                                                                index %
                                                                                                    COLORS.length
                                                                                            ],
                                                                                            0.1,
                                                                                        ),
                                                                                    '& .MuiLinearProgress-bar':
                                                                                        {
                                                                                            bgcolor:
                                                                                                COLORS[
                                                                                                    index %
                                                                                                        COLORS.length
                                                                                                ],
                                                                                            borderRadius: 4,
                                                                                        },
                                                                                }}
                                                                            />
                                                                            <Box
                                                                                display='flex'
                                                                                justifyContent='space-between'
                                                                                mt={
                                                                                    0.5
                                                                                }
                                                                            >
                                                                                <Typography
                                                                                    variant='caption'
                                                                                    color='text.secondary'
                                                                                >
                                                                                    {category.percentage.toFixed(
                                                                                        1,
                                                                                    )}

                                                                                    %
                                                                                    من
                                                                                    الإجمالي
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant='caption'
                                                                                    fontWeight={
                                                                                        600
                                                                                    }
                                                                                    color='success.main'
                                                                                >
                                                                                    {formatPrice(
                                                                                        category.totalValue,
                                                                                    )}
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    ),
                                                                )}
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grow>
                                )}

                            {/* أكثر المنتجات تفاعلاً - محسن */}
                            <Grow in={true} timeout={800}>
                                <Card sx={{ borderRadius: 4, mt: 5 }}>
                                    <CardContent>
                                        <Typography
                                            variant='h5'
                                            gutterBottom
                                            sx={{
                                                mb: 3,
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Star color='warning' />
                                            أكثر المنتجات تفاعلاً
                                        </Typography>
                                        {statistics.mostPopularProducts.length >
                                        0 ? (
                                            <TableContainer
                                                component={Paper}
                                                elevation={0}
                                                sx={{ borderRadius: 3 }}
                                            >
                                                <Table>
                                                    <TableHead
                                                        sx={{
                                                            bgcolor: alpha(
                                                                theme.palette
                                                                    .secondary
                                                                    .main,
                                                                0.05,
                                                            ),
                                                        }}
                                                    >
                                                        <TableRow>
                                                            <TableCell
                                                                width='5%'
                                                                align='center'
                                                            >
                                                                #
                                                            </TableCell>
                                                            <TableCell width='30%'>
                                                                المنتج
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='15%'
                                                            >
                                                                البائع
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='15%'
                                                            >
                                                                الفئة
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='15%'
                                                            >
                                                                التفاعل
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='10%'
                                                            >
                                                                السعر
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='10%'
                                                            >
                                                                الحالة
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {statistics.mostPopularProducts.map(
                                                            (
                                                                product: MostPopularProduct,
                                                                index: number,
                                                            ) => (
                                                                <TableRow
                                                                    key={
                                                                        product.id
                                                                    }
                                                                    sx={{
                                                                        '&:hover':
                                                                            {
                                                                                bgcolor:
                                                                                    alpha(
                                                                                        theme
                                                                                            .palette
                                                                                            .primary
                                                                                            .main,
                                                                                        0.02,
                                                                                    ),
                                                                                transition:
                                                                                    'background-color 0.2s',
                                                                            },
                                                                    }}
                                                                >
                                                                    <TableCell align='center'>
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                bgcolor:
                                                                                    index ===
                                                                                    0
                                                                                        ? '#FFD700'
                                                                                        : index ===
                                                                                            1
                                                                                          ? '#C0C0C0'
                                                                                          : index ===
                                                                                              2
                                                                                            ? '#CD7F32'
                                                                                            : theme
                                                                                                  .palette
                                                                                                  .grey[400],
                                                                                color:
                                                                                    index <
                                                                                    3
                                                                                        ? '#000'
                                                                                        : '#fff',
                                                                                fontWeight:
                                                                                    'bold',
                                                                            }}
                                                                        >
                                                                            {index +
                                                                                1}
                                                                        </Avatar>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            display='flex'
                                                                            alignItems='center'
                                                                        >
                                                                            <Link
                                                                                to={`${productsPathes.postsDetails}/${product.category}/${product.name}/${product.id}`}
                                                                            >
                                                                                {product.image && (
                                                                                    <Avatar
                                                                                        src={
                                                                                            product.image
                                                                                        }
                                                                                        alt={
                                                                                            product.name
                                                                                        }
                                                                                        sx={{
                                                                                            width: 50,
                                                                                            height: 50,
                                                                                            mr: 2,
                                                                                            borderRadius: 2,
                                                                                        }}
                                                                                    />
                                                                                )}
                                                                            </Link>
                                                                            <Box>
                                                                                <Typography
                                                                                    variant='body2'
                                                                                    fontWeight={
                                                                                        600
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        product.name
                                                                                    }
                                                                                </Typography>
                                                                                <Box
                                                                                    display='flex'
                                                                                    alignItems='center'
                                                                                    mt={
                                                                                        0.5
                                                                                    }
                                                                                    gap={
                                                                                        1
                                                                                    }
                                                                                >
                                                                                    <Box
                                                                                        display='flex'
                                                                                        alignItems='center'
                                                                                    >
                                                                                        <ThumbUp
                                                                                            sx={{
                                                                                                fontSize: 14,
                                                                                                color: 'text.secondary',
                                                                                            }}
                                                                                        />
                                                                                        <Typography
                                                                                            variant='caption'
                                                                                            color='text.secondary'
                                                                                            sx={{
                                                                                                mr: 1,
                                                                                            }}
                                                                                        >
                                                                                            {
                                                                                                product.likes
                                                                                            }
                                                                                        </Typography>
                                                                                    </Box>
                                                                                    <Box
                                                                                        display='flex'
                                                                                        alignItems='center'
                                                                                    >
                                                                                        <Visibility
                                                                                            sx={{
                                                                                                fontSize: 14,
                                                                                                color: 'text.secondary',
                                                                                            }}
                                                                                        />
                                                                                        <Typography
                                                                                            variant='caption'
                                                                                            color='text.secondary'
                                                                                        >
                                                                                            {
                                                                                                product.views
                                                                                            }
                                                                                        </Typography>
                                                                                    </Box>
                                                                                </Box>
                                                                            </Box>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Typography
                                                                            variant='caption'
                                                                            color='text.secondary'
                                                                        >
                                                                            @
                                                                            {product
                                                                                .seller
                                                                                .slug ||
                                                                                'غير محدد'}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Chip
                                                                            label={getCategoryName(
                                                                                product.category,
                                                                            )}
                                                                            size='small'
                                                                            variant='outlined'
                                                                            sx={{
                                                                                borderRadius: 2,
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Box
                                                                            display='flex'
                                                                            flexDirection='column'
                                                                            alignItems='center'
                                                                        >
                                                                            <Chip
                                                                                label={`${product.likes} إعجاب`}
                                                                                size='small'
                                                                                icon={
                                                                                    <ThumbUp
                                                                                        sx={{
                                                                                            fontSize: 14,
                                                                                        }}
                                                                                    />
                                                                                }
                                                                                color='primary'
                                                                                variant='outlined'
                                                                                sx={{
                                                                                    mb: 0.5,
                                                                                }}
                                                                            />
                                                                            <Chip
                                                                                label={`${product.views} مشاهدة`}
                                                                                size='small'
                                                                                icon={
                                                                                    <Visibility
                                                                                        sx={{
                                                                                            fontSize: 14,
                                                                                        }}
                                                                                    />
                                                                                }
                                                                                variant='outlined'
                                                                            />
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Typography
                                                                            variant='body2'
                                                                            fontWeight={
                                                                                700
                                                                            }
                                                                            color='primary'
                                                                        >
                                                                            {formatPrice(
                                                                                product.price,
                                                                            )}
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Chip
                                                                            label={getStatusLabel(
                                                                                product.status,
                                                                            )}
                                                                            color={getStatusColor(
                                                                                product.status,
                                                                            )}
                                                                            size='small'
                                                                            sx={{
                                                                                fontWeight: 600,
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box py={6} textAlign='center'>
                                                <Typography color='text.secondary'>
                                                    لا توجد منتجات حتى الآن
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grow>

                            {/* أكثر البائعين نشاطاً - محسن */}
                            <Grow in={true} timeout={900}>
                                <Card sx={{ borderRadius: 4, mt: 5 }}>
                                    <CardContent>
                                        <Typography
                                            variant='h5'
                                            gutterBottom
                                            sx={{
                                                mb: 3,
                                                fontWeight: 700,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                            }}
                                        >
                                            <Verified color='success' />
                                            أكثر البائعين نشاطاً
                                        </Typography>
                                        {statistics.topSellers.length > 0 ? (
                                            <TableContainer
                                                component={Paper}
                                                elevation={0}
                                                sx={{ borderRadius: 3 }}
                                            >
                                                <Table>
                                                    <TableHead
                                                        sx={{
                                                            bgcolor: alpha(
                                                                theme.palette
                                                                    .primary
                                                                    .main,
                                                                0.05,
                                                            ),
                                                        }}
                                                    >
                                                        <TableRow>
                                                            <TableCell
                                                                width='5%'
                                                                align='center'
                                                            >
                                                                #
                                                            </TableCell>
                                                            <TableCell width='30%'>
                                                                البائع
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='15%'
                                                            >
                                                                المنتجات
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='25%'
                                                            >
                                                                التفاعل
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='15%'
                                                            >
                                                                القيمة الإجمالية
                                                            </TableCell>
                                                            <TableCell
                                                                align='center'
                                                                width='10%'
                                                            >
                                                                الدور
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {statistics.topSellers.map(
                                                            (
                                                                seller: TopSeller,
                                                                index: number,
                                                            ) => (
                                                                <TableRow
                                                                    key={
                                                                        seller._id
                                                                    }
                                                                    sx={{
                                                                        '&:hover':
                                                                            {
                                                                                bgcolor:
                                                                                    alpha(
                                                                                        theme
                                                                                            .palette
                                                                                            .primary
                                                                                            .main,
                                                                                        0.02,
                                                                                    ),
                                                                                transition:
                                                                                    'background-color 0.2s',
                                                                            },
                                                                    }}
                                                                >
                                                                    <TableCell align='center'>
                                                                        <Avatar
                                                                            sx={{
                                                                                width: 32,
                                                                                height: 32,
                                                                                bgcolor:
                                                                                    index ===
                                                                                    0
                                                                                        ? '#FFD700'
                                                                                        : index ===
                                                                                            1
                                                                                          ? '#C0C0C0'
                                                                                          : index ===
                                                                                              2
                                                                                            ? '#CD7F32'
                                                                                            : theme
                                                                                                  .palette
                                                                                                  .grey[400],
                                                                                color:
                                                                                    index <
                                                                                    3
                                                                                        ? '#000'
                                                                                        : '#fff',
                                                                                fontWeight:
                                                                                    'bold',
                                                                            }}
                                                                        >
                                                                            {index +
                                                                                1}
                                                                        </Avatar>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Box
                                                                            display='flex'
                                                                            alignItems='center'
                                                                        >
                                                                            <Avatar
                                                                                src={
                                                                                    seller.avatar
                                                                                }
                                                                                alt={
                                                                                    seller.name
                                                                                }
                                                                                sx={{
                                                                                    width: 45,
                                                                                    height: 45,
                                                                                    mr: 2,
                                                                                }}
                                                                            >
                                                                                {seller.name.charAt(
                                                                                    0,
                                                                                )}
                                                                            </Avatar>
                                                                            <Box>
                                                                                <Typography
                                                                                    variant='body2'
                                                                                    fontWeight={
                                                                                        600
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        seller.name
                                                                                    }
                                                                                </Typography>
                                                                                <Typography
                                                                                    variant='caption'
                                                                                    color='text.secondary'
                                                                                >
                                                                                    {
                                                                                        seller.productsCount
                                                                                    }{' '}
                                                                                    منتج
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Chip
                                                                            label={
                                                                                seller.productsCount
                                                                            }
                                                                            color='primary'
                                                                            size='medium'
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                minWidth: 50,
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Box>
                                                                            <Box
                                                                                display='flex'
                                                                                alignItems='center'
                                                                                justifyContent='center'
                                                                                gap={
                                                                                    1
                                                                                }
                                                                            >
                                                                                <Chip
                                                                                    size='small'
                                                                                    icon={
                                                                                        <ThumbUp
                                                                                            sx={{
                                                                                                fontSize: 14,
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                    label={
                                                                                        seller.totalLikes
                                                                                    }
                                                                                    variant='outlined'
                                                                                />
                                                                                <Chip
                                                                                    size='small'
                                                                                    icon={
                                                                                        <Visibility
                                                                                            sx={{
                                                                                                fontSize: 14,
                                                                                            }}
                                                                                        />
                                                                                    }
                                                                                    label={seller.totalViews.toLocaleString()}
                                                                                    variant='outlined'
                                                                                />
                                                                            </Box>
                                                                            <Typography
                                                                                variant='caption'
                                                                                color='text.secondary'
                                                                            >
                                                                                متوسط:{' '}
                                                                                {Math.round(
                                                                                    (seller.totalLikes +
                                                                                        seller.totalViews) /
                                                                                        seller.productsCount,
                                                                                )}
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Typography
                                                                            variant='body2'
                                                                            fontWeight={
                                                                                700
                                                                            }
                                                                            color='primary'
                                                                        >
                                                                            {formatPrice(
                                                                                seller.totalValue,
                                                                            )}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant='caption'
                                                                            color='text.secondary'
                                                                        >
                                                                            {formatPrice(
                                                                                Math.round(
                                                                                    seller.totalValue /
                                                                                        seller.productsCount,
                                                                                ),
                                                                            )}{' '}
                                                                            متوسط
                                                                        </Typography>
                                                                    </TableCell>
                                                                    <TableCell align='center'>
                                                                        <Chip
                                                                            icon={getRoleIcon(
                                                                                seller.role,
                                                                            )}
                                                                            label={
                                                                                seller.role
                                                                            }
                                                                            color={getRoleColor(
                                                                                seller.role,
                                                                            )}
                                                                            size='small'
                                                                            variant='filled'
                                                                        />
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <Box py={6} textAlign='center'>
                                                <Typography color='text.secondary'>
                                                    لا يوجد بائعين نشطين حتى
                                                    الآن
                                                </Typography>
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grow>

                            {/* ملخص إضافي محسن */}
                            <Grid container spacing={3} sx={{ mt: 3 }}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in={true} timeout={1000}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,

                                                color: 'primary',
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <Percent
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            قيمة الخصومات
                                                        </Typography>
                                                    </Box>
                                                    <MonetizationOn
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.8,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                    gutterBottom
                                                >
                                                    {formatPrice(
                                                        statistics.totalDiscountValue,
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    sx={{ opacity: 0.9 }}
                                                >
                                                    إجمالي قيمة التخفيضات
                                                    المقدمة
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in={true} timeout={1100}>
                                        <Card
                                            sx={{
                                                borderRadius: 4,

                                                color: 'primary',
                                            }}
                                        >
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <TrendingUp
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            متوسط التفاعل
                                                        </Typography>
                                                    </Box>
                                                    <ThumbUp
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.8,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                    gutterBottom
                                                >
                                                    {statistics.averageLikesPerProduct.toFixed(
                                                        1,
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    sx={{ opacity: 0.9 }}
                                                >
                                                    متوسط الإعجابات لكل منتج
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Fade in={true} timeout={1200}>
                                        <Card sx={{ borderRadius: 2 }}>
                                            <CardContent>
                                                <Box
                                                    display='flex'
                                                    alignItems='center'
                                                    justifyContent='space-between'
                                                    mb={2}
                                                >
                                                    <Box
                                                        display='flex'
                                                        alignItems='center'
                                                        gap={1}
                                                    >
                                                        <AccessTime
                                                            sx={{
                                                                fontSize: 28,
                                                            }}
                                                        />
                                                        <Typography
                                                            variant='h6'
                                                            fontWeight={600}
                                                        >
                                                            نشاط اليوم
                                                        </Typography>
                                                    </Box>
                                                    <ShoppingCart
                                                        sx={{
                                                            fontSize: 32,
                                                            opacity: 0.8,
                                                        }}
                                                    />
                                                </Box>
                                                <Typography
                                                    variant='h3'
                                                    fontWeight='bold'
                                                    gutterBottom
                                                >
                                                    {statistics.newProductsToday +
                                                        statistics.newUsersToday}
                                                </Typography>
                                                <Typography
                                                    variant='body2'
                                                    sx={{ opacity: 0.9 }}
                                                >
                                                    {
                                                        statistics.newProductsToday
                                                    }{' '}
                                                    منتج +{' '}
                                                    {statistics.newUsersToday}{' '}
                                                    مستخدم
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Fade>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Container>
            </main>
        </>
    );
};

export default StatisticsPanel;
