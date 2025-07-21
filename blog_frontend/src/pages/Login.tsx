import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";
import type { AppDispatch } from "../store";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const authData = await loginUser(email, password);
      console.log("Auth data after login:", authData);
      dispatch(setAuth(authData));
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-60 p-4 border rounded text-center">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input
        className="border p-2 w-full mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-4"
        onClick={handleLogin}
      >
        Login
      </button>

      <p className="text-sm text-gray-700 mb-2">Don't have an account?</p>

      <Link to="/signup">
        <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded w-full hover:bg-blue-600 hover:text-white">
          Sign Up
        </button>
      </Link>
    </div>
  );
}
