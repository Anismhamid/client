import {useRef} from "react";

const useNotificationSound = () => {
	const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

	if (!notificationSoundRef.current) {
		notificationSoundRef.current = new Audio("/notification.mp3");
	}

	const playNotificationSound = () => {
		(notificationSoundRef.current as HTMLAudioElement)?.play().catch((error) => {
			console.error("Failed to play sound:", error);
		});
	};

	const showNotification = (message: string) => {
		if ("Notification" in window) {
			if (Notification.permission === "granted") {
				new Notification(message);
			} else if (Notification.permission !== "denied") {
				Notification.requestPermission().then((permission) => {
					if (permission === "granted") {
						new Notification(message, {
							icon: "/myLogo2.png",
						});
						if ("vibrate" in navigator) {
							navigator.vibrate([200, 100, 200]); // يهتز: 200ms توقف 100ms يهتز 200ms
						}
					}
				});
			}
		}
	};

	return {playNotificationSound, showNotification};
};

export default useNotificationSound;
