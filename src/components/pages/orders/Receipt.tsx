import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ReceiptsType} from "../../../interfaces/Receipts";
import {Table, Form} from "react-bootstrap";
import {getUserReceiptsById, getUsersReceipts} from "../../../services/Receipts";
import {PDFDownloadLink} from "@react-pdf/renderer";

import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import useToken from "../../../hooks/useToken";
import RoleType from "../../../interfaces/UserType";
import {useTranslation} from "react-i18next";
import Loader from "../../../atoms/loader/Loader";
import ReceiptPDF from "../../../helpers/generatePdf";

interface ReceiptProps {}
/**
 * Receipts page
 * @returns auth receipt and all receipt for admin users
 */
const Receipt: FunctionComponent<ReceiptProps> = () => {
	const [receipts, setReceipts] = useState<ReceiptsType[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [productSearch, setProductSearch] = useState("");
	const {decodedToken} = useToken();
	const {t} = useTranslation();

	// Generate to pdf file


	// Custom search
	const filteredOrders = useMemo(() => {
		return receipts.filter((receipt) => {
			const query = searchQuery.toLowerCase();
			const productQuery = productSearch.toLowerCase();

			const name = receipt.customer?.name?.first?.toLowerCase() || "";
			const email = receipt.customer?.email?.toLowerCase() || "";
			const orderNumber = receipt.orderNumber?.toString() || "";

			const orderDate = new Date(receipt.orderDate);
			const isWithinDateRange =
				(!startDate || new Date(startDate) <= orderDate) &&
				(!endDate || new Date(endDate) >= orderDate);

			const matchesProduct = receipt.products.some((p) =>
				p.product_name.toLowerCase().includes(productQuery),
			);

			return (
				(name.includes(query) ||
					email.includes(query) ||
					orderNumber.includes(query)) &&
				isWithinDateRange &&
				(matchesProduct || productQuery === "")
			);
		});
	}, [receipts, searchQuery, productSearch, startDate, endDate]);

	useEffect(() => {
		if (
			(decodedToken && decodedToken.role === RoleType.Admin) ||
			(decodedToken && decodedToken.role === RoleType.Moderator)
		) {
			getUsersReceipts()
				.then((res) => {
					setReceipts(res);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			if (decodedToken)
				getUserReceiptsById(decodedToken._id)
					.then((res) => {
						setReceipts(res);
					})
					.catch((err) => {
						console.log(err);
					});
		}
	}, [decodedToken]);

	if (!receipts) {
		return (
			<main className='text-center mt-5 min-vh-50'>
				<p>לא נמצאו קבלות</p>
			</main>
		);
	}

	if (receipts.length === 0) {
		return (
			<main className=''>
				<Loader />
			</main>
		);
	}

	return (
		<main>
			{/* חיפוש מתקדם  */}
			<Box className='container mt-4 rounded'>
				<Form className='text-center p-3 my-3 m-auto' role='search'>
					<h3>{t("pages.receipts.receiptSearchTitle")}</h3>
					<div className='row border p-3 border-danger rounded'>
						<div className='col-6'>
							<TextField
								label={t("pages.receipts.receiptSearch_1")}
								name='search_1'
								type='search'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								fullWidth
								className='my-2 border-bottom border-black border-4 rounded'
								variant='filled'
							/>
						</div>
						<div className='col-6 '>
							<TextField
								label={t("pages.receipts.receiptSearch_2")}
								name='search_2'
								type='search'
								value={productSearch}
								onChange={(e) => setProductSearch(e.target.value)}
								fullWidth
								className='my-2 border-bottom border-black border-4 rounded'
								variant='filled'
							/>
						</div>
						<div className='d-flex justify-content-center gap-3 mt-3'>
							<div>
								<label>{t("pages.receipts.receiptSearchFromDate")}</label>
								<TextField
									name='search_3'
									type='date'
									value={startDate}
									onChange={(e) => setStartDate(e.target.value)}
									fullWidth
									className='my-2 border-bottom border-black border-4 rounded'
									variant='filled'
								/>
							</div>
							<div>
								<label>{t("pages.receipts.receiptSearchToDate")}</label>
								<TextField
									name='search_3'
									type='date'
									value={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									fullWidth
									className='my-2 border-bottom border-black border-4 rounded'
									variant='filled'
								/>
							</div>
						</div>
					</div>
				</Form>
			</Box>
			<div className=' container'>
				<h2 className='text-center mb-4'>קבלות🧾</h2>
				{filteredOrders.reverse().map((receipt) => (
					<Box
						id={`receipt-${receipt.orderNumber}`}
						className='container my-5 p-3 border border-danger rounded'
						key={receipt.orderNumber}
						sx={{
							backdropFilter: "blur(10px)",
						}}
					>
						<Card className='mb-1 shadow-sm'>
							<CardHeader as='h5' className='text-center p-3 bg-primary'>
								<Typography
									sx={{
										color: "error",
									}}
								>
									'קבלה מס {receipt.orderNumber}
								</Typography>
							</CardHeader>
							<CardContent>
								<Typography>
									<Typography component={"span"}>תאריך:</Typography>
									{new Date(receipt.orderDate).toLocaleString("he-IL", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Typography>

								<CardContent>
									{receipt.customer ? (
										<>
											<strong className='me-1'>לקוח:</strong>
											{receipt.customer.name.first}
											<br />
											<strong className='me-1'>טלפון:</strong>
											{receipt.customer.phone.phone_1}
											<br />
											<strong className='me-1'>טלפון-2</strong>
											{receipt.customer.phone.phone_2 || "לא קיים"}
											<br />
											<strong className='me-1'>אימייל:</strong>{" "}
											{receipt.customer.email}
											<br />
											<strong className='me-1'>כתובת:</strong>
											{`${receipt.customer.address.city}, ${receipt.customer.address.street},
											${receipt.customer.address.houseNumber}`}
										</>
									) : (
										<span className=''>אין פרטי לקוח זמינים</span>
									)}
								</CardContent>

								<hr />

								<CardContent>
									<strong>שיטת תשלום:</strong>
									{receipt.payment == "true" ? "כרטיס אשראי" : "מזומן"}
								</CardContent>
								<CardContent>
									<Typography component={"span"}>
										שיטת איסוף:
									</Typography>
									{receipt.deliveryFee
										? `משלוח עד הבית ${receipt.deliveryFee.toLocaleString(
												"he-IL",
												{
													style: "currency",
													currency: "ILS",
												},
											)}`
										: "איסוף עצמי "}
								</CardContent>

								<CardContent className='fs-5 fw-bold'>
									סה״כ לתשלום:
									{receipt.totalAmount.toLocaleString("he-IL", {
										style: "currency",
										currency: "ILS",
									})}
								</CardContent>
							</CardContent>
						</Card>

						<h5 className='text-center mt-5'>🛒 מוצרים</h5>
						<Table striped bordered hover dir='rtl' className='mb-5'>
							<TableHead className='table-dark'>
								<TableRow>
									<TableCell align='right'>מוצרים</TableCell>
									<TableCell align='right'>כמות</TableCell>
									<TableCell align='right'>מחיר ליחידה</TableCell>
									<TableCell align='right'>סה״כ</TableCell>
								</TableRow>
							</TableHead>
							<tbody>
								{receipt.products.map((p, i) => (
									<TableRow key={i}>
										<TableCell align='right'>
											{p.product_name}
										</TableCell>
										<TableCell align='right'>{p.quantity}</TableCell>
										<TableCell align='right'>
											{(
												p.product_price / p.quantity
											).toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</TableCell>
										<TableCell align='right'>
											{p.product_price.toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</TableCell>
									</TableRow>
								))}
							</tbody>
						</Table>
						<CardContent className=''>
							<strong>שם עסק:</strong>
							{receipt.businessInfo.name}
							<br />
							<br />
							<strong>טלפון:</strong>
							{receipt.businessInfo.phone}
							<br />
							<br />
							<strong>אימייל:</strong>
							{receipt.businessInfo.email}
							<br />
							<br />
							<strong>כתובת:</strong>
							{receipt.businessInfo.address}
						</CardContent>

						<hr />
						<div className=' text-center'>
							<PDFDownloadLink
								document={<ReceiptPDF receipt={receipt} />}
								fileName={`receipt_${receipt.orderNumber}.pdf`}
							>
								{({loading}) => (
									<Button
										sx={{
											width: "30%",
											color: "darkturquoise",
											bgcolor: "darkslategray",
										}}
										disabled={loading}
									>
										{loading
											? "טוען..."
											: t("pages.receipts.download") + " - PDF"}
									</Button>
								)}
							</PDFDownloadLink>
							{/* <Button
								sx={{
									width: "30%",
									color: "darkturquoise",
									bgcolor: "darkslategray",
								}}
								onClick={() => ReceiptPDF(receipt as ReceiptsType)}
							>
								{t("pages.receipts.download")} - PDF
							</Button> */}
						</div>
					</Box>
				))}
			</div>
		</main>
	);
};

export default Receipt;
