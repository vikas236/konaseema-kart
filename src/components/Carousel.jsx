import React, { act, useEffect, useState } from "react";
import Slider from "react-slick";
import server from "../core/server.js";
import delete_icon from "../assets/delete_icon.svg";

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

const Carousel = ({ carouselSettings, cartItems, setCartItems }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setcategoriesLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [dishes, setDishes] = useState();
  const active_restaurant = localStorage.getItem("kk_active_restaurant");

  const settings = {
    ...carouselSettings,
    beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex),
  };

  async function getCategoryNames() {
    const categories = await server.getCategoryNames(active_restaurant);
    setCategories(categories);
    setcategoriesLoading(false);
    setRecipesLoading(true);
    getDishes(categories[0].name);
  }

  useEffect(() => {
    getCategoryNames();
  }, [setcategoriesLoading]);

  async function getDishes(category) {
    const recipes = await server.getDishes(active_restaurant, category);

    setDishes(recipes.dishes);
    setRecipesLoading(false);
  }

  function CartIcon({ dish_name, dish_price }) {
    const item = cartItems.find((e) => e.name === dish_name);
    const [itemQuantity, setItemQuantity] = useState(item ? item.quantity : 1);

    function addToCart() {
      if (!item) {
        const newCartItems = [
          ...cartItems,
          { name: dish_name, price: dish_price, quantity: 1 },
        ];
        setCartItems(newCartItems);
        localStorage.setItem("kk_cart_items", JSON.stringify(newCartItems));
      }
    }

    // function decreaseQuantity() {
    //   if (item) {
    //     if (item.quantity === 1) {
    //       removeItem(); // Remove if quantity is 1
    //     } else {
    //       const updatedCart = cartItems.map((e) =>
    //         e.name === dish_name ? { ...e, quantity: e.quantity - 1 } : e
    //       );
    //       setCartItems(updatedCart);
    //       setItemQuantity((prev) => prev - 1);
    //       localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
    //     }
    //   }
    // }

    // function increaseQuantity() {
    //   if (item) {
    //     const updatedCart = cartItems.map((e) =>
    //       e.name === dish_name ? { ...e, quantity: e.quantity + 1 } : e
    //     );
    //     setCartItems(updatedCart);
    //     setItemQuantity((prev) => prev + 1);
    //     localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
    //   }
    // }

    function removeItem() {
      const updatedCart = cartItems.filter((e) => e.name !== dish_name);
      setCartItems(updatedCart);
      localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
    }

    return item ? (
      <div className="flex gap-2 items-center">
        <button
          className="w-[35px] h-[35px] bg-red-400 rounded-md transition-all cursor-pointer p-1 
        active:bg-red-500"
        >
          <img src={delete_icon} className="" onClick={removeItem} />
        </button>
      </div>
    ) : (
      <button
        className="active:bg-[#307a59] active:text-white transition-all p-1 px-[7px] rounded-md cursor-pointer"
        onClick={addToCart}
      >
        <i className="bx bx-cart-add text-2xl"></i>
      </button>
    );
  }

  useEffect(() => {
    if (Math.floor(activeIndex) < categories.length) {
      setRecipesLoading(true);
      getDishes(categories[Math.floor(activeIndex)].name);
      ``;
    }
  }, [activeIndex]);

  return (
    <div className="w-full max-w-3xl mx-auto mt-1 pt-2 pb-22">
      {!categoriesLoading ? (
        <Slider {...settings}>
          {categories.map((item, index) => (
            <div
              key={index}
              className="h-full w-fit cursor-pointer"
              onClick={() => {
                if (index < categories.length) {
                  setActiveIndex(Math.floor(index));
                }
              }}
            >
              <div
                className={`w-full flex flex-col items-center bg-gray-100/50 pb-2 pt-2 px-2 relative ${
                  activeIndex === index
                    ? "after:w-[25px] after:absolute after:h-[5px] after:bg-[#307a59] after:bottom-0 after:rounded-lg"
                    : ""
                }`}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name.replaceAll("_", " ")}
                    className="w-full object-cover rounded-xl"
                  />
                )}
                <h3 className="w-full mt-1 pl-1 font-normal text-center">
                  {item.name.replaceAll("_", " ")}
                </h3>
                <p className="w-full mt-1 pl-1 text-sm font-semibold text-[#307a59]">
                  {item.cost}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="flex justify-center items-center pb-4">
          <div className="w-[35px] h-[35px] ">
            <Spinner />
          </div>
        </div>
      )}
      {!recipesLoading ? (
        <div className="dishes">
          {dishes.length &&
            dishes?.map((e, i) => {
              let price = e.price;
              if (
                localStorage.getItem("kk_active_restaurant") ===
                  "vindhu family restaruant" &&
                e[1] >= 100
              )
                price += 20;

              return (
                <div className="dish w-full" key={e.dish_name}>
                  <div
                    className="dish_name p-2 bg-gray-100 mb-2 border border-gray-200 rounded-xl 
                  flex relative"
                  >
                    {e.image ? (
                      <img
                        src={e.image}
                        alt="dish image"
                        className="h-[125px] w-[125px] border border-gray-300 rounded-2xl mr-4 object-contain"
                      />
                    ) : (
                      <div
                        className="h-[125px] w-[125px] flex items-center justify-center border border-gray-300 
                      rounded-2xl mr-4"
                      >
                        <i className="bx bx-bowl-hot text-6xl text-gray-300"></i>
                      </div>
                    )}
                    <div className="pt-1 flex flex-col justify-between">
                      <h2 className="dish_name">{e.dish_name}</h2>
                      <div className="dish_price text-[#307a59] flex items-center justify-between mb-4">
                        <span>₹{price}/-</span>
                        <div className="cart absolute right-5 bottom-5">
                          <CartIcon
                            dish_name={e.dish_name}
                            dish_price={price}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center mt-[50%] -translate-y-1/2">
          <div className="w-[50px] h-[50px] ">
            <Spinner />
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
