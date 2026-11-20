import { Fragment, FunctionComponent, MouseEvent } from 'react';
import { Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LinkifyProps {
    text: string;
    /** true when the link is inside my own (colored) bubble */
    isMe?: boolean;
    /** called right after navigating to an internal link */
    onInternalNavigate?: () => void;
}

/**
 * Hosts that belong to the app itself.
 * Links to these open INSIDE the app (React Router) instead of the browser.
 * Add your custom domain here when you have one (e.g. 'safqa.com').
 */
const INTERNAL_HOSTS = ['client-qqq1.vercel.app'];

const URL_REGEX = /(https?:\/\/[^\s<>"']+)/g;

// punctuation that is almost never part of the URL when it ends a sentence
const TRAILING_PUNCTUATION = /[.,;:!?)\]}،؛؟]+$/;

const parseInternalPath = (rawUrl: string): string | null => {
    try {
        const url = new URL(rawUrl);

        const isInternal =
            INTERNAL_HOSTS.includes(url.hostname) ||
            url.hostname === window.location.hostname;

        if (!isInternal) {
            return null;
        }

        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return null;
    }
};

const Linkify: FunctionComponent<LinkifyProps> = ({
    text,
    isMe = false,
    onInternalNavigate,
}) => {
    const navigate = useNavigate();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>, url: string) => {
        const internalPath = parseInternalPath(url);

        if (!internalPath) {
            return; // external: default behavior (new tab / system browser)
        }

        event.preventDefault();

        navigate(internalPath);

        onInternalNavigate?.();
    };

    const parts = text.split(URL_REGEX);

    return (
        <>
            {parts.map((part, index) => {
                // with a capture group in split(), odd indexes are the URLs
                if (index % 2 === 0) {
                    return <Fragment key={index}>{part}</Fragment>;
                }

                const trailing = part.match(TRAILING_PUNCTUATION)?.[0] ?? '';
                const url = trailing ? part.slice(0, -trailing.length) : part;

                return (
                    <Fragment key={index}>
                        <MuiLink
                            href={url}
                            target='_blank'
                            rel='noopener noreferrer'
                            underline='always'
                            onClick={(event) => handleClick(event, url)}
                            sx={{
                                color: isMe ? 'inherit' : 'primary.main',
                                fontWeight: 600,
                                wordBreak: 'break-all',
                                '&:hover': { opacity: 0.8 },
                            }}
                        >
                            {url}
                        </MuiLink>
                        {trailing}
                    </Fragment>
                );
            })}
        </>
    );
};

export default Linkify;