// components/ReceiptPDF.tsx
import {Page, Document, StyleSheet, View, Text, Image, Font} from "@react-pdf/renderer";
import logo from "/Logo.png";
import { ReceiptsType } from "../interfaces/Receipts";

// Register Hebrew font
Font.register({
	family: "Heebo",
	src: "/Heebo-VariableFont_wght.ttf",
});

// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 40,
		fontFamily: "Heebo",
	},
	header: {
		flexDirection: "row-reverse",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	logo: {
		width: 70,
		height: 50,
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
	},
	row: {
		flexDirection: "row-reverse",
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
		flexDirection: "row-reverse",
		backgroundColor: "#1976d2",
		color: "#fff",
		paddingVertical: 5,
		paddingHorizontal: 10,
		marginTop: 15,
	},
	tableRow: {
		flexDirection: "row-reverse",
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
		flexDirection: "row-reverse",
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
	const taxAmount = (receipt.totalAmount * 17) / (100 + 17);
	const subtotalWithoutTax = receipt.totalAmount - taxAmount;

	return (
		<Document>
			<Page size='A4' style={styles.page}>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Text style={styles.title}>שוק הבינה מרקט</Text>
						<Text style={styles.subtitle}>www.Shok-Habena.com</Text>
						<Text style={styles.subtitle}>
							support@ShokHabenamarket.com | +972-53-834-6915
						</Text>
					</View>
					<Image src={logo} style={styles.logo} />
				</View>

				{/* Receipt Title */}
				<Text style={styles.sectionTitle}>קבלה</Text>

				{/* Order Info */}
				<View style={{marginBottom: 20}}>
					<View style={styles.row}>
						<Text style={styles.value}>{receipt.orderNumber}</Text>
						<Text style={styles.label}>מספר הזמנה:</Text>
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
						<Text style={styles.label}>תאריך:</Text>
					</View>
				</View>

				{/* Customer Info */}
				{receipt.customer && (
					<>
						<Text style={styles.sectionTitle}>פרטי הלקוח</Text>
						<View style={{marginBottom: 20}}>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.name.first}{" "}
									{receipt.customer.name.last || ""}
								</Text>
								<Text style={styles.label}>לקוח:</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>{receipt.customer.email}</Text>
								<Text style={styles.label}>אימייל:</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.phone.phone_1}
									{receipt.customer.phone.phone_2 &&
										`, ${receipt.customer.phone.phone_2}`}
								</Text>
								<Text style={styles.label}>טלפון:</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.value}>
									{receipt.customer.address.city},{" "}
									{receipt.customer.address.street}{" "}
									{receipt.customer.address.houseNumber}
								</Text>
								<Text style={styles.label}>כתובת:</Text>
							</View>
						</View>
					</>
				)}

				{/* Products Table */}
				<Text style={styles.sectionTitle}>פירוט המוצרים</Text>
				<View style={styles.tableHeader}>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>מחיר</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>
						מחיר ליחידה
					</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>כמות</Text>
					<Text style={[styles.tableCell, {fontWeight: "bold"}]}>מוצר</Text>
				</View>

				{receipt.products.map((product:any, index:number) => {
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
					שיטת תשלום ומשלוח
				</Text>
				<View style={{marginBottom: 20}}>
					<View style={styles.row}>
						<Text style={styles.value}>
							{receipt.payment === "true" ? "כרטיס אשראי" : "מזומן"}
						</Text>
						<Text style={styles.label}>שיטת תשלום:</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.value}>
							{receipt.deliveryFee
								? `משלוח לבית - ${receipt.deliveryFee.toLocaleString(
										"he-IL",
										{
											style: "currency",
											currency: "ILS",
										},
									)}`
								: "איסוף עצמי"}
						</Text>
						<Text style={styles.label}>שיטת משלוח:</Text>
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
							<Text style={styles.label}>סה"כ לפני מע"מ:</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.value}>
								{taxAmount.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={styles.label}>מע"מ (17%):</Text>
						</View>
						<View style={styles.row}>
							<Text style={[styles.value, {fontWeight: "bold"}]}>
								{receipt.totalAmount.toLocaleString("he-IL", {
									style: "currency",
									currency: "ILS",
								})}
							</Text>
							<Text style={[styles.label, {fontWeight: "bold"}]}>
								סה"כ לתשלום:
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
