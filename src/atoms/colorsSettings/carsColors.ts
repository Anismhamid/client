export interface CarColor {
	key: string;
	hex: string;
}

export const colors: CarColor[] = [
	// Basic
	{key: "White", hex: "#FFFFFF"},
	{key: "Black", hex: "#000000"},
	{key: "Red", hex: "#FF0000"},
	{key: "Blue", hex: "#0000FF"},
	{key: "Green", hex: "#008000"},
	{key: "Yellow", hex: "#FFFF00"},
	{key: "Orange", hex: "#FFA500"},
	{key: "Purple", hex: "#800080"},
	{key: "Brown", hex: "#A52A2A"},
	{key: "Pink", hex: "#FFC0CB"},

	// Grays & Silvers
	{key: "Gray", hex: "#808080"},
	{key: "DarkGray", hex: "#A9A9A9"},
	{key: "LightGray", hex: "#D3D3D3"},
	{key: "Silver", hex: "#C0C0C0"},
	{key: "Platinum", hex: "#E5E4E2"},
	{key: "MetallicSilver", hex: "#BFC1C2"},

	// Luxury / Common Car Colors
	{key: "JetBlack", hex: "#1C1C1C"},
	{key: "MatteBlack", hex: "#2C2C2C"},
	{key: "PearlWhite", hex: "#F5F5F5"},
	{key: "ArcticWhite", hex: "#F8F8FF"},
	{key: "Gunmetal", hex: "#4B4B4B"},
	{key: "Charcoal", hex: "#3A3A3A"},

	// Blues
	{key: "NavyBlue", hex: "#003366"},
	{key: "DeepBlue", hex: "#00509E"},
	{key: "MetallicBlue", hex: "#4F83CC"},
	{key: "SkyBlue", hex: "#1CA9C9"},
	{key: "SteelBlue", hex: "#4682B4"},

	// Reds
	{key: "DarkRed", hex: "#8B0000"},
	{key: "FerrariRed", hex: "#B11226"},
	{key: "CandyRed", hex: "#C41E3A"},
	{key: "Burgundy", hex: "#722F37"},
	{key: "Crimson", hex: "#AA0114"},

	// Greens
	{key: "RacingGreen", hex: "#013220"},
	{key: "DarkGreen", hex: "#006400"},
	{key: "ForestGreen", hex: "#228B22"},
	{key: "OliveGreen", hex: "#556B2F"},
	{key: "SeaGreen", hex: "#2E8B57"},

	// Browns / Beiges
	{key: "DarkBrown", hex: "#4E342E"},
	{key: "Coffee", hex: "#6F4E37"},
	{key: "Tan", hex: "#D2B48C"},
	{key: "Wheat", hex: "#F5DEB3"},
	{key: "Sand", hex: "#C19A6B"},

	// Gold / Bronze
	{key: "Gold", hex: "#D4AF37"},
	{key: "MetallicGold", hex: "#B08D57"},
	{key: "Bronze", hex: "#CD7F32"},
	{key: "Champagne", hex: "#8C7853"},

	// Special / Trendy
	{key: "SlateGray", hex: "#708090"},
	{key: "CarbonGray", hex: "#36454F"},
	{key: "DesertSand", hex: "#E6BE8A"},
	{key: "NardoGray", hex: "#7F7F7F"},
	{key: "DarkSlate", hex: "#2F4F4F"},
];
