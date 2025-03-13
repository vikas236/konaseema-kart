import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import helpers from "../core/helpers";

function ProcessOrder({ cartItems, setCartItems }) {
  const navigate = useNavigate();
  const restaurat_name = localStorage.getItem("kk_active_restaurant");
  const [phone, setPhone] = useState(
    localStorage.getItem("kk_phone") ? localStorage.getItem("kk_phone") : ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("kk_address") ? localStorage.getItem("kk_address") : ""
  );
  const [name, setName] = useState(
    localStorage.getItem("kk_name") ? localStorage.getItem("kk_name") : ""
  );
  const [error, setError] = useState();

  function Dishes() {
    return (
      <div
        className="dishes border border-gray-200 p-2 rounded-lg 
      relative flex flex-col gap-1"
      >
        {cartItems.map((dish, i) => {
          return (
            <div className="dish flex justify-between text-sm" key={i}>
              <span>{dish.name}</span>
              <div className="w-fit inline-block">
                <span>
                  ₹{dish.price}/-({dish.quantity})
                </span>
              </div>
            </div>
          );
        })}
        <div
          className="mt-2 text-md flex justify-between border-t 
        border-gray-300 pt-2"
        >
          <span>Total</span>
          <span>
            ₹
            {cartItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            )}
            /-
          </span>
        </div>
        <button
          className="bg-primary text-white rounded-md px-2 py-1 
        absolute top-[-37px] right-0 text-sm active:opacity-90 
        transition-all"
          onClick={() => navigate("/cart")}
        >
          Edit Items
        </button>
      </div>
    );
  }

  function PaymentMode() {
    return (
      <div
        className="paymentmode border border-gray-200 rounded-2xl 
      p-2 py-0"
      >
        <div className="flex items-center py-3 border-b border-gray-200">
          <input
            type="radio"
            id="cod"
            name="payment"
            value="cod"
            className="mr-2 peer hidden"
            defaultChecked
          />
          <div
            className="w-4 h-4 border-3 border-gray-400 rounded-full 
          peer-checked:border-primary mr-1"
          ></div>
          <label htmlFor="cod" className="text-sm">
            Cash on Delivery (COD)
          </label>
        </div>

        {/* <div className="flex items-center py-3">
          <input
            type="radio"
            id="upi"
            name="payment"
            value="upi"
            className="mr-2 hidden peer"
          />
          <div
            className="w-4 h-4 border-3 border-gray-400 rounded-full 
          peer-checked:border-primary mr-1"
          ></div>
          <label htmlFor="upi" className="text-sm">
            UPI Payment
          </label>
        </div> */}
      </div>
    );
  }

  function PersonalDetails() {
    async function handlePhone(e) {
      const response = await helpers.addPhoneNumber("You Phone Number", phone);
      helpers.popUpMessage(response[0][0], response[0][1]);
      setPhone(response[1]);
      localStorage.setItem("kk_phone", response[1]);
      e.target.previousSibling.innerHTML = response[1];
    }

    async function handleAdress(e) {
      const response = await helpers.addAddress("You Address");
      helpers.popUpMessage(response[0][0], response[0][1]);
      setAddress(response[1]);
      e.target.previousSibling.innerHTML = response[1];
    }

    async function handleName(e) {
      const response = await helpers.addName("Your Name", name);
      helpers.popUpMessage(response[0][0], response[0][1]);
      localStorage.setItem("kk_name", response[1]);
      setName(response[1]);
      e.target.previousSibling.innerHTML = response[1];
    }

    return (
      <div
        className="phone w-full mt-4 rounded-2xl border border-gray-200 
      px-2 py-3 flex flex-col gap-2"
      >
        <div className="phone text-sm">
          <span>Phone:</span>
          <span className="w-[100px] px-3 text-gray-400">
            {phone ? phone : "XXXXX XXXXX"}
          </span>
          <button
            className="text-white transition-all bg-primary rounded-md px-3 py-1 
            active:opacity-85"
            onClick={handlePhone}
          >
            Edit
          </button>
        </div>
        <div className="address text-sm">
          <span>Adress:</span>
          <span className="w-[100px] px-3 text-gray-400">
            {address ? address : "your address..."}
          </span>
          <button
            className="text-white transition-all bg-primary rounded-md px-3 py-1 
            active:opacity-85"
            onClick={handleAdress}
          >
            Edit
          </button>
        </div>
        <div className="name text-sm">
          <span>Name:</span>
          <span className="w-[100px] px-3 text-gray-400">
            {name ? name : "your name"}
          </span>
          <button
            className="text-white transition-all bg-primary rounded-md px-3 py-1 
            active:opacity-85"
            onClick={handleName}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  function PlaceOrder() {
    function validateOrder() {
      if (!phone.length) {
        helpers.popUpMessage("phone number is required", "error");
        setError("phone number is required");
        return 1;
      }

      if (phone.length < 10) {
        helpers.popUpMessage("phone number too short", "error");
        setError("phone number too short");
        return 1;
      }

      if (!/^\d{10}$/.test(phone)) {
        helpers.popUpMessage("phone number is invalid", "error");
        setError("phone number is invalid");
        return 1;
      }

      if (!address.length || address === "Your Location") {
        helpers.popUpMessage("address is required", "error");
        setError("address is required");
        return 1;
      }

      if (!name) {
        helpers.popUpMessage("name is required", "error");
        setError("name is required");
        return 1;
      }

      if (name.length < 2) {
        helpers.popUpMessage("name is too short", "error");
        setError("name is too short");
        return 1;
      }

      return 0;
    }

    async function confirmOrder() {
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      if (totalAmount >= 100) {
        setError("");
        const response = await helpers.removeDialogBox("Place Order", "");
        if (response == "removed") {
          helpers.popUpMessage("Order Placed", "success");
          sendOrderMessage();
        } else helpers.popUpMessage("Cancelled", "error");
      } else {
        setError("Minimum Order Value: 100 rupees");
        helpers.popUpMessage("Minimum Order Value: 100 rupees", "error");
      }
    }

    async function sendOrderMessage() {
      const totalAmount = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );

      let food_order_items = cartItems
        .map(
          (e) =>
            "\n" + JSON.stringify(`${e.name}: ₹${e.price}/-(${e.quantity})`)
        )
        .join("");
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_API;
      const chatId = import.meta.env.VITE_TELEGRAM_CHATID;
      const restaurantName = localStorage.getItem("kk_active_restaurant");
      const location = localStorage.getItem("kk_address");
      const location_url = localStorage.getItem("kk_location_url");
      const phone = localStorage.getItem("kk_phone");

      const message =
        `*Name* ${name}` +
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
            }, 200);

            navigate("/restaurants");
          } else {
            helpers.popUpMessage("Error", "error");
          }
        })

        .catch((error) => {
          console.error("Error sending message:", error);

          helpers.popUpMessage("An error occurred", "error");
        });
    }

    return (
      <button
        className="placeorder border py-3 rounded-xl bg-primary 
      text-white active:opacity-90 transition-all relative"
        onClick={() => {
          const response = validateOrder();
          if (response == 0) confirmOrder();
        }}
      >
        Place Order
        <span
          className="text-xs absolute -top-[20px] left-0 text-red-400 
        pl-1 font-semibold"
        >
          {error}
        </span>
      </button>
    );
  }

  return (
    <div
      className="processorder w-full h-[calc(100dvh)] pt-4 flex flex-col 
      justify-between px-4 pb-4"
    >
      <div>
        <h2 className="mb-2 pl-1">Items</h2>
        <Dishes />
        <h2 className="mb-2 pl-1 mt-5">Payment Mode</h2>
        <PaymentMode />
        <PersonalDetails />
      </div>
      <PlaceOrder />
    </div>
  );
}

export default ProcessOrder;
