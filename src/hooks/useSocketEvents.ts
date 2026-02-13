import {useEffect, useState} from "react";
// import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {showNewProductToast} from "../atoms/bootStrapToast/SocketToast";
import {showInfo} from "../atoms/toasts/ReactToast";
import {useUser} from "../context/useUSer";
import {UserRegister} from "../interfaces/User";
import RoleType from "../interfaces/UserType";
import socket from "../socket/globalSocket";
import useNotificationSound from "./useNotificationSound";
import {Products} from "../interfaces/Posts";
import {productsPathes} from "../routes/routes";

const useSocketEvents = () => {
	const {auth} = useUser();
	const navigate = useNavigate();
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
		if (!socket.connected) socket.connect();

		// התחברות לחדר אדמין
		const handleConnect = () => {
			if (isAdminOrModerator)
				socket.emit("admins", {userId: auth._id, role: auth.role});
		};

		// הודעת שגיאה
		const handleError = (err: any) => console.error("Socket error:", err);

		// ניתוק
		const handleDisconnect = (reason: any) => {
			console.warn("Socket disconnected:", reason);
			setTimeout(() => {
				if (!socket.connected) socket.connect();
			}, 1000);
		};

		// משתמש חדש נרשם
		const handleUserRegistered = (user: UserRegister) => {
			if (auth.role === RoleType.Admin) {
				playNotificationSound();
				showInfo(`${user.email} ${user.role} مستخدم جديد تم تسجيله`);
				showNotification(`${user.email} ${user.role} مستخدم جديد تم تسجيله`);
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
				navigateTo: `${productsPathes.productDetails}/${newProduct.category}/${newProduct.brand}/${newProduct._id}`,
				product: newProduct,
			});

			showNotification(`تم إضافة منتج جديد: ${newProduct.product_name}`);
		};

		// חיבור מאזינים
		socket.on("connect", handleConnect);
		socket.on("error", handleError);
		socket.on("disconnect", handleDisconnect);
		socket.on("user:registered", handleUserRegistered);
		socket.on("user:newUserLoggedIn", handleUserLoggedIn);
		socket.on("product:new", handleNewProduct);

		// ניקוי מאזינים
		return () => {
			socket.off("connect", handleConnect);
			socket.off("error", handleError);
			socket.off("disconnect", handleDisconnect);
			socket.off("user:registered", handleUserRegistered);
			socket.off("user:newUserLoggedIn", handleUserLoggedIn);
			socket.off("product:new", handleNewProduct);
		};
	}, [navigate, playNotificationSound]);
};

export default useSocketEvents;
