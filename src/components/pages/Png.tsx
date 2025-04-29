import {Button} from "@mui/material";
import {FunctionComponent} from "react";
import {useNavigate} from "react-router-dom";

interface PageNotFoundProps {}
/**
 * Divs page not found
 * @returns not found page
 */
const PageNotFound: FunctionComponent<PageNotFoundProps> = () => {
	const navigate = useNavigate();
	return (
		<div className='d-flex justify-content-center align-items-center'>
			<div className='text-center'>
				<h1 className='display-6 text-danger'>Page Not Found</h1>
				<div className=' w-50 m-auto'>
					<img
						className='img-fluid'
						src='/src/assets/2x_error_dog.png'
						alt=''
					/>
				</div>
				<p className='lead'>Sorry, Can't found this page maby does not exist.</p>
				<Button
					onClick={() => navigate(-1)}
					className='btn btn-primary my-4'
				>
					Go Back
				</Button>
			</div>
		</div>
	);
};

export default PageNotFound;
