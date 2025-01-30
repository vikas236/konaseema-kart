import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "./data.js";

function Categories() {
  const navigate = useNavigate();
  const [categoriesNames, setCategoriesNames] = useState([]);
  if (
    localStorage.getItem("presentActiveRestaurant") !=
    localStorage.getItem("presentRestaurant")
  )
    localStorage.setItem("kk_cart_items", JSON.stringify([]));

  function CategoryImages() {
    useEffect(() => {
      const categories = document.querySelectorAll(".categories button");

      categories.forEach((e) => {
        e.addEventListener("click", () => {
          localStorage.setItem(
            "presentFoodCategory",
            e.innerHTML.toLowerCase().replaceAll(" ", "_")
          );
          navigate("/food");
        });
      });
    }, []);

    useEffect(() => {
      const restaurant = localStorage.getItem("presentRestaurant");
      const restaurant_data = Object.values(recipes).find(
        (e) => e.name === restaurant
      );

      if (restaurant_data) {
        let newCategories = Object.keys(restaurant_data).slice();
        newCategories.shift();

        // Only update state if newCategories is different from the current state
        setCategoriesNames((prev) =>
          JSON.stringify(prev) === JSON.stringify(newCategories)
            ? prev
            : newCategories
        );
      }
    }, []);

    return (
      <div className="categories w-full h-fit min-h-100 mt-3 mb-10">
        <div className="container mt-5 flex flex-wrap gap-3">
          {categoriesNames.map((name, index) => (
            <button
              key={index}
              className="shadow-xl flex border-2 border-orange-400 w-[calc(50%-6px)] min-h-[calc(40dvw-6px)] 
                     text-center font-semibold rounded-3xl py-5 px-5 cursor-pointer justify-center items-center
                     active:shadow-none transition-all"
            >
              {name.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-dvw overflow-y-scroll overflow-x-hidden">
      <CategoryImages />
    </div>
  );
}

export default Categories;
