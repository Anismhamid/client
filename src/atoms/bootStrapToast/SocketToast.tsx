import {toast} from "react-toastify";

export const showNewOrderToast = ({
	navigate,
	navigateTo,
	orderNum,
}: {
	navigate: (path: string) => void;
	navigateTo: string;
	orderNum: string;
}) => {
	toast.info(
		({closeToast}) => (
			<div>
				<p>
					<strong>בוצעה הזמנה חדשה:</strong> {orderNum}
				</p>
				<button
					onClick={() => {
						navigate(navigateTo);
						closeToast?.();
					}}
					className='btn btn-sm btn-primary me-2'
				>
					לפרטי ההזמנה
				</button>
				<button onClick={closeToast} className='btn btn-sm btn-secondary'>
					סגור
				</button>
			</div>
		),
		{
			autoClose: false,
			closeOnClick: true,
		},
	);
};
