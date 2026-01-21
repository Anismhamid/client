import {useState, useEffect, useCallback} from "react";
import {getCities, getStreets} from "../services/cities";

const useAddressData = (selectedCity = "") => {
	const [cities, setCities] = useState<string[]>([]);
	const [streets, setStreets] = useState<string[]>([]);
	const [loadingCities, setLoadingCities] = useState(false);
	const [loadingStreets, setLoadingStreets] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadCities = async () => {
			setLoadingCities(true);
			setError(null);
			try {
				const data = await getCities();
				setCities(data);
			} catch {
				setError("address.citiesLoadError");
			} finally {
				setLoadingCities(false);
			}
		};

		loadCities();
	}, []);

	// Fetch streets when city changes
	const fetchStreets = useCallback(async () => {
		if (!selectedCity) {
			setStreets([]);
			return;
		}

		setStreets([]); // reset immediately
		setLoadingStreets(true);
		setError(null);

		try {
			const data = await getStreets(selectedCity);
			setStreets(data);
		} catch {
			setError("address.streetsLoadError");
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
		loadingCities,
		loadingStreets,
		error,
	};
};

export default useAddressData;
