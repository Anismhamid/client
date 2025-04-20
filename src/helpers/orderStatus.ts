// Helper function to get status text
export const getStatusText = (status: string) => {
	const statusMapping: {[key: string]: string} = {
		Pending: "בהמתנה",
		Shipped: "נמסר",
		Delivered: "נשלח",
		Preparing: "ההזמנה שלך בהכנה",
		Cancelled: "בוטל",
	};
	return statusMapping[status] || "לא ידוע";
};




// <div>
// 	<strong>סטטוס:</strong>{" "}
// 	<span
// 		className={`${
// 			orderStatuses[order.orderNumber] === "Pending"
// 				? "text-danger"
// 				: orderStatuses[order.orderNumber] === "Shipped"
// 				? "text-success"
// 				: orderStatuses[order.orderNumber] === "Delivered"
// 				? "text-info"
// 				: orderStatuses[order.orderNumber] === "Preparing"
// 				? "text-primary"
// 				: orderStatuses[order.orderNumber] === "Cancelled"
// 				? "text-danger"
// 				: ""
// 		}`}
// 	>
// 		{getStatusText(orderStatuses[order.orderNumber])}
// 	</span>
// </div>;