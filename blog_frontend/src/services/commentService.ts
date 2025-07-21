import axios from "axios";
import { API_URL } from "../config/api";
import type { Comment, CreateCommentDto, UpdateCommentDto } from "../types";

// ✅ Get all comments for a specific blog
export const getCommentsByBlog = async (blogId: string): Promise<Comment[]> => {
  const res = await axios.get<Comment[]>(`${API_URL}/comments/blog/${blogId}`);
  return res.data;
};

// ✅ Post a new comment or reply
export const postComment = async (
  data: CreateCommentDto,
  token: string
): Promise<Comment> => {
  const res = await axios.post<Comment>(`${API_URL}/comments`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateComment = async (
  commentId: string,
  data: UpdateCommentDto,
  token: string
): Promise<Comment> => {
  const res = await axios.patch<Comment>(
    `${API_URL}/comments/${commentId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteComment = async (
  commentId: string,
  token: string
): Promise<{ message: string }> => {
  const res = await axios.delete<{ message: string }>(
    `${API_URL}/comments/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
