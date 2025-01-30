import React, { useState, useEffect } from "react";
import { recipes } from "./data";

function Food() {
  const presentFoodCategory = localStorage.getItem("presentFoodCategory");
  const presentRestaurant = localStorage.getItem("presentRestaurant");
  localStorage.setItem(
    "presentActiveRestaurant",
    localStorage.getItem("presentRestaurant")
  );

  const [cartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("kk_cart_items")) || []
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state
  const [error, setError] = useState(""); // Error state

  let menuItems = [];

  function sortFood() {
    Object.values(recipes).forEach((e) => {
      if (e.name === presentRestaurant) {
        if (Object.keys(e).includes("veg_" + presentFoodCategory)) {
          menuItems = menuItems.concat(e["veg_" + presentFoodCategory]);
        }
        if (Object.keys(e).includes("nonveg_" + presentFoodCategory)) {
          menuItems = menuItems.concat(e["nonveg_" + presentFoodCategory]);
        }
        menuItems = menuItems.concat(e[presentFoodCategory]);
      }
    });
  }
  sortFood();

  useEffect(() => {
    localStorage.setItem("kk_cart_items", JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(item) {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.name === item[0]);
      if (existingItem) {
        return prev.filter((cartItem) => cartItem.name !== item[0]);
      } else {
        return [...prev, { name: item[0], price: item[1], quantity: 1 }];
      }
    });
  }

  function updateQuantity(name, action) {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.name === name) {
            if (action === "increase")
              return { ...item, quantity: item.quantity + 1 };
            if (action === "decrease" && item.quantity > 1)
              return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleCart() {
    setIsCartOpen(!isCartOpen);
  }

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  async function placeOrder() {
    if (!phoneNumber || phoneNumber.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }
    setError("");

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_API;
    const chatId = import.meta.env.VITE_TELEGRAM_CHATID;
    const orderDetails = cartItems
      .map(
        (item) =>
          `${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`
      )
      .join("\n");

    const message = `🛒 *New Order Received* 🛒\n\n📱 *Phone:* ${phoneNumber}\n\n${orderDetails}\n\n💰 *Total:* ₹${totalAmount}`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=Markdown`;

    try {
      await fetch(telegramUrl);
      alert("Order placed successfully!");
      setCartItems([]); // Clear cart after successful order
      setPhoneNumber(""); // Reset phone input
      toggleCart(); // Close cart
    } catch (error) {
      console.error("Error sending order:", error);
      alert("Failed to place order. Please try again.");
    }
  }

  return (
    <div className="food w-full h-fit min-h-100 mt-3 mb-5">
      <div className="container flex flex-wrap gap-3 overflow-y-scroll pb-14">
        {menuItems.map((item, index) => (
          <span
            key={index}
            className="w-[calc(50%-6px)] min-h-[calc(15dvw-6px)] category flex flex-col shadow-md rounded-xl
                  overflow-hidden cursor-pointer relative border border-indigo-200 bg-gray-200 pt-1 pb-14"
          >
            <span className="px-4 py-2">{item[0]}</span>
            <span className="px-4 py-2 text-end">₹{item[1]}/-</span>
            <button
              className={`py-1 px-2 rounded-xl cursor-pointer absolute bottom-0 left-0 ${
                cartItems.some((cartItem) => cartItem.name === item[0])
                  ? "bg-red-500"
                  : "bg-orange-400"
              } text-white`}
              onClick={() => addToCart(item)}
            >
              {cartItems.some((cartItem) => cartItem.name === item[0])
                ? "Remove from cart"
                : "Add to cart"}
            </button>
          </span>
        ))}
      </div>

      {isCartOpen && (
        <div
          className="cart_background_overlay w-full h-full fixed top-0 left-0 bg-black/50 z-10"
          onClick={toggleCart}
        ></div>
      )}

      <div
        className={`cart w-full h-[500px] shadow-2xl border-t border-amber-300 rounded-t-3xl px-5 flex flex-col
       items-center pt-2 bg-orange-400 fixed left-0 transition-all duration-500 z-20 ${
         isCartOpen ? "bottom-0" : "-bottom-[450px]"
       }`}
      >
        <h1
          className="w-full text-white font-semibold flex items-center justify-between cursor-pointer py-2"
          onClick={toggleCart}
        >
          {cartItems.length === 0
            ? "Cart is Empty"
            : `Cart (${cartItems.length} items)`}
        </h1>

        <ul className="w-full h-full overflow-y-scroll pt-3 bg-white rounded-2xl mt-3 mb-3">
          {cartItems.map((item) => (
            <li
              key={item.name}
              className="w-full flex flex-col justify-between pl-7 py-2 border-b"
            >
              <span>{item.name}</span>
              <div className="w-full price flex items-center gap-3 p-2 pr-5">
                <button
                  className="bg-orange-400 border-2 border-orange-400 active:bg-white px-2"
                  onClick={() => updateQuantity(item.name, "decrease")}
                >
                  -
                </button>
                <span className="w-[75px] text-center">
                  ₹{item.price} x {item.quantity} = ₹
                  {item.price * item.quantity}
                </span>
                <button
                  className="bg-orange-400 border-2 border-orange-400 active:bg-white px-2"
                  onClick={() => updateQuantity(item.name, "increase")}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>

        <input
          type="tel"
          placeholder="Enter Phone Number"
          className="w-full px-4 py-2 border rounded-md mb-3 text-white outline-none"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        {error && <span className="text-red-500">{error}</span>}

        <button
          className="py-3 bg-white mb-3 w-full rounded-2xl"
          onClick={placeOrder}
        >
          Place Order ₹{totalAmount}/-
        </button>
      </div>
    </div>
  );
}

export default Food;
