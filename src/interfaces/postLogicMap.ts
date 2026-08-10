export type CategoryValue =
    | 'House'
    | 'Garden'
    | 'Cars'
    | 'Motorcycles'
    | 'Bikes'
    | 'Trucks'
    | 'ElectricVehicles'
    | 'MenClothes'
    | 'WomenClothes'
    | 'WomenBags'
    | 'Baby'
    | 'Kids'
    | 'Health'
    | 'Beauty'
    | 'Watches'
    | 'Cleaning'
    | 'Electronics'
    | 'Art'
    | 'Gaming'
    | 'RealEstate'
    | 'Pets'
    | 'Furniture';

export interface Field {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'color';
    required?: boolean;
    options?: string[];
}

export type SubCategoryFields = Record<string, Field[]>;

export const categoriesLogic: Record<CategoryValue, SubCategoryFields> = {
    /* ================== House ================== */
    House: {
        kitchen: [
            { name: 'brand', type: 'text', required: true },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'capacity', type: 'number' },
            { name: 'powerWatts', type: 'number' },
            { name: 'usageType', type: 'text' },
        ],

        storage: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'capacity', type: 'number' },
            { name: 'usageType', type: 'text' },
        ],

        decor: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
        ],

        maintenance: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'dimensions', type: 'text' },
            { name: 'powerWatts', type: 'number' },
            { name: 'usageType', type: 'text' },
        ],
    },

    /* ================== Garden ================== */
    Garden: {
        plants: [
            { name: 'brand', type: 'text' },
            { name: 'plantType', type: 'text', required: true },
            {
                name: 'season',
                type: 'select',
                options: ['spring', 'summer', 'autumn', 'winter'],
            },
            { name: 'sunExposure', type: 'text' },
        ],

        watering: [
            { name: 'brand', type: 'text' },
            { name: 'hoseLength', type: 'number' },
            { name: 'automatic', type: 'boolean' },
        ],

        tools: [
            { name: 'brand', type: 'text' },
            { name: 'toolType', type: 'text' },
            { name: 'weatherResistant', type: 'boolean' },
        ],

        outdoorDecor: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'weatherResistant', type: 'boolean' },
        ],
    },

    /* ================== Cars ================== */
    Cars: {
        private: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'diesel', 'hybrid', 'electric'],
                required: true,
            },
            { name: 'mileage', type: 'number' },
            { name: 'color', type: 'color' },
        ],

        electric: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'batteryCapacity', type: 'number' },
            { name: 'rangeKm', type: 'number' },
            { name: 'mileage', type: 'number' },
            { name: 'color', type: 'color' },
        ],

        parts: [
            { name: 'brand', type: 'text', required: true },
            { name: 'color', type: 'color' },
        ],
    },

    /* ================== Bikes ================== */
    Bikes: {
        kids: [
            { name: 'frameSize', type: 'text', required: true },
            { name: 'color', type: 'color' },
        ],

        mountain: [
            { name: 'frameSize', type: 'text', required: true },
            { name: 'color', type: 'color' },
            { name: 'suspension', type: 'boolean' },
        ],

        road: [
            { name: 'frameSize', type: 'text', required: true },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
        ],
    },

    /* ================== Trucks ================== */
    Trucks: {
        light: [
            { name: 'brand', type: 'text', required: true },
            {
                name: 'loadCapacityTons',
                type: 'number',
                required: true,
            },
        ],

        heavy: [
            { name: 'brand', type: 'text', required: true },
            {
                name: 'loadCapacityTons',
                type: 'number',
                required: true,
            },
            { name: 'axles', type: 'number' },
        ],
    },

    /* ================== Electric Vehicles ================== */
    ElectricVehicles: {
        cars: [
            { name: 'brand', type: 'text', required: true },
            { name: 'batteryCapacity', type: 'number' },
            { name: 'rangeKm', type: 'number' },
        ],

        scooters: [
            { name: 'brand', type: 'text', required: true },
            { name: 'batteryCapacity', type: 'number' },
            { name: 'rangeKm', type: 'number' },
        ],
    },

    Motorcycles: {
        street: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'engineCapacity', type: 'number', required: true },
            { name: 'mileage', type: 'number' },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'electric'],
            },
            { name: 'color', type: 'color' },
        ],

        sport: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'engineCapacity', type: 'number', required: true },
            { name: 'mileage', type: 'number' },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'electric'],
            },
            { name: 'color', type: 'color' },
        ],

        cruiser: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'engineCapacity', type: 'number', required: true },
            { name: 'mileage', type: 'number' },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'electric'],
            },
            { name: 'color', type: 'color' },
        ],

        offRoad: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'engineCapacity', type: 'number', required: true },
            { name: 'mileage', type: 'number' },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'electric'],
            },
            { name: 'color', type: 'color' },
        ],

        scooter: [
            { name: 'brand', type: 'text', required: true },
            { name: 'year', type: 'number', required: true },
            { name: 'engineCapacity', type: 'number', required: true },
            { name: 'mileage', type: 'number' },
            {
                name: 'fuel',
                type: 'select',
                options: ['gasoline', 'electric'],
            },
            { name: 'color', type: 'color' },
        ],

        parts: [
            { name: 'partType', type: 'text', required: true },
            { name: 'brand', type: 'text' },
        ],
    },
    /* ================== Men Clothes ================== */
    MenClothes: {
        casual: [
            {
                name: 'size',
                type: 'select',
                options: ['S', 'M', 'L', 'XL'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
        ],

        formal: [
            {
                name: 'size',
                type: 'select',
                options: ['S', 'M', 'L', 'XL'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
        ],

        shoes: [
            { name: 'size', type: 'number', required: true },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
        ],
    },

    /* ================== Women Clothes ================== */
    WomenClothes: {
        casual: [
            {
                name: 'size',
                type: 'select',
                options: ['XS', 'S', 'M', 'L', 'XL'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
        ],

        dresses: [
            {
                name: 'size',
                type: 'select',
                options: ['XS', 'S', 'M', 'L', 'XL'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
            { name: 'heelHeight', type: 'number' },
        ],

        shoes: [
            { name: 'size', type: 'number', required: true },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'heelHeight', type: 'number' },
        ],
    },

    /* ================== Women Bags ================== */
    WomenBags: {
        handbags: [
            {
                name: 'size',
                type: 'select',
                options: ['Mini', 'Small', 'Medium', 'Large'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
        ],

        toteBags: [
            {
                name: 'size',
                type: 'select',
                options: ['Small', 'Medium', 'Large', 'Oversized'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
        ],

        backpacks: [
            {
                name: 'size',
                type: 'select',
                options: ['Mini', 'Small', 'Medium', 'Large'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
        ],

        clutches: [
            {
                name: 'size',
                type: 'select',
                options: ['Mini', 'Standard'],
                required: true,
            },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'length', type: 'text' },
        ],
    },

    /* ================== Baby ================== */
    Baby: {
        clothes: [
            { name: 'ageGroup', type: 'text', required: true },
            { name: 'material', type: 'text' },
        ],

        care: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
        ],

        feeding: [
            { name: 'ageGroup', type: 'text', required: true },
            { name: 'brand', type: 'text', required: true },
            { name: 'material', type: 'text' },
        ],
    },

    /* ================== Kids ================== */
    Kids: {
        educational: [
            { name: 'ageGroup', type: 'text', required: true },
            { name: 'safeMaterial', type: 'boolean' },
        ],

        toys: [
            { name: 'ageGroup', type: 'text', required: true },
            { name: 'safeMaterial', type: 'boolean' },
        ],

        outdoor: [
            { name: 'ageGroup', type: 'text', required: true },
            { name: 'safeMaterial', type: 'boolean' },
        ],
    },

    /* ================== Health ================== */
    Health: {
        personalCare: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],

        medical: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],

        fitness: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],
    },

    /* ================== Beauty ================== */
    Beauty: {
        makeup: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],

        skincare: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],

        hair: [
            { name: 'brand', type: 'text' },
            { name: 'expiryDate', type: 'date' },
        ],
    },

    /* ================== Watches ================== */
    Watches: {
        classic: [
            { name: 'brand', type: 'text' },
            { name: 'waterResistant', type: 'boolean' },
        ],

        smart: [
            { name: 'brand', type: 'text' },
            { name: 'waterResistant', type: 'boolean' },
        ],

        hand: [
            { name: 'brand', type: 'text' },
            { name: 'waterResistant', type: 'boolean' },
        ],
    },

    /* ================== Cleaning ================== */
    Cleaning: {
        detergents: [
            { name: 'brand', type: 'text' },
            { name: 'volume', type: 'number' },
        ],

        tools: [
            { name: 'brand', type: 'text' },
            { name: 'volume', type: 'number' },
        ],

        disinfection: [
            { name: 'brand', type: 'text' },
            { name: 'volume', type: 'number' },
        ],
    },

    /* ================== Electronics ================== */
    Electronics: {
        smartphones: [
            { name: 'brand', type: 'text', required: true },
            { name: 'model', type: 'text' },
            { name: 'ram', type: 'number' },
            { name: 'storage', type: 'number' },
            { name: 'screenSize', type: 'number' },
            { name: 'operatingSystem', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'color', type: 'color' },
            { name: 'warranty', type: 'text' },
        ],

        laptops: [
            { name: 'brand', type: 'text', required: true },
            { name: 'model', type: 'text' },
            { name: 'processor', type: 'text' },
            { name: 'ram', type: 'number' },
            { name: 'storage', type: 'number' },
            { name: 'screenSize', type: 'number' },
            { name: 'operatingSystem', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'color', type: 'color' },
            { name: 'warranty', type: 'text' },
        ],

        tablets: [
            { name: 'brand', type: 'text', required: true },
            { name: 'model', type: 'text' },
            { name: 'ram', type: 'number' },
            { name: 'storage', type: 'number' },
            { name: 'screenSize', type: 'number' },
            { name: 'operatingSystem', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'color', type: 'color' },
            { name: 'warranty', type: 'text' },
        ],

        accessories: [
            { name: 'brand', type: 'text', required: true },
            { name: 'model', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'warranty', type: 'text' },
        ],

        audio: [
            { name: 'brand', type: 'text', required: true },
            { name: 'model', type: 'text' },
            { name: 'color', type: 'color' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],
    },

    /* ================== Art ================== */
    Art: {
        paintings: [
            { name: 'artist', type: 'text' },
            { name: 'creationYear', type: 'number' },
            { name: 'dimensions', type: 'text' },
            { name: 'technique', type: 'text' },
            { name: 'certificate', type: 'boolean' },
            { name: 'provenance', type: 'text' },
            { name: 'condition', type: 'text' },
            { name: 'framed', type: 'boolean' },
        ],

        sculptures: [
            { name: 'artist', type: 'text' },
            { name: 'creationYear', type: 'number' },
            { name: 'dimensions', type: 'text' },
            { name: 'technique', type: 'text' },
            { name: 'certificate', type: 'boolean' },
            { name: 'provenance', type: 'text' },
            { name: 'condition', type: 'text' },
        ],

        photography: [
            { name: 'artist', type: 'text' },
            { name: 'creationYear', type: 'number' },
            { name: 'dimensions', type: 'text' },
            { name: 'technique', type: 'text' },
            { name: 'certificate', type: 'boolean' },
            { name: 'provenance', type: 'text' },
            { name: 'condition', type: 'text' },
            { name: 'framed', type: 'boolean' },
        ],

        crafts: [
            { name: 'artist', type: 'text' },
            { name: 'creationYear', type: 'number' },
            { name: 'dimensions', type: 'text' },
            { name: 'technique', type: 'text' },
            { name: 'certificate', type: 'boolean' },
            { name: 'condition', type: 'text' },
        ],

        collectibles: [
            { name: 'artist', type: 'text' },
            { name: 'creationYear', type: 'number' },
            { name: 'dimensions', type: 'text' },
            { name: 'certificate', type: 'boolean' },
            { name: 'provenance', type: 'text' },
            { name: 'condition', type: 'text' },
        ],
    },

    /* ================== Gaming ================== */
    Gaming: {
        consoles: [
            {
                name: 'platform',
                type: 'select',
                options: ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile'],
            },
            { name: 'edition', type: 'text' },
            { name: 'releaseYear', type: 'number' },
            { name: 'condition', type: 'text' },
        ],

        games: [
            {
                name: 'platform',
                type: 'select',
                options: ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile'],
            },
            { name: 'genre', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'multiplayer', type: 'boolean' },
            { name: 'rating', type: 'text' },
            { name: 'language', type: 'text' },
            { name: 'releaseYear', type: 'number' },
        ],

        accessories: [
            {
                name: 'platform',
                type: 'select',
                options: ['PlayStation', 'Xbox', 'Nintendo', 'PC', 'Mobile'],
            },
            { name: 'edition', type: 'text' },
        ],

        pc_gaming: [
            { name: 'platform', type: 'select', options: ['PC'] },
            { name: 'processor', type: 'text' },
            { name: 'ram', type: 'number' },
            { name: 'storage', type: 'number' },
            { name: 'releaseYear', type: 'number' },
        ],
    },

    /* ================== Real Estate ================== */
    RealEstate: {
        apartment: [
            { name: 'area', type: 'number', required: true },
            { name: 'rooms', type: 'number' },
            { name: 'bathrooms', type: 'number' },
            { name: 'floors', type: 'number' },
            { name: 'hasParking', type: 'boolean' },
            { name: 'hasElevator', type: 'boolean' },
            { name: 'furnished', type: 'boolean' },
            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },
            { name: 'propertyAge', type: 'number' },
        ],

        house: [
            { name: 'area', type: 'number', required: true },
            { name: 'rooms', type: 'number' },
            { name: 'bathrooms', type: 'number' },
            { name: 'floors', type: 'number' },
            { name: 'hasParking', type: 'boolean' },
            { name: 'hasElevator', type: 'boolean' },
            { name: 'furnished', type: 'boolean' },
            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },
            { name: 'propertyAge', type: 'number' },
        ],

        villa: [
            { name: 'area', type: 'number', required: true },
            { name: 'rooms', type: 'number' },
            { name: 'bathrooms', type: 'number' },
            { name: 'floors', type: 'number' },
            { name: 'hasParking', type: 'boolean' },
            { name: 'hasElevator', type: 'boolean' },
            { name: 'furnished', type: 'boolean' },
            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },
            { name: 'propertyAge', type: 'number' },
        ],

        commercial: [
            { name: 'area', type: 'number', required: true },
            { name: 'rooms', type: 'number' },
            { name: 'bathrooms', type: 'number' },
            { name: 'floors', type: 'number' },
            { name: 'hasParking', type: 'boolean' },
            { name: 'hasElevator', type: 'boolean' },
            { name: 'furnished', type: 'boolean' },
            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },
            { name: 'propertyAge', type: 'number' },
        ],

        land: [
            { name: 'area', type: 'number', required: true },
            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },
            { name: 'propertyAge', type: 'number' },
        ],
    },

    /* ================== Pets ================== */
    Pets: {
        dogs: [
            { name: 'breed', type: 'text' },
            { name: 'age', type: 'number' },
            {
                name: 'gender',
                type: 'select',
                options: ['male', 'female'],
            },
            { name: 'vaccinated', type: 'boolean' },
            { name: 'neutered', type: 'boolean' },
            { name: 'microchipped', type: 'boolean' },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
            { name: 'healthIssues', type: 'text' },
            { name: 'temperament', type: 'text' },
        ],

        cats: [
            { name: 'breed', type: 'text' },
            { name: 'age', type: 'number' },
            {
                name: 'gender',
                type: 'select',
                options: ['male', 'female'],
            },
            { name: 'vaccinated', type: 'boolean' },
            { name: 'neutered', type: 'boolean' },
            { name: 'microchipped', type: 'boolean' },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
            { name: 'healthIssues', type: 'text' },
            { name: 'temperament', type: 'text' },
        ],

        birds: [
            { name: 'breed', type: 'text' },
            { name: 'age', type: 'number' },
            {
                name: 'gender',
                type: 'select',
                options: ['male', 'female'],
            },
            { name: 'vaccinated', type: 'boolean' },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
            { name: 'healthIssues', type: 'text' },
            { name: 'temperament', type: 'text' },
        ],

        fish: [
            { name: 'breed', type: 'text' },
            { name: 'age', type: 'number' },
            {
                name: 'gender',
                type: 'select',
                options: ['male', 'female'],
            },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
            { name: 'healthIssues', type: 'text' },
        ],

        small_animals: [
            { name: 'breed', type: 'text' },
            { name: 'age', type: 'number' },
            {
                name: 'gender',
                type: 'select',
                options: ['male', 'female'],
            },
            { name: 'vaccinated', type: 'boolean' },
            { name: 'neutered', type: 'boolean' },
            { name: 'microchipped', type: 'boolean' },
            { name: 'color', type: 'color' },
            { name: 'weight', type: 'number' },
            { name: 'healthIssues', type: 'text' },
            { name: 'temperament', type: 'text' },
        ],

        supplies: [
            { name: 'brand', type: 'text' },
            { name: 'size', type: 'text' },
            { name: 'material', type: 'text' },
        ],
    },

    /* ================== Furniture ================== */
    Furniture: {
        living_room: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],

        bedroom: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],

        dining: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],

        office: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],

        outdoor: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],

        kitchen: [
            { name: 'brand', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'dimensions', type: 'text' },
            { name: 'weight', type: 'number' },
            { name: 'assemblyRequired', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
            { name: 'style', type: 'text' },
            { name: 'includesAccessories', type: 'boolean' },
        ],
    },
};
