import {toast} from "react-toastify";
import { Products } from "../../interfaces/Products";

export const showNewProductToast = ({
	navigate,
	navigateTo,
	product,
}: {
	navigate: (path: string) => void;
	navigateTo: string;
	product: Products;
}) => {
	toast.info(
		({closeToast}) => (
			<div>
				<p>
					<strong>נוסף מוצר חדש:</strong> {`${product.category}, ${product.product_name}`}
				</p>
				<button
					onClick={() => {
						navigate(navigateTo);
						closeToast?.();
					}}
					className='btn btn-sm btn-primary me-2'
				>
					לצפיה במוצר
				</button>
				<button onClick={closeToast} className='btn btn-sm btn-secondary'>
					דילוג
				</button>
			</div>
		),
		{
			autoClose: false,
			closeOnClick: false,
		},
	);
};
