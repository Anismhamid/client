export type CategoryValue =
	| "House"
	| "Garden"
	| "Cars"
	| "Bikes"
	| "Trucks"
	| "Cleaning"
	| "MenClothes"
	| "WomenClothes"
	| "Baby"
	| "Kids"
	| "Health"
	| "Beauty"
	| "Watches"
	| "ElectricVehicles";

export interface Field {
	name: string;
	type: "text" | "number" | "boolean" | "select" | "date";
	required?: boolean;
	options?: string[];
}

export type SubCategoryFields = Record<string, Field[]>;

export const categoriesLogic: Record<CategoryValue, SubCategoryFields> = {
	House: {
		kitchen: [
			{name: "brand", type: "text", required: true},
			{name: "material", type: "text"},
			{name: "powerWatts", type: "number"},
			{name: "location", type: "text"},
		],
		storage: [
			{name: "material", type: "text", required: true},
			{name: "dimensions", type: "text"},
			{name: "capacity", type: "number"},
		],
		decor: [
			{name: "material", type: "text"},
			{name: "color", type: "text"},
		],
		maintenance: [
			{name: "brand", type: "text"},
			{name: "usageType", type: "select", options: ["indoor", "outdoor"]},
		],
	},

	Garden: {
		plants: [
			{name: "plantType", type: "text", required: true},
			{
				name: "season",
				type: "select",
				options: ["spring", "summer", "autumn", "winter"],
			},
			{name: "sunExposure", type: "text"},
		],
		watering: [
			{name: "brand", type: "text"},
			{name: "hoseLength", type: "number"},
			{name: "automatic", type: "boolean"},
		],
		tools: [
			{name: "brand", type: "text", required: true},
			{name: "toolType", type: "text"},
		],
		outdoorDecor: [
			{name: "material", type: "text"},
			{name: "weatherResistant", type: "boolean"},
		],
	},

	Cars: {
		private: [
			{name: "brand", type: "text", required: true},
			{name: "year", type: "number", required: true},
			{
				name: "fuel",
				type: "select",
				options: ["gasoline", "diesel", "hybrid"],
				required: true,
			},
			{name: "mileage", type: "number"},
			{name: "color", type: "text"},
		],
		electric: [
			{name: "brand", type: "text", required: true},
			{name: "batteryCapacity", type: "number", required: true},
			{name: "rangeKm", type: "number"},
		],
		parts: [],
		accessories: [],
	},

	Bikes: {
		kids: [
			{name: "frameSize", type: "text"},
			{name: "color", type: "text"},
		],
		mountain: [
			{name: "frameSize", type: "text", required: true},
			{name: "suspension", type: "boolean"},
		],
		road: [
			{name: "frameSize", type: "text", required: true},
			{name: "weight", type: "number"},
		],
	},

	Trucks: {
		light: [
			{name: "brand", type: "text", required: true},
			{name: "loadCapacityTons", type: "number", required: true},
		],
		heavy: [
			{name: "brand", type: "text", required: true},
			{name: "loadCapacityTons", type: "number", required: true},
			{name: "axles", type: "number"},
		],
	},

	Cleaning: {
		detergents: [
			{name: "brand", type: "text", required: true},
			{name: "volume", type: "number"},
		],
		tools: [{name: "brand", type: "text", required: true}],
		disinfection: [
			{name: "brand", type: "text"},
			{name: "volume", type: "number"},
		],
	},

	MenClothes: {
		casual: [
			{
				name: "size",
				type: "select",
				options: ["S", "M", "L", "XL"],
				required: true,
			},
			{name: "material", type: "text"},
			{name: "color", type: "text"},
		],
		formal: [
			{
				name: "size",
				type: "select",
				options: ["S", "M", "L", "XL"],
				required: true,
			},
			{name: "material", type: "text"},
		],
		shoes: [
			{name: "size", type: "number", required: true},
			{name: "color", type: "text"},
		],
	},

	WomenClothes: {
		casual: [
			{
				name: "size",
				type: "select",
				options: ["XS", "S", "M", "L", "XL"],
				required: true,
			},
			{name: "color", type: "text"},
		],
		dresses: [
			{
				name: "size",
				type: "select",
				options: ["XS", "S", "M", "L", "XL"],
				required: true,
			},
			{name: "length", type: "text"},
		],
		shoes: [
			{name: "size", type: "number", required: true},
			{name: "heelHeight", type: "number"},
		],
	},

	Baby: {
		clothes: [
			{name: "ageGroup", type: "text", required: true},
			{name: "material", type: "text"},
		],
		care: [{name: "brand", type: "text", required: true}],
		feeding: [
			{name: "brand", type: "text"},
			{name: "ageGroup", type: "text"},
		],
	},

	Kids: {
		educational: [
			{name: "ageGroup", type: "text", required: true},
			{name: "safeMaterial", type: "boolean"},
		],
		toys: [
			{name: "ageGroup", type: "text"},
			{name: "safeMaterial", type: "boolean"},
			{name: "material", type: "text"},
		],
		outdoor: [
			{name: "ageGroup", type: "text"},
			{name: "material", type: "text"},
		],
	},

	Health: {
		personalCare: [{name: "brand", type: "text", required: true}],
		medical: [
			{name: "brand", type: "text"},
			{name: "expiryDate", type: "date"},
		],
		fitness: [{name: "brand", type: "text"}],
	},

	Beauty: {
		makeup: [{name: "brand", type: "text", required: true}],
		skincare: [
			{name: "brand", type: "text"},
			{name: "expiryDate", type: "date"},
		],
		hair: [{name: "brand", type: "text"}],
	},

	Watches: {
		classic: [{name: "brand", type: "text"}],
		smart: [
			{name: "brand", type: "text"},
			{name: "waterResistant", type: "boolean"},
		],
		hand: [{name: "brand", type: "text"}],
	},

	ElectricVehicles: {
		scooters: [
			{name: "brand", type: "text"},
			{name: "rangeKm", type: "number"},
		],
		cars: [
			{name: "brand", type: "text"},
			{name: "batteryCapacity", type: "number"},
			{name: "rangeKm", type: "number"},
		],
	},
};
