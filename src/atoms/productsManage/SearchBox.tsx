import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {InputBase, Paper, IconButton, Box, CircularProgress} from "@mui/material";
import {FunctionComponent, useEffect, useState} from "react";

interface SearchBoxProps {
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	text: string;
}

const SearchBox: FunctionComponent<SearchBoxProps> = ({
	text,
	searchQuery,
	setSearchQuery,
}) => {
	const [inputValue, setInputValue] = useState(searchQuery);
	const [isSearching, setIsSearching] = useState(false); // حالة التحميل

	useEffect(() => {
		setInputValue(searchQuery);
	}, [searchQuery]);

	useEffect(() => {
		if (inputValue === searchQuery) {
			setIsSearching(false);
			return;
		}

		setIsSearching(true);

		const handler = setTimeout(() => {
			setSearchQuery(inputValue);
			setIsSearching(false);
		}, 400);

		return () => clearTimeout(handler);
	}, [inputValue, setSearchQuery, searchQuery]);

	return (
		<Box>
			<Paper
				component='form'
				onSubmit={(e) => e.preventDefault()}
				sx={{
					position: "sticky",
					width: {xs: "85%", sm: 450}, // عرض أفضل للموبايل
					m: "auto",
					mt: 5,
					mb: 4,
					p: "4px 12px",
					alignItems: "center",
					display: "flex",
					borderRadius: "50px",
					background: "rgba(255, 255, 255, 0.8)",
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
					backdropFilter: "blur(10px)",
					border: "2px solid rgba(33, 150, 243, 0.3)",
					transition: "all 0.3s ease",
					"&:focus-within": {
						borderColor: "#2196f3",
						boxShadow: "0 8px 32px rgba(33, 150, 243, 0.2)",
					},
				}}
			>
				<Box sx={{display: "flex", alignItems: "center", width: 24, height: 24}}>
					{isSearching ? (
						<CircularProgress
							size={20}
							thickness={5}
							sx={{color: "#2196f3"}}
						/>
					) : (
						<SearchIcon sx={{color: "#011427"}} />
					)}
				</Box>

				<InputBase
					sx={{
						color: "#003561",
						px: 2,
						flex: 1,
						fontWeight: "bold",
						fontSize: "1rem",
						"& input::placeholder": {
							color: "#216cf8",
							opacity: 0.6,
						},
					}}
					placeholder={text}
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					inputProps={{"aria-label": "search"}}
				/>

				{inputValue && (
					<IconButton
						onClick={() => {
							setInputValue("");
							setSearchQuery("");
						}}
						size='small'
						sx={{transition: "0.2s", "&:hover": {color: "error.main"}}}
					>
						<CloseIcon fontSize='small' />
					</IconButton>
				)}
			</Paper>
		</Box>
	);
};

export default SearchBox;
