// pages/Home.tsx
import { FunctionComponent, useState } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import HeroSection from './HeroSection';
import StatsStrip from './StatsStrip';
import AdsSection from './AdsSection';
import Loader from '../../../atoms/loader/Loader';
import AddProductModal from '../../../atoms/productsManage/addAndUpdateProduct/CreatePostModal';
import UpdateProductModal from '../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal';
import { showError } from '../../../atoms/toasts/ReactToast';
import AlertDialogs from '../../../atoms/toasts/Sweetalert';
import { useUser } from '../../../context/useUSer';
import { usePosts } from '../../../hooks/usePosts';
import RoleType from '../../../interfaces/UserType';
import handleRTL from '../../../locales/handleRTL';
import { deletePost, toggleLike } from '../../../services/postsServices';
import DiscountsAndOffers from '../products/DiscountsAndOffers';
import ContactCTA from './ContactCTA';
import PostsGrid from './PostsGrid';

const Home: FunctionComponent = () => {
    const { auth } = useUser();
    const { t } = useTranslation();
    // const navigate = useNavigate();
    const direction = handleRTL();
    const { posts, loading } = usePosts();

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [postIdToUpdate, setPostIdToUpdate] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [refresh, setRefresh] = useState(false);

    const isAdmin = auth?.role === RoleType.Admin;
    const isModerator = auth?.role === RoleType.Moderator;
    const canEdit = isAdmin || isModerator;

    const handleDelete = (productName: string) => {
        deletePost(productName).catch((err) => {
            console.error(err);
            showError('שגיאה במחיקת המוצר!');
        });
    };

    if (loading) return <Loader />;

    const currentUrl = window.location.origin;

    return (
        <>
            {/* ─── SEO (unchanged) ─── */}
            <title>
                {t('home')} | {t('webPageName')}
            </title>
            <meta
                name='description'
                content='صفقة منصة إلكترونية لبيع وشراء المنتجات الجديدة والمستعملة بسهولة وأمان'
            />
            <link rel='canonical' href={currentUrl} />
            <meta
                property='og:title'
                content='صفقة | سوق إلكتروني لبيع وشراء المنتجات'
            />
            <meta
                property='og:description'
                content='بيع وشراء المنتجات بسهولة وأمان'
            />

            {/* ─── HERO ─── */}
            <HeroSection onAddProduct={() => setShowAddModal(true)} />

            {/* ─── STATS ─── */}
            <StatsStrip postsCount={posts.length} />

            {/* ─── MAIN ─── */}
            <Box
                dir={direction}
                component='main'
                id='products-section'
                sx={{
                    background:
                        'radial-gradient(circle, rgba(245, 159, 11, 0.030) 0%, transparent 70%)',
                }}
            >
                <AdsSection />

                <DiscountsAndOffers />

                <PostsGrid
                    posts={posts}
                    canEdit={canEdit}
                    onSetPostIdToUpdate={setPostIdToUpdate}
                    onShowUpdateModal={() => setShowUpdateModal(true)}
                    onOpenDeleteModal={(name) => {
                        setPostToDelete(name);
                        setShowDeleteModal(true);
                    }}
                    onLikeToggle={toggleLike}
                />

                <ContactCTA />
            </Box>

            {/* ─── MODALS ─── */}
            <UpdateProductModal
                refresh={() => setRefresh((r) => !r)}
                postId={postIdToUpdate}
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
            />
            <AlertDialogs
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                title='⚠️ تنبيه مهم!'
                description={`هل أنت متأكد من رغبتك في حذف المنتج "${postToDelete}"؟ هذا الإجراء لا يمكن التراجع عنه`}
                handleDelete={() => handleDelete(postToDelete)}
            />
            <AddProductModal
                show={showAddModal}
                onHide={() => setShowAddModal(false)}
            />
        </>
    );
};

export default Home;
