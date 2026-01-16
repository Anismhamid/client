import {fontAwesomeIcon} from "../../../FontAwesome/Icons";
import {productsPathes} from "../../../routes/routes";

interface SubCategory {
	labelKey: string;
	path: string;
}

export interface NavbarCategory {
	labelKey: string;
	path: string;
	icon?: React.ReactNode;
	subCategories?: SubCategory[];
}

export const navbarCategoryLinks: NavbarCategory[] = [
	{
		labelKey: "categories.baby.label",
		path: productsPathes.baby,
		icon: fontAwesomeIcon.baby,
		subCategories: [
			{
				labelKey: "categories.baby.subCategories.clothes",
				path: `${productsPathes.baby}/clothes`,
			},
			{
				labelKey: "categories.baby.subCategories.care",
				path: `${productsPathes.baby}/care`,
			},
			{
				labelKey: "categories.baby.subCategories.feeding",
				path: `${productsPathes.baby}/feeding`,
			},
		],
	},
	{
		labelKey: "categories.kids.label",
		path: productsPathes.kids,
		icon: fontAwesomeIcon.kids,
		subCategories: [
			{
				labelKey: "categories.kids.subCategories.educational",
				path: `${productsPathes.kids}/educational`,
			},
			{
				labelKey: "categories.kids.subCategories.toys",
				path: `${productsPathes.kids}/toys`,
			},
			{
				labelKey: "categories.kids.subCategories.outdoor",
				path: `${productsPathes.kids}/outdoor`,
			},
		],
	},

	{
		labelKey: "categories.health.label",
		path: productsPathes.health,
		icon: fontAwesomeIcon.health,
		subCategories: [
			{
				labelKey: "categories.health.subCategories.personalCare",
				path: `${productsPathes.health}/personal-care`,
			},
			{
				labelKey: "categories.health.subCategories.medical",
				path: `${productsPathes.health}/medical`,
			},
			{
				labelKey: "categories.health.subCategories.fitness",
				path: `${productsPathes.health}/fitness`,
			},
		],
	},
	{
		labelKey: "categories.watches.label",
		path: productsPathes.watches,
		icon: fontAwesomeIcon.watches,
		subCategories: [
			{
				labelKey: "categories.watches.subCategories.classic",
				path: `${productsPathes.watches}/classic`,
			},
			{
				labelKey: "categories.watches.subCategories.smart",
				path: `${productsPathes.watches}/smart`,
			},
			{
				labelKey: "categories.watches.subCategories.hand",
				path: `${productsPathes.watches}/hand`,
			},
		],
	},
	{
		labelKey: "categories.beauty.label",
		path: productsPathes.beauty,
		icon: fontAwesomeIcon.beauty,
		subCategories: [
			{
				labelKey: "categories.beauty.subCategories.makeup",
				path: `${productsPathes.beauty}/makeup`,
			},
			{
				labelKey: "categories.beauty.subCategories.skincare",
				path: `${productsPathes.beauty}/skincare`,
			},
			{
				labelKey: "categories.beauty.subCategories.hair",
				path: `${productsPathes.beauty}/hair`,
			},
		],
	},
	{
		labelKey: "categories.cleaning.label",
		path: productsPathes.cleaning,
		icon: fontAwesomeIcon.cleaning,
		subCategories: [
			{
				labelKey: "categories.cleaning.subCategories.detergents",
				path: `${productsPathes.cleaning}/detergents`,
			},
			{
				labelKey: "categories.cleaning.subCategories.tools",
				path: `${productsPathes.cleaning}/tools`,
			},
			{
				labelKey: "categories.cleaning.subCategories.disinfection",
				path: `${productsPathes.cleaning}/disinfection`,
			},
		],
	},
	{
		labelKey: "categories.women-clothes.label",
		path: productsPathes.womenClothes,
		icon: fontAwesomeIcon.womenClothes,
		subCategories: [
			{
				labelKey: "categories.women-clothes.subCategories.casual",
				path: `${productsPathes.womenClothes}/casual`,
			},
			{
				labelKey: "categories.women-clothes.subCategories.dresses",
				path: `${productsPathes.womenClothes}/dresses`,
			},
			{
				labelKey: "categories.women-clothes.subCategories.shoes",
				path: `${productsPathes.womenClothes}/shoes`,
			},
		],
	},
	{
		labelKey: "categories.men-clothes.label",
		path: productsPathes.menClothes,
		icon: fontAwesomeIcon.menClothes,
		subCategories: [
			{
				labelKey: "categories.men-clothes.subCategories.casual",
				path: `${productsPathes.menClothes}/casual`,
			},
			{
				labelKey: "categories.men-clothes.subCategories.formal",
				path: `${productsPathes.menClothes}/formal`,
			},
			{
				labelKey: "categories.men-clothes.subCategories.shoes",
				path: `${productsPathes.menClothes}/shoes`,
			},
		],
	},
	{
		labelKey: "categories.cars.label",
		path: productsPathes.cars,
		icon: fontAwesomeIcon.cars,
		subCategories: [
			{
				labelKey: "categories.cars.subCategories.private",
				path: `${productsPathes.cars}/private`,
			},
			{
				labelKey: "categories.cars.subCategories.electric",
				path: `${productsPathes.cars}/electric`,
			},
			{
				labelKey: "categories.cars.subCategories.parts",
				path: `${productsPathes.cars}/parts`,
			},
			{
				labelKey: "categories.cars.subCategories.accessories",
				path: `${productsPathes.cars}/accessories`,
			},
		],
	},
	{
		labelKey: "categories.motorcycles.label",
		path: productsPathes.motorcycles,
		icon: fontAwesomeIcon.motorcycles,
		subCategories: [
			{
				labelKey: "categories.motorcycles.subCategories.sport",
				path: `${productsPathes.motorcycles}/sport`,
			},
			{
				labelKey: "categories.motorcycles.subCategories.scooters",
				path: `${productsPathes.motorcycles}/scooters`,
			},
			{
				labelKey: "categories.motorcycles.subCategories.parts",
				path: `${productsPathes.motorcycles}/parts`,
			},
		],
	},
	{
		labelKey: "categories.trucks.label",
		path: productsPathes.trucks,
		icon: fontAwesomeIcon.trucks,
		subCategories: [
			{
				labelKey: "categories.trucks.subCategories.light",
				path: `${productsPathes.trucks}/light`,
			},
			{
				labelKey: "categories.trucks.subCategories.heavy",
				path: `${productsPathes.trucks}/heavy`,
			},
		],
	},
	{
		labelKey: "categories.bikes.label",
		path: productsPathes.bikes,
		icon: fontAwesomeIcon.bikes,
		subCategories: [
			{
				labelKey: "categories.bikes.subCategories.kids",
				path: `${productsPathes.bikes}/kids`,
			},
			{
				labelKey: "categories.bikes.subCategories.mountain",
				path: `${productsPathes.bikes}/mountain`,
			},
			{
				labelKey: "categories.bikes.subCategories.road",
				path: `${productsPathes.bikes}/road`,
			},
		],
	},
	{
		labelKey: "categories.electric-vehicles.label",
		path: productsPathes.electricVehicles,
		icon: fontAwesomeIcon.electricVehicles,
		subCategories: [
			{
				labelKey: "categories.electric-vehicles.subCategories.cars",
				path: `${productsPathes.electricVehicles}/cars`,
			},
			{
				labelKey: "categories.electric-vehicles.subCategories.scooters",
				path: `${productsPathes.electricVehicles}/scooters`,
			},
		],
	},
];
