import {toast} from "react-toastify";
import {Posts} from "../../interfaces/Posts";

export const showNewPostToast = ({
	navigate,
	navigateTo,
	post,
}: {
	navigate: (path: string) => void;
	navigateTo: string;
	post: Posts;
}) => {
	toast.info(
		({closeToast}) => (
			<div>
				<p>
					<strong>נוסף מוצר חדש:</strong>{" "}
					{`${post.category}, ${post.product_name}`}
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
