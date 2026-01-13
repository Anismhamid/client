import {FunctionComponent, useEffect, useRef, useState} from "react";
import {deleteUserById, getUserById} from "../../services/usersServices";
import {useNavigate, useParams} from "react-router-dom";
import {
	Accordion,
	Button,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Skeleton,
	List,
	ListItem,
	ListItemText,
	Box,
	ListItemIcon,
	Stack,
	Card,
	CardContent,
	Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {path} from "../../routes/routes";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useToken from "../../hooks/useToken";
import Loader from "../../atoms/loader/Loader";
import {useUser} from "../../context/useUSer";
import {emptyAuthValues} from "../../interfaces/authValues";
import DeleteAccountBox from "../../atoms/userManage/DeleteAccountBox";
import UserDetailTable from "../../atoms/userManage/UesrDetailsTable";
import EditUserData from "../../atoms/userManage/EditUserData";
import HistoryIcon from "@mui/icons-material/History";
import {getAllOrders, getUserOrders} from "../../services/orders";
import {formatPrice} from "../../helpers/dateAndPriceFormat";
import {Order} from "../../interfaces/Order";
import RoleType from "../../interfaces/UserType";

interface ProfileProps {}
/**
 * profile
 * @returns auth profile
 */
const Profile: FunctionComponent<ProfileProps> = () => {
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const {decodedToken, setAfterDecode} = useToken();
	const {setAuth, setIsLoggedIn, auth} = useUser();
	const detailsRef = useRef<HTMLDivElement>(null);
	const [userOdredsLength, setUserOrdersLength] = useState<number>(0);
	const [userOdredsPrice, setUserOrdersPrice] = useState<number>(0);
	const [allOrders, setAllOrders] = useState<Order[]>([]);

	const [user, setUser] = useState<{
		name: {first: string; last: string};
		phone: {phone_1: string; phone_2: string};
		address: {
			city: string;
			street: string;
			houseNumber: string;
		};
		email: string;
		image: {url: string; alt: string};
		role: string;
		status: string;
		activity: string[];
	}>({
		name: {first: "", last: ""},
		phone: {phone_1: "", phone_2: ""},
		address: {city: "", street: "", houseNumber: ""},
		email: "",
		image: {url: "", alt: ""},
		role: "",
		status: "",
		activity: [],
	});

	const {id} = useParams();
	// useEffect(() => {
	// 	if (id) getUserById(id).then(setUser);
	// }, [id]);

	const updateProfile = () => {
		detailsRef.current?.scrollIntoView({behavior: "smooth"});
	};

	const changePassword = () => {
		// Navigate to the change password page
		// navigate(path.ChangePassword);
	};

	const contactSupport = () => {
		navigate(path.Contact);
	};

	useEffect(() => {
		const targetId = id || decodedToken?._id;
		if (targetId) {
			Promise.all([getUserById(targetId), getUserOrders(targetId)])
				.then(([userRes, ordersRes]) => {
					setUser(userRes);
					setUserOrdersLength(ordersRes.length);
					setUserOrdersPrice(
						ordersRes.reduce((totalOrders, order) => {
							// مجموع أسعار منتجات الطلب الحالي
							const orderTotal = order.products.reduce(
								(sum, product) => sum + product.product_price,
								0,
							);
							return totalOrders + orderTotal;
						}, 0),
					);
				})
				.catch((err) => console.error("Error fetching user data:", err))
				.finally(() => setLoading(false));
		}
	}, [id, decodedToken]);

	useEffect(() => {
		if (auth.role === RoleType.Admin || auth.role === RoleType.Moderator) {
			getAllOrders().then((ord) => setAllOrders(ord));
		}
	}, [auth.role]);

	const totalCommission = allOrders.reduce((sum, order) => {
		return sum + (order.commission || 0);
	}, 0);

	if (loading) {
		return <Loader />;
	}

	function handleDeleteAccount() {
		deleteUserById(decodedToken._id).then(() => {
			localStorage.removeItem("token");
			setAuth(emptyAuthValues);
			setIsLoggedIn(false);
			setAfterDecode(null);
			navigate(path.Home);
		});
	}

	return (
		<main className=' min-vh-100 py-5'>
			{/* صورة البروفايل */}
			<Box className='container d-flex flex-column align-items-center'>
				<div
					className='border border-3 border-primary-subtle rounded-circle shadow overflow-hidden'
					style={{width: 200, height: 200}}
				>
					{!imageLoaded && (
						<Skeleton
							sx={{bgcolor: "grey.300"}}
							variant='circular'
							width={200}
							height={200}
						/>
					)}

					{user && (
						<Avatar
							className='w-100 h-100'
							src={user?.image?.url || "https://i.ibb.co/5GzXkwq/user.png"}
							alt={
								user.image?.alt?.trim()
									? `${user.image?.alt}'s avatar`
									: `${user.name?.first || "משתמש"}'s avatar`
							}
							role='img'
							sx={{
								objectFit: "cover",
								display: imageLoaded ? "block" : "none",
							}}
							onLoad={() => setImageLoaded(true)}
						/>
					)}
				</div>
				{/* زر تحرير */}
				<Button
					variant='contained'
					color='warning'
					startIcon={<EditIcon />}
					onClick={() => updateProfile()}
					className='mt-3 rounded-pill shadow-sm px-4'
				>
					تحرير البيانات الشخصية
				</Button>
			</Box>
			{/* بيانات المستخدم */}
			<div className='container mt-5'>
				<Card className='shadow-lg rounded-4'>
					<CardContent>
						<Typography
							variant='h4'
							align='center'
							gutterBottom
							className='fw-bold text-primary'
						>
							البيانات الشخصية
						</Typography>
						<UserDetailTable user={user} />
					</CardContent>
				</Card>
			</div>
			{/* الطلبات */}
			<Box className='container mt-5'>
				{/* {(auth.role === "Admin" || auth.role === "Moderator") && (
					<Card className='my-5 rounded-5 shadow'>
						<CardContent>
							<Typography variant='body1' fontSize={20} component={"p"}>
								عدد الطلبات على الموقع:{" "}
								<strong>{allOrders.length}</strong>
							</Typography>
							<Typography
								textAlign={"center"}
								fontSize={25}
								component={"p"}
								variant='body1'
							>
								إجمالي العمولة لصاحب الموقع:
								<strong>{formatPrice(totalCommission)}</strong>
							</Typography>
						</CardContent>
					</Card>
				)} */}
				<Card className='shadow-sm rounded-4 border border-2 border-danger-subtle'>
					<CardContent>
						<Typography
							variant='h4'
							align='center'
							gutterBottom
							className='fw-bold text-danger'
						>
							الطلبات السابقة
						</Typography>

						<Box className='d-flex justify-content-around flex-wrap gap-4 mt-4'>
							<Card
								className='shadow-sm rounded-4'
								sx={{minWidth: 250, flex: 1, textAlign: "center"}}
							>
								<CardContent>
									<Typography variant='h6' color='text.secondary'>
										عدد الطلبات
									</Typography>
									<Typography variant='h4' color='error'>
										{userOdredsLength}
									</Typography>
									<Button
										variant='outlined'
										color='info'
										className='mt-3 rounded-pill'
										onClick={() =>
											navigate(
												`${path.CompleteOrders}?userId=${decodedToken._id}`,
											)
										}
									>
										مزيد من التفاصيل
									</Button>
								</CardContent>
							</Card>

							<Card
								className='shadow-sm rounded-4'
								sx={{minWidth: 250, flex: 1, textAlign: "center"}}
							>
								<CardContent>
									<Typography variant='h6' color='text.secondary'>
										إجمالي المشتريات على الموقع
									</Typography>
									<Typography variant='h4' color='success.main'>
										{formatPrice(userOdredsPrice)}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					</CardContent>
				</Card>
			</Box>
			{/* سجل الدخول */}
			<Box className='container mt-5'>
				<Accordion className='shadow-sm rounded-4'>
					<AccordionSummary expandIcon={<ArrowDownwardIcon />}>
						<Typography component='span' variant='h6' className='fw-bold'>
							سِجِل تَسجيل الدُلخول
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{user.activity?.length ? (
							<List dense>
								{user.activity
									.slice(user.activity.length - 1)
									.map((timestamp, index) => {
										const date = new Date(timestamp);
										return (
											<ListItem
												key={index}
												className='rounded-3 shadow-sm mb-2'
											>
												<ListItemIcon>
													<HistoryIcon color='primary' />
												</ListItemIcon>
												<ListItemText
													primary={date.toLocaleString("he-IL")}
													secondary='نشاط حديث'
												/>
											</ListItem>
										);
									})}
							</List>
						) : (
							<Typography sx={{padding: 2}} color='text.secondary'>
								لا يوجد نشاطات حديثة
							</Typography>
						)}
					</AccordionDetails>
				</Accordion>
			</Box>
			{/* أزرار إضافية */}
			<Box className='container text-center mt-5'>
				<Stack spacing={2} direction='row' justifyContent='center'>
					<Button
						variant='contained'
						color='success'
						onClick={changePassword}
						className='rounded-pill mx-3'
					>
						تغيير كلمة المرور
					</Button>
					<Button
						variant='contained'
						color='secondary'
						onClick={contactSupport}
						className='rounded-pill mx-5'
					>
						دعم فني
					</Button>
				</Stack>
			</Box>
			<Box ref={detailsRef}>
				<EditUserData userId={id || decodedToken._id} />
			</Box>

			{/* حذف الحساب */}
			<div className='container mt-5'>
				<DeleteAccountBox onDelete={handleDeleteAccount} />
			</div>
		</main>
	);
};

export default Profile;
