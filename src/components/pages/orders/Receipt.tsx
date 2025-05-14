import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ReceiptsType} from "../../../interfaces/Receipts";
import {Table, Form} from "react-bootstrap";
import {getUserReceiptsById, getUsersReceipts} from "../../../services/Receipts";
import {pdf} from "@react-pdf/renderer";

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
				<h2 className='text-center mb-4'>{t("pages.receipts.productsTitle")}</h2>
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
									{t("pages.receipts.receiptNumber") +
										" " +
										receipt.orderNumber}
								</Typography>
							</CardHeader>
							<CardContent>
								<CardContent>
									{receipt.customer ? (
										<>
											<strong className='d-block'>
												{t("date")}:
												{new Date(
													receipt.orderDate,
												).toLocaleString("he-IL", {
													year: "numeric",
													month: "long",
													day: "numeric",
													hour: "2-digit",
													minute: "2-digit",
												})}
											</strong>
											<strong className='me-1'>
												{t("customer")}:
											</strong>
											{receipt.customer.name.first}
											<br />
											<strong className='me-1'>
												{t("phone")}:
											</strong>
											{receipt.customer.phone.phone_1}
											<br />
											<strong className='me-1'>
												{t("phone")}-2:
											</strong>
											{receipt.customer.phone.phone_2 || "לא קיים"}
											<br />
											<strong className='me-1'>
												{t("email")}:
											</strong>
											{receipt.customer.email}
											<br />
											<strong className='me-1'>
												{t("address")}:
											</strong>
											{`${receipt.customer.address.city}, ${receipt.customer.address.street},
											${receipt.customer.address.houseNumber}`}
										</>
									) : (
										<span className=''>אין פרטי לקוח זמינים</span>
									)}
								</CardContent>

								<hr />

								<CardContent>
									<strong>
										{t("paymentMethod")}:
										<span className='mx-1'>
											{receipt.payment == "true"
												? `${t("creditCard")}`
												: `${t("cash")}`}
										</span>
									</strong>
								</CardContent>
								<CardContent>
									<strong>{t("pages.receipts.deliveryMethod")}:</strong>
									<span className='mx-1'>
										{receipt.deliveryFee
											? `${t("pages.receipts.delivery")} ${receipt.deliveryFee.toLocaleString(
													"he-IL",
													{
														style: "currency",
														currency: "ILS",
													},
												)}`
											: `${t("pages.receipts.pickup")}`}
									</span>
								</CardContent>

								<CardContent className='fs-5 fw-bold'>
									{t("pages.receipts.totalAmount")}:
									<span className='text-success mx-1'>
										{receipt.totalAmount.toLocaleString("he-IL", {
											style: "currency",
											currency: "ILS",
										})}
									</span>
								</CardContent>
							</CardContent>
						</Card>

						<h5 className='text-center mt-5'>{t("links.products")}</h5>
						<Table striped bordered hover dir='rtl' className='mb-5'>
							<TableHead className='table-dark'>
								<TableRow>
									<TableCell align='right'>
										{t("links.products")}
									</TableCell>
									<TableCell align='right'>{t("quantity")}</TableCell>
									<TableCell align='right'>
										{t("pages.receipts.pricePerUnit")}
									</TableCell>
									<TableCell align='right'>
										{" "}
										{t("pages.receipts.total")}
									</TableCell>
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
							<strong>{t("pages.recipts.businessName")}:</strong>
							{receipt.businessInfo.name}
							<br />
							<br />
							<strong>{t("phone")}:</strong>
							{receipt.businessInfo.phone}
							<br />
							<br />
							<strong>{t("email")}:</strong>
							{receipt.businessInfo.email}
							<br />
							<br />
							<strong>{t("address")}:</strong>
							{receipt.businessInfo.address}
						</CardContent>

						<hr />
						<div className=' text-center'>
							<Button
								onClick={() => {
									const doc = <ReceiptPDF receipt={receipt} />;
									pdf(doc)
										.toBlob()
										.then((blob) => {
											const url = URL.createObjectURL(blob);
											const link = document.createElement("a");
											link.href = url;
											link.download = `receipt_${receipt.orderNumber}.pdf`;
											link.click();
											URL.revokeObjectURL(url);
										});
								}}
								sx={{
									width: "30%",
									color: "darkturquoise",
									bgcolor: "darkslategray",
								}}
							>
								{t("pages.receipts.download") + " - PDF"}
							</Button>
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
