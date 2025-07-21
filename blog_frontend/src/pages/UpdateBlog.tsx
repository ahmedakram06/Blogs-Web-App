import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { getBlogById, updateBlog } from "../services/blogService";
import type { CreateBlogDto } from "../types";

export default function UpdateBlog() {
  const { id } = useParams<{ id: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      try {
        const blog = await getBlogById(id);
        setTitle(blog.title);
        setContent(blog.content);
        setIsPublic(blog.isPublic);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Failed to load blog.");
        navigate("/");
      }
    };

    fetchBlog();
  }, [id, navigate]);

  const handleUpdate = async () => {
    if (!token || !id) return alert("Unauthorized.");
    const updatedBlog: CreateBlogDto = { title, content, isPublic };
    try {
      await updateBlog(id, updatedBlog, token);
      alert("Blog updated!");
      navigate("/");
    } catch (err) {
      console.error("Error updating blog:", err);
      alert("Failed to update blog.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading blog...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Update Blog</h2>
      <input
        className="border p-2 w-full mb-4"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="border p-2 w-full mb-4 min-h-[200px]"
        placeholder="Blog Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Public Blog
      </label>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        onClick={handleUpdate}
      >
        Save Changes
      </button>
    </div>
  );
}
