import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaUserShield, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaBan, FaUserCircle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
      .then((res) => {
        toast.success(res.data.message || "User status updated successfully");
        setLoading(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to update user status");
      });
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <FaUsers className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">Manage Users</h1>
              <p className="text-gray-600 text-lg font-semibold">View and manage all registered users</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-t-blue-500 border-r-indigo-500 border-b-blue-500 border-l-indigo-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 font-semibold text-lg">Loading users...</p>
          </div>
        ) : users.length > 0 ? (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-x-auto overflow-y-visible">
              <table className="min-w-full table-auto">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  <tr className="text-left text-white">
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Profile</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider">Address</th>
                    <th className="px-6 py-4 font-bold text-sm uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user._id}
                      className="hover:bg-blue-50 transition-all group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        {user.profilePic ? (
                          <img
                            src={user.profilePic}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-md group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center border-2 border-blue-200 shadow-md group-hover:scale-110 transition-transform duration-300">
                            <FaUserCircle className="text-white text-2xl" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900">
                          {user.firstName} {user.lastName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400 text-sm" />
                          <span className="text-gray-700 font-semibold">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaUserShield className={`text-sm ${user.role === 'admin' ? 'text-purple-500' : 'text-blue-500'}`} />
                          <span className={`px-3 py-1 rounded-lg font-bold text-sm ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400 text-sm" />
                          <span className="text-gray-700 font-semibold">
                            {user.phone || user.phoneNumber || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <FaMapMarkerAlt className="text-gray-400 text-sm flex-shrink-0" />
                          <span 
                            className="text-gray-700 font-semibold truncate" 
                            title={user.address || "Not Provided"}
                          >
                            {user.address || "Not Provided"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            onClick={() => handleBlockUser(user.email)}
                            className={`px-4 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                              user.isBloked
                                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                            }`}
                          >
                            {user.isBloked ? (
                              <>
                                <FaBan />
                                Blocked
                              </>
                            ) : (
                              <>
                                <FaCheckCircle />
                                Active
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-12 text-center border-2 border-gray-200"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-blue-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Users Found</h2>
            <p className="text-gray-600">There are no registered users in the system yet.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
