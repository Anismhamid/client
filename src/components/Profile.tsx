import {FunctionComponent, useEffect, useState} from "react";
import {getUserById} from "../services/usersServices";
import RoleType from "../interfaces/UserType";
import {useNavigate} from "react-router-dom";
import {
	Accordion,
	Button,
	AccordionSummary,
	AccordionDetails,
	Typography,
	Skeleton,
} from "@mui/material";
import {path} from "../routes/routes";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import useToken from "../hooks/useToken";
import Loader from "../atoms/loader/Loader";

interface ProfileProps {}
/**
 * profile
 * @returns auth profile
 */
const Profile: FunctionComponent<ProfileProps> = () => {
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const {decodedToken} = useToken();

	const [user, setUser] = useState<{
		name: {first: string; last: string};
		phone: {phone_1: string; phone_2: string};
		address: {city: string; street: string; houseNumber?: string};
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
		// Logic to update the profile
		console.log("Updating profile...");
		navigate(path.CompleteProfile);
	};

	const changePassword = () => {
		// Navigate to the change password page
		// navigate(path.ChangePassword);
	};

	const contactSupport = () => {
		// Logic to handle contacting support
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

	return (
		<main className='min-vh-100'>
			<div className='container'>
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
							src={user.image.url}
							alt={
								user.image.alt
									? `${user.image?.alt}'s avatar`
									: `${user.name.first ?? "User"}'s avatar`
							}
							role='img'
							style={imageLoaded ? {} : {display: "none"}}
							width={200}
							onLoad={() => setImageLoaded(true)}
						/>
					</>

					<hr />
				</div>
				<div className='text-center my-4'>
					<Button
						variant='contained'
						color='warning'
						// Edit Profile
						onClick={updateProfile}
					>
						עריכת פרטים אישיים
					</Button>
				</div>
			</div>
			<div className='container table-responsive m-auto text-center my-5 rounded p-3 bg-gradient'>
				<div className=' fw-bold display-6 p-2'>פרים אישיים</div>
				<table className='table table-striped-columns'>
					<tbody>
						<tr>
							<th>שם מלא</th>
							<td>
								{user.name?.first} {user.name?.last}
							</td>
						</tr>
						<tr>
							<th>טלפון ראשי</th>
							<td>{user.phone?.phone_1 || "-"}</td>
						</tr>
						<tr>
							<th>טלפון נוסף</th>
							<td>{user.phone?.phone_2 || "-"}</td>
						</tr>
						<tr>
							<th>דו"אל</th>
							<td>{user.email}</td>
						</tr>
						<tr>
							<th>סוג חשבון</th>
							<td className='text-success fw-bold'>
								{user.role === RoleType.Admin
									? "מנהל ומנחה"
									: user.role === RoleType.Moderator
										? "מנחה"
										: user.role
											? "לקוח"
											: "—"}
							</td>
						</tr>
					</tbody>
				</table>

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
											currency: "ILs",
										})}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div className='row m-auto text-center'>
				{/* 1 */}
				<div>
					<Accordion
						sx={{
							color: "CaptionText",
							bgcolor: "AppWorkspace",
						}}
					>
						<AccordionSummary
							expandIcon={<ArrowDownwardIcon />}
							aria-controls='panel1-content'
							id='panel1-header'
						>
							<Typography component='span'>היסטורייה התחברות</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography style={{whiteSpace: "pre-line"}}>
								{user.activity?.length
									? user.activity
											.map((timestamp) =>
												new Date(timestamp).toLocaleString(
													"he-IL",
													{
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													},
												),
											)
											.join("\n")
									: "אין נתוני התחברות"}
							</Typography>
						</AccordionDetails>
					</Accordion>
				</div>
			</div>
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
		</main>
	);
};

export default Profile;
