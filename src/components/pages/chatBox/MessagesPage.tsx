import {useState} from "react";
import {Grid, Box, Paper, Typography} from "@mui/material";
import ChatList from "./ChatList";
import ChatBox from "./ChatBox";
import {UserMessage} from "../../../interfaces/usersMessages";
import {useUser} from "../../../context/useUSer";
import Loader from "../../../atoms/loader/Loader";

const MessagesPage = () => {
	const [selectedUser, setSelectedUser] = useState<UserMessage | null>(null);
	const {auth} = useUser();


	if (!auth) return <Loader />;

	const currentUser = {
		_id: auth._id as string,
		name: auth.name.first,
		email: auth.email as string,
		role: auth.role as string,
	};



	return (
		<Box sx={{height: "calc(100vh - 100px)", p: 2}}>
			<Grid container spacing={2} sx={{height: "100%"}}>
				<Grid size={{xs: 12, md: 4}} sx={{height: "100%"}}>
					<ChatList
						currentUser={currentUser}
						token={localStorage.getItem("token") as string}
						onSelectChat={setSelectedUser}
						selectedUserId={selectedUser?._id}
					/>
				</Grid>

				<Grid size={{xs: 12, md: 8}} sx={{height: "100%"}}>
					{selectedUser ? (
						<ChatBox
							currentUser={currentUser}
							otherUser={{
								_id: selectedUser._id || "unknown-id",
								from: {
									first: selectedUser.from?.first || "Unknown",
									last: selectedUser.from?.last || "",
									email: selectedUser.from?.email || "",
									role: selectedUser.from?.role || "Client",
								},
							}}
							token={localStorage.getItem("token") as string}
						/>
					) : (
						<Paper
							elevation={3}
							sx={{
								height: "100%",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 2,
								bgcolor: "#f5f5f5",
							}}
						>
							<Box sx={{textAlign: "center"}}>
								<Typography
									variant='h6'
									color='text.secondary'
									gutterBottom
								>
									👋 Select a conversation
								</Typography>
								<Typography variant='body2' color='text.secondary'>
									Choose a chat from the list to start messaging
								</Typography>
							</Box>
						</Paper>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default MessagesPage;
