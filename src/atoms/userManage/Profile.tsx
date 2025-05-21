import {FunctionComponent, useEffect, useRef, useState} from "react";
import {deleteUserById, getUserById} from "../../services/usersServices";
import {useNavigate} from "react-router-dom";
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {path} from "../../routes/routes";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useToken from "../../hooks/useToken";
import Loader from "../loader/Loader";
import {useUser} from "../../context/useUSer";
import {emptyAuthValues} from "../../interfaces/authValues";
import DeleteAccountBox from "./DeleteAccountBox";
import UserDetailTable from "./UesrDetailsTable";
import EditUserData from "./EditUserData";
import TodayIcon from "@mui/icons-material/Today";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HistoryIcon from "@mui/icons-material/History";

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
	const {setAuth, setIsLoggedIn} = useUser();
	const detailsRef = useRef<HTMLDivElement>(null);

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
		if (decodedToken) {
			getUserById(decodedToken._id)
				.then((res) => {
					setUser(res);
				})
				.catch((err) => {
					console.error("Error fetching user:", err);
				})
				.finally(() => setLoading(false));
		}
	}, [decodedToken]);

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
		<main>
			<div className='container mt-5 border-top border-bottom py-4'>
				<div>
					<>
						{!imageLoaded && (
							<Skeleton
								sx={{bgcolor: "grey.900"}}
								variant='rectangular'
								width={200}
								height={118}
							/>
						)}
						<img
							className='border border-light rounded'
							src={
								user.image.url ||
								"https://media2.giphy.com/media/l0MYO6VesS7Hc1uPm/200.webp?cid=ecf05e47hxvvpx851ogwi8s26zbj1b3lay9lke6lzvo76oyx&ep=v1_gifs_search&rid=200.webp&ct=g"
							}
							alt={
								user.image.alt?.trim()
									? `${user.image.alt}'s avatar`
									: `${user.name.first ?? "משתמש"}'s avatar`
							}
							role='img'
							style={imageLoaded ? {} : {display: "none"}}
							height={250}
							onLoad={() => setImageLoaded(true)}
						/>
					</>
				</div>
			</div>
			<div className='text-center my-4'>
				<Button
					variant='contained'
					color='warning'
					startIcon={<EditIcon />}
					onClick={updateProfile}
				>
					עריכת פרטים אישיים
				</Button>
			</div>
			<div className='container table-responsive m-auto text-center my-5 rounded p-3 bg-gradient'>
				<div className=' fw-bold display-6 p-2'>פרטים אישיים</div>
				<UserDetailTable user={user} />

				<div className=' m-auto text-center mt-5 w-100'>
					<div className='table-responsive m-auto text-center my-5 rounded p-3 bg-gradient'>
						<div className=' fw-bold display-6 p-2'>הזמנות קודמות</div>
						<table className='table table-striped-columns'>
							<tbody>
								<tr className=' bg-danger-subtle'>
									<th>מ"ס הזמנות</th>
									<td>
										<span className='fw-bold'>10</span>
										<Button
											onClick={() => {
												navigate(`${path.MyOrders}`);
											}}
											className='ms-5 border border-info'
										>
											פרטים נוספים
										</Button>
									</td>
								</tr>
								<tr>
									<th>ס"כ קניות באתר</th>
									<td>
										{(2500).toLocaleString("he-IL", {
											style: "currency",
											currency: "ILS",
										})}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className=' '>
				{/* 1 */}

				<Accordion className='accordion'>
					<AccordionSummary
						expandIcon={<ArrowDownwardIcon />}
						aria-controls='panel1-content'
						id='panel1-header'
					>
						<Typography component='span'>
							היסטוריית התחברות (5 ימים אחרונים)
						</Typography>
					</AccordionSummary>

					<AccordionDetails>
						{user.activity?.length ? (
							(() => {
								const now = new Date();
								const fiveDaysAgo = new Date();
								fiveDaysAgo.setDate(now.getDate() - 5);

								const recentActivity = user.activity.filter(
									(timestamp) => {
										const activityDate = new Date(timestamp);
										return activityDate >= fiveDaysAgo;
									},
								);

								return recentActivity.length ? (
									<List dense>
										{recentActivity.map((timestamp, index) => {
											const date = new Date(timestamp);
											const year = date.toLocaleString("he-IL", {
												year: "numeric",
											});
											const month = date.toLocaleString("he-IL", {
												month: "long",
											});
											const day = date.toLocaleString("he-IL", {
												day: "numeric",
											});
											const time = date.toLocaleString("he-IL", {
												hour: "2-digit",
												minute: "2-digit",
											});

											// קביעת הסגנון והאייקון לפי ההבדל בתאריך
											const isToday =
												date.toDateString() ===
												now.toDateString();
											const isThisWeek =
												date >= fiveDaysAgo && !isToday;

											let icon = <HistoryIcon />;
											let color = "text.secondary";

											if (isToday) {
												icon = <TodayIcon color='success' />;
												color = "success.main";
											} else if (isThisWeek) {
												icon = <AccessTimeIcon color='primary' />;
												color = "primary.main";
											}

											return (
												<ListItem
													key={index}
													sx={{height: 60}}
													className='accordion-item'
												>
													<ListItemIcon>{icon}</ListItemIcon>
													<ListItemText
														primary={
															<Box
																display='flex'
																alignItems='center'
																justifyContent='space-around'
																width='100%'
																color={color}
															>
																<Typography>
																	{year}
																</Typography>
																<Typography>
																	{month}
																</Typography>
																<Typography>
																	{day}
																</Typography>
																<Typography>
																	{time}
																</Typography>
															</Box>
														}
													/>
												</ListItem>
											);
										})}
									</List>
								) : (
									<Typography sx={{padding: 2}}>
										אין התחברויות ב־5 ימים האחרונים
									</Typography>
								);
							})()
						) : (
							<Typography sx={{padding: 2}}>אין נתוני התחברות</Typography>
						)}
					</AccordionDetails>
				</Accordion>
			</div>
			<Box ref={detailsRef}>
				<EditUserData userId={decodedToken._id} />
			</Box>

			<div className='text-center my-4'>
				<Button variant='contained' color='primary' onClick={changePassword}>
					שינוי סיסמה
				</Button>
			</div>

			<div className='text-center my-4'>
				<Button variant='contained' color='secondary' onClick={contactSupport}>
					צור קשר עם תמיכה
				</Button>
			</div>
			<DeleteAccountBox onDelete={handleDeleteAccount} />
		</main>
	);
};

export default Profile;
