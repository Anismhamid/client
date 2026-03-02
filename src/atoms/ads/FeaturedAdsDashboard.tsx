import {useEffect, useState} from "react";
import {
	Box,
	Typography,
	Grid,
	Paper,
	Button,
	MenuItem,
	TextField,
	Select,
	FormControl,
	InputLabel,
	CircularProgress,
	Stack,
	Chip,
} from "@mui/material";
import axios from "axios";
import dayjs from "dayjs";
import {FeaturedAd} from "../../interfaces/featuredAd";

const api = import.meta.env.VITE_API_URL;

const FeaturedAdsDashboard = () => {
	const [ads, setAds] = useState<FeaturedAd[]>([]);
	const [loading, setLoading] = useState(true);
	const [newAd, setNewAd] = useState({
		listingId: "",
		type: "homepage",
		startDate: dayjs().format("YYYY-MM-DD"),
		endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
	});
	const [saving, setSaving] = useState(false);

	const fetchAds = async () => {
		setLoading(true);
		try {
			const {data} = await axios.get(`${api}/featured-ads/me`, {
				headers: {Authorization: localStorage.getItem("token")},
			});
			setAds(data?.ads || []);
		} catch (err) {
			console.error(err);
			setAds([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAds();
	}, []);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | {name?: string; value: unknown}
		>,
	) => {
		const name = e.target.name!;
		setNewAd((prev) => ({...prev, [name]: e.target.value}));
	};

	const handleSubmit = async () => {
		setSaving(true);
		try {
			await axios.post(`${api}/featured-ads/buy`, newAd, {
				headers: {
					Authorization: localStorage.getItem("token"),
					"Content-Type": "application/json",
				},
			});
			await fetchAds();
			alert("تم شراء الإعلان بنجاح!");
			setNewAd({
				listingId: "",
				type: "homepage",
				startDate: dayjs().format("YYYY-MM-DD"),
				endDate: dayjs().add(7, "day").format("YYYY-MM-DD"),
			});
		} catch (err: any) {
			alert(err.response?.data?.message || "حدث خطأ");
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async (adId: string) => {
		if (!confirm("هل أنت متأكد من حذف الإعلان؟")) return;
		try {
			await axios.delete(`${api}/featured-ads/${adId}`, {
				headers: {Authorization: localStorage.getItem("token")},
			});
			await fetchAds();
			alert("تم حذف الإعلان بنجاح!");
		} catch (err) {
			console.error(err);
			alert("حدث خطأ أثناء الحذف");
		}
	};

	// عداد الإعلانات النشطة حسب النوع
	const activeCounts = ads.reduce(
		(acc, ad) => {
			if (ad?.isActive && ad?.type) {
				acc[ad.type] = (acc[ad.type] || 0) + 1;
			}
			return acc;
		},
		{} as Record<string, number>,
	);

	return (
		<Box sx={{p: 4}} component='main'>
			<Typography variant='h4' gutterBottom>
				إدارة Featured Ads
			</Typography>

			{/* شراء إعلان جديد */}
			<Paper sx={{p: 3, mb: 4}}>
				<Typography variant='h6' gutterBottom>
					شراء إعلان جديد
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{xs: 12, sm: 4}}>
						<TextField
							label='ID الإعلان'
							name='listingId'
							value={newAd.listingId}
							onChange={handleChange}
							fullWidth
						/>
					</Grid>

					<Grid size={{xs: 12, sm: 4}}>
						<FormControl fullWidth>
							<InputLabel>نوع الترويج</InputLabel>
							<Select
								name='type'
								value={newAd.type}
								onChange={(e) =>
									setNewAd((prev) => ({...prev, type: e.target.value}))
								}
							>
								<MenuItem value='homepage'>Homepage</MenuItem>
								<MenuItem value='top'>Top</MenuItem>
								<MenuItem value='highlight'>Highlight</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					<Grid size={{xs: 12, sm: 2}}>
						<TextField
							label='تاريخ البداية'
							type='date'
							name='startDate'
							value={newAd.startDate}
							onChange={handleChange}
							InputLabelProps={{shrink: true}}
							fullWidth
						/>
					</Grid>

					<Grid size={{xs: 12, sm: 2}}>
						<TextField
							label='تاريخ النهاية'
							type='date'
							name='endDate'
							value={newAd.endDate}
							onChange={handleChange}
							InputLabelProps={{shrink: true}}
							fullWidth
						/>
					</Grid>

					<Grid size={{xs: 12}}>
						<Button
							variant='contained'
							onClick={handleSubmit}
							disabled={saving}
						>
							{saving ? <CircularProgress size={24} /> : "شراء"}
						</Button>
					</Grid>
				</Grid>
			</Paper>

			{/* إعلانات نشطة حسب النوع */}
			<Paper sx={{p: 2, mb: 4}}>
				<Typography variant='h6' gutterBottom>
					الإعلانات النشطة حسب النوع
				</Typography>
				<Stack direction='row' spacing={2}>
					<Chip
						label={`Homepage: ${activeCounts.homepage || 0}`}
						color='success'
					/>
					<Chip label={`Top: ${activeCounts.top || 0}`} color='success' />
					<Chip
						label={`Highlight: ${activeCounts.highlight || 0}`}
						color='success'
					/>
				</Stack>
			</Paper>

			{/* إعلانات المستخدم */}
			<Typography variant='h6' gutterBottom>
				إعلاناتك الحالية
			</Typography>

			{loading ? (
				<CircularProgress />
			) : ads.length === 0 ? (
				<Typography>لا يوجد إعلانات بعد</Typography>
			) : (
				<Grid container spacing={2}>
					{ads.map((ad) => {
						const isActive =
							ad.isActive && dayjs().isBefore(dayjs(ad.endDate));
						return (
							<Grid size={{xs: 12, sm: 6, md: 4}} key={ad._id}>
								<Paper
									sx={{
										p: 2,
										backgroundColor: isActive ? "#e8f5e9" : "#ffebee",
									}}
								>
									<Typography variant='subtitle1'>
										{ad.listingId?.title || "بدون عنوان"}
									</Typography>
									<Typography variant='body2'>
										نوع: {ad.type}
									</Typography>
									<Typography variant='body2'>
										من {dayjs(ad.startDate).format("DD/MM/YYYY")} إلى{" "}
										{dayjs(ad.endDate).format("DD/MM/YYYY")}
									</Typography>
									<Typography variant='body2'>
										الحالة: {isActive ? "نشط" : "منتهي"}
									</Typography>
									<Button
										variant='outlined'
										color='error'
										size='small'
										sx={{mt: 1}}
										onClick={() => handleDelete(ad._id)}
									>
										Delete
									</Button>
								</Paper>
							</Grid>
						);
					})}
				</Grid>
			)}
		</Box>
	);
};

export default FeaturedAdsDashboard;
