import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	FunctionComponent,
} from "react";
import {AuthValues, emptyAuthValues} from "../interfaces/authValues";

// Auth type
type Auth = AuthValues;

// UserContext type
interface UserContextType {
	auth: Auth;
	setAuth: React.Dispatch<React.SetStateAction<Auth>>;
	isLoggedIn: boolean;
	setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultUserContext: UserContextType = {
	auth: emptyAuthValues,
	setAuth: () => {},
	isLoggedIn: false,
	setIsLoggedIn: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
};

interface UserProviderProps {
	children: ReactNode;
}

/**
 *  user provider component
 * @param {children}
 * @returns auth states
 */
export const UserProvider: FunctionComponent<UserProviderProps> = ({children}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [auth, setAuth] = useState<Auth>(emptyAuthValues);

	return (
		<UserContext.Provider
			value={{
				auth,
				setAuth,
				isLoggedIn,
				setIsLoggedIn,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
