import axios from "axios";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (res) => {
      setLoading(true);
      axios
        .post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
          accessToken: res.access_token,
        })
        .then((res) => {
          toast.success("Login Success");
          const user = res.data.user;
          localStorage.setItem("token", res.data.token);

          if (user.role === "Admin") {
            navigate("/admin/");
          } else {
            navigate("/");
          }
        })
        .catch(() => {
          toast.error("Google login failed.");
        })
        .finally(() => setLoading(false));
    },
  });

  async function handleOnSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.post(`${backendUrl}/api/users/login`, {
        email,
        password,
      });

      const user = res.data.user;
      toast.success("Login Success");
      localStorage.setItem("token", res.data.token);

      if (!user.emailVerified) {
        navigate("/verify-email");
      } else if (user.role === "Admin") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-picture flex justify-center items-center">
      <form onSubmit={handleOnSubmit} className="login-container">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="logo" className="logo-image" />
        </div>

        <div className="input-icon-wrapper">
          <FaEnvelope className="input-icon" />
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-icon-wrapper">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="google-login-btn" onClick={googleLogin}>
          <FaGoogle className="google-icon" />
          <span>Login with Google</span>
        </div>
      </form>
    </div>
  );
}
