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
		labelKey: "categories.House.label",
		value: "house",
		path: productsPathes.house,
		icon: "/categories/house.png",
		subCategories: [
			{
				labelKey: "categories.House.subCategories.kitchen",
				path: `${productsPathes.house}/kitchen`,
				value: "kitchen",
			},
			{
				labelKey: "categories.House.subCategories.storage",
				path: `${productsPathes.house}/storage`,
				value: "storage",
			},
			{
				labelKey: "categories.House.subCategories.decor",
				path: `${productsPathes.house}/decor`,
				value: "decor",
			},
			{
				labelKey: "categories.House.subCategories.maintenance",
				path: `${productsPathes.house}/maintenance`,
				value: "maintenance",
			},
		],
	},
	{
		labelKey: "categories.Garden.label",
		value: "garden",
		path: productsPathes.garden,
		icon: "/categories/gardening.png",
		subCategories: [
			{
				labelKey: "categories.Garden.subCategories.plants",
				path: `${productsPathes.garden}/plants`,
				value: "plants",
			},
			{
				labelKey: "categories.Garden.subCategories.watering",
				path: `${productsPathes.garden}/watering`,
				value: "watering",
			},
			{
				labelKey: "categories.Garden.subCategories.tools",
				path: `${productsPathes.garden}/tools`,
				value: "tools",
			},
			{
				labelKey: "categories.Garden.subCategories.outdoorDecor",
				path: `${productsPathes.garden}/outdoorDecor`,
				value: "outdoorDecor",
			},
		],
	},
	{
		labelKey: "categories.Baby.label",
		value: "baby",
		path: productsPathes.baby,
		icon: "/categories/baby.png",
		subCategories: [
			{
				labelKey: "categories.Baby.subCategories.clothes",
				path: `${productsPathes.baby}/clothes`,
				value: "clothes",
			},
			{
				labelKey: "categories.Baby.subCategories.care",
				path: `${productsPathes.baby}/care`,
				value: "care",
			},
			{
				labelKey: "categories.Baby.subCategories.feeding",
				path: `${productsPathes.baby}/feeding`,
				value: "feeding",
			},
		],
	},
	{
		labelKey: "categories.Kids.label",
		value: "kids",
		path: productsPathes.kids,
		icon: "/categories/kids.png",
		subCategories: [
			{
				labelKey: "categories.Kids.subCategories.educational",
				path: `${productsPathes.kids}/educational`,
				value: "educational",
			},
			{
				labelKey: "categories.Kids.subCategories.toys",
				path: `${productsPathes.kids}/toys`,
				value: "toys",
			},
			{
				labelKey: "categories.Kids.subCategories.outdoor",
				path: `${productsPathes.kids}/outdoor`,
				value: "outdoor",
			},
		],
	},
	{
		labelKey: "categories.Health.label",
		value: "health",
		path: productsPathes.health,
		icon: "/categories/health.png",
		subCategories: [
			{
				labelKey: "categories.Health.subCategories.personalCare",
				value: "personalCare",
				path: `${productsPathes.health}/personalCare`,
			},
			{
				labelKey: "categories.Health.subCategories.medical",
				path: `${productsPathes.health}/medical`,
				value: "medical",
			},
			{
				labelKey: "categories.Health.subCategories.fitness",
				path: `${productsPathes.health}/fitness`,
				value: "fitness",
			},
		],
	},
	{
		labelKey: "categories.Watches.label",
		value: "watches",
		path: productsPathes.watches,
		icon: "/categories/watches.png",
		subCategories: [
			{
				labelKey: "categories.Watches.subCategories.classic",
				path: `${productsPathes.watches}/classic`,
				value: "classic",
			},
			{
				labelKey: "categories.Watches.subCategories.smart",
				path: `${productsPathes.watches}/smart`,
				value: "smart",
			},
			{
				labelKey: "categories.Watches.subCategories.hand",
				path: `${productsPathes.watches}/hand`,
				value: "hand",
			},
		],
	},
	{
		labelKey: "categories.Beauty.label",
		value: "beauty",
		path: productsPathes.beauty,
		icon: "/categories/beauty.png",
		subCategories: [
			{
				labelKey: "categories.Beauty.subCategories.makeup",
				path: `${productsPathes.beauty}/makeup`,
				value: "makeup",
			},
			{
				labelKey: "categories.Beauty.subCategories.skincare",
				path: `${productsPathes.beauty}/skincare`,
				value: "skincare",
			},
			{
				labelKey: "categories.Beauty.subCategories.hair",
				path: `${productsPathes.beauty}/hair`,
				value: "hair",
			},
		],
	},
	{
		labelKey: "categories.Cleaning.label",
		value: "cleaning",
		path: productsPathes.cleaning,
		icon: "/categories/cleaning.png",
		subCategories: [
			{
				labelKey: "categories.Cleaning.subCategories.detergents",
				value: "detergents",
				path: `${productsPathes.cleaning}/detergents`,
			},
			{
				labelKey: "categories.Cleaning.subCategories.tools",
				path: `${productsPathes.cleaning}/tools`,
				value: "tools",
			},
			{
				labelKey: "categories.Cleaning.subCategories.disinfection",
				value: "disinfection",
				path: `${productsPathes.cleaning}/disinfection`,
			},
		],
	},
	{
		labelKey: "categories.WomenClothes.label",
		value: "WomenClothes",
		path: productsPathes.WomenClothes,
		icon: "/categories/woman-clothes.png",
		subCategories: [
			{
				labelKey: "categories.WomenClothes.subCategories.casual",
				path: `${productsPathes.WomenClothes}/casual`,
				value: "casual",
			},
			{
				labelKey: "categories.WomenClothes.subCategories.dresses",
				path: `${productsPathes.WomenClothes}/dresses`,
				value: "dresses",
			},
			{
				labelKey: "categories.WomenClothes.subCategories.shoes",
				path: `${productsPathes.WomenClothes}/shoes`,
				value: "shoes",
			},
		],
	},
	{
		labelKey: "categories.MenClothes.label",
		value: "MenClothes",
		path: productsPathes.MenClothes,
		icon: "/categories/men-clothes.png",
		subCategories: [
			{
				labelKey: "categories.MenClothes.subCategories.casual",
				path: `${productsPathes.MenClothes}/casual`,
				value: "casual",
			},
			{
				labelKey: "categories.MenClothes.subCategories.formal",
				path: `${productsPathes.MenClothes}/formal`,
				value: "formal",
			},
			{
				labelKey: "categories.MenClothes.subCategories.shoes",
				path: `${productsPathes.MenClothes}/shoes`,
				value: "shoes",
			},
		],
	},
	{
		labelKey: "categories.WomenBags.label",
		value: "WomenBags",
		path: productsPathes.WomenBags,
		icon: "/categories/women-bags.png",
		subCategories: [
			{
				labelKey: "categories.WomenBags.subCategories.casual",
				path: `${productsPathes.WomenBags}/casual`,
				value: "casual",
			},
		],
	},
	{
		labelKey: "categories.Cars.label",
		value: "cars",
		path: productsPathes.cars,
		icon: "/categories/car.png",
		subCategories: [
			{
				labelKey: "categories.Cars.subCategories.private",
				path: `${productsPathes.cars}/private`,
				value: "private",
			},
			{
				labelKey: "categories.Cars.subCategories.electric",
				path: `${productsPathes.cars}/electric`,
				value: "electric",
			},
			{
				labelKey: "categories.Cars.subCategories.parts",
				path: `${productsPathes.cars}/parts`,
				value: "parts",
			},
			{
				labelKey: "categories.Cars.subCategories.accessories",
				path: `${productsPathes.cars}/accessories`,
				value: "accessories",
			},
		],
	},
	{
		labelKey: "categories.Motorcycles.label",
		value: "motorcycles",
		path: productsPathes.motorcycles,
		icon: "/categories/motorcycle.png",
		subCategories: [
			{
				labelKey: "categories.Motorcycles.subCategories.sport",
				path: `${productsPathes.motorcycles}/sport`,
				value: "sport",
			},
			{
				labelKey: "categories.Motorcycles.subCategories.scooters",
				path: `${productsPathes.motorcycles}/scooters`,
				value: "scooters",
			},
			{
				labelKey: "categories.Motorcycles.subCategories.parts",
				path: `${productsPathes.motorcycles}/parts`,
				value: "parts",
			},
		],
	},
	{
		labelKey: "categories.Trucks.label",
		value: "trucks",
		path: productsPathes.trucks,
		icon: "/categories/truck.png",
		subCategories: [
			{
				labelKey: "categories.Trucks.subCategories.light",
				path: `${productsPathes.trucks}/light`,
				value: "light",
			},
			{
				labelKey: "categories.Trucks.subCategories.heavy",
				path: `${productsPathes.trucks}/heavy`,
				value: "heavy",
			},
		],
	},
	{
		labelKey: "categories.Bikes.label",
		value: "bikes",
		path: productsPathes.bikes,
		icon: "/categories/bike.png",
		subCategories: [
			{
				labelKey: "categories.Bikes.subCategories.kids",
				path: `${productsPathes.bikes}/kids`,
				value: "kids",
			},
			{
				labelKey: "categories.Bikes.subCategories.mountain",
				path: `${productsPathes.bikes}/mountain`,
				value: "mountain",
			},
			{
				labelKey: "categories.Bikes.subCategories.road",
				path: `${productsPathes.bikes}/road`,
				value: "road",
			},
		],
	},
	{
		labelKey: "categories.ElectricVehicles.label",
		value: "electric-vehicles",
		path: productsPathes.electricVehicles,
		icon: "/categories/electric-vehicle.png",
		subCategories: [
			{
				labelKey: "categories.ElectricVehicles.subCategories.cars",
				path: `${productsPathes.electricVehicles}/cars`,
				value: "cars",
			},
			{
				labelKey: "categories.ElectricVehicles.subCategories.scooters",
				path: `${productsPathes.electricVehicles}/scooters`,
				value: "scooters",
			},
		],
	},
] as const;

// export type NavCategory[] = (typeof productCategories)[number];
