import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getMyBlogs } from "../services/blogService";
import BlogCard from "../components/blogCard";
import type { RootState } from "../store";
import type { Blog } from "../types";

const BLOGS_PER_PAGE = 5;

interface CustomError {
  message?: string;
}

export default function MyBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const token = useSelector((state: RootState) => state.auth.token);

  const fetchMyBlogs = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await getMyBlogs(token);
      setBlogs(data);
    } catch (err: unknown) {
      const error = err as CustomError;
      toast.error(error.message || "Failed to load your blogs");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMyBlogs();
  }, [fetchMyBlogs, page]);

  console.log("MyBlogs re-rendered");
  return (
    <div className="max-w-5xl ml-12 mt-10 px-4">
      <h2 className="text-3xl font-bold mb-6 border-b pb-2">My Blogs</h2>

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
          : blogs
              .slice((page - 1) * BLOGS_PER_PAGE, page * BLOGS_PER_PAGE)
              .map((blog) => <BlogCard key={blog.id} blog={blog} />)}
      </div>

      {!loading && blogs.length > 0 && (
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
            disabled={page * BLOGS_PER_PAGE >= blogs.length}
          >
            Next
          </button>
        </div>
      )}

      {!loading && blogs.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          You have not posted any blogs yet.
        </p>
      )}
    </div>
  );
}
