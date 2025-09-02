import {FunctionComponent, useEffect, useState} from "react";
import {useUser} from "../../context/useUSer";
import {Order} from "../../interfaces/Order";
import {getAllOrders} from "../../services/orders";
import {Box, Typography} from "@mui/material";

interface WebSiteAdminsProps {}

const WebSiteAdmins: FunctionComponent<WebSiteAdminsProps> = () => {
	const {auth} = useUser();
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		if (auth.role !== "Admin") return;
		getAllOrders()
			.then((res) => setOrders(res))
			.catch((err) => console.log(err));
	}, [auth]);

	return (
		<>
			Website Admins
			<h1>
				{orders.map((commition) => (
					<Box>
						<Typography>
							{commition.commission ? commition.commission : 0}
						</Typography>
					</Box>
				))}
			</h1>
		</>
	);
};

export default WebSiteAdmins;
