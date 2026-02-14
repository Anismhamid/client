import React from "react";
import {Typography} from "@mui/material";

interface LinkifyProps {
	text: string;
}

const Linkify: React.FC<LinkifyProps> = ({text}) => {
	const urlRegex = /(https?:\/\/[^\s]+)/g;
	const parts = text.split(urlRegex);

	return (
		<Typography variant='body2' color='text.primary'>
			{parts.map((part, index) => {
				if (part.match(urlRegex)) {
					return (
						<a
							key={index}
							href={part}
							target='_blank'
							rel='noopener noreferrer'
							style={{color: "#1976d2", textDecoration: "underline"}}
						>
							{part}
						</a>
					);
				}
				return part;
			})}
		</Typography>
	);
};

export default Linkify;
