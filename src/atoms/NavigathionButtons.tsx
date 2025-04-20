import {FunctionComponent} from "react";
import {path, productsPathes} from "../routes/routes";
import {useNavigate} from "react-router-dom";
import {Button} from "react-bootstrap";

interface NavigathionButtonsProps {}

const NavigathionButtons: FunctionComponent<NavigathionButtonsProps> = () => {
	const navigate = useNavigate();

	return (
		<div className=' w-100'>
			<hr />
			<p className='fw-bold fs-3 rounded'>הזמנה חדשה</p>

			<div className='row'>
				<div className='col-3'>
					<Button
						onClick={() => navigate(path.Home)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						בית
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.Fruits)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						פירות
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.Vegetable)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						ירקות
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.fish)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						דגים
					</Button>
				</div>
			</div>
			<div className='row'>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.dairy)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						מוצרי חלב
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.meat)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						בשרים
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.spices)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						תבלינים
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.bakery)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						מאפים
					</Button>
				</div>
			</div>

			<div className='row'>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.beverages)}
						className='btn btn-info fw-bold w-100 m-1'
					>
						משקאות
					</Button>
				</div>
				<div className='col-6'>
					<Button
						onClick={() => navigate(productsPathes.forzen)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						מוצרים קפואים
					</Button>
				</div>
				<div className='col-3'>
					<Button
						onClick={() => navigate(productsPathes.snacks)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						חטיפים
					</Button>
				</div>
			</div>
		</div>
	);
};

export default NavigathionButtons;
