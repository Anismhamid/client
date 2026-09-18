// atoms/LikeButton.tsx
import {
    FunctionComponent,
    useCallback,
    useState,
    useRef,
    useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, CircularProgress, Typography } from '@mui/material';
import {
    Favorite as FavoriteIcon,
    FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useUser } from '../../hooks/useUSer';
import { handleLike, HandleLikeParams } from '../../helpers/handleLike';
import { Posts } from '../../interfaces/Posts';
import { path } from '../../routes/routes';

interface LikeButtonProps {
    product: Posts;
    setProduct?: (updater: (prev: Posts) => Posts) => void;
    onLikeToggle?: (productId: string, liked: boolean) => void;
}

const LikeButton: FunctionComponent<LikeButtonProps> = ({
    product,
    setProduct,
    onLikeToggle,
}) => {
    const [isLiking, setIsLiking] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, auth } = useUser();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const userLiked = auth?._id ? product.likes?.includes(auth._id) : false;

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio('/Like-Sound-Effect (mp3cut.net).mp3');
            audioRef.current.preload = 'auto';
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, [isLoggedIn]);

    const playNotificationSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
                console.error('Failed to play notification sound:', error);
            });
        }
    }, []);

    // يشتغل بعد ما handleLike يأكد النجاح فعلياً، مش قبل
    const handleToggleResult = useCallback(
        (productId: string, liked: boolean) => {
            if (liked) playNotificationSound();
            onLikeToggle?.(productId, liked);
        },
        [onLikeToggle, playNotificationSound],
    );

    const handleClick = async () => {
        if (!auth?._id) {
            navigate(path.Login);
            return;
        }

        const params: HandleLikeParams = {
            isLoggedIn,
            isLiking,
            navigate: (path: string) => navigate(path),
            setIsLiking,
            setProduct,
            product,
            auth,
            onLikeToggle: handleToggleResult,
        };

        await handleLike(params);
    };

    return (
        <IconButton
            aria-label={
                userLiked ? 'remove from favorites' : 'add to favorites'
            }
            onClick={handleClick}
            disabled={isLiking || !auth?._id}
            sx={{
                position: 'relative',
                padding: '8px',
            }}
        >
            {isLiking ? (
                <>
                    <FavoriteBorderIcon sx={{ opacity: 0.3 }} />
                    <CircularProgress
                        size={20}
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-10px',
                            marginLeft: '-10px',
                        }}
                    />
                </>
            ) : userLiked ? (
                <>
                    <FavoriteIcon
                        sx={{
                            color: 'error.main',
                            animation: 'pulse 0.3s ease-in-out',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(2)' },
                                '100%': { transform: 'scale(1)' },
                            },
                        }}
                    />
                    <Typography
                        sx={{
                            ml: 0.5,
                            fontSize: '0.875rem',
                            color: 'error.main',
                            fontWeight: 500,
                        }}
                    >
                        {product.likes?.length ?? 0}
                    </Typography>
                </>
            ) : (
                <>
                    <FavoriteBorderIcon />
                    <Typography sx={{ ml: 0.5, fontSize: '0.875rem' }}>
                        {product.likes?.length ?? 0}
                    </Typography>
                </>
            )}
        </IconButton>
    );
};

export default LikeButton;