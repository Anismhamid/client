import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";

interface AboutProps {}

/**
 * صفحة حولنا
 * @returns معلومات عن العمل
 */
const About: FunctionComponent<AboutProps> = () => {
	const {t} = useTranslation("about");

	return (
		<main className='min-vh-100'>
			<div className='container-fluid py-5'>
				<div className='row justify-content-center'>
					<div className='col-md-8 text-center'>
						<h1 className='mb-4 display-1 fw-bold'>{t("title")}</h1>
						<h2 className='lead mb-4 fs-3'>{t("subtitle")}</h2>

						{[
							["descriptionTitle", "descriptionText"],
							["ideaTitle", "ideaText"],
							["productsTitle", "productsText"],
							["roleTitle", "roleText"],
							["supportTitle", "supportText"],
							["joinTitle", "joinText"],
							["locationTitle", "locationText"],
						].map(([title, text]) => (
							<section key={title} className='about-section'>
								<h3 className='my-4'>{t(title)}</h3>
								<hr />
								<p className='lead fw-medium p-2'>{t(text)}</p>
							</section>
						))}
					</div>
				</div>
			</div>
		</main>
	);
};

export default About;
