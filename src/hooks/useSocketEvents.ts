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
import {Products} from "../interfaces/Posts";
import {productsPathes} from "../routes/routes";
import {useChat} from "./useChat";
import {LocalMessage} from "../interfaces/chat/localMessage";

const useSocketEvents = () => {
	const {auth} = useUser();
	const navigate = useNavigate();
	const {playNotificationSound, showNotification} = useNotificationSound();
	const {
		currentChatId,
		updateMessageStatus,
		addMessageForUser,
		setUnreadForUser,
		messages,
	} = useChat();

	useEffect(() => {
		if (!currentChatId || !auth || !messages) return;

		const userMessages = messages[currentChatId] || [];

		userMessages.forEach((msg) => {
			if (msg.from._id !== auth._id && msg.status === "sent") {
				// تحديث محليًا
				updateMessageStatus(currentChatId, msg._id, "seen");

				// إرسال إلى السيرفر
				socket.emit("message:seen", {
					messageId: msg._id,
					from: auth._id,
					to: msg.from._id,
				});
			}
		});
	}, [currentChatId, messages, auth?._id, updateMessageStatus]);

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

			showNotification(`تم إضافة منشور جديد: ${newProduct.product_name}`);
		};

		// const messageReceived = (msg: any) => {
		// 	// إذا المرسل هو المستخدم الحالي
		// 	if (msg.to?._id === auth._id) {
		// 		playNotificationSound("messageReceived");
		// 		if (addMessageForUser !== msg.chatId)
		// 			new Notification(`رسالة من ${msg.from?.name.first}`, {
		// 				body: msg.text,
		// 			});
		// 	}
		// };
		const messageReceived = (msg: LocalMessage) => {
			const otherUserId = msg.from._id === auth._id ? msg.to._id : msg.from._id;

			addMessageForUser(otherUserId, msg);

			if (currentChatId !== otherUserId) {
				setUnreadForUser(otherUserId, (prev) => (prev || 0) + 1);
				playNotificationSound("messageReceived");
				if (Notification.permission === "granted") {
					new Notification(`رسالة من ${msg.from?.name}`, {
						body: msg.text,
					});
				}
			}
		};

		const messageSent = (msg: any) => {
			// إذا المستلم هو المستخدم الحالي
			if (msg.from?._id === auth._id) {
				playNotificationSound("messageSent");
			}
		};

		// חיבור מאזינים
		socket.on("connect", handleConnect);
		socket.on("error", handleError);
		socket.on("disconnect", handleDisconnect);
		socket.on("message:sent", messageSent);
		socket.on("message:received", messageReceived);
		socket.on("user:registered", handleUserRegistered);
		socket.on("user:newUserLoggedIn", handleUserLoggedIn);
		socket.on("product:new", handleNewProduct);

		// ניקוי מאזינים
		return () => {
			socket.off("connect", handleConnect);
			socket.off("error", handleError);
			socket.off("disconnect", handleDisconnect);
			socket.off("message:sent", messageSent);
			socket.off("message:received", messageReceived);
			socket.off("user:registered", handleUserRegistered);
			socket.off("user:newUserLoggedIn", handleUserLoggedIn);
			socket.off("product:new", handleNewProduct);
		};
	}, [auth, navigate, playNotificationSound]);
};

export default useSocketEvents;
