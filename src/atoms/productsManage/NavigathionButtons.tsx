import {FunctionComponent} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Box, Button, Chip} from "@mui/material";
import {navbarCategoryLinks} from "../../helpers/navCategoryies";
import {useTranslation} from "react-i18next";
import {path} from "../../routes/routes";

interface NavigathionButtonsProps {}

const NavigathionButtons: FunctionComponent<NavigathionButtonsProps> = () => {
	const navigate = useNavigate();
	const {t} = useTranslation();

	return (
		<Box className='w-100'>
			<hr />
			<p className='fw-bold fs-3 rounded'>הזמנה חדשה</p>

			<Box
				component={"div"}
				sx={{
					border: "1px solid red",
					p: 3,
					borderRadius: 3,
					backdropFilter: "blur(10px)",
				}}
			>
				<Box>
					<Button
						variant='contained'
						onClick={() => navigate(path.Home)}
						color='primary'
						size='large'
						sx={{px: 10}}
					>
						בית
					</Button>
				</Box>
				<Box className='my-3'>
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
				</Box>
			</Box>
		</Box>
	);
};

export default NavigathionButtons;
