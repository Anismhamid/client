import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import handleRTL from "../locales/handleRTL";

interface ContactProps {}
/**
 * Mains contact
 * @returns contact infomation
 */
const Contact: FunctionComponent<ContactProps> = () => {
	const {t} = useTranslation();
	const diriction = handleRTL();
	return (
		<main  dir={diriction}>
			<div className='container'>
				<h1 className='text-center display-1'>{t("pages.contact.title")}</h1>
				<hr />
				<div className='row justify-content-center'>
					<div className='col-md-10'>
						<h3 className='mb-3 text-center mb-4'>
							{t("pages.contact.heading")}
						</h3>

						<p className='mb-4 lead text-start'>
							{t("pages.contact.intro")}
							<br />
							<br />
							{t("pages.contact.goal")}
						</p>
						<hr className=' text-light' />
						<div className='col-md-8 m-auto'>
							<h3 className='mb-3 text-center mb-4'>
								{t("pages.contact.team")}
							</h3>
							<p className='text-center mb-4 lead'>
								{t("pages.contact.teamDesc")}
							</p>
							<h5 className='mt-4'>{t("pages.contact.contactInfo")}</h5>
							<ul className=' list-group list-unstyled'>
								<li className='text-center list-group-item-action mb-4 p-2  lead fw-bold'>
									<Link
										to='mailto: support@fruitsandveg.com'
										className='text-primary ms-1 text-decoration-none'
									>
										<strong>{t("pages.contact.email")}</strong>
									</Link>
								</li>
								<li className='text-center list-group-item-info list-group-item-action mb-4 p-2  lead fw-bold'>
									<Link
										to='tel:+97231234567'
										className='text-primary text-decoration-none ms-1'
									>
										<strong>{t("pages.contact.phone")}</strong>
									</Link>
								</li>
							</ul>
							<p className='text-center mb-4 p-2 lead'>
								{t("pages.contact.note")}
							</p>

							<hr />

							<h5 className='mt-4'>{t("pages.contact.addressTitle")}</h5>
							<p className='text-center mb-4 p-2 lead'>
								<strong>{t("pages.contact.address")}</strong>
							</p>

							<p className='text-center mb-4 p-2 lead'>
								{t("pages.contact.thanks")}
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default Contact;
