import api from "./api"; // عدّل الاسم/المسار حسب ملفك
import { BlogPostItem, BlogStatus } from "../interfaces/blog";

export interface BlogPayload {
	title: string;
	excerpt: string;
	content: string;
	coverImage: string;
	tags: string[];
	status: BlogStatus;
}
type BlogEdit = BlogPostItem & { status: "draft" | "published" };

export const fetchBlogList = async (page: number, tag?: string) => {
	const { data } = await api.get<{ items: BlogPostItem[]; total: number; pages: number }>("/blog", {
		params: { page, ...(tag ? { tag } : {}) },
	});
	return data;
};

export const fetchBlogPost = async (slug: string) => {
	const { data } = await api.get<BlogPostItem>(`/blog/${encodeURIComponent(slug)}`);
	return data;
};

export const fetchBlogPostForEdit = async (id: string) => {
	const { data } = await api.get<BlogEdit>(`/blog/admin/${id}`);
	return data;
};

export const createBlogPost = async (payload: BlogPayload) => {
	const { data } = await api.post<BlogPostItem>("/blog", payload);
	return data;
};

export const updateBlogPost = async (id: string, payload: Partial<BlogPayload>) => {
	const { data } = await api.patch<BlogPostItem>(`/blog/${id}`, payload);
	return data;
};

export const deleteBlogPost = async (id: string) => {
	await api.delete(`/blog/${id}`);
};

export const fetchAllBlogPosts = async () => {
	const { data } = await api.get<(BlogPostItem & { status: string })[]>("/blog/admin/list");
	return data;
};