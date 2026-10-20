import { FC, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Chip, Container, Stack, Typography } from "@mui/material";
import { BlogPostItem, BlogStatus } from "../../interfaces/blog";
import { fetchAllBlogPosts, updateBlogPost } from "../../services/blog";

const statusLabel: Record<BlogStatus, string> = {
	draft: "مسودة",
	pending: "قيد المراجعة",
	published: "منشور",
};

const BlogManage: FC = () => {
	const [rows, setRows] = useState<BlogPostItem[]>([]);
	const [busyId, setBusyId] = useState("");

	useEffect(() => {
		fetchAllBlogPosts().then(setRows).catch(() => setRows([]));
	}, []);

	const toggle = async (p: BlogPostItem) => {
		const next: BlogStatus = p.status === "published" ? "draft" : "published";
		setBusyId(p._id);
		try {
			const updated = await updateBlogPost(p._id, { status: next });
			setRows((r) => r.map((x) => (x._id === p._id ? { ...x, status: updated.status } : x)));
		} finally {
			setBusyId("");
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h5" fontWeight={800}>
					إدارة المقالات
				</Typography>
				<Button component={RouterLink} to="/blog/new" variant="contained">
					مقال جديد
				</Button>
			</Box>

			<Stack spacing={1.5}>
				{rows.map((p) => (
					<Box
						key={p._id}
						sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, border: 1, borderColor: "divider", borderRadius: 2 }}
					>
						<Typography sx={{ flex: 1 }} fontWeight={600}>
							{p.title}
						</Typography>
						<Chip
							size="small"
							label={statusLabel[p.status]}
							color={p.status === "published" ? "success" : "default"}
						/>
						<Button size="small" component={RouterLink} to={`/blog/edit/${p._id}`}>
							تعديل
						</Button>
						<Button size="small" variant="outlined" disabled={busyId === p._id} onClick={() => toggle(p)}>
							{p.status === "published" ? "إلغاء النشر" : "نشر"}
						</Button>
					</Box>
				))}
				{rows.length === 0 && <Typography color="text.secondary">لا توجد مقالات</Typography>}
			</Stack>
		</Container>
	);
};

export default BlogManage;