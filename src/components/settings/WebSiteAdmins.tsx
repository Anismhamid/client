import { FunctionComponent, useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
} from "@mui/material";
import {
    TrendingUp,
    People,
    ShoppingCart,
    MonetizationOn,
    Visibility,
    ThumbUp,
    LocalOffer,
    AccessTime,
    AttachMoney,
    Refresh,
} from "@mui/icons-material";
import { Posts } from "../../interfaces/Posts";
import { getAllUsers } from "../../services/usersServices";
import { getAllPosts } from "../../services/postsServices";
import { User } from "../../interfaces/usersMessages";
import { useUser } from "../../context/useUSer";
import { formatPrice } from "../../helpers/dateAndPriceFormat";
import RoleType from "../../interfaces/UserType";

// Helper function to safely get number from views
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getViewsAsNumber = (views: any): number => {
    if (typeof views === 'number') return views;
    if (typeof views === 'string') return parseInt(views, 10) || 0;
    return 0;
};

// Helper function to safely get createdAt as string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    pendingProducts: number;
    soldProducts: number;
    newProductsToday: number;
    newProductsMonth: number;
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

// Colors for PieChart
const COLORS: string[] = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

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

const WebSiteAdmins: FunctionComponent = () => {
    const { auth } = useUser();
    const theme = useTheme();

    const [timeFrame, setTimeFrame] = useState<string>("today");
    const [statistics, setStatistics] = useState<Statistics>({
        totalProducts: 0,
        activeProducts: 0,
        pendingProducts: 0,
        soldProducts: 0,
        newProductsToday: 0,
        newProductsMonth: 0,
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

    useEffect(() => {
        if (auth.role !== RoleType.Admin && auth.role !== RoleType.Moderator) return;
    }, [auth._id, auth.role]);

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        try {
            const [usersRes, productsRes] = await Promise.all([
                getAllUsers(),
                getAllPosts(),
            ]);

            const usersData: AuthValues[] = (usersRes as AuthValues[]) || [];
            const postsData: Posts[] = (productsRes as Posts[]) || [];

            // ربط بيانات المستخدم مع المنشورات
            const postsWithUserData: PostWithUser[] = postsData.map((post: Posts) => ({
                ...post,
                userData: usersData.find(
                    (user: AuthValues) => user._id === post.userId,
                ) as User,
            }));

            calculateStatistics(usersData, postsWithUserData);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = (): void => {
        setRefreshing(true);
        fetchData();
    };

    // حساب جميع الإحصائيات لموقع C2C
    const calculateStatistics = (users: AuthValues[], posts: PostWithUser[]): void => {
        const now: Date = new Date();
        const todayStart: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart: Date = new Date(now.getFullYear(), now.getMonth(), 1);

        // إحصائيات المستخدمين
        const newUsersToday: number = users.filter(
            (user: AuthValues) => {
                const createdAt = user.createdAt ? new Date(user.createdAt) : now;
                return createdAt >= todayStart;
            }
        ).length;

        const newUsersMonth: number = users.filter(
            (user: AuthValues) => {
                const createdAt = user.createdAt ? new Date(user.createdAt) : now;
                return createdAt >= monthStart;
            }
        ).length;

        // إحصائيات المستخدمين حسب الدور
        const totalAdmins: number = users.filter((u: AuthValues) => u.role === "Admin").length;
        const totalModerators: number = users.filter((u: AuthValues) => u.role === "Moderator").length;
        const totalClients: number = users.filter((u: AuthValues) => u.role === "Client").length;

        // إحصائيات المنشورات حسب الوقت
        const newPostsToday: number = posts.filter(
            (post: PostWithUser) => {
                const createdAt = post.createdAt ? new Date(getCreatedAtAsString(post.createdAt)) : now;
                return createdAt >= todayStart;
            }
        ).length;

        const newPostsMonth: number = posts.filter(
            (post: PostWithUser) => {
                const createdAt = post.createdAt ? new Date(getCreatedAtAsString(post.createdAt)) : now;
                return createdAt >= monthStart;
            }
        ).length;

        // إحصائيات حالة المنشورات
        const activePosts: number = posts.filter((p: PostWithUser) => p.in_stock === true).length;
        const pendingPosts: number = posts.filter((p: PostWithUser) => p.status === "pending").length;
        const soldPosts: number = posts.filter((p: PostWithUser) => p.status === "sold").length;

        // حساب البائعين النشطين (المستخدمين الذين لديهم منشورات)
        const sellersMap = new Map<string, SellerData>();

        posts.forEach((post: PostWithUser) => {
            // نستخدم معرف المستخدم كـ Key أساسي وموحد
            const sellerId = post.userId;

            if (sellerId && post.userData) {
                const existing = sellersMap.get(sellerId as string);

                // إذا كان البائع موجوداً نأخذ بياناته، وإلا ننشئ كائن جديد
                const seller: SellerData = existing || {
                    productsCount: 0,
                    totalLikes: 0,
                    totalViews: 0,
                    totalValue: 0,
                    user: post.userData,
                };

                // تحديث البيانات وإعادة تخزينها في الـ Map
                sellersMap.set(sellerId as string, {
                    ...seller, // الحفاظ على بيانات المستخدم
                    productsCount: seller.productsCount + 1,
                    totalLikes: seller.totalLikes + (post.likes?.length || 0),
                    totalViews: seller.totalViews + getViewsAsNumber(post.views),
                    totalValue: seller.totalValue + (post.price || 0),
                });
            }
        });

        const activeSellers: number = sellersMap.size;

        // إحصائيات التفاعل
        const totalLikes: number = posts.reduce(
            (sum: number, post: PostWithUser) => sum + (post.likes?.length || 0),
            0,
        );
        const totalViews: number = posts.reduce(
            (sum: number, post: PostWithUser) => sum + getViewsAsNumber(post.views),
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
        const postPrices: number[] = posts.map((p: PostWithUser) => p.price || 0);
        const totalProductValue: number = postPrices.reduce((sum: number, price: number) => sum + price, 0);
        const averageProductPrice: number =
            posts.length > 0 ? Math.round(totalProductValue / posts.length) : 0;
        const highestPricedProduct: number =
            postPrices.length > 0 ? Math.max(...postPrices) : 0;
        const lowestPricedProduct: number =
            postPrices.length > 0
                ? Math.min(...postPrices.filter((p: number) => p > 0))
                : 0;

        // حساب قيمة الخصومات
        const totalDiscountValue: number = posts.reduce((sum: number, post: PostWithUser) => {
            if (post.sale && post.discount && post.price) {
                return sum + (post.price * post.discount) / 100;
            }
            return sum;
        }, 0);

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
        const productsByCategory: CategoryStats[] = Array.from(categoryMap.entries())
            .map(([category, data]: [string, CategoryData]) => ({
                category,
                count: data.count,
                percentage:
                    totalPostsCount > 0 ? (data.count / totalPostsCount) * 100 : 0,
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
                id: post._id || "",
                name: post.product_name || "منتج بدون اسم",
                image: typeof post.image === 'object' && post.image !== null ? post.image?.url : undefined,
                likes: post.likes?.length || 0,
                views: getViewsAsNumber(post.views),
                price: post.price || 0,
                status: post.in_stock ? "active" : "sold",
                seller: {
                    name: `${post.userData?.name?.first || ""} ${post.userData?.name?.last || ""}`.trim(),
                    link: `/customer-profile/${post.seller?.slug || ""}`,
                    slug: post.seller?.slug || "",
                    user: post.seller?.user || "",
                },
                category: post.category || "غير مصنف",
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
                name: `${data.user.name?.first || "مستخدم"} ${data.user.name?.last || ""}`.trim(),
                avatar: data.user.image?.url,
                productsCount: data.productsCount,
                totalLikes: data.totalLikes,
                totalViews: data.totalViews,
                totalValue: data.totalValue,
                role: data.user.role || "Client",
            }))
            .sort((a: TopSeller, b: TopSeller) => {
                if (b.productsCount !== a.productsCount) {
                    return b.productsCount - a.productsCount;
                }
                return (b.totalLikes + b.totalViews) - (a.totalLikes + a.totalViews);
            })
            .slice(0, 5);

        // توزيع المنتجات حسب التاريخ (آخر 7 أيام)
        const last7Days: string[] = Array.from({ length: 7 }, (_, i: number) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split("T")[0];
        }).reverse();

        const productsByDate: ProductByDate[] = last7Days.map((date: string) => {
            const count: number = posts.filter((post: PostWithUser) => {
                if (!post.createdAt) return false;
                const postDate: string = new Date(getCreatedAtAsString(post.createdAt))
                    .toISOString()
                    .split("T")[0];
                return postDate === date;
            }).length;
            return { date, count };
        });

        setStatistics({
            totalProducts: posts.length,
            activeProducts: activePosts,
            pendingProducts: pendingPosts,
            soldProducts: soldPosts,
            newProductsToday: newPostsToday,
            newProductsMonth: newPostsMonth,
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

    const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
        switch (status) {
            case "active":
                return "success";
            case "pending":
                return "warning";
            case "sold":
                return "error";
            default:
                return "default";
        }
    };

    const getStatusLabel = (status: string): string => {
        switch (status) {
            case "active":
                return "متاح";
            case "pending":
                return "قيد المراجعة";
            case "sold":
                return "تم البيع";
            default:
                return status;
        }
    };

    const getRoleColor = (role: string): "error" | "warning" | "success" | "info" | "default" => {
        switch (role) {
            case "Admin":
                return "error";
            case "Moderator":
                return "warning";
            case "Client":
                return "success";
            case "delivery":
                return "info";
            default:
                return "default";
        }
    };

    const getCategoryName = (category: string): string => {
        const categories: Record<string, string> = {
            House: "بيت",
            Garden: "حديقة",
            Cars: "سيارات",
            Bikes: "دراجات",
            Trucks: "شاحنات",
            ElectricVehicles: "مركبات كهربائية",
            MenClothes: "ملابس رجالية",
            WomenClothes: "ملابس نسائية",
            Baby: "أطفال",
            Kids: "ألعاب",
            Health: "صحة",
            Beauty: "جمال",
            Watches: "ساعات",
            Cleaning: "تنظيف",
        };
        return categories[category] || category;
    };

    // Check if user has access
    if (auth.role !== "Admin" && auth.role !== "Moderator") {
        return (
            <Box component="main" className="container mt-5 text-center">
                <Typography variant="h4" color="error">
                    غير مصرح لك بالوصول إلى هذه الصفحة
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <title>لوحة تحكم الإدارة | صفقة - منصة C2C</title>
            <meta
                name="description"
                content="لوحة تحكم إدارة منصة بيع وشراء C2C | صفقة"
            />
            <main>
                {/* العنوان الرئيسي */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        لوحة تحكم إدارة منصة صفقه
                    </Typography>
                    <Tooltip title="تحديث البيانات">
                        <IconButton
                            onClick={handleRefresh}
                            disabled={refreshing}
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                "&:hover": {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                        >
                            <Refresh className={refreshing ? "spin" : ""} />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* فلترة الوقت ومعلومات المسؤول */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <Box>
                        <Typography variant="body1" color="text.secondary">
                            مرحباً، {auth.name?.first} {auth.name?.last}
                        </Typography>
                        <Chip
                            label={auth.role === "Admin" ? "مدير النظام" : "مشرف"}
                            size="small"
                            color={auth.role === "Admin" ? "error" : "warning"}
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                        />
                    </Box>
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel>الفترة</InputLabel>
                        <Select
                            value={timeFrame}
                            label="الفترة"
                            onChange={(e) => setTimeFrame(e.target.value)}
                            sx={{ borderRadius: 2 }}
                        >
                            <MenuItem value="today">اليوم</MenuItem>
                            <MenuItem value="month">هذا الشهر</MenuItem>
                            <MenuItem value="all">الكل</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="50vh"
                    >
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <>
                        {/* إحصائيات سريعة */}
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ mt: 4, mb: 3, fontWeight: 600 }}
                        >
                            نظرة عامة
                        </Typography>
                        <Grid container spacing={3}>
                            {/* المستخدمون */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Card
                                    className="rounded-5 shadow-lg"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "translateY(-5px)" },
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <People
                                                color="primary"
                                                sx={{ fontSize: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                    component="p"
                                                    fontWeight={600}
                                                >
                                                    المستخدمون
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="p"
                                                    fontWeight="bold"
                                                    sx={{ color: "text.primary" }}
                                                >
                                                    {statistics.totalUsers}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    +{statistics.newUsersToday} اليوم
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mt={2}
                                        >
                                            <Chip
                                                size="small"
                                                label={`${statistics.totalAdmins} مدير`}
                                                color="error"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={`${statistics.totalModerators} مشرف`}
                                                color="warning"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={`${statistics.totalClients} عميل`}
                                                color="success"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* المنتجات */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Card
                                    className="rounded-5 shadow-lg"
                                    sx={{
                                        bgcolor: alpha(theme.palette.success.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "translateY(-5px)" },
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <ShoppingCart
                                                color="success"
                                                sx={{ fontSize: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    color="success.main"
                                                    component="p"
                                                    fontWeight={600}
                                                >
                                                    المنتجات
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="p"
                                                    fontWeight="bold"
                                                    sx={{ color: "text.primary" }}
                                                >
                                                    {statistics.totalProducts}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    +{statistics.newProductsToday} اليوم
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mt={2}
                                        >
                                            <Chip
                                                size="small"
                                                label={`${statistics.activeProducts} نشط`}
                                                color="success"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={`${statistics.pendingProducts} قيد`}
                                                color="warning"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={`${statistics.soldProducts} مباع`}
                                                color="error"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* القيمة */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Card
                                    className="rounded-5 shadow-lg"
                                    sx={{
                                        bgcolor: alpha(theme.palette.warning.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "translateY(-5px)" },
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <AttachMoney
                                                color="warning"
                                                sx={{ fontSize: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    color="warning.main"
                                                    component="p"
                                                    fontWeight={600}
                                                >
                                                    القيمة الإجمالية
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="p"
                                                    fontWeight="bold"
                                                    sx={{ color: "text.primary" }}
                                                >
                                                    {formatPrice(
                                                        statistics.totalProductValue,
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {formatPrice(
                                                        statistics.averageProductPrice,
                                                    )}{" "}
                                                    متوسط
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mt={2}
                                        >
                                            <Chip
                                                size="small"
                                                label={`${formatPrice(statistics.highestPricedProduct)} أعلى`}
                                                color="error"
                                                variant="outlined"
                                            />
                                            <Chip
                                                size="small"
                                                label={`${formatPrice(statistics.lowestPricedProduct)} أدنى`}
                                                color="success"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* التفاعل */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <Card
                                    className="rounded-5 shadow-lg"
                                    sx={{
                                        bgcolor: alpha(theme.palette.info.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                                        transition: "transform 0.3s",
                                        "&:hover": { transform: "translateY(-5px)" },
                                    }}
                                >
                                    <CardContent>
                                        <Box display="flex" alignItems="center">
                                            <ThumbUp
                                                color="info"
                                                sx={{ fontSize: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography
                                                    variant="h6"
                                                    color="info.main"
                                                    component="p"
                                                    fontWeight={600}
                                                >
                                                    التفاعل
                                                </Typography>
                                                <Typography
                                                    variant="h5"
                                                    component="p"
                                                    fontWeight="bold"
                                                    sx={{ color: "text.primary" }}
                                                >
                                                    {statistics.totalLikes.toLocaleString()}
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    {statistics.averageLikesPerProduct}{" "}
                                                    معدل لكل منتج
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            mt={2}
                                        >
                                            <Box display="flex" alignItems="center">
                                                <ThumbUp sx={{ fontSize: 16, mr: 0.5 }} />
                                                <Typography variant="caption">
                                                    {statistics.totalLikes}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <Visibility
                                                    sx={{ fontSize: 16, mr: 0.5 }}
                                                />
                                                <Typography variant="caption">
                                                    {statistics.totalViews.toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <People sx={{ fontSize: 16, mr: 0.5 }} />
                                                <Typography variant="caption">
                                                    {statistics.activeSellers}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* المخطط البياني لتوزيع الفئات */}
                        <Card className="rounded-5 shadow mt-5">
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{ mb: 3, fontWeight: 600 }}
                                >
                                    📊 توزيع المنتجات حسب الفئة
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={statistics.productsByCategory.slice(
                                                        0,
                                                        5,
                                                    )}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    label={(entry: any) =>
                                                        `${getCategoryName(entry.category)}: ${entry.percentage.toFixed(1)}%`
                                                    }
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="count"
                                                >
                                                    {statistics.productsByCategory
                                                        .slice(0, 5)
                                                        .map((_entry: CategoryStats, index: number) => (
                                                            <Cell
                                                                key={`cell-${index}`}
                                                                fill={
                                                                    COLORS[
                                                                    index %
                                                                    COLORS.length
                                                                    ]
                                                                }
                                                            />
                                                        ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box>
                                            <Typography variant="h6" gutterBottom>
                                                تفصيل الفئات
                                            </Typography>
                                            {statistics.productsByCategory
                                                .slice(0, 5)
                                                .map((category: CategoryStats, index: number) => (
                                                    <Box key={index} mb={2}>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            mb={0.5}
                                                        >
                                                            <Box
                                                                display="flex"
                                                                alignItems="center"
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
                                                                            "50%",
                                                                        mr: 1,
                                                                    }}
                                                                />
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={500}
                                                                >
                                                                    {getCategoryName(
                                                                        category.category,
                                                                    )}
                                                                </Typography>
                                                            </Box>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                            >
                                                                {category.count} منتج
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={category.percentage}
                                                            sx={{
                                                                height: 6,
                                                                bgcolor: alpha(
                                                                    COLORS[
                                                                    index %
                                                                    COLORS.length
                                                                    ],
                                                                    0.1,
                                                                ),
                                                                "& .MuiLinearProgress-bar":
                                                                {
                                                                    bgcolor:
                                                                        COLORS[
                                                                        index %
                                                                        COLORS.length
                                                                        ],
                                                                },
                                                            }}
                                                        />
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            mt={0.5}
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {category.percentage.toFixed(
                                                                    1,
                                                                )}
                                                                % من الإجمالي
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                fontWeight={600}
                                                            >
                                                                {formatPrice(
                                                                    category.totalValue,
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ))}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* المزيد من الإحصائيات */}
                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Card className="rounded-5 shadow" sx={{ height: "100%" }}>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ mb: 3, fontWeight: 600 }}
                                        >
                                            📈 توزيع المنتجات خلال الأسبوع
                                        </Typography>
                                        <Box>
                                            {statistics.productsByDate.map(
                                                (item: ProductByDate, index: number) => (
                                                    <Box key={index} mb={2}>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            mb={0.5}
                                                        >
                                                            <Typography variant="body2">
                                                                {item.date}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                            >
                                                                {item.count} منتج
                                                            </Typography>
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={Math.min(
                                                                (item.count /
                                                                    Math.max(
                                                                        ...statistics.productsByDate.map(
                                                                            (p: ProductByDate) =>
                                                                                p.count,
                                                                        ),
                                                                        1
                                                                    )) *
                                                                100,
                                                                100,
                                                            )}
                                                            sx={{
                                                                height: 8,
                                                                borderRadius: 4,
                                                                bgcolor: alpha(
                                                                    theme.palette.primary
                                                                        .main,
                                                                    0.1,
                                                                ),
                                                            }}
                                                        />
                                                    </Box>
                                                ),
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card className="rounded-5 shadow" sx={{ height: "100%" }}>
                                    <CardContent>
                                        <Typography
                                            variant="h6"
                                            gutterBottom
                                            sx={{ mb: 3, fontWeight: 600 }}
                                        >
                                            🏆 أكثر الفئات شعبية
                                        </Typography>
                                        <Box>
                                            {statistics.topCategories.map(
                                                (cat: TopCategory, index: number) => (
                                                    <Box key={index} mb={2}>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            mb={0.5}
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={500}
                                                            >
                                                                {getCategoryName(
                                                                    cat.category,
                                                                )}
                                                            </Typography>
                                                            <Chip
                                                                label={`#${index + 1}`}
                                                                size="small"
                                                                color={
                                                                    index === 0
                                                                        ? "success"
                                                                        : index === 1
                                                                            ? "warning"
                                                                            : "default"
                                                                }
                                                            />
                                                        </Box>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                        >
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {cat.count} منتج
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {cat.likes} إعجاب
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                ),
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* أكثر المنتجات تفاعلاً */}
                        <Card className="rounded-5 shadow mt-5">
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{ mb: 3, fontWeight: 600 }}
                                >
                                    أكثر المنتجات تفاعلاً
                                </Typography>
                                {statistics.mostPopularProducts.length > 0 ? (
                                    <TableContainer
                                        component={Paper}
                                        elevation={0}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <Table>
                                            <TableHead
                                                sx={{
                                                    bgcolor: alpha(
                                                        theme.palette.primary.main,
                                                        0.05,
                                                    ),
                                                }}
                                            >
                                                <TableRow>
                                                    <TableCell width="5%"></TableCell>
                                                    <TableCell width="25%">
                                                        المنتج
                                                    </TableCell>
                                                    <TableCell align="center" width="15%">
                                                        البائع
                                                    </TableCell>
                                                    <TableCell align="center" width="15%">
                                                        الفئة
                                                    </TableCell>
                                                    <TableCell align="center" width="10%">
                                                        التفاعل
                                                    </TableCell>
                                                    <TableCell align="center" width="10%">
                                                        السعر
                                                    </TableCell>
                                                    <TableCell align="center" width="10%">
                                                        الحالة
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {statistics.mostPopularProducts.map(
                                                    (product: MostPopularProduct, index: number) => (
                                                        <TableRow key={product.id}>
                                                            <TableCell>
                                                                <Chip
                                                                    label={`#${index + 1}`}
                                                                    color={
                                                                        index === 0
                                                                            ? "success"
                                                                            : index === 1
                                                                                ? "warning"
                                                                                : index ===
                                                                                    2
                                                                                    ? "error"
                                                                                    : "default"
                                                                    }
                                                                    sx={{ fontWeight: 600 }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
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
                                                                                width: 40,
                                                                                height: 40,
                                                                                mr: 2,
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <Box>
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight={
                                                                                500
                                                                            }
                                                                        >
                                                                            {product.name}
                                                                        </Typography>
                                                                        <Box
                                                                            display="flex"
                                                                            alignItems="center"
                                                                            mt={0.5}
                                                                        >
                                                                            <ThumbUp
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    mr: 0.5,
                                                                                    color: "text.secondary",
                                                                                }}
                                                                            />
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                            >
                                                                                {
                                                                                    product.likes
                                                                                }
                                                                            </Typography>
                                                                            <Visibility
                                                                                sx={{
                                                                                    fontSize: 14,
                                                                                    ml: 2,
                                                                                    mr: 0.5,
                                                                                    color: "text.secondary",
                                                                                }}
                                                                            />
                                                                            <Typography
                                                                                variant="caption"
                                                                                color="text.secondary"
                                                                            >
                                                                                {
                                                                                    product.views
                                                                                }
                                                                            </Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                {product.seller.slug && (
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                        display="block"
                                                                    >
                                                                        @
                                                                        {
                                                                            product
                                                                                .seller
                                                                                .slug
                                                                        }
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={getCategoryName(
                                                                        product.category,
                                                                    )}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    alignItems="center"
                                                                >
                                                                    <Box
                                                                        display="flex"
                                                                        alignItems="center"
                                                                    >
                                                                        <ThumbUp
                                                                            sx={{
                                                                                fontSize: 16,
                                                                                mr: 0.5,
                                                                                color: "primary.main",
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight={
                                                                                600
                                                                            }
                                                                        >
                                                                            {
                                                                                product.likes
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                    <Box
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        mt={0.5}
                                                                    >
                                                                        <Visibility
                                                                            sx={{
                                                                                fontSize: 16,
                                                                                mr: 0.5,
                                                                                color: "text.secondary",
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                        >
                                                                            {
                                                                                product.views
                                                                            }
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={600}
                                                                    color="primary"
                                                                >
                                                                    {formatPrice(
                                                                        product.price,
                                                                    )}
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={getStatusLabel(
                                                                        product.status,
                                                                    )}
                                                                    color={getStatusColor(
                                                                        product.status,
                                                                    )}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box py={4} textAlign="center">
                                        <Typography color="text.secondary">
                                            لا توجد منتجات حتى الآن
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* أكثر البائعين نشاطاً */}
                        <Card className="rounded-5 shadow mt-5">
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{ mb: 3, fontWeight: 600 }}
                                >
                                    👑 أكثر البائعين نشاطاً
                                </Typography>
                                {statistics.topSellers.length > 0 ? (
                                    <TableContainer
                                        component={Paper}
                                        elevation={0}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        <Table>
                                            <TableHead
                                                sx={{
                                                    bgcolor: alpha(
                                                        theme.palette.primary.main,
                                                        0.05,
                                                    ),
                                                }}
                                            >
                                                <TableRow>
                                                    <TableCell width="5%"></TableCell>
                                                    <TableCell width="30%">
                                                        البائع
                                                    </TableCell>
                                                    <TableCell align="center" width="15%">
                                                        المنتجات
                                                    </TableCell>
                                                    <TableCell align="center" width="20%">
                                                        التفاعل
                                                    </TableCell>
                                                    <TableCell align="center" width="15%">
                                                        القيمة الإجمالية
                                                    </TableCell>
                                                    <TableCell align="center" width="15%">
                                                        الدور
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {statistics.topSellers.map(
                                                    (seller: TopSeller, index: number) => (
                                                        <TableRow key={seller._id}>
                                                            <TableCell>
                                                                <Chip
                                                                    label={`#${index + 1}`}
                                                                    color={
                                                                        index === 0
                                                                            ? "success"
                                                                            : index === 1
                                                                                ? "warning"
                                                                                : index ===
                                                                                    2
                                                                                    ? "error"
                                                                                    : "default"
                                                                    }
                                                                    sx={{ fontWeight: 600 }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                >
                                                                    <Avatar
                                                                        src={
                                                                            seller.avatar
                                                                        }
                                                                        alt={seller.name}
                                                                        sx={{
                                                                            width: 40,
                                                                            height: 40,
                                                                            mr: 2,
                                                                        }}
                                                                    >
                                                                        {seller.name.charAt(
                                                                            0,
                                                                        )}
                                                                    </Avatar>
                                                                    <Box>
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight={
                                                                                500
                                                                            }
                                                                        >
                                                                            {seller.name}
                                                                        </Typography>
                                                                        <Typography
                                                                            variant="caption"
                                                                            color="text.secondary"
                                                                        >
                                                                            {
                                                                                seller.productsCount
                                                                            }{" "}
                                                                            منتج
                                                                        </Typography>
                                                                    </Box>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={
                                                                        seller.productsCount
                                                                    }
                                                                    color="primary"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Box>
                                                                    <Box
                                                                        display="flex"
                                                                        alignItems="center"
                                                                        justifyContent="center"
                                                                    >
                                                                        <ThumbUp
                                                                            sx={{
                                                                                fontSize: 16,
                                                                                mr: 0.5,
                                                                                color: "primary.main",
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="body2"
                                                                            fontWeight={
                                                                                600
                                                                            }
                                                                        >
                                                                            {
                                                                                seller.totalLikes
                                                                            }
                                                                        </Typography>
                                                                        <Visibility
                                                                            sx={{
                                                                                fontSize: 16,
                                                                                ml: 2,
                                                                                mr: 0.5,
                                                                                color: "text.secondary",
                                                                            }}
                                                                        />
                                                                        <Typography
                                                                            variant="body2"
                                                                            color="text.secondary"
                                                                        >
                                                                            {seller.totalViews.toLocaleString()}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        متوسط:{" "}
                                                                        {Math.round(
                                                                            (seller.totalLikes +
                                                                                seller.totalViews) /
                                                                            seller.productsCount,
                                                                        )}
                                                                    </Typography>
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Typography
                                                                    variant="body2"
                                                                    fontWeight={600}
                                                                    color="primary"
                                                                >
                                                                    {formatPrice(
                                                                        seller.totalValue,
                                                                    )}
                                                                </Typography>
                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    {formatPrice(
                                                                        Math.round(
                                                                            seller.totalValue /
                                                                            seller.productsCount,
                                                                        ),
                                                                    )}{" "}
                                                                    متوسط
                                                                </Typography>
                                                            </TableCell>
                                                            <TableCell align="center">
                                                                <Chip
                                                                    label={seller.role}
                                                                    color={getRoleColor(
                                                                        seller.role,
                                                                    )}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Box py={4} textAlign="center">
                                        <Typography color="text.secondary">
                                            لا يوجد بائعين نشطين حتى الآن
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* إحصائيات مفصلة حسب الفئة */}
                        <Card className="rounded-5 shadow mt-5">
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    sx={{ mb: 3, fontWeight: 600 }}
                                >
                                    إحصائيات مفصلة حسب الفئة
                                </Typography>
                                <Grid container spacing={2}>
                                    {statistics.productsByCategory
                                        .slice(0, 6)
                                        .map((category: CategoryStats, index: number) => (
                                            <Grid
                                                size={{ xs: 12, sm: 6, md: 4 }}
                                                key={index}
                                            >
                                                <Card
                                                    variant="outlined"
                                                    sx={{ height: "100%" }}
                                                >
                                                    <CardContent>
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                            alignItems="center"
                                                            mb={1}
                                                        >
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight={600}
                                                            >
                                                                {getCategoryName(
                                                                    category.category,
                                                                )}
                                                            </Typography>
                                                            <Chip
                                                                label={`${category.count}`}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={category.percentage}
                                                            sx={{
                                                                height: 8,
                                                                mb: 2,
                                                                bgcolor: alpha(
                                                                    theme.palette.primary
                                                                        .main,
                                                                    0.1,
                                                                ),
                                                            }}
                                                        />
                                                        <Box
                                                            display="flex"
                                                            justifyContent="space-between"
                                                        >
                                                            <Typography
                                                                variant="body2"
                                                                color="text.secondary"
                                                            >
                                                                {category.percentage.toFixed(
                                                                    1,
                                                                )}
                                                                % من الإجمالي
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                fontWeight={600}
                                                            >
                                                                {formatPrice(
                                                                    category.totalValue,
                                                                )}
                                                            </Typography>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                </Grid>
                                {statistics.productsByCategory.length > 6 && (
                                    <Box mt={3} textAlign="center">
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            و {statistics.productsByCategory.length - 6}{" "}
                                            فئة أخرى
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        {/* ملخص إضافي */}
                        <Grid container spacing={3} sx={{ mt: 3 }}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card className="rounded-5 shadow">
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <MonetizationOn
                                                color="primary"
                                                sx={{ mr: 1 }}
                                            />
                                            <Typography variant="h6" sx={{ mb: 0 }}>
                                                قيمة الخصومات
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            color="primary"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {formatPrice(statistics.totalDiscountValue)}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <LocalOffer
                                                color="action"
                                                sx={{ mr: 1, fontSize: 20 }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                إجمالي قيمة التخفيضات
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card className="rounded-5 shadow">
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <TrendingUp color="success" sx={{ mr: 1 }} />
                                            <Typography variant="h6" sx={{ mb: 0 }}>
                                                متوسط التفاعل
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            color="success"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {statistics.averageLikesPerProduct.toFixed(1)}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <ThumbUp
                                                color="action"
                                                sx={{ mr: 1, fontSize: 20 }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                متوسط الإعجابات لكل منتج
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card className="rounded-5 shadow">
                                    <CardContent>
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <AccessTime color="warning" sx={{ mr: 1 }} />
                                            <Typography variant="h6" sx={{ mb: 0 }}>
                                                نشاط اليوم
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="h4"
                                            color="warning"
                                            fontWeight="bold"
                                            gutterBottom
                                        >
                                            {statistics.newProductsToday +
                                                statistics.newUsersToday}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <ShoppingCart
                                                color="action"
                                                sx={{ mr: 1, fontSize: 20 }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                {statistics.newProductsToday} منتج +{" "}
                                                {statistics.newUsersToday} مستخدم
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* ملاحظات وتحليلات */}
                        <Card
                            className="rounded-5 shadow mt-5"
                            sx={{ bgcolor: alpha(theme.palette.info.main, 0.05) }}
                        >
                            <CardContent>
                                <Typography variant="h6" gutterBottom color="info.main">
                                    📝 تحليلات وملاحظات
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box>
                                            <Typography variant="body2" paragraph>
                                                <strong>التحليل:</strong> المنصة تحتوي على{" "}
                                                <strong>
                                                    {statistics.totalProducts}
                                                </strong>{" "}
                                                منتج بقيمة إجمالية تبلغ{" "}
                                                <strong>
                                                    {formatPrice(
                                                        statistics.totalProductValue,
                                                    )}
                                                </strong>
                                                .
                                            </Typography>
                                            <Typography variant="body2" paragraph>
                                                <strong>التفاعل:</strong> هناك{" "}
                                                <strong>
                                                    {statistics.totalLikes.toLocaleString()}
                                                </strong>{" "}
                                                إعجاب و{" "}
                                                <strong>
                                                    {statistics.totalViews.toLocaleString()}
                                                </strong>{" "}
                                                مشاهدة على المنتجات.
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>النشاط:</strong> تم إضافة{" "}
                                                <strong>
                                                    {statistics.newProductsToday}
                                                </strong>
                                                منتج و
                                                <strong>
                                                    {statistics.newUsersToday}
                                                </strong>
                                                مستخدم جديد اليوم.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Box>
                                            <Typography gap={3} variant="body2">
                                                <strong style={{ margin: 1 }}>
                                                    المستخدمون:
                                                </strong>
                                                يوجد
                                                <strong>
                                                    {statistics.activeSellers}
                                                </strong>
                                                مستخدم نشط من أصل
                                                <strong>{statistics.totalUsers}</strong>
                                                مستخدم.
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>الفئات:</strong> أكثر الفئات
                                                نشاطاً هي
                                                <strong>
                                                    {statistics.topCategories.length > 0
                                                        ? getCategoryName(
                                                            statistics
                                                                .topCategories[0]
                                                                .category,
                                                        )
                                                        : "-"}
                                                </strong>
                                                بعدد
                                                {statistics.topCategories.length > 0
                                                    ? statistics.topCategories[0].count
                                                    : 0}
                                                منتج.
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>معدل النمو:</strong> متوسط سعر
                                                المنتج{" "}
                                                <strong>
                                                    {formatPrice(
                                                        statistics.averageProductPrice,
                                                    )}
                                                </strong>{" "}
                                                ومتوسط التفاعل{" "}
                                                <strong>
                                                    {statistics.averageLikesPerProduct.toFixed(
                                                        1,
                                                    )}
                                                </strong>{" "}
                                                إعجاب لكل منتج.
                                            </Typography>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box
                                    mt={2}
                                    pt={2}
                                    borderTop={`1px solid ${alpha(theme.palette.divider, 0.1)}`}
                                >
                                    <Typography variant="caption" color="text.secondary">
                                        آخر تحديث: {new Date().toLocaleString("ar-EG")}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>

            <style>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </>
    );
};

export default WebSiteAdmins;