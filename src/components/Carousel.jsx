import React, { useState } from "react";
import Slider from "react-slick";

const Carousel = ({
  carouselContent,
  carouselSettings,
  menu_items,
  cartItems,
  setCartItems,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    ...carouselSettings,
    beforeChange: (oldIndex, newIndex) => setActiveIndex(newIndex),
  };

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
    <div className="w-full max-w-3xl mx-auto mt-1 pt-2 pb-3">
      <Slider {...settings}>
        {carouselContent.map((item, index) => (
          <div
            key={index}
            className="h-full w-fit cursor-pointer"
            onClick={() => index < menu_items.length && setActiveIndex(index)}
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
      <div className="dishes">
        {menu_items[Math.floor(activeIndex)]?.map((e, i) => (
          <div className="dish w-full" key={i}>
            <div className="dish_name p-5 bg-gray-100 mb-2 border border-gray-200 rounded-xl">
              <h2 className="dish_name">{e[0]}</h2>
              <div className="dish_price text-[#307a59] flex items-center justify-between mt-5">
                <span>₹{e[1]}/-</span>
                <CartIcon dish_name={e[0]} dish_price={e[1]} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
