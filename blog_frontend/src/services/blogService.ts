import axios from "axios";
import { API_URL } from "../config/api";
import type { Blog, CreateBlogDto } from "../types";

// Get all public blogs
export const getPublicBlogs = async (): Promise<Blog[]> => {
  const res = await axios.get<Blog[]>(`${API_URL}/blogs/public`);
  return res.data;
};

// Get a single blog by ID
export const getBlogById = async (id: string): Promise<Blog> => {
  const res = await axios.get<Blog>(`${API_URL}/blogs/${id}`);
  return res.data;
};

// Get blogs created by the logged-in user
export const getMyBlogs = async (token: string): Promise<Blog[]> => {
  const res = await axios.get<Blog[]>(`${API_URL}/blogs/mine`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Create a new blog (requires token)
export const createBlog = async (
  blog: CreateBlogDto,
  token: string
): Promise<Blog> => {
  const res = await axios.post<Blog>(`${API_URL}/blogs`, blog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update an existing blog (requires token)
export const updateBlog = async (
  id: string,
  blog: CreateBlogDto,
  token: string
): Promise<Blog> => {
  const res = await axios.patch<Blog>(`${API_URL}/blogs/${id}`, blog, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete a blog by ID (requires token)
export const deleteBlog = async (
  id: string,
  token: string
): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(
    `${API_URL}/blogs/${id}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
