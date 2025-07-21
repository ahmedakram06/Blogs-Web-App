import { useNavigate } from "react-router-dom";
import type { Blog } from "../types";

export default function BlogCard({ blog }: { blog: Blog }) {
  const navigate = useNavigate();

  const image =
    blog.imageUrl || `https://picsum.photos/seed/${blog.id}/300/300`;

  return (
    <div
      className="flex rounded-xl shadow hover:shadow-md transition cursor-pointer overflow-hidden"
      onClick={() => navigate(`/blogs/${blog.id}`)}
    >
      {/* Left: Image */}
      <img src={image} alt={blog.title} className="w-40 h-40 object-cover" />

      {/* Right: Content */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h2 className="text-xl font-semibold text-blue-700">{blog.title}</h2>
          <p className="text-gray-700 mt-1">{blog.content.slice(0, 100)}...</p>
        </div>

        <div className="mt-3 text-sm text-gray-500 flex justify-between">
          <span>By {blog.author.name}</span>
          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
