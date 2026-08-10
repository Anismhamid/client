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

    // New categories
    Art: 'Art',
    Gaming: 'Gaming',
    RealEstate: 'RealEstate',
    Pets: 'Pets',
    Furniture: 'Furniture',
    
} as const;

export type Category = keyof typeof CATEGORIES;
