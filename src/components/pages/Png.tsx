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
		<>
			<title>لم يتم العثور على الصفحة | صفقة</title>
			<meta
				name='description'
				content={"عذرا، لم أتمكن من العثور على هذه الصفحة ربما غير موجودة"}
			/>
			<div className='d-flex justify-content-center align-items-center'>
				<div className='text-center'>
					<h1 className='display-6 text-danger'>لم يتم العثور على الصفحة</h1>
					<div className=' w-50 m-auto'>
						<img
							className='img-fluid'
							src='/src/assets/2x_error_dog.png'
							alt=''
						/>
					</div>
					<p className='lead'>
						عذرا، لم أتمكن من العثور على هذه الصفحة ربما غير موجودة
					</p>
					<Button
						variant='contained'
						onClick={() => navigate(-1)}
						className='btn btn-primary my-4'
					>
						عودة
					</Button>
				</div>
			</div>
		</>
	);
};

export default PageNotFound;
