import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  Blog,
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
  User,
} from "../types";
import { getBlogById, deleteBlog } from "../services/blogService";
import {
  getCommentsByBlog,
  postComment,
  deleteComment,
  updateComment,
} from "../services/commentService";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import CommentItem from "../components/commentItem";

interface CustomError {
  message?: string;
}

export default function BlogDetails() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<(Blog & { imageUrl?: string }) | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const { token, user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const loadComments = useCallback(async () => {
    if (!id) return;
    try {
      const fetched = await getCommentsByBlog(id);
      setComments(fetched);
    } catch (err: unknown) {
      const error = err as CustomError;
      console.error("Failed to load comments:", error.message || err);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getBlogById(id).then((data) => {
        const withImage = {
          ...data,
          imageUrl: `https://picsum.photos/seed/${data.id}/800/400`,
        };
        setBlog(withImage);
      });
      loadComments();
    }
  }, [id, loadComments]);

  const handleComment = async () => {
    if (!token || !commentText.trim() || !blog) return;

    const dto: CreateCommentDto = {
      blogId: blog.id,
      content: commentText.trim(),
    };

    try {
      await postComment(dto, token);
      setCommentText("");
      loadComments();
    } catch (err: unknown) {
      const error = err as CustomError;
      alert(error.message || "Failed to post comment.");
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!token || !content.trim() || !blog) return;

    const dto: CreateCommentDto = {
      blogId: blog.id,
      content: content.trim(),
      parentId,
    };

    try {
      await postComment(dto, token);
      loadComments();
    } catch (err: unknown) {
      const error = err as CustomError;
      alert(error.message || "Failed to post reply.");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!token) return;
    try {
      await deleteComment(commentId, token);
      loadComments();
    } catch (err: unknown) {
      const error = err as CustomError;
      alert(error.message || "Failed to delete comment.");
    }
  };

  const handleEditComment = async (commentId: string, newContent: string) => {
    if (!token || !newContent.trim()) return;

    const dto: UpdateCommentDto = {
      content: newContent.trim(),
    };

    try {
      await updateComment(commentId, dto, token);
      loadComments();
    } catch (err: unknown) {
      const error = err as CustomError;
      alert(error.message || "Failed to update comment.");
    }
  };

  const handleDeleteBlog = async () => {
    if (!token || !blog) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      await deleteBlog(blog.id, token);
      navigate("/");
    } catch (err: unknown) {
      const error = err as CustomError;
      alert(error.message || "Failed to delete blog.");
    }
  };

  if (!blog) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl ml-12 mt-10 px-4">
      {/* Blog title & actions */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">{blog.title}</h1>
        {token && user?.id === blog.author.id && (
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/blogs/${blog.id}/edit`)}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Edit Blog
            </button>
            <button
              onClick={handleDeleteBlog}
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
            >
              Delete Blog
            </button>
          </div>
        )}
      </div>

      {/* Blog author & date */}
      <div className="text-gray-500 text-sm mb-4">
        By {blog.author.name} — {new Date(blog.createdAt).toLocaleDateString()}
      </div>

      {/* Blog image */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt="Blog"
          className="w-5xl h-5xl object-cover rounded-xl mb-4"
        />
      )}

      {/* Blog content */}
      <p className="whitespace-pre-wrap mb-8">{blog.content}</p>

      {/* Comment input */}
      {token && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Leave a Comment</h3>
          <textarea
            className="border p-2 w-full mb-2"
            rows={3}
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            onClick={handleComment}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Comment
          </button>
        </div>
      )}

      {/* Comments List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onDelete={handleDeleteComment}
              onEdit={handleEditComment}
              currentUser={user as User}
              blogAuthorId={blog.author.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
