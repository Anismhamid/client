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
    | 'Furniture'
    | 'Cameras'
    | 'Books'
    | 'MusicalInstruments'
    | 'ConstructionEquipment'
    | 'IndustrialEquipment'
    | 'WeldingEquipment'
    | 'OfficeEquipment'
    | 'Services';

export interface Field {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select' | 'date' | 'color' | 'array';
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

        trees: [
            { name: 'brand', type: 'text' },
            { name: 'treeType', type: 'text', required: true },
            { name: 'height', type: 'number' },
            { name: 'ageYears', type: 'number' },
            { name: 'fruitBearing', type: 'boolean' },
            { name: 'fruitType', type: 'text' },
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

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },
            { name: 'propertyAge', type: 'number' },
            { name: 'utilitiesIncluded', type: 'boolean' },
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

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },
            { name: 'propertyAge', type: 'number' },
            { name: 'utilitiesIncluded', type: 'boolean' },
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

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },
            { name: 'propertyAge', type: 'number' },
            { name: 'utilitiesIncluded', type: 'boolean' },
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

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },
            { name: 'propertyAge', type: 'number' },
            { name: 'utilitiesIncluded', type: 'boolean' },
        ],

        land: [
            { name: 'area', type: 'number', required: true },

            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },
            { name: 'propertyAge', type: 'number' },
            { name: 'utilitiesIncluded', type: 'boolean' },
        ],

        room: [
            { name: 'area', type: 'number', required: true },
            { name: 'rooms', type: 'number' },
            { name: 'bathrooms', type: 'number' },
            { name: 'furnished', type: 'boolean' },

            {
                name: 'roomType',
                type: 'select',
                options: ['private_room', 'shared_room', 'master_room'],
            },

            {
                name: 'rentalType',
                type: 'select',
                options: ['sale', 'rent', 'daily'],
            },

            { name: 'monthlyRent', type: 'number' },
            { name: 'availableFrom', type: 'date' },

            {
                name: 'genderPreference',
                type: 'select',
                options: ['male', 'female', 'any'],
            },

            { name: 'utilitiesIncluded', type: 'boolean' },
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
            { name: 'birdType', type: 'text' },
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
    /* ================== Cameras ================== */
    Cameras: {
        cameras: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },

            {
                name: 'cameraType',
                type: 'select',
                options: [
                    'dslr',
                    'mirrorless',
                    'compact',
                    'action',
                    'security',
                    'professional_video',
                ],
            },

            { name: 'sensorType', type: 'text' },
            { name: 'megapixels', type: 'number' },
            { name: 'resolution', type: 'text' },
            { name: 'videoResolution', type: 'text' },
            { name: 'lensMount', type: 'text' },
            { name: 'focalLength', type: 'text' },

            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },

            { name: 'warranty', type: 'text' },
            { name: 'includedAccessories', type: 'array' },
        ],

        lenses: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'lensMount', type: 'text' },
            { name: 'focalLength', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
            { name: 'includedAccessories', type: 'array' },
        ],

        video: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'resolution', type: 'text' },
            { name: 'videoResolution', type: 'text' },
            { name: 'sensorType', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
            { name: 'includedAccessories', type: 'array' },
        ],

        accessories: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
            { name: 'includedAccessories', type: 'array' },
        ],
    },

    /* ================== Books ================== */
    Books: {
        school: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        university: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        novels: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        children: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        religious: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        language: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        business: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],

        other: [
            { name: 'title', type: 'text', required: true },
            { name: 'author', type: 'text' },
            { name: 'publisher', type: 'text' },
            { name: 'edition', type: 'text' },
            { name: 'publicationYear', type: 'number' },
            { name: 'language', type: 'text' },
            { name: 'isbn', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'good', 'fair'],
            },
        ],
    },

    /* ================== Musical Instruments ================== */
    MusicalInstruments: {
        guitars: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        pianos: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        keyboards: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        drums: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        violins: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        wind: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        percussion: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        other: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'material', type: 'text' },
            { name: 'color', type: 'color' },
            { name: 'size', type: 'text' },
            { name: 'electric', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],
    },

    /* ================== Construction Equipment ================== */
    ConstructionEquipment: {
        excavators: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        loaders: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        cranes: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        concrete_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        scaffolding: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        cutting_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        compaction_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        other: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            { name: 'enginePower', type: 'number' },
            {
                name: 'fuelType',
                type: 'select',
                options: ['diesel', 'gasoline', 'electric', 'hybrid'],
            },
            { name: 'weight', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],
    },

    /* ================== Industrial Equipment ================== */
    IndustrialEquipment: {
        industrial_machines: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        compressors: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        generators: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        production_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        packaging_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        material_handling: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        other: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'year', type: 'number' },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'capacity', type: 'number' },
            { name: 'operatingHours', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],
    },

    /* ================== Welding Equipment ================== */
    WeldingEquipment: {
        welding_machines: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'weldingType',
                type: 'select',
                options: ['mig', 'mag', 'tig', 'arc', 'plasma', 'spot'],
            },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'amperage', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        plasma_cutters: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'weldingType',
                type: 'select',
                options: ['plasma'],
            },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'amperage', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        welding_accessories: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        protective_equipment: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],

        other: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            {
                name: 'weldingType',
                type: 'select',
                options: ['mig', 'mag', 'tig', 'arc', 'plasma', 'spot'],
            },
            { name: 'power', type: 'number' },
            { name: 'voltage', type: 'number' },
            { name: 'amperage', type: 'number' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'accessories', type: 'array' },
        ],
    },

    /* ================== Office Equipment ================== */
    OfficeEquipment: {
        printers: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'printTechnology',
                type: 'select',
                options: ['laser', 'inkjet', 'thermal', 'other'],
            },
            { name: 'colorPrinting', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        scanners: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'printTechnology',
                type: 'select',
                options: ['laser', 'inkjet', 'thermal', 'other'],
            },
            { name: 'colorPrinting', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        copiers: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'printTechnology',
                type: 'select',
                options: ['laser', 'inkjet', 'thermal', 'other'],
            },
            { name: 'colorPrinting', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        projectors: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            { name: 'colorPrinting', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        shredders: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        laminators: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],

        other: [
            { name: 'brand', type: 'text' },
            { name: 'model', type: 'text' },
            { name: 'connectivity', type: 'text' },
            {
                name: 'printTechnology',
                type: 'select',
                options: ['laser', 'inkjet', 'thermal', 'other'],
            },
            { name: 'colorPrinting', type: 'boolean' },
            {
                name: 'condition',
                type: 'select',
                options: ['new', 'like_new', 'excellent', 'good', 'fair'],
            },
            { name: 'warranty', type: 'text' },
        ],
    },

    /* ================== Services ================== */
    Services: {
        maintenance: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            {
                name: 'availableDays',
                type: 'array',
                options: [
                    'sunday',
                    'monday',
                    'tuesday',
                    'wednesday',
                    'thursday',
                    'friday',
                    'saturday',
                ],
            },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        electrical: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        plumbing: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        cleaning: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        transportation: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        moving: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        automotive: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        programming: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        design: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        photography: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        marketing: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        education: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        beauty: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],

        other: [
            { name: 'serviceTitle', type: 'text', required: true },
            { name: 'providerName', type: 'text' },
            { name: 'experienceYears', type: 'number' },
            { name: 'priceFrom', type: 'number' },
            { name: 'priceTo', type: 'number' },
            {
                name: 'pricingType',
                type: 'select',
                options: ['hourly', 'fixed', 'daily', 'monthly', 'negotiable'],
            },
            { name: 'availableDays', type: 'array' },
            { name: 'availableHours', type: 'text' },
            { name: 'serviceArea', type: 'text' },
            { name: 'emergencyService', type: 'boolean' },
        ],
    },
};
