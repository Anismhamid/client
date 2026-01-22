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

export const categoriesLogic = {
	// ================== House ==================
	House: {
		kitchen: [
			{name: "brand", type: "text"},
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
			{name: "usageType", type: "text"},
		],
	},

	// ================== Garden ==================
	Garden: {
		plants: [
			{name: "plantType", type: "text", required: true},
			{name: "season", type: "text"},
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

	// ================== Cars ==================
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

	// ================== BIKES ==================
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

	// ================== TRUCKS ==================
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

	// ================== CLEANING ==================
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

	// ================== MEN CLOTHES ==================
	MenClothes: {
		casual: [
			{name: "size", type: "text", required: true},
			{name: "material", type: "text"},
			{name: "color", type: "text"},
		],
		formal: [
			{name: "size", type: "text", required: true},
			{name: "material", type: "text"},
		],
		shoes: [
			{name: "size", type: "text", required: true},
			{name: "color", type: "text"},
		],
	},

	// ================== WOMEN CLOTHES ==================
	WomenClothes: {
		casual: [
			{name: "size", type: "text", required: true},
			{name: "color", type: "text"},
		],
		dresses: [
			{name: "size", type: "text", required: true},
			{name: "length", type: "text"},
		],
		shoes: [
			{name: "size", type: "text", required: true},
			{name: "heelHeight", type: "number"},
		],
	},

	// ================== BABY ==================
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

	// ================== KIDS ==================
	Kids: {
		educational: [
			{name: "ageGroup", type: "text", required: true},
			{name: "safeMaterial", type: "boolean"},
		],
		toys: [
			{name: "ageGroup", type: "text"},
			{name: "safeMaterial", type: "boolean"},
		],
		outdoor: [{name: "ageGroup", type: "text"}],
	},

	// ================== HEALTH ==================
	Health: {
		personalCare: [{name: "brand", type: "text", required: true}],
		medical: [
			{name: "brand", type: "text"},
			{name: "expiryDate", type: "text"},
		],
		fitness: [{name: "brand", type: "text"}],
	},

	// ================== BEAUTY ==================
	Beauty: {
		makeup: [{name: "brand", type: "text", required: true}],
		skincare: [
			{name: "brand", type: "text"},
			{name: "expiryDate", type: "text"},
		],
		hair: [{name: "brand", type: "text"}],
	},

	// ================== WATCHES ==================
	Watches: {
		classic: [{name: "brand", type: "text"}],
		smart: [
			{name: "brand", type: "text"},
			{name: "waterResistant", type: "boolean"},
		],
		hand: [{name: "brand", type: "text"}],
	},

	// ================== ELECTRIC VEHICLES ==================
	ElectricVehicles: {
		scooters: [
			{name: "brand", type: "text"},
			{name: "rangeKm", type: "number"},
		],
	},
};
