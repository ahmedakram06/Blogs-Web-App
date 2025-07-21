import axios from "axios";
import { API_URL } from "../config/api";
import type { AuthState } from "../store/slices/authSlice";

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterResponse {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthState> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
    email,
    password,
  });
  console.log("Response from backend:", res.data);
  return {
    token: res.data.accessToken,
    user: res.data.user,
  };
};

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthState> => {
  const res = await axios.post<RegisterResponse>(`${API_URL}/auth/register`, {
    name,
    email,
    password,
  });

  return {
    token: res.data.accessToken,
    user: res.data.user,
  };
};
