import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = localStorage.getItem("token");
				const res = await axios.get(
					`${import.meta.env.VITE_BACKEND_URL}/api/users/all`,
					{
						headers: {
							Authorization: `Bearer ${token}`,
						},
					}
				);
				setUsers(res.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoading(false);
			}
		};
		if (loading) {
			fetchUsers();
		}
	}, [loading]);

	function handleBlockUser(email) {
		const token = localStorage.getItem("token");

		axios
			.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/users/block/${email}`,
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			.then(() => {
				setLoading(true);
			})
			.catch((err) => {
				console.error(err);
			});
	}

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<h1 className="text-3xl font-bold text-gray-700 mb-6">Manage Users</h1>

			{loading ? (
				<div className="flex justify-center items-center h-40">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
					<table className="min-w-full table-auto border-collapse border border-gray-300">
						<thead className="bg-blue-100">
							<tr className="text-left text-gray-700">
								<th className="px-6 py-3 font-medium">Profile</th>
								<th className="px-6 py-3 font-medium">Name</th>
								<th className="px-6 py-3 font-medium">Email</th>
								<th className="px-6 py-3 font-medium">Role</th>
								<th className="px-6 py-3 font-medium">Phone</th>
								<th className="px-6 py-3 font-medium">Address</th>
								<th className="px-6 py-3 font-medium">Status</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr
									key={user._id}
									className="border-t hover:bg-gray-100 transition-all"
								>
									<td className="px-6 py-3">
										<img
											src={user.profilePic || "/default-avatar.png"}
											alt="Profile"
											className="w-10 h-10 rounded-full shadow"
										/>
									</td>
									<td className="px-6 py-3">
										{user.firstName} {user.lastName}
									</td>
									<td className="px-6 py-3">{user.email}</td>
									<td className="px-6 py-3 capitalize">{user.role}</td>
									<td className="px-6 py-3">
										{user.phone || user.phoneNumber || "N/A"}
									</td>
									<td className="px-6 py-3">
										{user.address || "Not Provided"}
									</td>
									<td className="px-6 py-3">
										<button
											onClick={() => handleBlockUser(user.email)}
											className={`px-3 py-1 text-white rounded-lg shadow ${
												user.isBloked
													? "bg-red-600 hover:bg-red-700"
													: "bg-green-600 hover:bg-green-700"
											} transition-all`}
										>
											{user.isBloked ? "Blocked" : "Active"}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
