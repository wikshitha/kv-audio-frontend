import axios from "axios";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import {
  FaEnvelope,
  FaLock,
  FaGoogle,
  FaUserCircle,
  FaSpinner,
} from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
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

  function handleRegisterRedirect() {
    setLoadingRegister(true);
    setTimeout(() => {
      navigate("/register");
    }, 800);
  }

  return (
    <div className="bg-picture flex justify-center items-center">
      <form onSubmit={handleOnSubmit} className="form-container shadow-lg rounded-xl">
        <div className="form-header relative">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              <FaUserCircle size={80} className="text-[#AA60C8]" />
            </div>
          </div>
          <h2 className="text-white text-xl font-bold mt-4">Login</h2>
        </div>

        <div className="form-body">
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
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="google-login-btn" onClick={googleLogin}>
          <FaGoogle className="google-icon" />
          <span>Login with Google</span>
        </div>

        <p className="login-redirect">
          Don't have an account?{" "}
          <span
            onClick={handleRegisterRedirect}
            style={{ cursor: "pointer", display: "inline-flex", alignItems: "center" }}
          >
            {loadingRegister ? (
              <FaSpinner className="spin" style={{ marginRight: "8px" }} />
            ) : (
              "Register"
            )}
          </span>
        </p>
      </form>
    </div>
  );
}
