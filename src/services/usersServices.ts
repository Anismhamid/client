import axios from "axios";
import {UserLogin, UserRegister} from "../interfaces/User";
import {showError, showSuccess} from "../atoms/Toast";
import {jwtDecode} from "jwt-decode";

const api = `${import.meta.env.VITE_API_URL}/users`;

interface GoogleJwtPayload {
	email: string;
	email_verified: string;
	exp: string;
	family_name: string;
	given_name: string;
	iat: string;
	iss: string;
	name: string;
	picture: string;
	sub: string;
	typ: string;
	aud: string;
	azp: string;
	jti: string;
	kid: string;
	nbf: string;
}

/**
 * Register a new user
 * @param newUserData - New user registration data
 * @returns Token string if registration is successful, or null if there's an error
 */
export const registerNewUser = async (newUserData: UserRegister) => {
	try {
		const response = await axios.post(api, newUserData);
		showSuccess("נחמד, נרשמת בהצלחה!. עכשיו אתה יכול להתחבר");
		return response.data;
	} catch (error) {
		console.log(error);
		showError("Invalid Data try again.");
		return null;
	}
};

/**
 * Responses handle google login
 * @param response
 * @returns
 */
export const handleGoogleLogin = async (response: any, extraData: any) => {
	try {
		const decoded = jwtDecode<GoogleJwtPayload>(response.credential);
		const {email, given_name, family_name, picture, sub} = decoded;

		if (!email || !sub) {
			throw new Error("Missing required Google user info");
		}

		const userData = {
			googleId: sub,
			email,
			name: {
				first: given_name,
				last: family_name,
			},
			image: {
				url: picture,
				alt: given_name,
			},
			phone: {
				phone_1: extraData ? extraData.phone_1 : "",
				phone_2: extraData ? extraData.phone_2 : "",
			},
			address: {
				city: extraData ? extraData.city : "",
				street: extraData ? extraData.street : "",
				houseNumber:extraData ? extraData.houseNumber : "",
			},
		};

		const res = await axios.post(`${api}/google`, userData, {
			headers: {
				Authorization: localStorage.getItem("token"),
			},
		});
		const token = res.data;
		localStorage.setItem("token", token);
		showSuccess("התחברת בהצלחה עם גוגל!");
		return token;
	} catch (error) {
		console.error("Error during Google login:", error);
		showError("התחברות עם גוגל נכשלה");
		return null;
	}
};

export const verifyGoogleToken = async (token: string) => {
	const url = `${import.meta.env.VITE_API_VIREFY_TOKEN}${token}`;
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		throw new Error("Failed to verify Google token");
	}
};

export const verifyGoogleUser = async (googleId: string) => {
	try {
		const res = await axios.get(`${api}/google/verify/${googleId}`);
		return res.data.exists; // سيرفر يرجّع true أو false
	} catch (err) {
		console.error("Error verifying Google user", err);
		return false;
	}
};

export const compleateProfileData = async (userId: string, values: any) => {
	try {
		const token = localStorage.getItem("token");
		const payload = {
			phone: {
				phone_1: values.phone.phone_1,
				phone_2: values.phone.phone_2,
			},
			address: {
				city: values.address.city,
				street: values.address.street,
				houseNumber: values.address.houseNumber,
			},
		};
		await axios.patch(`${api}/compleate/${userId}`, payload, {
			headers: {
				Authorization: token,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

/**
 * Login user and get a token
 * @param userData - User credentials (Email and Password)
 * @returns Token string if login is successful, or null if there's an error
 */
export const loginUser = async (userData: UserLogin) => {
	try {
		const response = await axios.post(`${api}/login`, userData);
		return response.data;
	} catch (error: any) {
		if (error.request.response === "Too Many Requests") {
			showError(error.request.response);
		} else {
			showError("שם משתמש או סיסמה שגויים");
		}
		console.log();
		return null;
	}
};

/**
 * Get all users for admins
 * @returns Array of users if successful, or null if there's an error or no token
 */
export const getAllUsers = async () => {
	try {
		const response = await axios.get(api, {
			headers: {Authorization: localStorage.getItem("token")},
		});
		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

/**
 * Get user by ID for admins or moderators
 * @param userId - The user ID to retrieve
 * @returns The user object if successful, or null if there's an error or no token
 */
export const getUserById = async (userId: string) => {
	try {
		const token = localStorage.getItem("token");

		// If there is no token, c.log an error and return null
		if (!token) {
			console.error("No token found");
			return null;
		}

		const response = await axios.get(`${api}/${userId}`, {
			headers: {Authorization: token},
		});
		if (response.status === 200) {
			return response.data;
		} else {
			console.error("Failed to fetch user: " + response.status);
			return null;
		}
	} catch (error) {
		// Log any errors that occurred during the API request
		console.error("Error getting user:", error);
		return null;
	}
};

/**
 * Patch user role by userId
 * @param userId - User ID to update
 * @param newRole - New role to assign to the user
 * @returns A user object with the updated role, or null in case of an error
 */
export const patchUserRole = async (userId: string, newRole: string) => {
	try {
		const response = await axios.patch(
			`${api}/role/${userId}`,
			{role: newRole},
			{
				headers: {Authorization: localStorage.getItem("token")},
			},
		);
		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};
