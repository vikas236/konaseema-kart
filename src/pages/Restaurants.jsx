import { NavLink } from "react-router-dom";
import { recipes } from "../core/data.js";
import { useState, useEffect } from "react";
import camelCasing from "../core/helpers.js";
import server from "../core/server.js";

function Restaurants({ setCartItems }) {
  const [loading, setLoading] = useState(true);
  let [restaurantNames, setRestaurantNames] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(
    localStorage.getItem("kk_active_restaurant") || ""
  );

  async function getRestaurantNames() {
    let restaurant_names = await server.getRestaurantNames();

    setRestaurantNames(restaurant_names);
    setLoading(false);
  }

  function Spinner({ primary_color }) {
    let bg_color, text_color;
    if (primary_color == "white") {
      bg_color = "bg-white";
      text_color = "bg-primary";
    } else {
      text_color = "bg-white";
      bg_color = "bg-primary";
    }

    return (
      <div className="w-full h-full relative overflow-hidden rounded-full animate-spin">
        <span
          className={`w-[60%] h-full absolute top-1/2 left-1/2 ${bg_color} z-10`}
        ></span>
        <span
          className={`w-full h-full absolute left-0 rounded-full opacity-25 ${bg_color} z-10`}
        ></span>
        <span
          className={`w-[75%] h-[75%] absolute top-1/2 left-1/2 -translate-1/2 ${text_color} rounded-full z-30`}
        ></span>
      </div>
    );
  }

  useEffect(() => {
    getRestaurantNames();
  }, [setRestaurantNames, setLoading]);

  function redirectToMenu(e) {
    const selectedRestaurant =
      e.currentTarget.childNodes[1].childNodes[0].innerHTML;

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
        {!loading ? (
          restaurantNames.map((e, i) => {
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
                  <h2 className="text-sm truncate">{e.name}</h2>
                  <button className="text-start flex items-center justify-between text-gray-400 text-md active:text-primary text-sm">
                    view menu
                    <i className="bx bx-chevron-right bg-[#accabd] rounded-full p-[1px] text-white ml-2"></i>
                  </button>
                </div>
              </NavLink>
            );
          })
        ) : (
          <div className="w-full h-full flex justify-center items-center mt-[50%] -translate-y-1/2">
            <div className="w-[50px] h-[50px] ">
              <Spinner />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restaurants;
