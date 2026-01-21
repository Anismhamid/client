import {useEffect, useState} from "react";
import {getCities} from "../services/cities";

const useCountries = () => {
	const [countries, setCountries] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadCountries = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getCities();
				setCountries(data);
			} catch {
				setError("address.countriesLoadError");
			} finally {
				setLoading(false);
			}
		};

		loadCountries();
	}, []);

	return {
		countries,
		loading,
		error,
	};
};

export default useCountries;
