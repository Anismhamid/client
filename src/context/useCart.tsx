import {
	createContext,
	useContext,
	useState,
	ReactNode,
	FunctionComponent,
	Dispatch,
	SetStateAction,
	useEffect,
} from "react";

type CartType = number;

interface CartContextType {
	quantity: number;
	setQuantity: Dispatch<SetStateAction<CartType>>;
}

const cartContext: CartContextType = {
	quantity: 0,
	setQuantity: () => {},
};

const CartContext = createContext<CartContextType>(cartContext);

export const useCartItems = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCartItems must be used within a CartProvider");
	}
	return context;
};

interface CartProviderProps {
	children: ReactNode;
}

export const CartProvider: FunctionComponent<CartProviderProps> = ({children}) => {
	const [quantity, setQuantity] = useState<number>(() => {
		const stored = localStorage.getItem("cartQuantity");
		return stored ? parseInt(stored, 10) : 0;
	});

	useEffect(() => {
		localStorage.setItem("cartQuantity", quantity.toString());
	}, [quantity]);

	return (
		<CartContext.Provider value={{quantity, setQuantity}}>
			{children}
		</CartContext.Provider>
	);
};
