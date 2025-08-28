import {VercelRequest, VercelResponse} from "@vercel/node";
import {getAllProducts} from "../../src/services/productsServices";

const hostname = "https://client-qqq1.vercel.app";

export default async function handler(_: VercelRequest, res: VercelResponse) {
	try {
		const products = await getAllProducts();
		const categories = [...new Set(products.map((p) => p.category))];

		const pages = [
			{url: "/", changefreq: "daily", priority: 1.0},
			{url: "/about", changefreq: "monthly", priority: 0.7},
			{url: "/contact", changefreq: "monthly", priority: 0.7},
			{url: "/privacy-and-policy", changefreq: "yearly", priority: 0.3},
			...categories.map((cat) => ({
				url: `/category/${encodeURIComponent(cat)}`,
				changefreq: "daily",
				priority: 0.9,
			})),
			...products.map((p) => ({
				url: `/products/${encodeURIComponent(p.product_name)}`,
				changefreq: "weekly",
				priority: 0.7,
			})),
		];

		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(
		(page) => `
  <url>
    <loc>${hostname}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
	)
	.join("")}
</urlset>`;

		res.setHeader("Content-Type", "application/xml");
		res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate"); // cache 1h
		res.status(200).send(sitemapXml);
	} catch (error) {
		console.error(error);
		res.status(500).send("Error generating sitemap");
	}
}
