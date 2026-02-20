import {FunctionComponent, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableRow,
	Paper,
	Chip,
	Box,
	Typography,
} from "@mui/material";
import {categoriesLogic, CategoryValue} from "../../../atoms/productsManage/postLogicMap";
import {getColorHex} from "../../../atoms/colorsSettings/carsColors";

interface Product {
	category: CategoryValue;
	subcategory?: string;
	[key: string]: any;
}

interface Field {
	name: string;
	type: string;
	required?: boolean;
	options?: string[];
}

interface PostDetailsTableProps {
	product: Product;
}

const PostDetailsTable: FunctionComponent<PostDetailsTableProps> = ({product}) => {
	const {t} = useTranslation();

const fields: Field[] = useMemo(() => {
	if (!product.subcategory) return [];

	const categoryFields =
		categoriesLogic[product.category]?.[
			product.subcategory as keyof (typeof categoriesLogic)[typeof product.category]
		];

	return (categoryFields as Field[]) || [];
}, [product.category, product.subcategory]);

if (fields.length === 0) {
	return (
		<Paper sx={{p: 3, textAlign: "center", borderRadius: 2}}>
			<Typography color='text.secondary'>
				لا توجد تفاصيل إضافية لهذا المنتج
			</Typography>
		</Paper>
	);
}

	const renderValue = (field: Field, value: any) => {
		if (field.name === "color" && value) {
			const colorHex = getColorHex(value);
			return (
				<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
					<Box
						sx={{
							width: 20,
							height: 20,
							borderRadius: "50%",
							bgcolor: colorHex || value,
							border: "1px solid",
							borderColor: "divider",
						}}
					/>
					<span>{value}</span>
				</Box>
			);
		}

		if (Array.isArray(value)) {
			return (
				<Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap"}}>
					{value.map((item, index) => (
						<Chip key={index} label={item} size='small' />
					))}
				</Box>
			);
		}

		return value?.toString() || "-";
	};

	return (
		<TableContainer component={Paper} sx={{borderRadius: 2, overflow: "hidden"}}>
			<Table>
				<TableBody>
					<TableRow sx={{bgcolor: "action.hover"}}>
						<TableCell component='th' sx={{fontWeight: 600, width: "40%"}}>
							{t("category")}
						</TableCell>
						<TableCell>
							<Chip
								label={t(product.category)}
								color='primary'
								size='small'
								sx={{ml: 1}}
							/>
							{product.subcategory && (
								<Chip
									label={product.subcategory}
									variant='outlined'
									size='small'
								/>
							)}
						</TableCell>
					</TableRow>

					{fields.map((field) => {
						const value = product[field.name];
						if (value === undefined || value === null) return null;

						return (
							<TableRow key={field.name} hover>
								<TableCell component='th' sx={{fontWeight: 500}}>
									{t(field.name)}
								</TableCell>
								<TableCell>{renderValue(field, value)}</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default PostDetailsTable;
