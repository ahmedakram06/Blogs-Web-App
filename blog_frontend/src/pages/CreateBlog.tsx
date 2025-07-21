import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../services/blogService";
import type { CreateBlogDto } from "../types";

export default function CreateBlog() {
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.auth.token);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = async () => {
    if (!token) return alert("You must be logged in.");
    const blogData: CreateBlogDto = { title, content, isPublic };
    try {
      await createBlog(blogData, token);
      alert("Blog created!");
      navigate("/");
    } catch (err) {
      console.error("Error creating blog:", err);
      alert("Error creating blog");
    }
  };

  console.log("Create Blog re-rendered");
  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-4">Create Blog</h2>
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
        onClick={handleSubmit}
      >
        Create
      </button>
    </div>
  );
}
