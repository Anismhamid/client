import {FunctionComponent} from "react";

interface SeoProps {
	title: string;
	description: string;
	keywords?: string;
	image: string;
	type?: string;
}

const Seo: FunctionComponent<SeoProps> = ({
	title,
	description,
	keywords = "بيع وشراء جميع المنتجات في مكان واحد, توصيل",
	image = "",
	type = "website",
}) => {
	return (
		<>
			<title>{title}</title>
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />

			{/* Open Graph */}
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<link rel='icon' type='image/svg+xml' href={image} />
			<meta property='og:type' content={type} />
		</>
	);
};

export default Seo;
