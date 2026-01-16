import {Box} from "@mui/material";
import {FunctionComponent} from "react";
import {productCategories} from "../../components/navbar/navCategoryies";
import {useTranslation} from "react-i18next";

interface CategoriesFiltersButtonsProps {
	setSearchQuery: (query: string) => void;
	searchQuery: string;
}

const CategoriesFiltersButtons: FunctionComponent<CategoriesFiltersButtonsProps> = ({
	searchQuery,
	setSearchQuery,
}) => {
	const {t} = useTranslation();
	return (
		<>
			{" "}
			{/* ازرار التصفيه */}
			{productCategories.map(({labelKey}) => {
				const isActive = searchQuery === t(labelKey);

				return (
					<Box
						key={labelKey}
						sx={{
							borderRadius: "50px",
							m: 1,
							fontSize: isActive ? "1rem" : "0.875rem",
							fontWeight: isActive ? "bold" : "medium",
							color: isActive ? "#fff" : "primary.main",
							backgroundColor: isActive ? "primary.main" : "transparent",
							border: `2px solid ${isActive ? "primary.main" : "primary.light"}`,
							padding: isActive ? "10px 20px" : "8px 16px",
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							cursor: "pointer",
							transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
							"&:hover": {
								backgroundColor: isActive ? "primary.dark" : "primary.50",
								boxShadow: 2,
							},
						}}
						onClick={() => setSearchQuery(t(labelKey))}
					>
						{t(labelKey)}
					</Box>
				);
			})}
		</>
	);
};

export default CategoriesFiltersButtons;
