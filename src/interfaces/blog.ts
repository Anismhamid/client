export type BlogStatus = 'draft' | 'pending' | 'published';

export interface BlogPostItem {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content?: string;
    coverImage?: string;
    tags: string[];
    authorName: { first: string; last: string };
    status: BlogStatus;
    publishedAt?: string;
    views: number;
}
