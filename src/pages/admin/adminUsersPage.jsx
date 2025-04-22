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
				console.log(res.data);
				setUsers(res.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			} finally {
				setLoading(false);
			}
		};
        if(loading){
            fetchUsers();
        }
	}, [loading]);

    function handleBlockUser(email){
    
        const token = localStorage.getItem("token");

        axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/users/block/${email}`,{}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(()=>{
            setLoading(true);
        }).catch((err)=>{
            console.error(err);
        })
    }

	return (
		<div className="p-6">
			<h1 className="text-2xl font-semibold mb-4">Admin Users</h1>
			{loading ? (
				<p className="text-center text-gray-600">Loading...</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
						<thead className="bg-gray-200">
							<tr>
								<th className="px-4 py-2 text-left">Profile</th>
								<th className="px-4 py-2 text-left">Name</th>
								<th className="px-4 py-2 text-left">Email</th>
								<th className="px-4 py-2 text-left">Role</th>
								<th className="px-4 py-2 text-left">Phone</th>
								<th className="px-4 py-2 text-left">Address</th>
								<th className="px-4 py-2 text-left">Status</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id} className="border-t hover:bg-gray-100">
									<td className="px-4 py-2">
                                    <img src={user.profilePic} alt="Profile" className="w-10 h-10 rounded-full"/>
									</td>
									<td className="px-4 py-2">
										{user.firstName} {user.lastName}
									</td>
									<td className="px-4 py-2">{user.email}</td>
									<td className="px-4 py-2 capitalize">{user.role}</td>
									<td className="px-4 py-2">
										{user.phone || user.phoneNumber}
									</td>
									<td className="px-4 py-2">{user.address}</td>
									<td onClick={()=>{handleBlockUser(user.email)}} className="px-4 py-2 cursor-pointer">{user.isBloked?"BLOCKED":"ACTIVE"}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}