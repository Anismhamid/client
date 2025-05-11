import {FunctionComponent} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Button, Chip} from "@mui/material";
import {navbarCategoryLinks} from "../helpers/navCategoryies";
import {useTranslation} from "react-i18next";
import { path } from "../routes/routes";

interface NavigathionButtonsProps {}

const NavigathionButtons: FunctionComponent<NavigathionButtonsProps> = () => {
	const navigate = useNavigate();
	const {t} = useTranslation();

	return (
		<div className=' w-100'>
			<hr />
			<p className='fw-bold fs-3 rounded'>הזמנה חדשה</p>

			<div className=''>
				<div>
					<Button
						variant='contained'
						onClick={() => navigate(path.Home)}
						className='btn btn-secondary fw-bold w-100 m-1'
					>
						בית
					</Button>
				</div>
				<div className='my-3'>
					{navbarCategoryLinks.map((link) => (
						<NavLink to={link.path} key={link.path}>
							{({isActive}) => (
								<Chip
									label={t(link.labelKey)}
									color={isActive ? "default" : "info"}
									size='medium'
									sx={{
										px: 2,
										m: 1,
										"&:hover": {
											transform: "scale(1.05)",
											boxShadow: 2,
										},
										transition: "all 0.2s ease",
										...(isActive && {
											fontWeight: "bold",
											border: "2px solid #894891",
										}),
									}}
								/>
							)}
						</NavLink>
					))}
				</div>
			</div>
		</div>
	);
};

export default NavigathionButtons;
