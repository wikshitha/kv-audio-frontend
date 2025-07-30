import { useState } from "react";
import "./register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaUserCircle,
} from "react-icons/fa";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLoginRedirect, setLoadingLoginRedirect] = useState(false);

  const navigate = useNavigate();

  async function handleOnSubmit(e) {
    e.preventDefault();

    if (!firstName || !lastName || !email || !password || !address || !phone) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      if (profilePic) {
        const toastId = toast.loading("Uploading profile picture...");
        imageUrl = await mediaUpload(profilePic);
        toast.dismiss(toastId);
        toast.success("Image uploaded");
      }

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(`${backendUrl}/api/users`, {
        firstName,
        lastName,
        email,
        password,
        address,
        phone,
        profilePic: imageUrl,
      });

      toast.success("Registration Successful");
      navigate("/login");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Something went wrong during registration."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleLoginRedirect() {
    setLoadingLoginRedirect(true);
    setTimeout(() => {
      navigate("/login");
    }, 800);
  }

  return (
    <div className="bg-picture flex justify-center items-center">
      <form onSubmit={handleOnSubmit} className="form-container shadow-lg rounded-xl">
        <div className="form-header relative">
          <label htmlFor="profilePic" className="avatar-wrapper">
            <div className="profile-avatar">
              {profilePic ? (
                <img
                  src={URL.createObjectURL(profilePic)}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <FaUserCircle size={80} className="text-[#AA60C8]" />
              )}
            </div>
          </label>
          <input
            type="file"
            id="profilePic"
            accept="image/*"
            className="file-input"
            onChange={(e) => setProfilePic(e.target.files[0])}
          />
          <h2 className="text-white text-xl font-bold mt-4">Register</h2>
        </div>

        <div className="form-body">
          <div className="input-icon-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="First Name"
              className="input-field"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="input-icon-wrapper">
            <FaUser className="input-icon" />
            <input
              type="text"
              placeholder="Last Name"
              className="input-field"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="input-icon-wrapper">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-icon-wrapper">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-icon-wrapper">
            <FaMapMarkerAlt className="input-icon" />
            <input
              type="text"
              placeholder="Address"
              className="input-field"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="input-icon-wrapper">
            <FaPhone className="input-icon" />
            <input
              type="text"
              placeholder="Phone"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="login-redirect">
          Already have an account?{" "}
          <span onClick={handleLoginRedirect}>
            {loadingLoginRedirect ? (
              <FaSpinner className="spin" />
            ) : (
              "Login"
            )}
          </span>
        </p>
      </form>
    </div>
  );
}
