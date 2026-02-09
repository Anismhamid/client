import axios from "axios";
import {EditUserProfile, UserLogin, UserRegister} from "../interfaces/User";
import {showError, showSuccess} from "../atoms/toasts/ReactToast";
import {jwtDecode} from "jwt-decode";
import GoogleJwtPayload from "../interfaces/google";
import {CompleteUserPayload} from "../interfaces/completeProfile";

const api = `${import.meta.env.VITE_API_URL}/users`;

/**
 * Register a new user
 * @param newUserData - New user registration data
 * @returns Token string if registration is successful, or null if there's an error
 */
export const registerNewUser = async (newUserData: UserRegister) => {
	try {
		const response = await axios.post(api, newUserData, {
			headers: {"Content-Type": "application/json"},
		});
		localStorage.setItem("tiken", response.data);
		return response.data;
	} catch (error) {
		throw new Error;
	}
};

/**
 * Responses handle google login
 * @param response
 * @returns userData
 */
export const handleGoogleLogin = async (response: any, extraData: any) => {
	try {
		const decoded = jwtDecode<GoogleJwtPayload>(response.credential);
		const {email, given_name, family_name, picture, sub} = decoded;

		if (!email || !sub) {
			throw new Error("Missing required Google user info");
		}

		const userData = {
			credentialToken: response.credential,
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
				houseNumber: extraData ? extraData.houseNumber : "",
				slug: extraData ? extraData.slug : "",
			},
		};

		const res = await axios.post(`${api}/google`, userData, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		// res.data is the token
		localStorage.setItem("token", res.data);
		return res.data;
	} catch (error) {
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
		return res.data.exists;
	} catch (err) {
		console.error("Error verifying Google user", err);
		return false;
	}
};

/**
 * compleate Profile information
 * @param userId
 * @param values
 */
export const compleateProfileData = async (
	userId: string,
	values: CompleteUserPayload,
) => {
	try {
		const token = localStorage.getItem("token");
		const payload = {
			phone: {
				phone_1: values.phone.phone_1,
				phone_2: values.phone.phone_2 || "",
			},
			image: {
				url: values.image?.url,
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
 * Users id
 * @param userId
 * @param data
 * @returns
 */
// Update the editUserProfile function:
export const editUserProfile = async (userId: string, data: EditUserProfile) => {
	try {
		const response = await axios.patch(`${api}/edit-user/${userId}`, data, {
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
		});
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			// Log full error details
			console.error("Axios error response:", error.response);
			console.error("Error status:", error.response?.status);
			console.error("Error data:", error.response?.data);
			console.error("Error headers:", error.response?.headers);

			// Get more specific error message
			const errorMessage =
				error.response?.data?.message ||
				error.response?.data?.error ||
				error.response?.data ||
				"Failed to update profile";

			throw new Error(errorMessage);
		}
		throw error;
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

		const response = await axios.get(`${api}/${userId}`, {
			headers: {Authorization: token},
		});

		return response.data;
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
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
			},
		);
		return response.data;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const deleteUserById = async (userId: string) => {
	try {
		const response = await axios.delete(`${api}/${userId}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const changeUserPassword = async (userId: string, newPassword: string) => {
	try {
		const token = localStorage.getItem("token");

		await axios.patch(
			`${api}/password/${userId}`,
			{newPassword},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: token,
				},
			},
		);

		showSuccess("הסיסמה שונתה בהצלחה");
		return true;
	} catch (error) {
		console.error("שגיאה בשינוי סיסמה:", error);
		showError("לא הצלחנו לשנות את הסיסמה");
		return false;
	}
};

export const patchUserStatus = async (userId: string, status: boolean) => {
	try {
		const response = await axios.patch(`${api}/status/${userId}`, {status});
		return response.data;
	} catch (error) {
		console.error("Error updating status:", error);
		throw error;
	}
};

export const getCustomerProfileBySlug = async (slug: string) => {
	try {
		const res = await axios.get(`${api}/customer/${slug}`);
		return res.data;
	} catch (err) {
		console.error("Error fetching customer profile by slug:", err);
	}
};

export const checkSlugAvailability = async (slug: string): Promise<boolean> => {
	try {
		const response = await axios.get(`${api}/check-slug/${slug}`);
		return response.data.available;
	} catch (error) {
		console.error("Error checking slug availability:", error);
		throw error;
	}
};
