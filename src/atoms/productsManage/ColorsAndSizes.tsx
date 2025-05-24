import {
	Box,
	Divider,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
} from "@mui/material";
import {FunctionComponent} from "react";
import CheckIcon from "@mui/icons-material/Check";
interface ColorsAndSizesProps {
	category: string;
}

const colors = ["primary", "secondary", "error", "success", "warning"] as const;
const sizes = ["XS", "S", "M", "L", "XL"];

const ColorsAndSizes: FunctionComponent<ColorsAndSizesProps> = ({category}) => {
	const clothestype = ["women-clothes"].includes(category);
	const bagstype = ["women-bags"].includes(category);

	return (
		<>
			<Box
			>
				{clothestype ? (
					<>
						<Divider
							sx={{
								backgroundColor: "red",
								my: 2,
							}}
						/>
						<FormLabel
							sx={{
								mb: 1.5,
								fontWeight: "bold",
								textTransform: "uppercase",
								fontSize: "1rem",
								letterSpacing: "0.1em",
							}}
						>
							Color
						</FormLabel>
						<RadioGroup
							row
							defaultValue='warning'
							sx={{gap: 2, flexWrap: "wrap"}}
						>
							{colors.map((color) => (
								<Box
									key={color}
									sx={{
										width: 30,
										height: 30,
										borderRadius: "50%",
										bgcolor: (theme) => theme.palette[color].main,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										position: "relative",
									}}
								>
									<Radio
										value={color}
										sx={{
											position: "absolute",
											width: "100%",
											height: "100%",
											opacity: 0,
											"&.Mui-checked + svg": {
												display: "block",
											},
										}}
									/>
									<CheckIcon
										sx={{
											color: "white",
											display: "none",
											pointerEvents: "none",
										}}
									/>
								</Box>
							))}
						</RadioGroup>
						<Divider
							sx={{
								backgroundColor: "red",
								my: 2,
							}}
						/>
						<FormLabel
							sx={{
								mb: 1.5,
								fontWeight: "bold",
								textTransform: "uppercase",
								fontSize: "12px",
								letterSpacing: "0.1em",
							}}
						>
							Size
						</FormLabel>
						<RadioGroup row defaultValue='M' sx={{gap: 2, flexWrap: "wrap"}}>
							{sizes.map((size) => (
								<Box
									key={size}
									sx={{
										width: 30,
										height: 30,
										border: "1px solid",
										borderColor: "grey.500",
										borderRadius: "50%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										position: "relative",

										"& .Mui-checked + span": {
											fontWeight: "bold",
										},
									}}
								>
									<FormControlLabel
										value={size}
										control={
											<Radio
												sx={{
													position: "absolute",
													opacity: 0,
													width: "100%",
													height: "100%",
												}}
											/>
										}
										label={size}
										sx={{
											m: 0,
										}}
									/>
								</Box>
							))}
						</RadioGroup>
						<Divider
							sx={{
								backgroundColor: "red",
								my: 2,
							}}
						/>
					</>
				) : bagstype ? (
					<>
						<FormLabel
							sx={{
								mb: 1.5,
								fontWeight: "bold",
								textTransform: "uppercase",
								fontSize: "1rem",
								letterSpacing: "0.1em",
							}}
						>
							Color
						</FormLabel>
						<RadioGroup
							row
							defaultValue='warning'
							sx={{gap: 2, flexWrap: "wrap"}}
						>
							{colors.map((color) => (
								<Box
									key={color}
									sx={{
										width: 30,
										height: 30,
										borderRadius: "50%",
										bgcolor: (theme) => theme.palette[color].main,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										position: "relative",
										margin:"auto"
									}}
								>
									<Radio
										value={color}
										sx={{
											position: "absolute",
											width: "100%",
											height: "100%",
											opacity: 0,
											"&.Mui-checked + svg": {
												display: "block",
											},
										}}
									/>
									<CheckIcon
										sx={{
											color: "white",
											display: "none",
											pointerEvents: "none",
										}}
									/>
								</Box>
							))}
						</RadioGroup>
						<Divider
							sx={{
								backgroundColor: "red",
								my: 2,
							}}
						/>
					</>
				) : (
					""
				)}
			</Box>
		</>
	);
};

export default ColorsAndSizes;
