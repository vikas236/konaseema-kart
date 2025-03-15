import { useEffect, useState } from "react";
import server from "../core/server";
import helpers from "../core/helpers";

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

function Order() {
  const phone = localStorage.getItem("kk_phone")
    ? localStorage.getItem("kk_phone")
    : "";
  const [prevOrders, setPrevOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getOrders() {
    setLoading(true);
    const orders = await server.getUserOrders(phone);
    setPrevOrders(orders);
    setLoading(false);
  }

  useEffect(() => {
    getOrders();
  }, []);

  function OrdersList() {
    function Order({ data }) {
      const food_items = data.food_order_items
        .replaceAll('"', "")
        .split("\n")
        .filter((e) => e != "");
      let order_status;
      if (data.order_status == "failed") order_status = "cancelled";
      else order_status = data.order_status;

      return (
        <div className="border border-gray-300 rounded-xl p-2 shadow-sm relative">
          <div>
            <h2 className="w-full text-md font-semibold">
              {data.restaurant_name}
            </h2>
            <span className="text-gray-400 text-xs">
              {helpers.formatTimestamp(data.created_at)}
            </span>
            <div className="mt-3 flex gap-[1px] flex-col">
              {food_items.map((e, i) => {
                return (
                  <span className="block text-xs" key={i}>
                    {e}
                  </span>
                );
              })}
            </div>
          </div>
          <div
            className="absolute top-[10px] right-[10px] text-xs flex items-end 
          flex-col"
          >
            <span
              className={`text-primary font-semibold ${
                order_status === "Not Confirmed" && "text-gray-500"
              } ${order_status === "on the way" && "text-black"} ${
                order_status === "completed" && "text-primary"
              } ${order_status == "cancelled" && "text-red-400"}`}
            >
              {order_status}
            </span>
            <div className="mt-1 flex">
              <span className="text-gray-400">₹{data.total_amount}/-</span>
              <span
                className="font-normal mx-1 inline-block h-[17px] border-l 
                border-gray-400"
              ></span>
              <span className="text-gray-400">COD</span>
            </div>
          </div>
        </div>
      );
    }

    return prevOrders.map((e, i) => (
      <div key={i} className="flex flex-col w-full">
        <Order data={e} />
      </div>
    ));
  }

  return (
    <div
      className="orders flex flex-col items-center relative 
    min-h-[calc(100vh-200px)] gap-2 pb-5"
    >
      <h2 className="font-semibold mb-3">Orders</h2>
      {loading ? (
        <div
          className="w-[50px] h-[50px] absolute top-1/2 left-1/2 
        -translate-1/2"
        >
          <Spinner />
        </div>
      ) : !prevOrders.length ? (
        <h1
          className="text-3xl font-semibold text-gray-400 absolute top-1/2 
        left-1/2 -translate-1/2 text-center w-full"
        >
          No Orders
        </h1>
      ) : (
        <OrdersList />
      )}
    </div>
  );
}

export default Order;
