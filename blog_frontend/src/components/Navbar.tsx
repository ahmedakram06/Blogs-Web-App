import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import { disconnectSocket } from "../store/slices/socketSlice";
import { setSearchQuery } from "../store/slices/searchSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const query = useAppSelector((state) => state.search.query);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(disconnectSocket());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow">
      {/* Left Section */}
      <div className="flex items-center gap-10">
        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-10 h-10 rounded-full border"
        />
        <div className="flex items-center gap-9">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>
          <Link
            to="/my-blogs"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            My Blogs
          </Link>
          <Link
            to="/create"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Create Blog
          </Link>
          <Link
            to="/chat"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Messenger
          </Link>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-10">
        <input
          type="text"
          placeholder="Search blogs..."
          value={query}
          onChange={handleSearchChange}
          className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-500"
        />
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
