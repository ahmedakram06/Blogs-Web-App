import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

interface CustomError {
  message?: string;
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post(`${API_URL}/users/register`, { name, email, password });
      alert("Registration successful. Please log in.");
      navigate("/login");
    } catch (err: unknown) {
      const error = err as CustomError;
      console.error("Signup failed:", error);
      alert(error.message || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-60 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <input
        className="border p-2 w-full mb-4"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSignup}
      >
        Sign Up
      </button>
    </div>
  );
}
