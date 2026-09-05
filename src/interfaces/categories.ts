export const CATEGORIES = {
    House: 'House',
    Garden: 'Garden',
    Electronics: 'Electronics',
    Kids: 'Kids',
    Baby: 'Baby',
    Beauty: 'Beauty',
    Cleaning: 'Cleaning',
    Health: 'Health',
    Watches: 'Watches',
    MenClothes: 'MenClothes',
    WomenClothes: 'WomenClothes',
    WomenBags: 'WomenBags',

    Cars: 'Cars',
    Motorcycles: 'Motorcycles',
    Trucks: 'Trucks',
    Bikes: 'Bikes',
    ElectricVehicles: 'ElectricVehicles',

    Art: 'Art',
    Gaming: 'Gaming',
    RealEstate: 'RealEstate',
    Pets: 'Pets',
    Furniture: 'Furniture',

    // New categories
    Cameras: 'Cameras',
    Books: 'Books',
    MusicalInstruments: 'MusicalInstruments',
    ConstructionEquipment: 'ConstructionEquipment',
    IndustrialEquipment: 'IndustrialEquipment',
    WeldingEquipment: 'WeldingEquipment',
    OfficeEquipment: 'OfficeEquipment',
    Services: 'Services',
} as const;

export type Category = keyof typeof CATEGORIES;