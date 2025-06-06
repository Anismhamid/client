import {FunctionComponent} from "react";
import {Link, NavLink} from "react-router-dom";
import {navbarCategoryLinks} from "../../helpers/navCategoryies";
import {useTranslation} from "react-i18next";
import {Box} from "@mui/material";

interface FooterProps {}
/**
 * Footers
 * @returns footer
 */
const Footer: FunctionComponent<FooterProps> = () => {
	const {t} = useTranslation();

	return (
		<Box
			component={"footer"}
			sx={{
				borderTop: "1px solid red",
				borderColor: "red",
			}}
		>
			<Box className='container py-5'>
				<Box className='row'>
					{/* Quick Links Section */}
					<div className='col-4 mb-3'>
						<h5>קישורים מהירים</h5>
						<nav className='flex-column'>
							<ul className='list-unstyled'>
								{navbarCategoryLinks.map((pathes, index) => (
									<li key={index}>
										<NavLink
											to={pathes.path}
											className='text-primaty text-decoration-none'
										>
											{t(`${pathes.labelKey}`)}
										</NavLink>
									</li>
								))}
							</ul>
						</nav>
					</div>
					{/* Store Info Section */}
					<Box className='col-md-5 mb-3'>
						<h3>שוק הבינה</h3>
						<p>פירות וירקות ועוד נשלחים אליכם עד דלת הבית</p>
						<hr />
						<p>
							צור איתנו קשר:
							<Link
								to='mailto:support@fruitsandveg.com'
								className='text-primary ms-1 text-decoration-none'
							>
								support@fruitsandveg.com
							</Link>
						</p>

						<p>
							טלפון:
							<Link
								to='tel:+97538346915'
								className='text-primary text-decoration-none ms-1'
							>
								053-834-69-15
							</Link>
						</p>
					</Box>

					{/* Social Media Links Section */}
					<Box className='col-md-3 mb-3'>
						<h5>עקוב אחרינו</h5>
						<nav className='gap-3'>
							<ul className='list-unstyled'>
								<li>
									<NavLink
										to='https://facebook.com'
										className='text-primaty text-decoration-none'
										target='_blank'
									>
										Facebook
									</NavLink>
								</li>
								<li>
									<NavLink
										to='https://instagram.com'
										className='text-primaty text-decoration-none'
										target='_blank'
									>
										Instagram
									</NavLink>
								</li>
								<li>
									<NavLink
										to='https://twitter.com'
										className='text-primaty text-decoration-none'
										target='_blank'
									>
										Twitter
									</NavLink>
								</li>
							</ul>
						</nav>
					</Box>
				</Box>
				{/* Footer Bottom */}
				<Box
					dir='ltr'
					sx={{
						width: "100%",
						mt: "30px",
						textAlign: "center",
						border: 1,
						borderColor: "red",
						p: 1,
						borderRadius: 2,
					}}
				>
					<p>&copy; 2025 Corner Market Store. All rights reserved.</p>
				</Box>
			</Box>
		</Box>
	);
};

export default Footer;
