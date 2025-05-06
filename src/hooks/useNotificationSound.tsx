import {useRef} from "react";

const useNotificationSound = () => {
	const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

	if (!notificationSoundRef.current) {
		notificationSoundRef.current = new Audio("/notification.mp3");
	}

	const playNotificationSound = () => {
		notificationSoundRef.current?.play().catch((error) => {
			console.error("Failed to play sound:", error);
		});
	};

	return {playNotificationSound};
};

export default useNotificationSound;
