import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import server from "../core/server.js";
import dish_filler from "../assets/dish_filler.png";

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

const Carousel = ({
  carouselSettings,
  menu_items,
  cartItems,
  setCartItems,
}) => {
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
    getDishes(categories);
  }

  useEffect(() => {
    getCategoryNames();
  }, [setcategoriesLoading]);

  async function getDishes(categories) {
    const recipes = await server.getDishes(
      active_restaurant,
      categories[activeIndex].name
    );

    setDishes(recipes.dishes);
    setRecipesLoading(false);
  }

  useEffect(() => {});

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

    function decreaseQuantity() {
      if (item) {
        if (item.quantity === 1) {
          removeItem(); // Remove if quantity is 1
        } else {
          const updatedCart = cartItems.map((e) =>
            e.name === dish_name ? { ...e, quantity: e.quantity - 1 } : e
          );
          setCartItems(updatedCart);
          setItemQuantity((prev) => prev - 1);
          localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
        }
      }
    }

    function increaseQuantity() {
      if (item) {
        const updatedCart = cartItems.map((e) =>
          e.name === dish_name ? { ...e, quantity: e.quantity + 1 } : e
        );
        setCartItems(updatedCart);
        setItemQuantity((prev) => prev + 1);
        localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
      }
    }

    function removeItem() {
      const updatedCart = cartItems.filter((e) => e.name !== dish_name);
      setCartItems(updatedCart);
      localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
    }

    return item ? (
      <div className="flex gap-2 items-center">
        <button
          className="bg-red-500 px-3 rounded-md text-white text-lg ml-2 transition-all cursor-pointer"
          onClick={removeItem}
        >
          x
        </button>
        <button
          className="bg-gray-200 px-2 my-1 rounded-md text-xl active:bg-transparent transition-all cursor-pointer"
          onClick={decreaseQuantity}
        >
          -
        </button>
        <span className="w-[25px] text-center bg-white px-2 rounded-md">
          {itemQuantity}
        </span>
        <button
          className="bg-[#307a59] px-2 rounded-md text-xl text-white active:bg-transparent active:text-[#307a59] 
          transition-all cursor-pointer"
          onClick={increaseQuantity}
        >
          +
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

  return (
    <div className="w-full max-w-3xl mx-auto mt-1 pt-2 pb-22">
      {!categoriesLoading ? (
        <Slider {...settings}>
          {categories.map((item, index) => (
            <div
              key={index}
              className="h-full w-fit cursor-pointer"
              onClick={() => index < dishes.length && setActiveIndex(index)}
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
                    alt={item.name}
                    className="w-full object-cover rounded-xl"
                  />
                )}
                <h3 className="w-full mt-1 pl-1 font-normal text-center">
                  {item.name}
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
        <div className="dishes flex flex-wrap gap-2 justify-between">
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
                <div
                  className="dish w-[calc(50%-10px)] p-5 mb-2 border border-gray-200 rounded-xl shadow relative pt-14 mt-14"
                  key={e.dish_name}
                >
                  <div
                    className={`w-[65%] h-fit absolute rounded-full p-7 left-1/2 -top-[50%] border border-gray-100 shadow 
                        translate-y-1/3 -translate-x-1/2 bg-white`}
                  >
                    <img
                      src={e.image ? e.image : dish_filler}
                      alt=""
                      className=""
                    />
                  </div>

                  <div className="dish_name mt-3">
                    <h2 className="dish_name">{e.dish_name}</h2>
                    <div className="dish_price text-[#307a59] flex items-center justify-between mt-5">
                      <span>₹{price}/-</span>
                      <CartIcon dish_name={e.dish_name} dish_price={price} />
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
