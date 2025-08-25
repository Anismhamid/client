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
						<h5>روابط سريعة</h5>
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
						<h3>سـوق الـسـخـنـيـني</h3>
						<p>الفواكه والخضروات والمزيد يتم توصيلها إلى باب منزلك</p>
						<hr />
						<p>
							اتصل بنا:
							<Link
								to='mailto:support@fruitsandveg.com'
								className='text-primary ms-1 text-decoration-none'
							>
								support@fruitsandveg.com
							</Link>
						</p>

						<p>
							هاتف:
							<Link
								to='tel:+9746310374'
								className='text-primary text-decoration-none ms-1'
							>
								046310374
							</Link>
						</p>
					</Box>

					{/* Social Media Links Section */}
					<Box className='col-md-3 mb-3'>
						<h5>تابعنا</h5>
						<nav className='gap-3'>
							<ul className='list-unstyled'>
								<li>
									<div style={{display: "flex"}}>
										<NavLink
											to='https://www.facebook.com/shokshknini/?locale=ar_AR'
											className='text-primaty text-decoration-none'
											target='_blank'
										>
											سوق السخنيني ام الفحم
										</NavLink>
										<div
											style={{
												borderRadius: "50%",
												width: "30px",
												height: "30px",
												backgroundColor: "#0966FF",
												textAlign: "center",
												fontSize: "1.5rem",
												marginRight: 10,
											}}
										>
											f
										</div>
									</div>
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
						borderColor: "#0966FF",
						p: 1,
						borderRadius: 5,
					}}
				>
					<p>&copy; {new Date().getFullYear()} جميع الحقوق محفوظة سوق الـسـخـنـيـني</p>
				</Box>
			</Box>
		</Box>
	);
};

export default Footer;
