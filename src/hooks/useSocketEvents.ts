import {useEffect} from "react";
// import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {showNewProductToast} from "../atoms/bootStrapToast/SocketToast";
import {showInfo} from "../atoms/toasts/ReactToast";
import {useUser} from "../context/useUSer";
import {UserRegister} from "../interfaces/User";
import RoleType from "../interfaces/UserType";
import socket from "../socket/globalSocket";
import useNotificationSound from "./useNotificationSound";
import {Products} from "../interfaces/Products";

const useSocketEvents = () => {
	const {auth} = useUser();
	const navigate = useNavigate();
	// const {t} = useTranslation();
	const {playNotificationSound, showNotification} = useNotificationSound();

	useEffect(() => {
		if (!auth) return;

		const isAdminOrModerator =
			auth.role === RoleType.Admin || auth.role === RoleType.Moderator;

		// הגדרת נתוני התחברות
		socket.auth = {
			userId: auth._id,
			role: auth.role,
			name: auth.name?.first,
			withCredentials: true,
		};

		// התחברות אם לא מחובר
		if (!socket.connected) {
			socket.connect();
			console.log("Connecting socket...");
		}

		// התחברות לחדר אדמין
		const handleConnect = () => {
			console.log("Socket connected!");
			if (isAdminOrModerator) {
				socket.emit("admins", {
					userId: auth._id,
					role: auth.role,
				});
			}
		};

		// הודעת שגיאה
		const handleError = (error: any) => {
			console.error("Socket error:", error);
		};

		// ניתוק
		const handleDisconnect = (reason: any) => {
			console.warn("Socket disconnected:", reason);
			setTimeout(() => {
				if (!socket.connected) {
					console.log("Attempting to reconnect...");
					socket.connect();
				}
			}, 1000);
		};

		// הזמנה חדשה
		const handleNewOrder = (newProduct: Products) => {
			if (isAdminOrModerator) {
				playNotificationSound();
				showNewProductToast({
					navigate,
					navigateTo: `/product-details/${newProduct.product_name}`,
					productId: newProduct._id ?? "",
				});
				showNotification(`تم إصدار أمر جديد بواسطة ${newProduct.category}`);
			}
		};

		// עדכון סטטוס ללקוח
		// const handleClientOrderStatus = ({
		// 	orderNumber,
		// 	status,
		// }: {
		// 	orderNumber: string;
		// 	status: string;
		// }) => {
		// 	playNotificationSound();
		// 	showInfo(`ההזמנה שלך (${orderNumber}) ${getStatusText(status, t)}`);
		// 	showNotification(`ההזמנה שלך (${orderNumber}) ${getStatusText(status, t)}`);
		// };

		// עדכון סטטוס כללי
		// const handleOrderStatusUpdated = ({
		// 	orderNumber,
		// 	status,
		// 	userId,
		// 	updatedBy,
		// }: {
		// 	orderNumber: string;
		// 	status: string;
		// 	userId: string;
		// 	updatedBy: string;
		// }) => {
		// 	playNotificationSound();
		// 	const msg =
		// 		auth._id === userId
		// 			? `ההזמנה שלך (${orderNumber}) עודכנה לסטטוס: ${getStatusText(status, t)} ע"י ${updatedBy}`
		// 			: isAdminOrModerator
		// 				? `הזמנה מספר ${orderNumber} עודכנה לסטטוס: ${getStatusText(status, t)} ע"י ${updatedBy}`
		// 				: null;

		// 	if (msg) {
		// 		showInfo(msg);
		// 		showNotification(msg);
		// 	}
		// };

		// משתמש חדש נרשם
		const handleUserRegistered = (user: UserRegister) => {
			if (auth.role === RoleType.Admin) {
				playNotificationSound();
				showInfo(`${user.email} ${user.role} משתמש חדש נרשם`);
				showNotification(`${user.email} ${user.role} משתמש חדש נרשם`);
			}
		};

		// משתמש התחבר
		const handleUserLoggedIn = (user: UserRegister) => {
			if (auth.role === RoleType.Admin) {
				playNotificationSound();

				const msg =
					user.role === RoleType.Admin
						? `${user.email} משתמש אדמין התחבר`
						: user.role === RoleType.Moderator
							? `${user.email} משתמש מנחה התחבר`
							: `${user.email} משתמש התחבר`;
				showInfo(msg);
				showNotification(msg);
			}
		};

		const handleNewProduct = (newProduct: Products) => {
			playNotificationSound();

			showNewProductToast({
				navigate,
				navigateTo: `/product-details/${newProduct.product_name}`,
				productId: newProduct._id ?? "",
			});

			showNotification(`تم إضافة منتج جديد: ${newProduct.product_name}`);
		};

		// חיבור מאזינים
		socket.on("connect", handleConnect);
		socket.on("error", handleError);
		socket.on("disconnect", handleDisconnect);
		socket.on("new order", handleNewOrder);
		// socket.on("order:status:client", handleClientOrderStatus);
		// socket.on("order:status:updated", handleOrderStatusUpdated);
		socket.on("user:registered", handleUserRegistered);
		socket.on("user:newUserLoggedIn", handleUserLoggedIn);
		socket.on("product:new", handleNewProduct);

		// ניקוי מאזינים
		return () => {
			socket.off("connect", handleConnect);
			socket.off("error", handleError);
			socket.off("disconnect", handleDisconnect);
			socket.off("new order", handleNewOrder);
			// socket.off("order:status:client", handleClientOrderStatus);
			// socket.off("order:status:updated", handleOrderStatusUpdated);
			socket.off("user:registered", handleUserRegistered);
			socket.off("user:newUserLoggedIn", handleUserLoggedIn);
			socket.off("product:new", handleNewProduct);
		};
	}, [auth?._id, auth?.role, auth?.name?.first]);
};

export default useSocketEvents;
