import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import helpers from "../core/helpers.js";

function Cart({ cartItems, setCartItems }) {
  const phone = useState(localStorage.getItem("kk_phone"));
  const address = useState(localStorage.getItem("kk_address"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handlePrice(index, quantity) {
    const newCartItems = [...cartItems];
    newCartItems[index].quantity = quantity;
    setCartItems(newCartItems);
    localStorage.setItem("kk_cart_items", JSON.stringify(newCartItems));
    if (quantity === 0) handleDelete(index);
  }

  async function handleDelete(index) {
    const response = await helpers.removeDialogBox(
      "Remove from cart",
      cartItems[index].name
    );

    if (response == "removed") {
      const newCartItems = [...cartItems];
      newCartItems.splice(index, 1);
      setCartItems(newCartItems);
      localStorage.setItem("kk_cart_items", JSON.stringify(newCartItems));
      helpers.popUpMessage("removed", "success");
    } else {
      helpers.popUpMessage("cancelled", "error");
      handlePrice(index, 1);
    }
  }

  async function handleOrder() {
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (totalAmount >= 100) {
      if (phone[0] && address[0]) {
        if (!loading) {
          setLoading(true);
          const response = await helpers.removeDialogBox("Place order", "");
          if (response == "removed") {
            proceedToCheckout();
          } else helpers.popUpMessage("cancelled", "error");
          setLoading(false);
        }
      } else navigate("/auth");
    } else {
      setError("order should be above 100 rupees");
    }
  }

  function proceedToCheckout() {
    let food_order_items = cartItems
      .map(
        (e) => "\n" + JSON.stringify(`${e.name}: ₹${e.price}/-(${e.quantity})`)
      )
      .join("");

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_API;
    const chatId = import.meta.env.VITE_TELEGRAM_CHATID;
    const restaurantName = localStorage.getItem("kk_active_restaurant");
    const location = localStorage.getItem("kk_address");
    const location_url = localStorage.getItem("kk_location_url");
    const phone = localStorage.getItem("kk_phone");
    if (!botToken || !chatId) {
      // alert("Missing Telegram API credentials. Check your .env file.");
      return;
    }
    const totalAmount = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const message =
      `📦 *New Order Received!* 📦\n\n` +
      `🏠 *Restaurant:* ${restaurantName}\n` +
      `🍔 *Food:* ${food_order_items}` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Address:* ${location}\n` +
      `📍 *Find on Google Maps:*  ${location_url}\n` +
      `💰 *Total Cost:* ₹${totalAmount}/-\n\n`;
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=Markdown`;

    fetch(telegramUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          // Clear the cart
          setCartItems([]);
          localStorage.removeItem("kk_cart_items");
          helpers.popUpMessage("order placed", "success");
          setTimeout(async () => {
            await helpers.removeDialogBox(
              "please wait for order confirmation",
              "our representative will call you soon"
            );
          }, 500);
          navigate("/restaurants");
        } else {
          alert("Failed to send order details. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        alert("An error occurred while placing the order.");
      });
  }

  return (
    <div className="cart pb-6">
      {cartItems.length > 0 && <h1 className="mb-12 text-center mt-5">Cart</h1>}
      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div
            className="cart-item flex justify-between items-end shadow-sm border border-gray-200 p-4 rounded-2xl relative mb-2"
            key={index}
          >
            <div className="left">
              <h2 className="font-semibold">{item.name}</h2>
              <h2 className="text-primary pt-2">
                ₹{item.price}({item.quantity}) = ₹{item.price * item.quantity}
                /-
              </h2>
            </div>
            <div className="right w-[100px] flex justify-end">
              <div className="bg-primary w-fit text-white rounded-full px-1 py-1">
                <button
                  className="rounded-full px-2 transition-all active:bg-gray-100/25"
                  onClick={() => handlePrice(index, item.quantity - 1)}
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  className="rounded-full px-2 transition-all active:bg-gray-100/25"
                  onClick={() => handlePrice(index, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="absolute top-[5px] right-[5px] text-gray-400 text-2xl transition-all active:bg-gray-200/50 px-2 rounded-full"
              onClick={() => handleDelete(index)}
            >
              -
            </button>
          </div>
        ))
      ) : (
        <h2 className="w-full h-[calc(100dvh-20px)] text-2xl flex justify-center items-center text-gray-400 font-semibold">
          No items in cart
        </h2>
      )}

      {cartItems.length > 0 && (
        <button
          className="w-[calc(100%-40px)] bg-primary text-white rounded-lg fixed bottom-[20px] py-3 text-center"
          onClick={handleOrder}
        >
          {loading
            ? `Loading...`
            : `Place Order ₹
          ${cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
          )}
          /-`}
          {error && (
            <span className="text-red-500 absolute top-[-20px] left-0 text-xs font-semibold">
              {error}
            </span>
          )}
          <span className="absolute bottom-[-15px] right-0 text-primary text-xs font-semibold">
            only cash on delivery
          </span>
        </button>
      )}
    </div>
  );
}

export default Cart;
