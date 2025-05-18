import {
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	TextField,
} from "@mui/material";
import {useFormik} from "formik";
import {FunctionComponent} from "react";
import * as yup from "yup";
import useAddressData from "../../hooks/useAddressData";

interface UserInfoModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: {
		phone_1: string;
		phone_2: string;
		city: string;
		street: string;
		houseNumber: string;
	}) => void;
}

const UserInfoModal: FunctionComponent<UserInfoModalProps> = ({
	isOpen,
	onClose,
	onSubmit,
}) => {
	const formik = useFormik({
		initialValues: {
			phone_1: "",
			phone_2: "",
			city: "",
			street: "",
			houseNumber: "",
		},
		validationSchema: yup.object({
			phone_1: yup
				.string()
				.required("נדרש מספר טלפון ראשי")
				.matches(/^0\d{1,2}-?\d{7}$/),
			phone_2: yup
				.string()
				.min(9)
				.max(10)
				.matches(/^$|^0\d{1,2}-?\d{7}$/, "מספר טלפון משני לא תקין"),
			city: yup.string().required("נדרשת עיר"),
			street: yup.string().required("נדרש רחוב"),
			houseNumber: yup.string(),
		}),
		onSubmit: (values) => {
			onSubmit(values);
		},
	});

	const {cities, streets, loadingStreets} = useAddressData(formik.values.city);

	return (
		<Dialog open={isOpen} onClose={onClose} maxWidth='xs' fullWidth>
			<DialogTitle className=' text-center'>
				יש להשלם את פרטיך להמשך להרשמה
			</DialogTitle>
			<DialogContent>
				<Box component='form' onSubmit={formik.handleSubmit} noValidate>
					<TextField
						margin='dense'
						label='טלפון ראשי'
						fullWidth
						name='phone_1'
						value={formik.values.phone_1}
						onChange={formik.handleChange}
						error={formik.touched.phone_1 && Boolean(formik.errors.phone_1)}
						helperText={formik.touched.phone_1 && formik.errors.phone_1}
					/>
					<TextField
						margin='dense'
						label='טלפון נוסף'
						fullWidth
						name='phone_2'
						value={formik.values.phone_2}
						onChange={formik.handleChange}
					/>
					<TextField
						select
						label='בחר עיר'
						name='city'
						value={formik.values.city}
						onChange={formik.handleChange}
						error={formik.touched.city && Boolean(formik.errors.city)}
						helperText={formik.touched.city && formik.errors.city}
						fullWidth
						className='my-2'
						variant='outlined'
						SelectProps={{
							MenuProps: {
								PaperProps: {
									style: {
										maxHeight: 300,
									},
								},
							},
						}}
					>
						<MenuItem value=''>בחר עיר</MenuItem>
						{cities.map((city, index) => (
							<MenuItem key={index} value={city}>
								{city}
							</MenuItem>
						))}
					</TextField>
					<TextField
						select
						label='בחר רחוב'
						name='street'
						value={formik.values.street}
						onChange={formik.handleChange}
						disabled={!formik.values.city || loadingStreets}
						error={formik.touched.street && Boolean(formik.errors.street)}
						helperText={formik.touched.street && formik.errors.street}
						fullWidth
						className='my-2'
						variant='outlined'
						SelectProps={{
							MenuProps: {
								PaperProps: {
									style: {
										maxHeight: 300,
									},
								},
							},
						}}
					>
						<MenuItem value=''>בחר רחוב</MenuItem>
						{loadingStreets ? (
							<MenuItem disabled>טוען רחובות...</MenuItem>
						) : (
							streets.map((street, index) => (
								<MenuItem key={index} value={street}>
									{street}
								</MenuItem>
							))
						)}
					</TextField>
					<TextField
						margin='dense'
						label='מספר בית'
						fullWidth
						name='houseNumber'
						value={formik.values.houseNumber}
						onChange={formik.handleChange}
						error={
							formik.touched.houseNumber &&
							Boolean(formik.errors.houseNumber)
						}
						helperText={
							formik.touched.houseNumber && formik.errors.houseNumber
						}
					/>
					<DialogActions className='d-flex align-items-center justify-content-between mt-3'>
						<Button variant='contained' onClick={onClose} color='error'>
							ביטול רישום
						</Button>
						{formik.isSubmitting ? (
							<CircularProgress size={20} />
						) : (
							<Button type='submit' color='primary' variant='contained'>
								המשך
							</Button>
						)}
					</DialogActions>
				</Box>
			</DialogContent>
		</Dialog>
	);
};

export default UserInfoModal;
