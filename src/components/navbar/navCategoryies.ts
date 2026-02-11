import {productsPathes} from "../../routes/routes";

export interface SubCategory {
	labelKey: string;
	value: string;
	path: string;
}

export interface NavCategory {
	labelKey: string;
	value: string;
	path: string;
	icon?: string;
	subCategories: SubCategory[];
}

export const productsAndCategories: NavCategory[] = [
	{
		labelKey: "categories.house.label",
		value: "house",
		path: productsPathes.house,
		icon: "/categories/house.png",
		subCategories: [
			{
				labelKey: "categories.house.subCategories.kitchen",
				path: `${productsPathes.house}/kitchen`,
				value: "kitchen",
			},
			{
				labelKey: "categories.house.subCategories.storage",
				path: `${productsPathes.house}/storage`,
				value: "storage",
			},
			{
				labelKey: "categories.house.subCategories.decor",
				path: `${productsPathes.house}/decor`,
				value: "decor",
			},
			{
				labelKey: "categories.house.subCategories.maintenance",
				path: `${productsPathes.house}/maintenance`,
				value: "maintenance",
			},
		],
	},
	{
		labelKey: "categories.garden.label",
		value: "garden",
		path: productsPathes.garden,
		icon: "/categories/gardening.png",
		subCategories: [
			{
				labelKey: "categories.garden.subCategories.plants",
				path: `${productsPathes.garden}/plants`,
				value: "plants",
			},
			{
				labelKey: "categories.garden.subCategories.watering",
				path: `${productsPathes.garden}/watering`,
				value: "watering",
			},
			{
				labelKey: "categories.garden.subCategories.tools",
				path: `${productsPathes.garden}/tools`,
				value: "tools",
			},
			{
				labelKey: "categories.garden.subCategories.outdoorDecor",
				path: `${productsPathes.garden}/outdoorDecor`,
				value: "outdoorDecor",
			},
		],
	},
	{
		labelKey: "categories.baby.label",
		value: "baby",
		path: productsPathes.baby,
		icon: "/categories/baby.png",
		subCategories: [
			{
				labelKey: "categories.baby.subCategories.clothes",
				path: `${productsPathes.baby}/clothes`,
				value: "clothes",
			},
			{
				labelKey: "categories.baby.subCategories.care",
				path: `${productsPathes.baby}/care`,
				value: "care",
			},
			{
				labelKey: "categories.baby.subCategories.feeding",
				path: `${productsPathes.baby}/feeding`,
				value: "feeding",
			},
		],
	},
	{
		labelKey: "categories.kids.label",
		value: "kids",
		path: productsPathes.kids,
		icon: "/categories/kids.png",
		subCategories: [
			{
				labelKey: "categories.kids.subCategories.educational",
				path: `${productsPathes.kids}/educational`,
				value: "educational",
			},
			{
				labelKey: "categories.kids.subCategories.toys",
				path: `${productsPathes.kids}/toys`,
				value: "toys",
			},
			{
				labelKey: "categories.kids.subCategories.outdoor",
				path: `${productsPathes.kids}/outdoor`,
				value: "outdoor",
			},
		],
	},
	{
		labelKey: "categories.health.label",
		value: "health",
		path: productsPathes.health,
		icon: "/categories/health.png",
		subCategories: [
			{
				labelKey: "categories.health.subCategories.personalCare",
				value: "personalCare",
				path: `${productsPathes.health}/personalCare`,
			},
			{
				labelKey: "categories.health.subCategories.medical",
				path: `${productsPathes.health}/medical`,
				value: "medical",
			},
			{
				labelKey: "categories.health.subCategories.fitness",
				path: `${productsPathes.health}/fitness`,
				value: "fitness",
			},
		],
	},
	{
		labelKey: "categories.watches.label",
		value: "watches",
		path: productsPathes.watches,
		icon: "/categories/watches.png",
		subCategories: [
			{
				labelKey: "categories.watches.subCategories.classic",
				path: `${productsPathes.watches}/classic`,
				value: "classic",
			},
			{
				labelKey: "categories.watches.subCategories.smart",
				path: `${productsPathes.watches}/smart`,
				value: "smart",
			},
			{
				labelKey: "categories.watches.subCategories.hand",
				path: `${productsPathes.watches}/hand`,
				value: "hand",
			},
		],
	},
	{
		labelKey: "categories.beauty.label",
		value: "beauty",
		path: productsPathes.beauty,
		icon: "/categories/beauty.png",
		subCategories: [
			{
				labelKey: "categories.beauty.subCategories.makeup",
				path: `${productsPathes.beauty}/makeup`,
				value: "makeup",
			},
			{
				labelKey: "categories.beauty.subCategories.skincare",
				path: `${productsPathes.beauty}/skincare`,
				value: "skincare",
			},
			{
				labelKey: "categories.beauty.subCategories.hair",
				path: `${productsPathes.beauty}/hair`,
				value: "hair",
			},
		],
	},
	{
		labelKey: "categories.cleaning.label",
		value: "cleaning",
		path: productsPathes.cleaning,
		icon: "/categories/cleaning.png",
		subCategories: [
			{
				labelKey: "categories.cleaning.subCategories.detergents",
				value: "detergents",
				path: `${productsPathes.cleaning}/detergents`,
			},
			{
				labelKey: "categories.cleaning.subCategories.tools",
				path: `${productsPathes.cleaning}/tools`,
				value: "tools",
			},
			{
				labelKey: "categories.cleaning.subCategories.disinfection",
				value: "disinfection",
				path: `${productsPathes.cleaning}/disinfection`,
			},
		],
	},
	{
		labelKey: "categories.womenclothes.label",
		value: "women-clothes",
		path: productsPathes.womenClothes,
		icon: "/categories/woman-clothes.png",
		subCategories: [
			{
				labelKey: "categories.womenclothes.subCategories.casual",
				path: `${productsPathes.womenClothes}/casual`,
				value: "casual",
			},
			{
				labelKey: "categories.womenclothes.subCategories.dresses",
				path: `${productsPathes.womenClothes}/dresses`,
				value: "dresses",
			},
			{
				labelKey: "categories.womenclothes.subCategories.shoes",
				path: `${productsPathes.womenClothes}/shoes`,
				value: "shoes",
			},
		],
	},
	{
		labelKey: "categories.menclothes.label",
		value: "men-clothes",
		path: productsPathes.menClothes,
		icon: "/categories/man-clothes.png",
		subCategories: [
			{
				labelKey: "categories.menclothes.subCategories.casual",
				path: `${productsPathes.menClothes}/casual`,
				value: "casual",
			},
			{
				labelKey: "categories.menclothes.subCategories.formal",
				path: `${productsPathes.menClothes}/formal`,
				value: "formal",
			},
			{
				labelKey: "categories.menclothes.subCategories.shoes",
				path: `${productsPathes.menClothes}/shoes`,
				value: "shoes",
			},
		],
	},
	{
		labelKey: "categories.cars.label",
		value: "cars",
		path: productsPathes.cars,
		icon: "/categories/car.png",
		subCategories: [
			{
				labelKey: "categories.cars.subCategories.private",
				path: `${productsPathes.cars}/private`,
				value: "private",
			},
			{
				labelKey: "categories.cars.subCategories.electric",
				path: `${productsPathes.cars}/electric`,
				value: "electric",
			},
			{
				labelKey: "categories.cars.subCategories.parts",
				path: `${productsPathes.cars}/parts`,
				value: "parts",
			},
			{
				labelKey: "categories.cars.subCategories.accessories",
				path: `${productsPathes.cars}/accessories`,
				value: "accessories",
			},
		],
	},
	{
		labelKey: "categories.motorcycles.label",
		value: "motorcycles",
		path: productsPathes.motorcycles,
		icon: "/categories/motorcycle.png",
		subCategories: [
			{
				labelKey: "categories.motorcycles.subCategories.sport",
				path: `${productsPathes.motorcycles}/sport`,
				value: "sport",
			},
			{
				labelKey: "categories.motorcycles.subCategories.scooters",
				path: `${productsPathes.motorcycles}/scooters`,
				value: "scooters",
			},
			{
				labelKey: "categories.motorcycles.subCategories.parts",
				path: `${productsPathes.motorcycles}/parts`,
				value: "parts",
			},
		],
	},
	{
		labelKey: "categories.trucks.label",
		value: "trucks",
		path: productsPathes.trucks,
		icon: "/categories/truck.png",
		subCategories: [
			{
				labelKey: "categories.trucks.subCategories.light",
				path: `${productsPathes.trucks}/light`,
				value: "light",
			},
			{
				labelKey: "categories.trucks.subCategories.heavy",
				path: `${productsPathes.trucks}/heavy`,
				value: "heavy",
			},
		],
	},
	{
		labelKey: "categories.bikes.label",
		value: "bikes",
		path: productsPathes.bikes,
		icon: "/categories/bike.png",
		subCategories: [
			{
				labelKey: "categories.bikes.subCategories.kids",
				path: `${productsPathes.bikes}/kids`,
				value: "kids",
			},
			{
				labelKey: "categories.bikes.subCategories.mountain",
				path: `${productsPathes.bikes}/mountain`,
				value: "mountain",
			},
			{
				labelKey: "categories.bikes.subCategories.road",
				path: `${productsPathes.bikes}/road`,
				value: "road",
			},
		],
	},
	{
		labelKey: "categories.electric-vehicles.label",
		value: "electric-vehicles",
		path: productsPathes.electricVehicles,
		icon: "/categories/electric-vehicle.png",
		subCategories: [
			{
				labelKey: "categories.electric-vehicles.subCategories.cars",
				path: `${productsPathes.electricVehicles}/cars`,
				value: "cars",
			},
			{
				labelKey: "categories.electric-vehicles.subCategories.scooters",
				path: `${productsPathes.electricVehicles}/scooters`,
				value: "scooters",
			},
		],
	},
] as const;

// export type NavCategory[] = (typeof productCategories)[number];
