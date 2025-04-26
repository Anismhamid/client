export const getFaviconForCategory = (category: string) => {
	switch (category) {
		case "fruits":
			return "../src/assets/icons/fruits.svg";
		case "vegetable":
			return "../src/assets/icons/vegetable.svg";
		case "fish":
			return "../src/assets/icons/fish.svg";
		case "dairy":
			return "../src/assets/icons/dairy.svg";
		case "meat":
			return "../src/assets/icons/meat.svg";
		case "spices":
			return "../src/assets/icons/spices.svg";
		case "bakery":
			return "../src/assets/icons/bakery.svg";
		case "beverages":
			return "../src/assets/icons/beverages.svg";
		case "frozen":
			return "../src/assets/icons/frozen.svg";
		case "snacks":
			return "../src/assets/icons/snacks.svg";
		default:
			return "";
	}
};
