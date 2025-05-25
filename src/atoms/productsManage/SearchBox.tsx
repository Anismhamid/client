import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import {InputBase, Paper, IconButton, Box} from "@mui/material";
import {FunctionComponent} from "react";

interface SearchBoxProps {
	searchQuery: string;
	setSearchQuery:Function
	text:string
}

const SearchBox: FunctionComponent<SearchBoxProps> = ({text,searchQuery,setSearchQuery}) => {
	return (
		<Box>
			<Paper
				component='form'
				onSubmit={(e) => e.preventDefault()}
				sx={{
					position: "sticky",
					width: {xs: "60%", sm: 400},
					m: "auto",
					mt: 5,
					mb: 4,
					fontSize: "1rem",
					p: "2px 10px",
					alignItems: "center",
					display: "flex",
					borderRadius: "50px",
					background: "rgba(255, 255, 255, 0.767)",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
					backdropFilter: "blur(10px)",
					border: "2px solid rgba(0, 89, 255, 0.637)",
					transition: "0.3s ease",
					"&:hover": {
						boxShadow: "0 0px 1px rgba(255, 255, 255, 0.884)",
					},
				}}
			>
				<SearchIcon sx={{color: "#011427", mr: 1}} />
				<InputBase
					sx={{
						color: "#003561",
						mr: 2,
						flex: 1,
						fontWeight:"bold",
						letterSpacing:1,
						fontSize: "1rem",
						"& input::placeholder": {
							color: "#216cf8",
						},
					}}
					placeholder={text}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					inputProps={{"aria-label": "search"}}
				/>
				<IconButton onClick={() => setSearchQuery("")} size='small'>
					<CloseIcon fontSize='small' />
				</IconButton>
			</Paper>
		</Box>
	);
};
export default SearchBox;
