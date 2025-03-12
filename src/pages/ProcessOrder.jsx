import { useState } from "react";
import { useNavigate } from "react-router-dom";
import helpers from "../core/helpers";

function ProcessOrder({ cartItems }) {
  const navigate = useNavigate();
  const restaurat_name = localStorage.getItem("kk_active_restaurant");
  const [phone, setPhone] = localStorage.getItem("kk_phone")
    ? localStorage.getItem("kk_phone")
    : "";
  const [address, setAddress] = localStorage.getItem("kk_address")
    ? localStorage.getItem("kk_address")
    : "";
  const [name, setName] = localStorage.getItem("kk_name")
    ? localStorage.getItem("kk_name")
    : "";
  const [paymentMethod, setPaymentMethod] = useState(0);

  function Dishes() {
    return (
      <div
        className="dishes border border-gray-200 p-2 rounded-lg 
      relative"
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
          className="mt-4 text-md flex justify-between border-t 
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
        className="paymentmode mt-4 border border-gray-200 rounded-2xl 
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

        <div className="flex items-center py-3">
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
        </div>
      </div>
    );
  }

  function PersonalDetails() {
    async function handlePhone(e) {
      const response = await helpers.addPhoneNumber("You Phone Number", phone);
      helpers.popUpMessage(response[0][0], response[0][1]);
    }

    async function handleAdress(e) {
      const response = await helpers.addAddress("You Address");
      helpers.popUpMessage(response[0][0], response[0][1]);
    }

    async function handleName(e) {
      const response = await helpers.addName("Your Name", name);
      helpers.popUpMessage(response[0][0], response[0][1]);
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
            className="text-primary underline transition-all 
            active:text-gray-400"
            onClick={handlePhone}
          >
            Edit
          </button>
        </div>
        <div className="address text-sm">
          <span>Adress:</span>
          <span className="w-[100px] px-3 text-gray-400">
            {address ? address : "your adress..."}
          </span>
          <button
            className="text-primary underline transition-all 
            active:text-gray-400"
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
            className="text-primary underline transition-all 
            active:text-gray-400"
            onClick={handleName}
          >
            Edit
          </button>
        </div>
      </div>
    );
  }

  function PlaceOrder() {
    return (
      <button
        className="placeorder border py-3 rounded-xl bg-primary 
      text-white active:opacity-90 transition-all"
      >
        Place Order
      </button>
    );
  }

  return (
    <div
      className="processorder w-full h-[calc(100dvh)] pt-4 flex flex-col 
      justify-between px-4 border pb-4"
    >
      <div>
        <h2 className="mb-3 pl-1">Items</h2>
        <Dishes />
        <PaymentMode />
        <PersonalDetails />
      </div>
      <PlaceOrder />
    </div>
  );
}

export default ProcessOrder;
