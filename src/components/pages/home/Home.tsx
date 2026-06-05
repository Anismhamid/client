// pages/Home.tsx
import { FunctionComponent, lazy, Suspense, useState } from 'react';
import { Box } from '@mui/material';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';

import HeroSection from './HeroSection';
import StatsStrip from './StatsStrip';
import AdsSection from './AdsSection';
import Loader from '../../../atoms/loader/Loader';
const AddProductModal = lazy(
    () =>
        import(
            '../../../atoms/productsManage/addAndUpdateProduct/CreatePostModal'
        ),
);

const UpdateProductModal = lazy(
    () =>
        import(
            '../../../atoms/productsManage/addAndUpdateProduct/UpdatePostModal'
        ),
);
import { showError } from '../../../atoms/toasts/ReactToast';
const AlertDialogs = lazy(() => import('../../../atoms/toasts/Sweetalert'));
import { useUser } from '../../../context/useUSer';
import { usePosts } from '../../../hooks/usePosts';
import RoleType from '../../../interfaces/UserType';
import handleRTL from '../../../locales/handleRTL';
import { deletePost, toggleLike } from '../../../services/postsServices';
import JsonLd from '../../../../utils/JsonLd';
import { useLocation } from 'react-router-dom';
const DiscountsAndOffers = lazy(() => import('../products/DiscountsAndOffers'));
const ContactCTA = lazy(() => import('./ContactCTA'));
const PostsGrid = lazy(() => import('./PostsGrid'));

const Home: FunctionComponent = () => {
    const { auth } = useUser();
    // const { t } = useTranslation();
    const direction = handleRTL();
    const { posts, loading } = usePosts();
    const location = useLocation();

    // Modals state
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [postIdToUpdate, setPostIdToUpdate] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState('');
    const [, setRefresh] = useState(false);

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

    const currentUrl = `https://client-qqq1.vercel.app${location.pathname}`;

    return (
        <>
            ;{/* ─── SEO (unchanged) ─── */}
            <title>صفقة | منصة بيع وشراء المنتجات الجديدة والمستعملة</title>
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
            <meta
                property='og:image'
                content='https://client-qqq1.vercel.app/d3.png'
            />
            <meta property='og:url' content='https://client-qqq1.vercel.app' />
            <meta property='og:type' content='website' />
            <JsonLd
                data={{
                    '@context': 'https://schema.org',
                    '@graph': [
                        {
                            '@type': 'WebSite',
                            '@id': 'https://client-qqq1.vercel.app/#website',
                            name: 'صفقة',
                            alternateName: 'Safqa',
                            url: 'https://client-qqq1.vercel.app',
                        },
                        {
                            '@type': 'Organization',
                            '@id': 'https://client-qqq1.vercel.app/#organization',
                            name: 'صفقة',
                            alternateName: 'Safqa',
                            url: 'https://client-qqq1.vercel.app',
                            logo: {
                                '@type': 'ImageObject',
                                url: 'https://client-qqq1.vercel.app/d3.png',
                            },
                        },
                    ],
                }}
            />
            {/* ─── HERO ─── */}
            <HeroSection onAddProduct={() => setShowAddModal(true)} />
            {/* ─── STATS ─── */}
            <StatsStrip postsCount={posts.length} />
            {/* ─── MAIN ─── */}
            <Box
                dir={direction}
                component='main'
                id='lising-section'
                title='lising-section'
                sx={{
                    background:
                        'radial-gradient(circle, rgba(245, 159, 11, 0.030) 0%, transparent 70%)',
                }}
            >
                <AdsSection />

                <Suspense fallback={<Loader />}>
                    <DiscountsAndOffers />
                    <PostsGrid
                        posts={posts}
                        featured={false}
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
                </Suspense>
            </Box>
            <Suspense fallback={<Loader />}>
                {/* ─── MODALS ─── */}
                <UpdateProductModal
                    refresh={() => setRefresh((r) => !r)}
                    postId={postIdToUpdate}
                    show={showUpdateModal}
                    onHide={() => setShowUpdateModal(false)}
                />
            </Suspense>{' '}
            <Suspense fallback={<Loader />}>
                <AlertDialogs
                    show={showDeleteModal}
                    onHide={() => setShowDeleteModal(false)}
                    title='⚠️ تنبيه مهم!'
                    description={`هل أنت متأكد من رغبتك في حذف المنتج "${postToDelete}"؟ هذا الإجراء لا يمكن التراجع عنه`}
                    handleDelete={() => handleDelete(postToDelete)}
                />
            </Suspense>
            <Suspense fallback={<Loader />}>
                <AddProductModal
                    show={showAddModal}
                    onHide={() => setShowAddModal(false)}
                />
            </Suspense>
        </>
    );
};

export default Home;
