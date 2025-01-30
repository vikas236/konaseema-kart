import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Nav from "./Nav.jsx";
import Food from "./Food.jsx";
import Categories from "./Categories.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <Nav />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/food" element={<Food />} />
      <Route path="/categories" element={<Categories />} />
    </Routes>
  </Router>
);
