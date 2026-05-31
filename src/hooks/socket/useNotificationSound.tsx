import {useRef} from "react";

const useNotificationSound = () => {
	const messageReceivedSound = useRef(new Audio("/live-chat-353605.mp3"));
	const messageSentSound = useRef(new Audio("/live-chat-2.mp3"));
	const defaultSound = useRef(new Audio("/notification.mp3"));

	const playNotificationSound = (
		type: "messageReceived" | "messageSent" | "default" = "default",
	) => {
		let audio: HTMLAudioElement;

		switch (type) {
			case "messageReceived":
				audio = messageReceivedSound.current;
				break;
			case "messageSent":
				audio = messageSentSound.current;
				break;
			default:
				audio = defaultSound.current;
		}
		audio.pause();
		audio.currentTime = 0;
		audio.play().catch(console.error);
	};

	const showNotification = (message: string) => {
		if (!("Notification" in window)) return;

		if (Notification.permission === "granted") {
			new Notification(message, {icon: "/myLogo2.png"});
			return;
		}

		if (Notification.permission !== "denied") {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					new Notification(message, {icon: "/myLogo2.png"});

					if ("vibrate" in navigator) {
						navigator.vibrate([200, 100, 200]);
					}
				}
			});
		}
	};

	return {playNotificationSound, showNotification};
};

export default useNotificationSound;
