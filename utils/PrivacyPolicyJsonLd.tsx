// components/PrivacyPolicyJsonLd.tsx
import React from "react";
import  {FunctionComponent} from "react";

const PrivacyPolicyJsonLd: FunctionComponent = () => {
	const data = {
		"@context": "https://schema.org",
		"@type": "PrivacyPolicy",
		name: "سياسة الخصوصية - بيع وشراء",
		description:
			"اطلع على سياسة الخصوصية لمتجر بيع وشراء في أم الفحم. كيف نجمع البيانات، نستخدمها، ونحافظ على سريتها.",
		url: "https://client-qqq1.vercel.app/Privacy-and-policy",
		publisher: {
			"@type": "Organization",
			name: "بيع وشراء أم الفحم",
			logo: {
				"@type": "ImageObject",
				url: "https://client-qqq1.vercel.app/myLogo.png",
			},
		},
		availableLanguage: ["ar", "he", "en"],
		datePublished: "2025-04-13",
		dateModified: "2025-04-13",
	};

	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
		/>
	);
};

export default PrivacyPolicyJsonLd;
