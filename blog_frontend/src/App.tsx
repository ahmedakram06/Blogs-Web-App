import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { connectSocket } from "./store/slices/socketSlice";
import { useAppDispatch } from "./store/hooks";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // ✅ import Signup page
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import BlogDetails from "./pages/BlogDetails";
import MyBlogs from "./pages/MyBlogs";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/privateRoute";
import Chat from "./pages/Chat";

function AppRoutes() {
  const location = useLocation();

  const isAuthPage = ["/login", "/signup"].includes(location.pathname); // ✅ detect login/signup

  return (
    <>
      {!isAuthPage && <Navbar />}

      <div className="px-4 mt-6 min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <CreateBlog />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <CreateBlog />
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs/:id/edit"
            element={
              <PrivateRoute>
                <UpdateBlog />
              </PrivateRoute>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <PrivateRoute>
                <BlogDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-blogs"
            element={
              <PrivateRoute>
                <MyBlogs />
              </PrivateRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {!isAuthPage && <Footer />}
    </>
  );
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(connectSocket());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
