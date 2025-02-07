import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Cart({ cartItems, setCartItems }) {
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPhone(localStorage.getItem("kk_user_phone") || "");
    setLocation(localStorage.getItem("kk_user_location") || "");
  }, []);

  function handlePhoneChange(e) {
    const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
    setPhone(value);
  }

  function saveDetails() {
    if (phone.length < 10) {
      alert("Enter a valid phone number.");
      return;
    }
    if (!location) {
      alert("Enable location to proceed.");
      return;
    }
    localStorage.setItem("kk_user_phone", phone);
    localStorage.setItem("kk_user_location", location);
    alert("Details saved!");
  }

  function increaseQuantity(name) {
    const updatedCart = cartItems.map((item) =>
      item.name === name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
  }

  function decreaseQuantity(name) {
    const updatedCart = cartItems
      .map((item) =>
        item.name === name ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);

    setCartItems(updatedCart);
    localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
  }

  function removeItem(name) {
    const updatedCart = cartItems.filter((item) => item.name !== name);
    setCartItems(updatedCart);
    localStorage.setItem("kk_cart_items", JSON.stringify(updatedCart));
  }

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Proceed to checkout function
  function proceedToCheckout(e) {
    e.currentTarget.classList.add("hidden");
    setTimeout(() => {
      if (e.currentTarget) e.currentTarget.classList.remove("hidden");
    }, 1500);

    if (!phone || phone.length < 10) {
      alert("Enter a valid phone number before proceeding.");
      return;
    }
    if (!location) {
      alert("Enable location before proceeding.");
      return;
    }

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_API;
    const chatId = import.meta.env.VITE_TELEGRAM_CHATID;
    const restaurantName =
      localStorage.getItem("kk_active_restaurant") || "Unknown Restaurant";
    const longitude = localStorage
      .getItem("kk_user_location")
      ?.split(", ")[1]
      .trim();
    const latitude = localStorage
      .getItem("kk_user_location")
      ?.split(", ")[0]
      .trim();

    if (!botToken || !chatId) {
      alert("Missing Telegram API credentials. Check your .env file.");
      return;
    }

    const orderDetails = cartItems
      .map(
        (item) =>
          `${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}`
      )
      .join("\n");

    const message =
      `📦 *New Order Received!* 📦\n\n` +
      `🏠 *Restaurant:* ${restaurantName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Address:* ${location}\n` +
      `📍 *Find on Google Maps:* https://www.google.com/maps?q=${latitude},${longitude}` +
      `💰 *Total Cost:* ₹${totalAmount}/-\n\n`;

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
      message
    )}&parse_mode=Markdown`;

    fetch(telegramUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.ok) {
          alert("Order placed successfully! 📦");

          // Clear the cart
          setCartItems([]);
          localStorage.removeItem("kk_cart_items"); // Remove cart data from localStorage
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

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Lat: ${latitude}, Lng: ${longitude}`);
        localStorage.setItem(
          "kk_user_location",
          `Lat: ${latitude}, Lng: ${longitude}`
        );

        // Reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.display_name) {
            setLocation(data.display_name);
            localStorage.setItem("kk_user_location", data.display_name);
          }
        } catch (error) {
          console.error("Reverse geocoding failed", error);
        }

        setLoading(false);
      },
      () => {
        alert("Failed to retrieve location.");
        setLoading(false);
      }
    );
  }

  return (
    <div className="cart-container max-w-3xl mx-auto pb-5 bg-white rounded-lg">
      <h1 className="text-md font-semibold mb-5 text-center">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="cart-items flex flex-col gap-5">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="cart-item flex justify-between items-center p-4 border rounded-lg bg-gray-50"
            >
              <div>
                <h2 className="text-lg font-medium">{item.name}</h2>
                <p className="text-gray-500">₹{item.price}/-</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="bg-red-500 px-3 rounded-md text-white text-md pb-1 ml-2"
                  onClick={() => removeItem(item.name)}
                >
                  x
                </button>
                <button
                  className="bg-gray-200 px-2 rounded-md text-lg active:bg-transparent"
                  onClick={() => decreaseQuantity(item.name)}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  className="bg-green-500 px-2 rounded-md text-lg text-white active:bg-transparent"
                  onClick={() => increaseQuantity(item.name)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 mb-6">
        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            maxLength="10"
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border rounded-md bg-gray-100/80"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-2">Location:</label>
          <input
            type="text"
            value={location}
            readOnly
            placeholder="Click 'Detect Location'"
            className="w-full px-3 py-2 border rounded-md bg-gray-100/80"
          />
          <button
            onClick={detectLocation}
            className="mt-2 px-3 py-2 bg-[#307a59] text-white rounded-md hover:bg-[#255c44]"
          >
            {loading ? "Detecting..." : "Detect Location"}
          </button>
        </div>

        <button
          onClick={saveDetails}
          className="mt-2 px-3 py-2 bg-[#307a59] text-white rounded-md hover:bg-[#255c44]"
        >
          Save Details
        </button>

        <div className="checkout fixed bottom-0 left-0 w-full bg-white border-t border-gray-400 rounded-t-3xl">
          <button
            onClick={proceedToCheckout}
            className="mt-3 px-5 py-2 bg-[#307a59] text-white rounded-md absolute bottom-[25px] left-[50%] translate-x-[-50%] w-[calc(100%-40px)]"
          >
            Proceed to Checkout ₹{totalAmount}/-
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
