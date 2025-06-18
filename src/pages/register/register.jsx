import { useState } from "react";
import "./register.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  async function handleOnSubmit(e) {
    try {
      e.preventDefault();
      const profileImagePromise = mediaUpload(profilePic);
      const imageUrl = await profileImagePromise;

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      axios
        .post(`${backendUrl}/api/users`, {
          firstName,
          lastName,
          email,
          password,
          address,
          phone,
          profilePic: imageUrl,
        })
        .then((res) => {
          toast.success("Registration Successful");
          navigate("/login");
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || "An error occurred");
        });
    } catch (err) {
      toast.error("Failed to upload profile picture");
    }
  }

  return (
    <div className="bg-picture flex justify-center items-center">
      <form
        onSubmit={handleOnSubmit}
        className="form-container shadow-lg rounded-xl"
      >
        <div className="form-header">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <h2 className="text-white text-xl font-bold mt-4">Register</h2>
        </div>
        <div className="form-body">
          <input
            type="text"
            placeholder="First Name"
            className="input-field"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="input-field"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Address"
            className="input-field"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phone"
            className="input-field"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <div className="file-input-container">
            <label htmlFor="profilePic" className="file-label">
              Upload Profile Picture
            </label>
            <input
              type="file"
              id="profilePic"
              accept="image/*"
              className="file-input"
              onChange={(e) => setProfilePic(e.target.files[0])}
            />
          </div>
        </div>
        <button type="submit" className="submit-btn">
          Register
        </button>
      </form>
    </div>
  );
}
