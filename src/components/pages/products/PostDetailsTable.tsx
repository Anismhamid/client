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
	useTheme,
	alpha,
	Divider,
} from "@mui/material";
import {categoriesLogic, CategoryValue} from "../../../atoms/productsManage/postLogicMap";
import {getColorHex} from "../../../atoms/colorsSettings/carsColors";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
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
	const theme = useTheme();

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
			<Paper
				elevation={0}
				sx={{
					p: 4,
					textAlign: "center",
					borderRadius: 3,
					border: "1px solid",
					borderColor: "divider",
					bgcolor: alpha(theme.palette.primary.main, 0.02),
				}}
			>
				<InfoOutlinedIcon
					sx={{
						fontSize: 48,
						color: "text.secondary",
						mb: 2,
						opacity: 0.5,
					}}
				/>
				<Typography variant='h6' color='text.secondary' gutterBottom>
					لا توجد تفاصيل إضافية
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					هذا المنتج لا يحتوي على تفاصيل إضافية
				</Typography>
			</Paper>
		);
	}

	const renderValue = (field: Field, value: any | []) => {
		if (field.name === "color" && value) {
			const colorHex = getColorHex(value);
			return (
				<Box sx={{display: "flex", alignItems: "center", gap: 1.5}}>
					<Box
						sx={{
							width: 20,
							height: 20,
							borderRadius: "50%",
							bgcolor: colorHex || value,
							border: "2px solid",
							borderColor: "background.paper",
							boxShadow: `0 0 0 1px ${alpha(theme.palette.divider, 0.1)}`,
							transition: "transform 0.2s",
							"&:hover": {
								transform: "scale(1.1)",
							},
						}}
					/>
					<Typography variant='body2' fontWeight={500}>
						{value}
					</Typography>
				</Box>
			);
		}

		if (Array.isArray(value) && value.length > 0) {
			return (
				<Box sx={{display: "flex", gap: 0.5, flexWrap: "wrap"}}>
					{value.map((item, index) => (
						<Chip
							key={index}
							label={item}
							size='small'
							variant='outlined'
							sx={{
								borderRadius: 1.5,
								"&:hover": {
									bgcolor: alpha(theme.palette.primary.main, 0.05),
									borderColor: "primary.main",
								},
							}}
						/>
					))}
				</Box>
			);
		}

		if (Array.isArray(value) && value.length === 0) {
			return (
				<Typography variant='body2' color='text.disabled'>
					-
				</Typography>
			);
		}

		if (typeof value === "number") {
			return (
				<Typography variant='body2' fontWeight={600}>
					{value}
				</Typography>
			);
		}

		if (typeof value === "boolean") {
			const boolValue = value ? t("common.yes") : t("common.no");
			return (
				<Chip
					label={boolValue}
					size='small'
					color={value ? "success" : "default"}
					sx={{
						minWidth: 60,
						fontWeight: 500,
						"& .MuiChip-label": {px: 2},
					}}
				/>
			);
		}

		if (typeof value === "string" && value) {
			const translatedValue = t(`common.${value}`, {defaultValue: value});
			return <Typography variant='body2'>{translatedValue}</Typography>;
		}

		return (
			<Typography variant='body2' color='text.disabled'>
				-
			</Typography>
		);
	};

	return (
		<TableContainer
			component={Paper}
			elevation={0}
			sx={{
				borderRadius: 3,
				overflow: "hidden",
				border: "1px solid",
				borderColor: "divider",
			}}
		>
			<Table>
				<TableBody>
					{/* Category Header */}
					<TableRow
						sx={{
							bgcolor: alpha(theme.palette.primary.main, 0.03),
							"&:hover": {
								bgcolor: alpha(theme.palette.primary.main, 0.05),
							},
						}}
					>
						<TableCell
							component='th'
							sx={{
								fontWeight: 600,
								width: "35%",
								borderBottom: "none",
								py: 2.5,
							}}
						>
							<Box sx={{display: "flex", alignItems: "center", gap: 1}}>
								<CategoryOutlinedIcon
									sx={{fontSize: 20, color: "primary.main"}}
								/>
								<Typography variant='body2' fontWeight={600}>
									{t("modals.updateProductModal.category")}
								</Typography>
							</Box>
						</TableCell>
						<TableCell sx={{borderBottom: "none", py: 2.5}}>
							<Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
								{product.subcategory && (
									<Chip
										label={t(
											`categories.${product.category.toLocaleLowerCase()}.subCategories.${product.subcategory.toLocaleLowerCase()}`,
										)}
										variant='filled'
										size='small'
										sx={{
											bgcolor: alpha(
												theme.palette.primary.main,
												0.1,
											),
											color: "primary.main",
											fontWeight: 500,
											borderRadius: 1.5,
										}}
									/>
								)}
								<Chip
									label={t(
										`categories.${t(product.category.toLocaleLowerCase())}.label`,
									)}
									color='primary'
									size='small'
									sx={{
										borderRadius: 1.5,
										fontWeight: 500,
									}}
								/>
							</Box>
						</TableCell>
					</TableRow>
					{/* Divider */}
					<TableRow>
						<TableCell colSpan={2} sx={{p: 0, borderBottom: "none"}}>
							<Divider sx={{borderStyle: "dashed"}} />
						</TableCell>
					</TableRow>

					{fields.map((field, index) => {
						const value = product[field.name];
						if (value === undefined || value === null) return null;

						return (
							<TableRow
								key={field.name}
								sx={{
									"&:hover": {
										bgcolor: alpha(theme.palette.primary.main, 0.02),
									},
									...(index === fields.length - 1 && {
										"& .MuiTableCell-root": {
											borderBottom: "none",
										},
									}),
								}}
							>
								<TableCell
									component='th'
									sx={{
										fontWeight: 500,
										color: "text.secondary",
										bgcolor: alpha(
											theme.palette.background.default,
											0.5,
										),
										width: "35%",
									}}
								>
									<Typography variant='body2' color='text.secondary'>
										{t(`common.${field.name}`)}
										{/* {field.required && (
											<Typography
												component='span'
												color='error.main'
												sx={{ml: 0.5}}
											>
												*
											</Typography>
										)} */}
									</Typography>
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
