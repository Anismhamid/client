import {FunctionComponent} from "react";

const PrivacyPolicyJsonLd: FunctionComponent = () => {
	const data = {
		"@context": "https://schema.org",
		"@type": "WebPage",
		name: "سياسة الخصوصية",
		url: "https://client-qqq1.vercel.app/privacy-and-policy",
		description:
			"اطلع على سياسة الخصوصية لمتجر بيع وشراء في أم الفحم. كيف نجمع البيانات، نستخدمها، ونحافظ على سريتها.",
		inLanguage: ["ar", "he", "en"],
		isPartOf: {
			"@type": "WebSite",
			name: "صفقه",
			url: "https://client-qqq1.vercel.app",
		},
		publisher: {
			"@type": "Organization",
			name: "صفقه",
			logo: {
				"@type": "ImageObject",
				url: "https://client-qqq1.vercel.app/myLogo.png",
			},
		},
		availableLanguage: ["ar", "he", "en"],
		datePublished: "2025-1-06",
		dateModified: "2025-1-06",
	};

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
		/>
	);
};

export default PrivacyPolicyJsonLd;
