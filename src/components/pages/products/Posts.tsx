import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import PostsCategory from './PostsCategory';
import PageNotFound from '../Png';

const Posts: FunctionComponent = () => {
    const { category, subCategory } = useParams<{
        category: string;
        subCategory?: string;
    }>();

    if (!category) return <PageNotFound />;

    return <PostsCategory category={category} subCategory={subCategory} />;
};

export default Posts;