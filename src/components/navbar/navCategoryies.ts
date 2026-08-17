import { productsPathes } from '../../routes/routes';

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
    subCategories: readonly SubCategory[];
}

export const productsAndCategories: NavCategory[] = [
    /* ================== House ================== */
    {
        labelKey: 'categories.House.label',
        value: 'House',
        path: productsPathes.house,
        icon: '/categories/house.png',
        subCategories: [
            {
                labelKey: 'categories.House.subCategories.kitchen',
                value: 'kitchen',
                path: `${productsPathes.house}/kitchen`,
            },
            {
                labelKey: 'categories.House.subCategories.storage',
                value: 'storage',
                path: `${productsPathes.house}/storage`,
            },
            {
                labelKey: 'categories.House.subCategories.decor',
                value: 'decor',
                path: `${productsPathes.house}/decor`,
            },
            {
                labelKey: 'categories.House.subCategories.maintenance',
                value: 'maintenance',
                path: `${productsPathes.house}/maintenance`,
            },
        ],
    },

    /* ================== Garden ================== */
    {
        labelKey: 'categories.Garden.label',
        value: 'Garden',
        path: productsPathes.garden,
        icon: '/categories/gardening.png',
        subCategories: [
            {
                labelKey: 'categories.Garden.subCategories.plants',
                value: 'plants',
                path: `${productsPathes.garden}/plants`,
            },
            {
                labelKey: 'categories.Garden.subCategories.watering',
                value: 'watering',
                path: `${productsPathes.garden}/watering`,
            },
            {
                labelKey: 'categories.Garden.subCategories.tools',
                value: 'tools',
                path: `${productsPathes.garden}/tools`,
            },
            {
                labelKey: 'categories.Garden.subCategories.outdoorDecor',
                value: 'outdoorDecor',
                path: `${productsPathes.garden}/outdoorDecor`,
            },
        ],
    },

    /* ================== Cars ================== */
    {
        labelKey: 'categories.Cars.label',
        value: 'Cars',
        path: productsPathes.cars,
        icon: '/categories/car.png',
        subCategories: [
            {
                labelKey: 'categories.Cars.subCategories.private',
                value: 'private',
                path: `${productsPathes.cars}/private`,
            },
            {
                labelKey: 'categories.Cars.subCategories.electric',
                value: 'electric',
                path: `${productsPathes.cars}/electric`,
            },
            {
                labelKey: 'categories.Cars.subCategories.parts',
                value: 'parts',
                path: `${productsPathes.cars}/parts`,
            },
        ],
    },

    /* ================== Bikes ================== */
    {
        labelKey: 'categories.Bikes.label',
        value: 'Bikes',
        path: productsPathes.bikes,
        icon: '/categories/bike.png',
        subCategories: [
            {
                labelKey: 'categories.Bikes.subCategories.kids',
                value: 'kids',
                path: `${productsPathes.bikes}/kids`,
            },
            {
                labelKey: 'categories.Bikes.subCategories.mountain',
                value: 'mountain',
                path: `${productsPathes.bikes}/mountain`,
            },
            {
                labelKey: 'categories.Bikes.subCategories.road',
                value: 'road',
                path: `${productsPathes.bikes}/road`,
            },
        ],
    },

    /* ================== Trucks ================== */
    {
        labelKey: 'categories.Trucks.label',
        value: 'Trucks',
        path: productsPathes.trucks,
        icon: '/categories/truck.png',
        subCategories: [
            {
                labelKey: 'categories.Trucks.subCategories.light',
                value: 'light',
                path: `${productsPathes.trucks}/light`,
            },
            {
                labelKey: 'categories.Trucks.subCategories.heavy',
                value: 'heavy',
                path: `${productsPathes.trucks}/heavy`,
            },
        ],
    },

    /* ================== Electric Vehicles ================== */
    {
        labelKey: 'categories.ElectricVehicles.label',
        value: 'ElectricVehicles',
        path: productsPathes.electricVehicles,
        icon: '/categories/electric-vehicle.png',
        subCategories: [
            {
                labelKey: 'categories.ElectricVehicles.subCategories.cars',
                value: 'cars',
                path: `${productsPathes.electricVehicles}/cars`,
            },
            {
                labelKey: 'categories.ElectricVehicles.subCategories.scooters',
                value: 'scooters',
                path: `${productsPathes.electricVehicles}/scooters`,
            },
        ],
    },

    /* ================== Men Clothes ================== */
    {
        labelKey: 'categories.MenClothes.label',
        value: 'MenClothes',
        path: productsPathes.MenClothes,
        icon: '/categories/men-clothes.png',
        subCategories: [
            {
                labelKey: 'categories.MenClothes.subCategories.casual',
                value: 'casual',
                path: `${productsPathes.MenClothes}/casual`,
            },
            {
                labelKey: 'categories.MenClothes.subCategories.formal',
                value: 'formal',
                path: `${productsPathes.MenClothes}/formal`,
            },
            {
                labelKey: 'categories.MenClothes.subCategories.shoes',
                value: 'shoes',
                path: `${productsPathes.MenClothes}/shoes`,
            },
        ],
    },

    /* ================== Women Clothes ================== */
    {
        labelKey: 'categories.WomenClothes.label',
        value: 'WomenClothes',
        path: productsPathes.WomenClothes,
        icon: '/categories/woman-clothes.png',
        subCategories: [
            {
                labelKey: 'categories.WomenClothes.subCategories.casual',
                value: 'casual',
                path: `${productsPathes.WomenClothes}/casual`,
            },
            {
                labelKey: 'categories.WomenClothes.subCategories.dresses',
                value: 'dresses',
                path: `${productsPathes.WomenClothes}/dresses`,
            },
            {
                labelKey: 'categories.WomenClothes.subCategories.shoes',
                value: 'shoes',
                path: `${productsPathes.WomenClothes}/shoes`,
            },
        ],
    },

    /* ================== Women Bags ================== */
    {
        labelKey: 'categories.WomenBags.label',
        value: 'WomenBags',
        path: productsPathes.WomenBags,
        icon: '/categories/women-bags.png',
        subCategories: [
            {
                labelKey: 'categories.WomenBags.subCategories.handbags',
                value: 'handbags',
                path: `${productsPathes.WomenBags}/handbags`,
            },
            {
                labelKey: 'categories.WomenBags.subCategories.toteBags',
                value: 'toteBags',
                path: `${productsPathes.WomenBags}/toteBags`,
            },
            {
                labelKey: 'categories.WomenBags.subCategories.backpacks',
                value: 'backpacks',
                path: `${productsPathes.WomenBags}/backpacks`,
            },
            {
                labelKey: 'categories.WomenBags.subCategories.clutches',
                value: 'clutches',
                path: `${productsPathes.WomenBags}/clutches`,
            },
        ],
    },

    /* ================== Baby ================== */
    {
        labelKey: 'categories.Baby.label',
        value: 'Baby',
        path: productsPathes.baby,
        icon: '/categories/baby.png',
        subCategories: [
            {
                labelKey: 'categories.Baby.subCategories.clothes',
                value: 'clothes',
                path: `${productsPathes.baby}/clothes`,
            },
            {
                labelKey: 'categories.Baby.subCategories.care',
                value: 'care',
                path: `${productsPathes.baby}/care`,
            },
            {
                labelKey: 'categories.Baby.subCategories.feeding',
                value: 'feeding',
                path: `${productsPathes.baby}/feeding`,
            },
        ],
    },

    /* ================== Kids ================== */
    {
        labelKey: 'categories.Kids.label',
        value: 'Kids',
        path: productsPathes.kids,
        icon: '/categories/kids.png',
        subCategories: [
            {
                labelKey: 'categories.Kids.subCategories.educational',
                value: 'educational',
                path: `${productsPathes.kids}/educational`,
            },
            {
                labelKey: 'categories.Kids.subCategories.toys',
                value: 'toys',
                path: `${productsPathes.kids}/toys`,
            },
            {
                labelKey: 'categories.Kids.subCategories.outdoor',
                value: 'outdoor',
                path: `${productsPathes.kids}/outdoor`,
            },
        ],
    },

    /* ================== Health ================== */
    {
        labelKey: 'categories.Health.label',
        value: 'Health',
        path: productsPathes.health,
        icon: '/categories/health.png',
        subCategories: [
            {
                labelKey: 'categories.Health.subCategories.personalCare',
                value: 'personalCare',
                path: `${productsPathes.health}/personalCare`,
            },
            {
                labelKey: 'categories.Health.subCategories.medical',
                value: 'medical',
                path: `${productsPathes.health}/medical`,
            },
            {
                labelKey: 'categories.Health.subCategories.fitness',
                value: 'fitness',
                path: `${productsPathes.health}/fitness`,
            },
        ],
    },

    /* ================== Beauty ================== */
    {
        labelKey: 'categories.Beauty.label',
        value: 'Beauty',
        path: productsPathes.beauty,
        icon: '/categories/beauty.png',
        subCategories: [
            {
                labelKey: 'categories.Beauty.subCategories.makeup',
                value: 'makeup',
                path: `${productsPathes.beauty}/makeup`,
            },
            {
                labelKey: 'categories.Beauty.subCategories.skincare',
                value: 'skincare',
                path: `${productsPathes.beauty}/skincare`,
            },
            {
                labelKey: 'categories.Beauty.subCategories.hair',
                value: 'hair',
                path: `${productsPathes.beauty}/hair`,
            },
        ],
    },

    /* ================== Watches ================== */
    {
        labelKey: 'categories.Watches.label',
        value: 'Watches',
        path: productsPathes.watches,
        icon: '/categories/watches.png',
        subCategories: [
            {
                labelKey: 'categories.Watches.subCategories.classic',
                value: 'classic',
                path: `${productsPathes.watches}/classic`,
            },
            {
                labelKey: 'categories.Watches.subCategories.smart',
                value: 'smart',
                path: `${productsPathes.watches}/smart`,
            },
            {
                labelKey: 'categories.Watches.subCategories.hand',
                value: 'hand',
                path: `${productsPathes.watches}/hand`,
            },
        ],
    },

    /* ================== Cleaning ================== */
    {
        labelKey: 'categories.Cleaning.label',
        value: 'Cleaning',
        path: productsPathes.cleaning,
        icon: '/categories/cleaning.png',
        subCategories: [
            {
                labelKey: 'categories.Cleaning.subCategories.detergents',
                value: 'detergents',
                path: `${productsPathes.cleaning}/detergents`,
            },
            {
                labelKey: 'categories.Cleaning.subCategories.tools',
                value: 'tools',
                path: `${productsPathes.cleaning}/tools`,
            },
            {
                labelKey: 'categories.Cleaning.subCategories.disinfection',
                value: 'disinfection',
                path: `${productsPathes.cleaning}/disinfection`,
            },
        ],
    },

    /* ================== Motorcycles ================== */
    {
        labelKey: 'categories.Motorcycles.label',
        value: 'Motorcycles',
        path: productsPathes.motorcycles,
        icon: '/categories/motorcycle.png',
        subCategories: [
            {
                labelKey: 'categories.Motorcycles.subCategories.street',
                value: 'street',
                path: `${productsPathes.motorcycles}/street`,
            },
            {
                labelKey: 'categories.Motorcycles.subCategories.sport',
                value: 'sport',
                path: `${productsPathes.motorcycles}/sport`,
            },
            {
                labelKey: 'categories.Motorcycles.subCategories.cruiser',
                value: 'cruiser',
                path: `${productsPathes.motorcycles}/cruiser`,
            },
            {
                labelKey: 'categories.Motorcycles.subCategories.offRoad',
                value: 'offRoad',
                path: `${productsPathes.motorcycles}/offRoad`,
            },
            {
                labelKey: 'categories.Motorcycles.subCategories.scooter',
                value: 'scooter',
                path: `${productsPathes.motorcycles}/scooter`,
            },
            {
                labelKey: 'categories.Motorcycles.subCategories.parts',
                value: 'parts',
                path: `${productsPathes.motorcycles}/parts`,
            },
        ],
    },

    /* ================== Electronics ================== */
    {
        labelKey: 'categories.Electronics.label',
        value: 'Electronics',
        path: productsPathes.electronics,
        icon: '/categories/electronics.png',
        subCategories: [
            {
                labelKey: 'categories.Electronics.subCategories.smartphones',
                value: 'smartphones',
                path: `${productsPathes.electronics}/smartphones`,
            },
            {
                labelKey: 'categories.Electronics.subCategories.laptops',
                value: 'laptops',
                path: `${productsPathes.electronics}/laptops`,
            },
            {
                labelKey: 'categories.Electronics.subCategories.tablets',
                value: 'tablets',
                path: `${productsPathes.electronics}/tablets`,
            },
            {
                labelKey: 'categories.Electronics.subCategories.accessories',
                value: 'accessories',
                path: `${productsPathes.electronics}/accessories`,
            },
            {
                labelKey: 'categories.Electronics.subCategories.audio',
                value: 'audio',
                path: `${productsPathes.electronics}/audio`,
            },
        ],
    },

    /* ================== Art ================== */
    {
        labelKey: 'categories.Art.label',
        value: 'Art',
        path: productsPathes.art,
        icon: '/categories/art.png',
        subCategories: [
            {
                labelKey: 'categories.Art.subCategories.paintings',
                value: 'paintings',
                path: `${productsPathes.art}/paintings`,
            },
            {
                labelKey: 'categories.Art.subCategories.sculptures',
                value: 'sculptures',
                path: `${productsPathes.art}/sculptures`,
            },
            {
                labelKey: 'categories.Art.subCategories.photography',
                value: 'photography',
                path: `${productsPathes.art}/photography`,
            },
            {
                labelKey: 'categories.Art.subCategories.crafts',
                value: 'crafts',
                path: `${productsPathes.art}/crafts`,
            },
            {
                labelKey: 'categories.Art.subCategories.collectibles',
                value: 'collectibles',
                path: `${productsPathes.art}/collectibles`,
            },
        ],
    },

    /* ================== Gaming ================== */
    {
        labelKey: 'categories.Gaming.label',
        value: 'Gaming',
        path: productsPathes.gaming,
        icon: '/categories/gaming.png',
        subCategories: [
            {
                labelKey: 'categories.Gaming.subCategories.consoles',
                value: 'consoles',
                path: `${productsPathes.gaming}/consoles`,
            },
            {
                labelKey: 'categories.Gaming.subCategories.games',
                value: 'games',
                path: `${productsPathes.gaming}/games`,
            },
            {
                labelKey: 'categories.Gaming.subCategories.accessories',
                value: 'accessories',
                path: `${productsPathes.gaming}/accessories`,
            },
            {
                labelKey: 'categories.Gaming.subCategories.pc_gaming',
                value: 'pc_gaming',
                path: `${productsPathes.gaming}/pc_gaming`,
            },
        ],
    },

    /* ================== Real Estate ================== */
    {
        labelKey: 'categories.RealEstate.label',
        value: 'RealEstate',
        path: productsPathes.realEstate,
        icon: '/categories/realEstate.png',
        subCategories: [
            {
                labelKey: 'categories.RealEstate.subCategories.apartment',
                value: 'apartment',
                path: `${productsPathes.realEstate}/apartment`,
            },
            {
                labelKey: 'categories.RealEstate.subCategories.house',
                value: 'house',
                path: `${productsPathes.realEstate}/house`,
            },
            {
                labelKey: 'categories.RealEstate.subCategories.villa',
                value: 'villa',
                path: `${productsPathes.realEstate}/villa`,
            },
            {
                labelKey: 'categories.RealEstate.subCategories.commercial',
                value: 'commercial',
                path: `${productsPathes.realEstate}/commercial`,
            },
            {
                labelKey: 'categories.RealEstate.subCategories.land',
                value: 'land',
                path: `${productsPathes.realEstate}/land`,
            },
        ],
    },

    /* ================== Pets ================== */
    {
        labelKey: 'categories.Pets.label',
        value: 'Pets',
        path: productsPathes.pets,
        icon: '/categories/pets.png',
        subCategories: [
            {
                labelKey: 'categories.Pets.subCategories.dogs',
                value: 'dogs',
                path: `${productsPathes.pets}/dogs`,
            },
            {
                labelKey: 'categories.Pets.subCategories.cats',
                value: 'cats',
                path: `${productsPathes.pets}/cats`,
            },
            {
                labelKey: 'categories.Pets.subCategories.birds',
                value: 'birds',
                path: `${productsPathes.pets}/birds`,
            },
            {
                labelKey: 'categories.Pets.subCategories.fish',
                value: 'fish',
                path: `${productsPathes.pets}/fish`,
            },
            {
                labelKey: 'categories.Pets.subCategories.small_animals',
                value: 'small_animals',
                path: `${productsPathes.pets}/small_animals`,
            },
            {
                labelKey: 'categories.Pets.subCategories.supplies',
                value: 'supplies',
                path: `${productsPathes.pets}/supplies`,
            },
        ],
    },

    /* ================== Furniture ================== */
    {
        labelKey: 'categories.Furniture.label',
        value: 'Furniture',
        path: productsPathes.furniture,
        icon: '/categories/furniture.png',
        subCategories: [
            {
                labelKey: 'categories.Furniture.subCategories.living_room',
                value: 'living_room',
                path: `${productsPathes.furniture}/living_room`,
            },
            {
                labelKey: 'categories.Furniture.subCategories.bedroom',
                value: 'bedroom',
                path: `${productsPathes.furniture}/bedroom`,
            },
            {
                labelKey: 'categories.Furniture.subCategories.dining',
                value: 'dining',
                path: `${productsPathes.furniture}/dining`,
            },
            {
                labelKey: 'categories.Furniture.subCategories.office',
                value: 'office',
                path: `${productsPathes.furniture}/office`,
            },
            {
                labelKey: 'categories.Furniture.subCategories.outdoor',
                value: 'outdoor',
                path: `${productsPathes.furniture}/outdoor`,
            },
            {
                labelKey: 'categories.Furniture.subCategories.kitchen',
                value: 'kitchen',
                path: `${productsPathes.furniture}/kitchen`,
            },
        ],
    },
];