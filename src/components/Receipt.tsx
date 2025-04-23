import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ReceiptsType} from "../interfaces/Receipts";
import {Card, Table, Spinner, Form} from "react-bootstrap";
import {getUserReceiptsById, getUsersReceipts} from "../services/Receipts";
import html2canvas from "html2canvas";

import jsPDF from "jspdf";
import {Button, TextField} from "@mui/material";
import useToken from "../hooks/useToken";
import RoleType from "../interfaces/UserType";
import {showError} from "../atoms/Toast";
import {useTranslation} from "react-i18next";
import handleRTL from "../locales/handleRTL";

interface ReceiptProps {}
/**
 * Receipts page
 * @returns auth receipt and all receipt for admin users
 */
const Receipt: FunctionComponent<ReceiptProps> = () => {
	const {t, i18n} = useTranslation();
	const [receipts, setReceipts] = useState<ReceiptsType[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [productSearch, setProductSearch] = useState("");
	const {decodedToken} = useToken();

	const generatePDF = async (orderNumber: string) => {
		const element = document.getElementById(`receipt-${orderNumber}`);
		if (!element) return;

		try {
			const canvas: HTMLCanvasElement = await html2canvas(element, {scale: 2});
			const imgData = canvas.toDataURL("image/png");

			const pdf = new jsPDF("p", "mm", "a4");
			const pdfWidth = pdf.internal.pageSize.getWidth();
			const pdfHeight = (canvas.height * pdfWidth - 200) / canvas.width;

			pdf.addImage(imgData, "png", 0, 0, pdfWidth, pdfHeight);
			pdf.save(`receipt_${orderNumber}.pdf`);
		} catch (error) {
			showError("שגיאה ביצירת PDF");
		}
	};

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
		if (decodedToken && decodedToken.role === RoleType.Client) {
			getUserReceiptsById(decodedToken._id)
				.then((res) => {
					setReceipts(res);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (decodedToken && decodedToken.role === RoleType.Admin) {
			getUsersReceipts()
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
				<Spinner animation='border' variant='primary' />
				<p className='mt-3'>טוען קבלות...</p>
			</main>
		);
	}
	const diriction = handleRTL();

	if (receipts.length === 0) {
		return (
			<div className='text-center mt-5'>
				<p>לא נמצאו קבלות</p>
			</div>
		);
	}

	return (
		<main className=' min-vh-100' dir={diriction}>
			{/* חיפוש מתקדם  */}
			<div className='container mt-4 rounded'>
				<Form className='text-center p-3 my-3 m-auto' role='search'>
					<h3>🔎 {t("pages.receipts.receiptSearchTitle")}</h3>
					<div className='row border p-3 border-primary rounded'>
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
			</div>
			<div className=' container'>
				<h2 className='text-center mb-4'>{t("links.receipts")}🧾</h2>
				{filteredOrders.map((receipt) => (
					<div
						id={`receipt-${receipt.orderNumber}`}
						className='container my-5 bg-light p-3 border border-primary rounded'
						key={receipt.orderNumber}
					>
						<Card className='mb-4 shadow-sm'>
							<Card.Header
								as='h5'
								className='text-center bg-primary text-white'
							>
								{t("pages.receipts.receiptNumber")} {receipt.orderNumber}
							</Card.Header>
							<Card.Body>
								<Card.Text>
									<strong>{t("pages.receipts.receiptDate")}</strong>
									{new Date(receipt.orderDate).toLocaleString("he-IL", {
										year: "numeric",
										month: "long",
										day: "numeric",
										hour: "2-digit",
										minute: "2-digit",
									})}
								</Card.Text>

								<Card.Text>
									{receipt.customer ? (
										<>
											<strong className='me-1'>
												{t("pages.receipts.receiptCustomer")}
											</strong>
											{receipt.customer.name.first}
											<br />
											<strong className='me-1'>
												{t("pages.receipts.receiptCustomerPhone")}
											</strong>
											{receipt.customer.phone.phone_1}
											<br />
											<strong className='me-1'>
												{t("pages.receipts.receiptCustomerPhone")}
											</strong>
											{receipt.customer.phone.phone_2 || "לא קיים"}
											<br />
											<strong className='me-1'>
												{t("pages.receipts.receiptCustomerEmail")}
											</strong>{" "}
											{receipt.customer.email}
											<br />
											<strong className='me-1'>
												{t(
													"pages.receipts.receiptCustomerAdress",
												)}
											</strong>
											{`${receipt.customer.address.city}, ${receipt.customer.address.street},
											${receipt.customer.address.houseNumber}`}
										</>
									) : (
										<span className='text-muted'>
											{t(
												"pages.receipts.receiptCustomerNoCustomerToProvide",
											)}
										</span>
									)}
								</Card.Text>

								<hr />

								<Card.Text>
									<strong>
										{t("pages.receipts.receiptCustomerPaymentMethod")}
									</strong>
									{receipt.payment == "true"
										? t("pages.receipts.receiptCustomerCridetCard")
										: t("pages.receipts.receiptCustomerCash")}
								</Card.Text>
								<Card.Text>
									<strong>
										{t(
											"pages.receipts.receiptCustomerCollectionMethod",
										)}
									</strong>{" "}
									{receipt.deliveryFee
										? `${t("pages.receipts.receiptCustomerDelivry")} ${receipt.deliveryFee.toLocaleString(
												"he-IL",
												{
													style: "currency",
													currency: "ILS",
												},
											)}`
										: t(
												"pages.receipts.receiptCustomerSelfCollection",
											)}
								</Card.Text>

								<Card.Text className='fs-5 fw-bold'>
									{t("pages.receipts.receiptTotalToBePaid")}
									{receipt.totalAmount.toLocaleString("he-IL", {
										style: "currency",
										currency: "ILS",
									})}
								</Card.Text>
							</Card.Body>
						</Card>

						<h5 className='text-center'>🛒 {t("links.products")}</h5>
						<Table striped bordered hover dir='rtl' className='mb-5'>
							<thead className='table-dark'>
								<tr>
									<th>{t("links.products")}</th>
									<th>{t("pages.receipts.receiptTotalQuantity")}</th>
									<th>
										{t("pages.receipts.receiptTotalPricePerUnit")}
									</th>
									<th>
										{t("pages.receipts.receiptTotalPriceTotalUnits")}
									</th>
								</tr>
							</thead>
							<tbody>
								{receipt.products.map((p, i) => (
									<tr key={i}>
										<td>{p.product_name}</td>
										<td>{p.quantity}</td>
										<td>
											{(
												p.product_price / p.quantity
											).toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</td>
										<td>
											{p.product_price.toLocaleString("he-IL", {
												style: "currency",
												currency: "ILS",
											})}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
						<Card.Text className=' text-dark'>
							<strong>{t("pages.receipts.receiptBusinessName")}</strong>
							{receipt.businessInfo.name}
							<br />
							<br />
							<strong>{t("pages.receipts.receiptCustomerPhone")}</strong>
							{receipt.businessInfo.phone}
							<br />
							<br />
							<strong>
								{t("pages.receipts.receiptCustomerEmail")}
							</strong>{" "}
							{receipt.businessInfo.email}
							<br />
							<br />
							<strong>
								{t("pages.receipts.receiptCustomerAdress")}
							</strong>{" "}
							{receipt.businessInfo.address}
						</Card.Text>

						<hr />
						<div className=' text-center'>
							<Button
								sx={{
									width: "30%",
									color: "darkturquoise",
									bgcolor: "darkslategray",
								}}
								onClick={() => generatePDF(receipt.orderNumber)}
							>
								{t("pages.receipts.receiptDownload")} - PDF
							</Button>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Receipt;
