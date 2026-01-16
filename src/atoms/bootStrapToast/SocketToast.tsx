import {toast} from "react-toastify";

export const showNewProductToast = ({
	navigate,
	navigateTo,
	productId,
}: {
	navigate: (path: string) => void;
	navigateTo: string;
	productId: string;
}) => {
	toast.info(
		({closeToast}) => (
			<div>
				<p>
					<strong>בוצעה הזמנה חדשה:</strong> {productId}
				</p>
				<button
					onClick={() => {
						navigate(navigateTo);
						closeToast?.();
					}}
					className='btn btn-sm btn-primary me-2'
				>
					לפרטי המוצר
				</button>
				<button onClick={closeToast} className='btn btn-sm btn-secondary'>
					סגור
				</button>
			</div>
		),
		{
			autoClose: false,
			closeOnClick: false,
		},
	);
};
