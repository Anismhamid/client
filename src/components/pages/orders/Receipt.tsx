import {FunctionComponent, useEffect, useMemo, useState} from "react";
import {ReceiptsType} from "../../../interfaces/Receipts";
import {Card, Table, Form} from "react-bootstrap";
import {getUserReceiptsById, getUsersReceipts} from "../../../services/Receipts";
import html2canvas from "html2canvas";

import jsPDF from "jspdf";
import {Button, TextField} from "@mui/material";
import useToken from "../../../hooks/useToken";
import RoleType from "../../../interfaces/UserType";
import {useTranslation} from "react-i18next";
import Loader from "../../../atoms/loader/Loader";

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
	const generatePDF = async (elementId: string) => {
		const input = document.getElementById(`receipt-${elementId}`);
		if (!input) {
			console.error("Element not found");
			return;
		}

		// יוצרים תמונה מה־HTML
		const canvas = await html2canvas(input, {
			scale: 2,
			useCORS: true,
			scrollY: -window.scrollY,
		});
		const imgData = canvas.toDataURL("image/jpeg", 1.0);
		const pdf = new jsPDF("p", "mm", "a4");
		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		const imgWidth = pageWidth;
		const imgHeight = (canvas.height * imgWidth - 200) / canvas.width;

		let heightLeft = imgHeight;
		let position = 0;

		pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft > 0) {
			position = heightLeft - imgHeight;
			pdf.addPage();
			pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}

		pdf.save("receipt.pdf");
	};

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
			<div className='container mt-4 rounded'>
				<Form className='text-center p-3 my-3 m-auto' role='search'>
					<h3>{t("pages.receipts.receiptSearchTitle")}</h3>
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
				<h2 className='text-center mb-4'>קבלות🧾</h2>
				{filteredOrders.reverse().map((receipt) => (
					<div
						id={`receipt-${receipt.orderNumber}`}
						className=' container my-5 bg-light p-3 border border-primary rounded'
						key={receipt.orderNumber}
					>
						<Card className='card mb-1 shadow-sm'>
							<Card.Header
								as='h5'
								className='text-center bg-primary text-white'
							>
								'קבלה מס {receipt.orderNumber}
							</Card.Header>
							<Card.Body>
								<Card.Text>
									<strong>תאריך:</strong>
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
										<span className='text-muted'>
											אין פרטי לקוח זמינים
										</span>
									)}
								</Card.Text>

								<hr />

								<Card.Text>
									<strong>שיטת תשלום:</strong>
									{receipt.payment == "true" ? "כרטיס אשראי" : "מזומן"}
								</Card.Text>
								<Card.Text>
									<strong>שיטת איסוף:</strong>{" "}
									{receipt.deliveryFee
										? `משלוח עד הבית ${receipt.deliveryFee.toLocaleString(
												"he-IL",
												{
													style: "currency",
													currency: "ILS",
												},
											)}`
										: "איסוף עצמי "}
								</Card.Text>

								<Card.Text className='fs-5 fw-bold'>
									סה״כ לתשלום:
									{receipt.totalAmount.toLocaleString("he-IL", {
										style: "currency",
										currency: "ILS",
									})}
								</Card.Text>
							</Card.Body>
						</Card>

						<h5 className='text-center'>🛒 מוצרים</h5>
						<Table striped bordered hover dir='rtl' className='mb-5'>
							<thead className='table-dark'>
								<tr>
									<th>מוצרים</th>
									<th>כמות</th>
									<th>מחיר ליחידה</th>
									<th>סה״כ</th>
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
								{t("pages.receipts.download")} - PDF
							</Button>
						</div>
					</div>
				))}
			</div>
		</main>
	);
};

export default Receipt;
