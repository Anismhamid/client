import {Button, Card, CardContent, Grid, Typography} from "@mui/material";
import {FunctionComponent} from "react";
import {
	Security as SecurityIcon,
	SupportAgent as SupportIcon,
	QrCode,
	Download,
} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {path} from "../../../../routes/routes";
import {showSuccess} from "../../../../atoms/toasts/ReactToast";
import {AuthValues} from "../../../../interfaces/authValues";

interface QuickActionsTabProps {
	user: AuthValues;
}

const QuickActionsTab: FunctionComponent<QuickActionsTabProps> = ({user}) => {
	const navigate = useNavigate();

	const contactSupport = () => {
		navigate(path.Contact);
	};

	const handleExportData = () => {
		// Logic to export user data
		showSuccess("سيتم تحميل بياناتك قريباً");
	};

	return (
		<Card sx={{borderRadius: 3}}>
			<CardContent>
				<Typography variant='h5' gutterBottom fontWeight='bold' color='primary'>
					إجراءات سريعة
				</Typography>
				<Grid container spacing={2}>
					<Grid size={{xs: 12, sm: 6}}>
						{/* TODO:change password */}
						<Button
							variant='outlined'
							fullWidth
							startIcon={<SecurityIcon />}
							// onClick={changePassword}
							disabled
							sx={{
								py: 1.5,
								justifyContent: "flex-center",
								gap: 2,
							}}
						>
							تغيير كلمة المرور (قريبأ)
						</Button>
					</Grid>
					<Grid size={{xs: 12, sm: 6}}>
						<Button
							variant='outlined'
							fullWidth
							startIcon={<SupportIcon />}
							onClick={contactSupport}
							sx={{
								py: 1.5,
								justifyContent: "flex-center",
								gap: 2,
							}}
						>
							دعم فني
						</Button>
					</Grid>
					<Grid size={{xs: 12, sm: 6}}>
						<Button
							variant='outlined'
							fullWidth
							disabled
							startIcon={<Download />}
							onClick={handleExportData}
							sx={{
								py: 1.5,
								justifyContent: "flex-center",
								gap: 2,
							}}
						>
							تصدير البيانات (قريبأ)
						</Button>
					</Grid>
					<Grid size={{xs: 12, sm: 6}}>
						<Button
							variant='outlined'
							fullWidth
							startIcon={<QrCode />}
							onClick={() => navigate(`/users/customer/${user.slug}`)}
							sx={{
								py: 1.5,
								justifyContent: "flex-center",
								gap: 2,
							}}
						>
							الصفحتي التجاريه
						</Button>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	);
};

export default QuickActionsTab;
