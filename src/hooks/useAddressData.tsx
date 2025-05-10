import {useState, useEffect, useCallback} from "react";
import {getCities, getStreets} from "../services/cities";

const useAddressData = (selectedCity = "") => {
	const [cities, setCities] = useState<string[]>([]);
	const [streets, setStreets] = useState<string[]>([]);
	const [loadingStreets, setLoadingStreets] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadCities = async () => {
			try {
				const data = await getCities();
				setCities(data);
			} catch (err) {
				setError("טעינת רשימת הערים נכשלה");
			}
		};
		loadCities();
	}, []);

	const fetchStreets = useCallback(async () => {
		if (!selectedCity) {
			setStreets([]);
			return;
		}

		setLoadingStreets(true);
		setError(null);
		try {
			const data = await getStreets(selectedCity);
			setStreets(data);
		} catch (err) {
			setError("טעינת רשימת הרחובות נכשלה");
			setStreets([]);
		} finally {
			setLoadingStreets(false);
		}
	}, [selectedCity]);

	useEffect(() => {
		fetchStreets();
	}, [fetchStreets]);

	return {
		cities,
		streets,
		loadingStreets,
		error,
		reloadStreets: fetchStreets,
	};
};

export default useAddressData;
