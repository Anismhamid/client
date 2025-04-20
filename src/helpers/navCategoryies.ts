import { fontAwesomeIcon } from "../FontAwesome/Icons";
import { productsPathes } from "../routes/routes";

export const navbarCategoryLinks = [
	{
		labelKey: "categories.fruits",
		path: productsPathes.Fruits,
		icon: fontAwesomeIcon.Fruit,
	},
	{
		labelKey: "categories.vegetable",
		path: productsPathes.Vegetable,
		icon: fontAwesomeIcon.Vegetable,
	},
	{
		labelKey: "categories.fish",
		path: productsPathes.fish,
		icon: fontAwesomeIcon.fish,
	},
	{
		labelKey: "categories.dairy",
		path: productsPathes.dairy,
		icon: fontAwesomeIcon.dairyProducts,
	},
	{
		labelKey: "categories.meat",
		path: productsPathes.meat,
		icon: fontAwesomeIcon.meat,
	},
	{
		labelKey: "categories.spices",
		path: productsPathes.spices,
		icon: fontAwesomeIcon.spices,
	},
	{
		labelKey: "categories.bakery",
		path: productsPathes.bakery,
		icon: fontAwesomeIcon.bakery,
	},
	{
		labelKey: "categories.beverages",
		path: productsPathes.beverages,
		icon: fontAwesomeIcon.beverages,
	},
	{
		labelKey: "categories.forzen",
		path: productsPathes.forzen,
		icon: fontAwesomeIcon.forzen,
	},
	{
		labelKey: "categories.snacks",
		path: productsPathes.snacks,
		icon: fontAwesomeIcon.snacks,
	},
];
