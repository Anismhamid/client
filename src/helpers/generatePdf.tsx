// components/ReceiptPDF.tsx
import {Page, Document, StyleSheet, View, Text, Image, Font} from "@react-pdf/renderer";
import logo from "/myLogo2.png";
import {ReceiptsType} from "../interfaces/Receipts";
import handleRTL from "../locales/handleRTL";

// Register Hebrew font
Font.register({
	family: "Cairo",
	src: "/cairo/Cairo-VariableFont_slnt,wght.ttf",
});

// const rTL = () => (handleRTL() === "ltr" ? "row" : "row");

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 40,
		fontFamily: "Cairo",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	logo: {
		width: 150,
		height: 150,
	},
	title: {
		fontSize: 24,
		color: "#1976d2",
		fontWeight: "bold",
		marginBottom: 5,
	},
	subtitle: {
		fontSize: 11,
		color: "#444",
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
		borderBottomWidth: 1,
		borderBottomColor: "#1976d2",
		paddingBottom: 5,
		textAlign: "right",
		flexDirection: "row",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	label: {
		fontSize: 12,
		color: "#333",
		fontWeight: "bold",
	},
	value: {
		fontSize: 12,
		color: "#333",
	},
	tableHeader: {
		flexDirection: "row",
		backgroundColor: "#1976d2",
		color: "#fff",
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginTop: 15,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		paddingVertical: 8,
		paddingHorizontal: 10,
	},
	tableCell: {
		flex: 1,
		fontSize: 11,
		textAlign: "right",
	},
	totalRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginTop: 15,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
	},
	footer: {
		marginTop: 30,
		paddingTop: 10,
		borderTopWidth: 1,
		borderTopColor: "#e0e0e0",
		fontSize: 10,
		color: "#666",
	},
});

const ReceiptPDF = ({receipt}: {receipt: ReceiptsType}) => {
	const taxAmount = (receipt.totalAmount * 18) / (100 + 18);
	const subtotalWithoutTax = receipt.totalAmount - taxAmount;
	return (
		<Document>
			<Page size='A4' style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>سوق السخنيني</Text>
						<Text style={styles.subtitle}>www.Shok-Habena.com</Text>
						<Text style={styles.subtitle}>
							support@ShokHabenamarket.com | +972-53-834-6915
						</Text>
					</View>
					<Image src={logo} style={styles.logo} />
				</View>

				{/* Receipt Title */}
				<Text style={styles.sectionTitle}>ايصال</Text>

				{/* Order Info */}
				<View style={{marginBottom: 20}}>
					<View style={styles.row}>
						<Text style={styles.value}>{receipt.orderNumber}</Text>
						<Text style={styles.label}>رقم الطلب</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.value}>
							{new Date(receipt.orderDate).toLocaleDateString("he-IL", {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
						<Text style={styles.label}>تاريخ الطلب</Text>
					</View>
				</View>

				{/* Customer Info */}
				{receipt.customer && (
					<>
						<Text style={styles.sectionTitle}>تفاصيل العميل</Text>
						<View style={{marginBottom: 20}}>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.name.first}{" "}
									{receipt.customer.name.last || ""}
								</Text>
								<Text style={styles.label}>عميل</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>{receipt.customer.email}</Text>
								<Text style={styles.label}>بريد إلكتروني</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.phone.phone_1}
									{receipt.customer.phone.phone_2 &&
										`, ${receipt.customer.phone.phone_2}`}
								</Text>
								<Text style={styles.label}>هاتف</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.address.city},{" "}
									{receipt.customer.address.street}{" "}
									{receipt.customer.address.houseNumber}
								</Text>
								<Text style={styles.label}>العنوان</Text>
							</View>
						</View>
					</>
				)}

				{/* Products Table */}
				<Text style={styles.sectionTitle}>تفاصيل المنتج</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>سعر</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>
						السعر الكيلو
					</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>الكمية</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>المنتج</Text>
				</View>

				{receipt.products.map((product: any, index: number) => {
					const unitPrice = product.product_price / product.quantity;
					return (
						<View
							key={index}
							style={[
								styles.tableRow,
								{
									backgroundColor:
										index % 2 === 0 ? "#f5f5f5" : "transparent",
								},
							]}
						>
							<Text style={styles.tableCell}>
								{product.product_price.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={styles.tableCell}>
								{unitPrice.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={styles.tableCell}>{product.quantity}</Text>
							<Text style={styles.tableCell}>{product.product_name}</Text>
						</View>
					);
				})}

				{/* Payment Info */}
				<Text style={[styles.sectionTitle, {marginTop: 20}]}>
					طريقة الدفع و الاستلام
				</Text>
				<View style={{marginBottom: 20}}>
					<View style={styles.row}>
						<Text style={styles.value}>
							{receipt.payment === "true" ? "بطاقة إئتمان" : "نقدي"}
						</Text>
						<Text style={styles.label}>طريقة الدفع</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.value}>
							{receipt.deliveryFee
								? ` ${receipt.deliveryFee.toLocaleString("he-IL", {
										style: "currency",
										currency: "ILS",
									})} ${receipt.deliveryFee} - التوصيل إلى المنازل `
								: "استلام الذاتي"}
						</Text>
						<Text style={styles.label}>طريقة الاستلام</Text>
					</View>
				</View>

				{/* Totals */}
				<View style={styles.totalRow}>
					<View style={{width: 200}}>
						<View style={styles.row}>
							<Text style={styles.value}>
								{subtotalWithoutTax.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={styles.label}>
								الإجمالي قبل ضريبة القيمة المضافة:
							</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.value}>
								{taxAmount.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={styles.label}>ضريبة القيمة المضافة (18%):</Text>
						</View>
						<View style={styles.row}>
							<Text style={[styles.value, {fontWeight: "bold"}]}>
								{receipt.totalAmount.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={[styles.label, {fontWeight: "bold"}]}>
								السعر الإجمالي:
							</Text>
						</View>
					</View>
				</View>

				{/* Business Info */}
				<View style={styles.footer}>
					<Text style={{fontWeight: "bold", marginBottom: 5}}>פרטי העסק:</Text>
					<Text>שם: {receipt.businessInfo.name}</Text>
					<Text>אימייל: {receipt.businessInfo.email}</Text>
					<Text>טלפון: {receipt.businessInfo.phone}</Text>
					<Text>כתובת: {receipt.businessInfo.address}</Text>
				</View>

				{/* Thank you message */}
				<Text style={[styles.footer, {textAlign: "center", marginTop: 20}]}>
					תודה שקניתם אצלנו! נשמח לראותכם שוב
				</Text>
			</Page>
		</Document>
	);
};

export default ReceiptPDF;
