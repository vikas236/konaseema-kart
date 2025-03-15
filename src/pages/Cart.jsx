import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import helpers from "../core/helpers.js";
import React from "react";

function Loader() {
  return (
    <span className="relative flex size-5 justify-center items-center">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full 
      bg-white opacity-75"
      ></span>
      <span className="relative inline-flex size-3 rounded-full bg-white"></span>
    </span>
  );
}

function Cart({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  function processOrder() {
    const total_price = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    if (!loading) {
      setLoading(true);
      if (total_price >= 100) {
        setError("");
        navigate("/processorder");
      } else {
        setError("min order: ₹100/-");
      }
      setLoading(false);
    }
  }

  function TotalPrice() {
    return (
      <div
        className="prices w-full fixed bottom-[85px] left-0 
  bg-white text-black"
      >
        <div
          className="text-sm flex justify-between border-t border-gray-300 
    shadow-3xl px-6 pt-4 pb-2 rounded-t-3xl"
        >
          <span>Total</span>
          <span className="font-bold">:</span>
          <span>
            ₹
            {cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
            /-
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="cart pb-6">
      {cartItems.length ? (
        <>
          <h1 className="pl-1 mb-2 mt-5">Cart</h1>
          {cartItems.map((item, index) => (
            <div
              className="cart-item flex justify-between items-end shadow-sm border 
              border-gray-200 p-4 rounded-2xl relative mb-2"
              key={index}
            >
              <div className="left">
                <h2 className="font-semibold">{item.name}</h2>
                <h2 className="text-primary pt-2">
                  ₹{item.price * item.quantity}/-
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
          ))}
          <TotalPrice />
          <button
            className="w-[calc(100%-40px)] bg-primary text-white rounded-lg fixed 
            bottom-[20px] py-3 text-center active:opacity-85 transition-all"
            onClick={processOrder}
          >
            {!loading ? (
              "Place Order"
            ) : (
              <div className="w-full h-[24px] flex items-center justify-center">
                <Loader />
              </div>
            )}
            {error && (
              <span className="text-red-500 absolute top-[-20px] left-0 text-xs font-semibold">
                {error}
              </span>
            )}
          </button>
        </>
      ) : (
        <div
          className="flex flex-col items-center justify-center h-[calc(100dvh-20px)] 
        gap-3"
        >
          <h2
            className="w-full text-2xl flex justify-center 
          items-center text-gray-400 font-semibold"
          >
            No items in cart
          </h2>
          <button
            className="bg-primary py-2 w-fit px-3 rounded-md 
          text-white text-lg"
          >
            <Link to="/restaurants">Add Items</Link>
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
