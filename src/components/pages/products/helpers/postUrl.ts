import { productsPathes } from '../../../../routes/routes';

interface PostUrlInput {
    _id?: string;
    postName?: string;
    category?: string | null;
    seller?: {
        slug?: string;
    } | string | null;
}

/**
 * Slug يدعم العربية والعبرية والإنجليزية.
 */
export const slugify = (
    text = '',
    maxLength = 60,
): string =>
    text
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, maxLength)
        .replace(/-+$/g, '');

/**
 * Canonical:
 *
 * /<sellerSlug>/posts/<category>/<post-slug>-<id>
 *
 * Example:
 *
 * /anis-mhamied-1769591927900/posts/Services/
 * cleaning-homes-6ac3b2e0cbf456906a36fa4e
 */
export const getPostUrl = ({
    _id,
    postName,
    category,
    seller,
}: PostUrlInput): string => {
    if (!_id) {
        return productsPathes.postsDetails;
    }

    const productSlug = slugify(postName ?? '');

    const postSlug = productSlug
        ? `${productSlug}-${_id}`
        : _id;

    const sellerSlug =
        typeof seller === 'object' && seller !== null
            ? seller.slug
            : undefined;

    // fallback
    if (!sellerSlug || !category) {
        return `${productsPathes.postsDetails}/${encodeURIComponent(
            postSlug,
        )}`;
    }

    return `/${encodeURIComponent(
        sellerSlug,
    )}${productsPathes.postsDetails}/${encodeURIComponent(
        category,
    )}/${encodeURIComponent(postSlug)}`;
};

/**
 * Extract MongoDB ObjectId from:
 *
 * abc-6ac3b2e0cbf456906a36fa4e
 *
 * or:
 *
 * 6ac3b2e0cbf456906a36fa4e
 */
export const extractPostId = (param = ''): string =>
    /[a-f0-9]{24}$/i.exec(param)?.[0] ?? param;