import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAppSelector } from "../store/hooks";
import { getPublicBlogs } from "../services/blogService";
import BlogCard from "../components/blogCard";
import type { Blog } from "../types";

const BLOGS_PER_PAGE = 5;

interface CustomError {
  message?: string;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const searchQuery = useAppSelector((state) =>
    state.search.query.toLowerCase()
  );

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getPublicBlogs();
      setBlogs(data);
    } catch (err: unknown) {
      const error = err as CustomError;
      toast.error(error.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // const filteredBlogs = blogs.filter((blog) =>
  //   blog.title.toLowerCase().includes(searchQuery)
  // );

  const filteredBlogs = Array.isArray(blogs)
    ? blogs.filter((blog) => blog.title.toLowerCase().includes(searchQuery))
    : [];

  const paginatedBlogs = filteredBlogs.slice(
    (page - 1) * BLOGS_PER_PAGE,
    page * BLOGS_PER_PAGE
  );

  return (
    <div className="max-w-5xl ml-12 mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">Recent Posts</h2>

      <div className="grid gap-4">
        {loading
          ? [...Array(BLOGS_PER_PAGE)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border rounded-xl p-4 shadow"
              >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-full mb-1" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
              </div>
            ))
          : paginatedBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
      </div>

      {!loading && filteredBlogs.length > 0 && (
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
          >
            Prev
          </button>
          <span className="text-sm self-center">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1 border rounded text-sm bg-gray-100 hover:bg-gray-200"
            disabled={page * BLOGS_PER_PAGE >= filteredBlogs.length}
          >
            Next
          </button>
        </div>
      )}

      {!loading && filteredBlogs.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No blogs found for "{searchQuery}"
        </p>
      )}
    </div>
  );
}
