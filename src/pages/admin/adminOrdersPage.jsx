import axios from "axios";
import { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function AdminOrdersPage() {
    const [orders, setorders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeOrder, setActiveOrder] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);

    useEffect(()=>{
        if(loading){
            const token = localStorage.getItem("token");
             axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`,{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((res)=>{
                console.log(res.data);
                setorders(res.data);
                setLoading(false);
            }).catch((err)=>{
                console.error(err);
            })
        }
    },[loading])

	function handleOrderStatusChange(orderId, status) {
        const token = localStorage.getItem("token");
        
        axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/orders/status/${orderId}`,
            {
                status: status,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        ).then(()=>{
            console.log("Order status updated");
            setModalOpened(false);
            setLoading(true);
        }).catch((err)=>{
            console.error(err);
            setLoading(true);
        })
    }

   return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Admin Orders</h1>
			{loading ? (
				<p className="text-center text-gray-600">Loading...</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
						<thead className="bg-gray-200">
							<tr>
								<th className="px-4 py-2 text-left">Order ID</th>
								<th className="px-4 py-2 text-left">Email</th>
								<th className="px-4 py-2 text-left">Days</th>
								<th className="px-4 py-2 text-left">Starting Date</th>
								<th className="px-4 py-2 text-left">Ending Date</th>
								<th className="px-4 py-2 text-left">Total Amount</th>
								<th className="px-4 py-2 text-left">Approval Status</th>
								<th className="px-4 py-2 text-left">Order Date</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr
									key={order._id}
									className="border-t hover:bg-gray-100 cursor-pointer"
									onClick={() => {
										setActiveOrder(order);
										setModalOpened(true);
									}}
								>
									<td className="px-4 py-2">{order.orderId}</td>
									<td className="px-4 py-2">{order.email}</td>
									<td className="px-4 py-2">{order.days}</td>
									<td className="px-4 py-2">
										{new Date(order.startingDate).toLocaleDateString()}
									</td>
									<td className="px-4 py-2">
										{new Date(order.endingDate).toLocaleDateString()}
									</td>
									<td className="px-4 py-2">{order.totalAmount.toFixed(2)}</td>
									<td className="px-4 py-2">
										{order.status}
									</td>
									<td className="px-4 py-2">
										{new Date(order.orderDate).toLocaleDateString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
			{modalOpened && (
				<div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
					<div className="w-[500px] bg-white p-4 rounded-lg shadow-lg relative">
						<IoMdCloseCircleOutline
							className="absolute top-2 right-2 text-3xl cursor-pointer hover:text-red-600"
							onClick={() => setModalOpened(false)}
						/>
						<h1 className="text-2xl font-semibold mb-4">Order Details</h1>
						<div className="flex flex-col gap-2">
							<p>
								<span className="font-semibold">Order ID:</span>{" "}
								{activeOrder.orderId}
							</p>
							<p>
								<span className="font-semibold">Email:</span>{" "}
								{activeOrder.email}
							</p>
							<p>
								<span className="font-semibold">Days:</span> {activeOrder.days}
							</p>
							<p>
								<span className="font-semibold">Starting Date:</span>{" "}
								{new Date(activeOrder.startingDate).toLocaleDateString()}
							</p>
							<p>
								<span className="font-semibold">Ending Date:</span>{" "}
								{new Date(activeOrder.endingDate).toLocaleDateString()}
							</p>
							<p>
								<span className="font-semibold">Total Amount:</span>{" "}
								{activeOrder.totalAmount.toFixed(2)}
							</p>
							<p>
								<span className="font-semibold">Approval Status:</span>{" "}
								{activeOrder.status}
							</p>
							<p>
								<span className="font-semibold">Order Date:</span>{" "}
								{new Date(activeOrder.orderDate).toLocaleDateString()}
							</p>
						</div>
						<div className=" my-5 w-full flex justify-cener items-center">
							<button onClick={()=>{
                                handleOrderStatusChange(activeOrder.orderId, "approved")
                            }} className="flex bg-green-500 text-white px-4 py-1 rounded-md">
								Approve
							</button>
							<button onClick={()=>{
                                handleOrderStatusChange(activeOrder.orderId, "Rejected")
                            }} className="flex bg-red-500 text-white px-4 py-1 rounded-md ml-4">
								Reject
							</button>
						</div>
						<table className="w-full mt-4">
							<thead>
								<tr>
									<th></th>
									<th>Product</th>
									<th>Qty</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								{activeOrder.orderedItems.map((item) => {
									return (
										<tr key={item.product.key}>
											<td>
												<img
													src={item.product.image}
													alt={item.product.name}
													className="w-10 h-10"
												/>
											</td>
											<td>{item.product.name}</td>
											<td>{item.quantity}</td>
											<td>{item.product.price}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
}