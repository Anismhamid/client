import {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import handleRTL from "../locales/handleRTL";

interface PrivacyAdnPolicyProps {}
/**
 * Mains privacy and policy
 * @returns
 */
const PrivacyAdnPolicy: FunctionComponent<PrivacyAdnPolicyProps> = () => {
	const {t} = useTranslation();
	const diriction = handleRTL();

	return (
		<main className='min-vh-100'>
			<div
				dir={diriction}
				className='container my-5 border border-primary shadow p-5 rounded-4'
			>
				<h1 className='text-center mb-4 text-primary'>
					{t("pages.privacy.title")}
				</h1>

				<p className=' mb-5'>
					{t("pages.privacy.lastUpdated", {date: "13/04/2025"})}
				</p>

				{/* 1 */}
				<section className='my-5'>
					<h2 className='text-center display-6'>
						{t("pages.privacy.intro.title")}
					</h2>
					<p className='lead'>{t("pages.privacy.intro.text")}</p>
				</section>

				{/* 2 */}
				<section className='my-5'>
					2.
					<h2 className='display-6'>
						{t("pages.privacy.collectedInfo.title")}
					</h2>
					<p className='lead'>{t("pages.privacy.collectedInfo.text")}</p>
					<ol>
						<hr />
						<li>{t("pages.privacy.collectedInfo.info.name")}</li>
						<hr />
						<li>{t("pages.privacy.collectedInfo.info.email")}</li>
						<hr />
						<li>{t("pages.privacy.collectedInfo.info.image")}</li>
						<hr />
						<li>{t("pages.privacy.collectedInfo.technical")}</li>
						<hr />
					</ol>
				</section>

				{/* 3 */}
				<section className='my-5'>
					3.
					<h2 className='display-6'>{t("pages.privacy.usage.title")}</h2>
					<ol>
						<li>{t("pages.privacy.usage.points.p1")}</li>
						<hr />
						<li>{t("pages.privacy.usage.points.p2")}</li>
						<hr />
						<li>{t("pages.privacy.usage.points.p3")}</li>
						<hr />
						<li>{t("pages.privacy.usage.points.p4")}</li>
						<hr />
					</ol>
				</section>

				{/* 4 */}
				<section className='my-5'>
					4.
					<h2 className='display-6'>{t("pages.privacy.consent.title")}</h2>
					<ol>
						<li>{t("pages.privacy.consent.text")}</li>
					</ol>
				</section>

				{/* 5 */}
				<section className='my-5'>
					5.
					<h2 className='display-6'>{t("pages.privacy.sharing.title")}</h2>
					<ol>
						<li>{t("pages.privacy.sharing.points.external")}</li>
						<li>{t("pages.privacy.sharing.points.law")}</li>
					</ol>
				</section>

				<section className='my-5'>
					<h2 className='display-6 '>
						6. {t("pages.privacy.protection.title")}
					</h2>
					<p className=' lead'>{t("pages.privacy.protection.text")}</p>
				</section>

				<section className='my-5'>
					7.
					<h2 className='display-6 '>{t("pages.privacy.updates.title")}</h2>
					<p className=' lead'>{t("pages.privacy.updates.text")}</p>
				</section>

				<section className='my-5'>
					8.
					<h2 className='display-6 '>{t("pages.privacy.rights.title")}</h2>
					<ol>
						<li>{t("pages.privacy.rights.points.p1")}</li>
						<li>{t("pages.privacy.rights.points.p2")}</li>
						<li>{t("pages.privacy.rights.points.p3")}</li>
					</ol>
				</section>

				{/* 9 */}
				<section className='my-5'>
					9.
					<h2 className='display-6 '>{t("pages.privacy.userConsent.title")}</h2>
					<ul>
						<li>{t("pages.privacy.userConsent.text")}</li>
					</ul>
				</section>

				{/* 10 */}
				<section className='my-5'>
					10.
					<h2 className='display-6 '>{t("pages.privacy.contact.title")}</h2>
					<ol>
						<li>{t("pages.privacy.contact.text")}</li>
						<li>{t("pages.privacy.contact.phone")}</li>
					</ol>
				</section>
			</div>
		</main>
	);
};

export default PrivacyAdnPolicy;
