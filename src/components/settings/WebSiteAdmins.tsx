import {FunctionComponent, useEffect, useState} from "react";

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
} from "@mui/material";
import {
	TrendingUp,
	People,
	ShoppingCart,
	MonetizationOn,
	// CalendarToday,
} from "@mui/icons-material";
import {useUser} from "../../context/useUSer";
import {Products} from "../../interfaces/Products";
import {getAllUsers} from "../../services/usersServices";
import {getAllProducts} from "../../services/productsServices";
import {User} from "../../interfaces/usersMessages";
import {Helmet} from "react-helmet";

interface WebSiteAdminsProps {}

const WebSiteAdmins: FunctionComponent<WebSiteAdminsProps> = () => {
	const {auth} = useUser();
	const [users, setUsers] = useState<User[]>([]);
	const [products, setProducts] = useState<Products[]>([]);
	const [timeFrame, setTimeFrame] = useState<string>("today");

	useEffect(() => {
		if (auth.role !== "Admin" && auth.role !== "Moderator") return;
		// جلب جميع البيانات
		Promise.all([getAllUsers(), getAllProducts()])
			.then(([usersRes, productsRes]) => {
				setUsers(usersRes);
				setProducts(productsRes);
			})
			.catch((err) => console.log(err));
	}, [auth]);

	// حساب مبيعات اليوم/الشهر حسب الفترة المحددة
	const now = new Date();
	const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	// حساب المستخدمين الجدد
	const newUsersToday = users.filter(
		(user) => new Date(user.createdAt || now) >= todayStart,
	).length;

	const newUsersMonth = users.filter(
		(user) => new Date(user.createdAt || now) >= monthStart,
	).length;

	if (auth.role !== "Admin" && auth.role !== "Moderator") {
		return (
			<Box component={"main"} className='container mt-5 text-center'>
				<Typography variant='h4' color='error'>
					غير مصرح لك بالوصول إلى هذه الصفحة
				</Typography>
			</Box>
		);
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم الإدارة | صفقة</title>
				<meta name='description' content={"لوحة تحكم الإدارة | صفقة"} />
			</Helmet>
			<main className='container-fluid my-5'>
				<Typography
					variant='h3'
					component='h1'
					gutterBottom
					align='center'
					className='mb-5'
				>
					لوحة تحكم الإدارة
				</Typography>

				{/* فلترة الوقت */}
				<Box display='flex' justifyContent='flex-end' mb={3}>
					<FormControl sx={{minWidth: 120}}>
						<InputLabel>الفترة</InputLabel>
						<Select
							value={timeFrame}
							label='الفترة'
							onChange={(e) => setTimeFrame(e.target.value)}
						>
							<MenuItem value='today'>اليوم</MenuItem>
							<MenuItem value='month'>هذا الشهر</MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* بطاقات الإحصائيات */}
				<Grid container spacing={3}>
					<Grid size={{xs: 12, md: 6, lg: 3}}>
						<Card className='rounded-5 shadow' sx={{bgcolor: "#e3f2fd"}}>
							<CardContent>
								<Box display='flex' alignItems='center'>
									<MonetizationOn
										color='primary'
										sx={{fontSize: 40, m: 5}}
									/>
									<Box>
										<Typography
											variant='h6'
											color='primary'
											component='p'
										>
											المبيعات
										</Typography>
										<Typography
											variant='h5'
											component='p'
											fontWeight='bold'
											sx={{color: "black"}}
										>
											{/* {formatPrice(
											timeFrame === "today"
												? todaySales
												: monthSales,
										)} */}
											todaySales,monthSales
										</Typography>
										<Typography variant='body2' color='gray'>
											{timeFrame === "today"
												? "مبيعات اليوم"
												: "مبيعات الشهر"}
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{xs: 12, md: 6, lg: 3}}>
						<Card
							className='rounded-5 shadow'
							sx={{bgcolor: "#e8f5e9", color: "black"}}
						>
							<CardContent>
								<Box display='flex' alignItems='center'>
									<TrendingUp
										color='success'
										sx={{fontSize: 40, m: 5}}
									/>
									<Box>
										<Typography
											variant='h6'
											color='primary'
											component='p'
										>
											العمولة
										</Typography>
										<Typography
											variant='h5'
											component='p'
											fontWeight='bold'
											sx={{color: "black"}}
										>
											{/* {formatPrice(
											timeFrame === "today"
												? todayCommission
												: monthCommission,
										)} */}
											todayCommission, monthCommission
										</Typography>
										<Typography variant='body2' color='gray'>
											{timeFrame === "today"
												? "عمولة اليوم"
												: "عمولة الشهر"}
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{xs: 12, md: 6, lg: 3}}>
						<Card
							className='rounded-5 shadow'
							sx={{bgcolor: "#fff3e0", px: 5}}
						>
							<CardContent>
								<Box display='flex' alignItems='center'>
									<People
										color='warning'
										sx={{m: 5, fontSize: 40, mr: 1}}
									/>
									<Box>
										<Typography
											variant='h6'
											color='primary'
											component='p'
										>
											المستخدمون الجدد
										</Typography>
										<Typography
											variant='h5'
											component='p'
											fontWeight='bold'
											sx={{color: "black"}}
										>
											{timeFrame === "today"
												? newUsersToday
												: newUsersMonth}
										</Typography>
										<Typography variant='body2' color='gray'>
											{timeFrame === "today"
												? "مستخدم جديد اليوم"
												: "مستخدم جديد هذا الشهر"}
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{xs: 12, md: 6, lg: 3}}>
						<Card className='rounded-5 shadow' sx={{bgcolor: "#fbe9e7"}}>
							<CardContent>
								<Box display='flex' alignItems='center'>
									<ShoppingCart
										color='error'
										sx={{m: 5, fontSize: 40, margin: 5}}
									/>
									<Box>
										<Typography
											variant='h6'
											component='p'
											color='primary'
										>
											إجمالي المنتجات على الموقع
										</Typography>
										<Typography
											variant='h5'
											component='p'
											fontWeight='bold'
											sx={{color: "black"}}
										>
											{products.length}
										</Typography>
										<Typography variant='body2' color='gray'>
											عدد الطلبات الكلي
										</Typography>
									</Box>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* إجمالي المبيعات والعمولة */}
				<Grid container spacing={3} sx={{mt: 1}}>
					<Grid size={{xs: 12, md: 6}}>
						<Card className='rounded-5 shadow mt-4'>
							<CardContent>
								<Typography variant='h6' gutterBottom>
									إجمالي المبيعات
								</Typography>
								<Typography
									variant='h4'
									color='primary'
									fontWeight='bold'
								>
									{/* {formatPrice(totalSales)} */}
									totalSales
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									القيمة الإجمالية للمنتجات المباعة
								</Typography>
							</CardContent>
						</Card>
					</Grid>

					<Grid size={{xs: 12, md: 6}}>
						<Card className='rounded-5 shadow mt-4'>
							<CardContent>
								<Typography variant='h6' gutterBottom>
									إجمالي العمولة
								</Typography>
								<Typography
									variant='h4'
									color='secondary'
									fontWeight='bold'
								>
									{/* {formatPrice(totalCommission)} */}
									totalCommission
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									إجمالي عمولة الموقع
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* أكثر المنتجات مبيعاً */}
				<Card className='rounded-5 shadow mt-5'>
					<CardContent>
						<Typography variant='h5' gutterBottom>
							أكثر المنتجات مبيعاً
						</Typography>
						{/* <TableContainer component={Paper} elevation={0}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>المنتج</TableCell>
									<TableCell align='center'>الكمية المباعة</TableCell>
									<TableCell align='center'>الترتيب</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{topSellingProducts.map((product, index) => (
									<TableRow key={index}>
										<TableCell>
											<Box display='flex' alignItems='center'>
												{product.image && (
													<Box
														component='img'
														src={product.image}
														alt={product.name}
														sx={{
															width: 40,
															height: 40,
															borderRadius: 1,
															mr: 2,
														}}
													/>
												)}
												<Typography>{product.name}</Typography>
											</Box>
										</TableCell>
										<TableCell align='center'>
											<Chip
												label={product.quantity}
												color='primary'
											/>
										</TableCell>
										<TableCell align='center'>
											<Chip
												label={`#${index + 1}`}
												color={
													index === 0
														? "success"
														: index === 1
															? "secondary"
															: index === 2
																? "warning"
																: "default"
												}
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer> */}
					</CardContent>
				</Card>
			</main>
		</>
	);
};

export default WebSiteAdmins;
