export const CATEGORIES = {
    House: "House",
    Garden: "Garden",
    Electronics: "Electronics",
    Kids: "Kids",
    Baby: "Baby",
    Beauty: "Beauty",
    Cleaning: "Cleaning",
    Health: "Health",
    Watches: "Watches",
    MenClothes: "MenClothes",
    WomenClothes: "WomenClothes",
    WomenBags: "WomenBags",
    Cars: "Cars",
    Motorcycles: "Motorcycles",
    Trucks: "Trucks",
    Bikes: "Bikes",
    ElectricVehicles: "ElectricVehicles",
} as const;

export type Category = keyof typeof CATEGORIES;