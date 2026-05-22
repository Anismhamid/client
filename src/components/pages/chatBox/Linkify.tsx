import React from "react";
import { Typography, Link } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";

interface LinkifyProps {
    text: string;
}

const Linkify: React.FC<LinkifyProps> = ({ text }) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
        <Typography variant='body2' component="span">
            {parts.map((part, index) => {
                if (part.match(urlRegex)) {
                    return (
                        <Link
                            key={index}
                            href={part}
                            target='_blank'
                            rel='noopener noreferrer'
                            sx={{
                                color: "primary.main",
                                textDecoration: "none",
                                fontWeight: 500,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                '&:hover': { textDecoration: "underline" },
                            }}
                        >
                            {part.length > 40 ? part.substring(0, 40) + "..." : part}
                            <LaunchIcon sx={{ fontSize: 12 }} />
                        </Link>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </Typography>
    );
};

export default Linkify;