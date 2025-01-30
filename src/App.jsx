import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { recipes } from "./data";

function App() {
  const navigate = useNavigate();

  const restaurants = [];

  function getRestaurantNames() {
    Object.values(recipes).forEach((e) => {
      restaurants.push(e.name);
    });
  }
  getRestaurantNames();

  function redirectToFood() {
    const buttons = document.querySelectorAll(".restaurants button");

    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        localStorage.setItem(
          "presentRestaurant",
          e.target.innerHTML.toLowerCase()
        );
        navigate("/categories");
      });
    });
  }
  useEffect(() => redirectToFood());

  return (
    <div className="restaurants w-full h-fit min-h-100 mt-3 mb-10">
      <h1 className="text-xl text-center mt-5">Restaurants</h1>
      <div className="container mt-5 flex flex-wrap gap-3">
        {restaurants.map((restaurant, index) => (
          <button
            key={index} // Use a unique key for each item
            className="shadow-xl flex border-2 border-orange-400 w-[calc(50%-6px)] min-h-[calc(40dvw-6px)] 
                     text-center font-semibold rounded-3xl py-5 px-5 cursor-pointer justify-center items-center
                     active:shadow-none transition-all"
          >
            {restaurant}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
