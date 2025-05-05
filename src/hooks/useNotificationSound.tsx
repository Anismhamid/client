import {useState, useMemo, useEffect, useRef} from "react";

const useNotificationSound = () => {
	const [canPlaySound, setCanPlaySound] = useState(false);

	// יצירת Audio ו-AudioContext רק פעם אחת
	const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
	const audioContextRef = useRef<AudioContext | null>(null);
	const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

	useEffect(() => {
		notificationSoundRef.current = new Audio("/notification.mp3");
		audioContextRef.current = new window.AudioContext();

		// חיבור בין ה-Audio ל-AudioContext פעם אחת בלבד
		if (audioContextRef.current && notificationSoundRef.current) {
			sourceRef.current = audioContextRef.current.createMediaElementSource(
				notificationSoundRef.current,
			);
			sourceRef.current.connect(audioContextRef.current.destination);
		}
	}, []);

	useEffect(() => {
		const allowSound = () => {
			setCanPlaySound(true);
			audioContextRef.current?.resume().catch(console.error);
			window.removeEventListener("click", allowSound);
		};

		window.addEventListener("click", allowSound);
		return () => window.removeEventListener("click", allowSound);
	}, []);

	const playNotificationSound = () => {
		if (canPlaySound && notificationSoundRef.current) {
			// הפעלת הצליל מבלי ליצור אובייקטים חדשים
			notificationSoundRef.current.currentTime = 0;
			notificationSoundRef.current.play().catch(console.error);
		}
	};

	return {playNotificationSound};
};

export default useNotificationSound;
