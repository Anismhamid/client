import {FunctionComponent} from "react";
import {Link, NavLink} from "react-router-dom";
import {path, productsPathes} from "../routes/routes";

interface FooterProps {}
/**
 * Footers
 * @returns footer
 */
const Footer: FunctionComponent<FooterProps> = () => {
	return (
		<footer className='text-white pt-4 pb-2 bottom-0 start-0 end-0'>
			<div className='container py-5'>
				<div className='row'>
					{/* Store Info Section */}
					<div className='col-md-4 mb-3'>
						<h3>שוק הבינה</h3>
						<p>פירות וירקות טריים ואורגניים נשלחים אליכם עד דלת הבית</p>
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
					</div>

					{/* Quick Links Section */}
					<div className='col-md-4 mb-3'>
						<h5>קישורים מהירים</h5>
						<nav className='flex-column'>
							<ul className='list-unstyled'>
								<li>
									<NavLink
										to={productsPathes.Fruits}
										className='text-primaty text-decoration-none'
									>
										Fruits
									</NavLink>
								</li>
								<li>
									<NavLink
										to={productsPathes.Vegetable}
										className='text-primaty text-decoration-none'
									>
										Vegetables
									</NavLink>
								</li>
								<li>
									<NavLink
										to={path.About}
										className='text-primaty text-decoration-none'
									>
										About Us
									</NavLink>
								</li>
								<li>
									<NavLink
										to={path.Contact}
										className='text-primaty text-decoration-none'
									>
										Contact Us
									</NavLink>
								</li>
							</ul>
						</nav>
					</div>

					{/* Social Media Links Section */}
					<div className='col-md-4 mb-3'>
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
					</div>
				</div>

				{/* Footer Bottom */}
				<div className='row' dir='ltr'>
					<div className='col text-center mt-3'>
						<p>&copy; 2025 Corner Market Store. All rights reserved.</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
