import React, { useState, useEffect, Profiler } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Restaurants from "./pages/Restaurants.jsx";
import Search from "./pages/Search.jsx";
import Cart from "./pages/Cart.jsx";
import Admin from "./pages/Admin.jsx";
import Menu from "./pages/Menu.jsx";
import Nav from "./pages/Nav.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import Dock from "./pages/Dock.jsx";
import Auth from "./pages/Auth.jsx";
import NotFound from "./pages/NotFound.jsx";
import Payment from "./pages/Payment.jsx";
import AdminAuth from "./pages/AdminAuth.jsx";

function App() {
  const location = useLocation();
  const [cartItems, setCartItems] = useState(() => {
    return localStorage.getItem("kk_cart_items")
      ? JSON.parse(localStorage.getItem("kk_cart_items"))
      : [];
  });

  useEffect(() => {
    const root = document.querySelector("#root");
    const app = document.querySelector(".app");
    if (location.pathname === "/admin" || location.pathname === "/admin_auth") {
      root.classList.remove("pb-[70px]");
      root.classList.remove("px-5");
      app.classList.remove("py-3");
    } else {
      root.classList.add("pb-[70px]");
      root.classList.add("px-5");
      app.classList.add("py-3");
    }
  });

  return (
    <div className="app w-full overflow-x-hidden overflow-y-scroll py-3">
      <Nav cartItems={cartItems} setCartItems={setCartItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/restaurants"
          element={
            <Restaurants cartItems={cartItems} setCartItems={setCartItems} />
          }
        />
        <Route
          path="/restaurants/menu"
          element={<Menu cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route
          path="/admin"
          element={<Admin cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin_auth" element={<AdminAuth />} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/payment" element={<Payment />} /> */}
      </Routes>
      <Dock cartItems={cartItems} />
    </div>
  );
}

export default App;
