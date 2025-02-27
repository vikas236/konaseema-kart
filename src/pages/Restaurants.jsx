import { NavLink } from "react-router-dom";
import { recipes } from "../core/data.js";
import { useState, useEffect } from "react";
import camelCasing from "../core/helpers.js";

function Restaurants({ cartItems, setCartItems }) {
  const restaurant_names = [];
  const [activeRestaurant, setActiveRestaurant] = useState(
    localStorage.getItem("kk_active_restaurant") || ""
  );

  Object.values(recipes).forEach((e) => {
    const name = [];
    e.name.split(" ").forEach((e) => {
      name.push(e[0].toUpperCase() + e.slice(1, e.length));
    });
    restaurant_names.push(name.join(" "));
  });

  function redirectToMenu(e) {
    const selectedRestaurant =
      e.currentTarget.childNodes[1].childNodes[0].innerHTML.toLowerCase();

    // Reset cart if switching to a different restaurant
    if (selectedRestaurant !== activeRestaurant) {
      setCartItems([]);
      localStorage.removeItem("kk_cart_items");
      setActiveRestaurant(selectedRestaurant);
    }

    localStorage.setItem("kk_active_restaurant", selectedRestaurant);
  }

  return (
    <div className="restaurants">
      <h1 className="font-semibold text-center">Restaurants</h1>
      <div className="container flex flex-wrap pt-5 gap-3">
        {restaurant_names.map((e, i) => {
          return (
            <NavLink
              to="/restaurants/menu"
              onClick={redirectToMenu}
              className="restaurant w-[calc(50%-6px)] bg-gray-100 p-3 rounded-lg flex flex-col gap-2 cursor-pointer border border-gray-200"
              key={i}
            >
              <img
                src="https://img.freepik.com/free-photo/cement-texture_1194-6501.jpg?semt=ais_hybrid"
                alt=""
                className="h-fit rounded-lg hidden"
              />
              <div className="details flex flex-col justify-between gap-2">
                <h2 className="text-sm truncate">{e}</h2>
                <button className="text-start flex items-center justify-between text-gray-400 text-md active:text-primary text-sm">
                  view menu
                  <i className="bx bx-chevron-right bg-[#accabd] rounded-full p-[1px] text-white ml-2"></i>
                </button>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Restaurants;
