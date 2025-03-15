import React, { act, useEffect, useState } from "react";
import server from "../core/server";
import helpers from "../core/helpers.js";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

function Admin() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = new Date(selectedDate).toISOString().split("T")[0];

  const navigate = useNavigate();
  useEffect(() => {
    const admin_user = localStorage.getItem("kk_admin_user");
    if (!admin_user) {
      if (admin_user != "in") navigate("/admin_auth");
    }
  });

  const [activeModule, setActiveModule] = useState(
    localStorage.getItem("kk_admin_active_module")
      ? localStorage.getItem("kk_admin_active_module")
      : "0"
  );
  const panelFeatures = [
    // ["Dashboard Overview"],
    ["Order Processing", OrderProcessing],
    ["Restaurant Management", RestaurantManagement],
    // ["User Control", UserManagement],
    ["Delivery Management", DeliveryManagegment],
    ["Payment & Finance", PaymentsFinance],
    ["Promotions & Discounts", PromotionsDiscounts],
    // ["Customer Feedback", CustomerFeedback],
    // ["Notifications & Alerts", NotificationsAlerts],
    // ["Data & Analytics", DataAnalytics],
  ];
  const ActiveComponent = panelFeatures[activeModule][1];

  function Dock() {
    const [active, setActive] = useState(true);

    useEffect(() => {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 0) setActive(false);
        else setActive(true);
      });
    });

    useEffect(() => {
      setTimeout(() => {
        setActive(false);
      }, 1500);
    });

    useEffect(() => {
      localStorage.setItem("kk_admin_active_module", activeModule);
    }, [activeModule]);

    return (
      <div
        className={`dock w-[65px] ease-in-out py-1 flex-col fixed 
          top-1/2 flex justify-around items-center bg-primary z-10 
          text-white text-4xl rounded-4xl -translate-y-1/2 
          ${active ? "right-[15px]" : "-right-[100px]"} transition-all 
          duration-650`}
      >
        <button
          className={`rounded-full p-3 py-2 ${
            activeModule == 0 && "bg-white"
          } ${activeModule == 0 && "text-primary"} 
            transition-all`}
          onClick={() => setActiveModule(0)}
        >
          <i className="bx bxs-package"></i>
        </button>
        <button
          className={`rounded-full p-3 py-2 ${
            activeModule == 1 && "bg-white"
          } ${activeModule == 1 && "text-primary"} 
            transition-all`}
          onClick={() => setActiveModule(1)}
        >
          <i className="bx bx-bowl-hot"></i>
        </button>
        <button
          onClick={() => setActive(!active)}
          className={`close_dock w-[60px] h-[60px] bg-white 
            rounded-full absolute bottom-[-65px] active:bg-red-400 
            text-red-400 shadow-lg border border-gray-200 
            active:text-white active:border-red-400 close_dock
            ${
              !active
                ? "right-[75px] rotate-[180deg] text-primary"
                : "right-[0] "
            } transition-all
            `}
        >
          <i className="bx bx-chevron-right"></i>
        </button>
      </div>
    );
  }

  function MonthPicker() {
    return (
      <div
        className={`date_picker h-[85px] bg-primary text-white 
          rounded-b-3xl px-4 relative z-100`}
      >
        <div
          className={`border border-white rounded-lg p-2 flex w-fit absolute left-1/2 
            top-1/2 -translate-1/2 items-center justify-between cursor-pointer`}
        >
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="w-[150px]"
          />
          <button className="absolute right-[5px]">
            <i className="bx bxs-calendar-edit text-3xl"></i>
          </button>
        </div>
      </div>
    );
  }

  function UserManagement() {
    return (
      <div className="user_management w-full min-h-[calc(100dvh-90px)]"></div>
    );
  }

  function OrderProcessing() {
    const [activeCategory, setActiveCategory] = useState(
      localStorage.getItem("kk_admin_orders_category")
        ? parseInt(localStorage.getItem("kk_admin_orders_category"))
        : 0
    );
    const [prevOrders, setPrevOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    async function updateOrders() {
      setLoading(true);

      const orders = await server.getOrdersByDate(formattedDate);

      const sortedOrders = [
        orders.filter((e) => e.order_status === "Not Confirmed"),
        orders.filter((e) => e.order_status === "on the way"),
        orders.filter((e) => e.order_status === "completed"),
        orders.filter((e) => e.order_status === "failed"),
      ];

      setPrevOrders(sortedOrders);
      setLoading(false);
    }

    useEffect(() => {
      updateOrders();
    }, [setPrevOrders]);

    function PreviousOrder() {
      function OrdersList() {
        function Order({ data, i }) {
          // sort food items string into a array
          function sortFoodOrders(data) {
            return data.food_order_items
              .replaceAll('"', "")
              .split("\n")
              .filter((e) => e != "");
          }
          const food_items = sortFoodOrders(data);

          // edit order status button
          function EditOrderStatus() {
            async function handleOrderStatus(data, status) {
              const response = await helpers.removeDialogBox(
                "Change Order Status to",
                status
              );

              if (response == "removed") {
                setLoading(true);
                let newData = { ...data };

                newData.order_status = status;
                await server.updateOrderStatus(newData);
                updateOrders();

                helpers.popUpMessage(`order ${data.id} edited`, "success");
              } else {
                helpers.popUpMessage("calcelled", "error");
              }
            }

            return (
              <div
                className="absolute -right-[1px] -bottom-[50px] flex z-0 border-l 
              border-r border-b border-gray-300 px-2 pb-2 pt-1 rounded-b-2xl 
              bg-white shadow-md gap-2"
              >
                <button
                  className="text-primary bg-gray-100 rounded-xl py-[1px] 
                px-[10px] text-2xl active:opacity-50 transition-all shadow 
                border border-primary"
                  onClick={() => handleOrderStatus(data, "Not Confirmed")}
                >
                  <i className="bx bx-list-ul"></i>
                </button>
                <button
                  className="text-primary bg-gray-100 rounded-xl py-[1px] 
                px-[10px] text-2xl active:opacity-50 transition-all shadow 
                border border-primary"
                  onClick={() => handleOrderStatus(data, "on the way")}
                >
                  <i className="bx bx-package"></i>
                </button>
                <button
                  className="text-primary bg-gray-100 rounded-xl py-[1px] 
                px-[10px] text-2xl active:opacity-50 transition-all shadow 
                border border-primary"
                  onClick={() => handleOrderStatus(data, "completed")}
                >
                  <i className="bx bx-check"></i>
                </button>
                <button
                  className="text-red-400 bg-gray-100 rounded-xl py-[1px] 
                px-[10px] text-2xl active:opacity-50 transition-all shadow 
                border border-red-400"
                  onClick={() => handleOrderStatus(data, "failed")}
                >
                  -
                </button>
              </div>
            );
          }

          // order details
          return (
            <div
              className="border border-gray-300 rounded-xl p-2 shadow-sm 
            relative min-h-[100px] mt-9 mb-13 rounded-br-none rounded-tl-none"
            >
              <div>
                <span className="block text-xs text-gray-400">
                  Order No: {data.id}
                </span>
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
                <h2 className="pt-3 text-xs">
                  Address:{" "}
                  <a
                    href={data.location_url}
                    className="text-primary underline"
                  >
                    Link
                  </a>
                </h2>
                <div className="flex pb-2 pt-1">
                  <button
                    className="text-primary mr-2 text-3xl pt-3 
                  pr-3 active:opacity-90 transition-all"
                  >
                    <a
                      href={data.location_url}
                      className="border border-primary px-[8px] pt-[3px] 
                      rounded-lg"
                      target="_blank"
                    >
                      <i className="bx bx-current-location"></i>
                    </a>
                  </button>
                  <span className="text-xs relative top-[3px]">
                    {data.address}
                  </span>
                </div>
              </div>
              <div
                className="absolute top-[10px] right-[10px] text-xs flex 
              flex-col items-end"
              >
                <span
                  className={`${
                    data.order_status == "Confirmed" && "text-black"
                  } ${
                    data.order_status == "Not Confirmed" && "text-gray-400"
                  } ${data.order_status == "failed" && "text-red-400"} ${
                    data.order_status == "on the way" && "text-primary"
                  } ${
                    data.order_status == "completed" && "text-primary"
                  } font-semibold`}
                >
                  {data.order_status}
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
              <EditOrderStatus />
              <button
                className="absolute -top-[42px] -left-[1px] border-t border-l 
                border-r p-2 text-md rounded-t-xl border-gray-300 px-3 
                text-white bg-primary font-semibold active:opacity-90 
                transition-all"
              >
                <a href={`tel:${data.phone}`}>Call {data.phone}</a>
              </button>
            </div>
          );
        }

        // previous orders
        return prevOrders[activeCategory].length > 0 ? (
          prevOrders[activeCategory].map((e, i) => {
            return (
              <div key={i} className="flex flex-col w-full relative">
                <Order data={e} i={i} />
              </div>
            );
          })
        ) : (
          <h1
            className="text-3xl font-semibold text-gray-300 absolute 
          top-1/2 left-1/2 -translate-1/2 text-center"
          >
            {activeCategory == 0 && "No Pending Orders"}
            {activeCategory == 1 && "No Orders For Delivery"}
            {activeCategory == 2 && "No Completed Orders"}
            {activeCategory == 3 && "No Failed Orders"}
          </h1>
        );
      }

      // Previous Orders
      return (
        <div
          className="orders flex flex-col items-center mt-3 relative 
        h-[calc(100vh-200px)] gap-2 pb-24"
        >
          {loading ? (
            <div
              className="w-[50px] h-[50px] absolute top-1/2 left-1/2 
            -translate-1/2"
            >
              <Spinner />
            </div>
          ) : !prevOrders.length ? (
            <h1 className="text-3xl font-semibold text-gray-400"></h1>
          ) : (
            <OrdersList />
          )}
        </div>
      );
    }

    // Orders Categories
    function OrdersCategories() {
      function handleCategoryNumber(i) {
        localStorage.setItem("kk_admin_orders_category", i);
        setActiveCategory(i);
      }

      return (
        <div
          className="flex gap-4 bg-gray-100[10] left-1/2 -translate-x-1/2 
        fixed bottom-0 justify-center pb-3 flex-wrap shadow-lg border pt-[28px] 
        w-[300px] border-gray-300 rounded-t-xl z-10 bg-white"
        >
          <button
            className={`px-3 py-2 rounded-lg text-2xl bg-white border 
              border-gray-300 text-gray-500 transition-all opacity-65 
              relative ${
                activeCategory === 0 &&
                `opacity-100 shadow-md border-gray-400 translate-y-[-3px] 
            scale-125 mx-1`
              }`}
            onClick={() => handleCategoryNumber(0)}
          >
            <i className="bx bx-list-ul"></i>
            <span
              className="absolute text-xs border rounded-xl px-[8px] 
            py-[2px] font-semibold top-[-12px] right-[-12px] bg-white"
            >
              {prevOrders.length ? prevOrders[0].length : "..."}
            </span>
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-2xl bg-white border 
              border-gray-300 transition-all opacity-65 relative 
          ${
            activeCategory === 1 &&
            "opacity-100 shadow-md border-gray-400 translate-y-[-3px] scale-125 mx-1"
          }`}
            onClick={() => handleCategoryNumber(1)}
          >
            <i className="bx bx-package"></i>
            <span
              className="absolute text-xs border rounded-xl px-[8px] 
            py-[2px] font-semibold top-[-12px] right-[-12px] bg-white"
            >
              {prevOrders.length ? prevOrders[1].length : "..."}
            </span>
          </button>
          <button
            className={`px-3 py-2 rounded-lg text-2xl bg-white border 
              border-gray-300 text-primary opacity-65 transition-all 
          ${
            activeCategory === 2 &&
            "opacity-100 shadow-md border-gray-400 translate-y-[-3px] scale-125 mx-1"
          } relative`}
            onClick={() => handleCategoryNumber(2)}
          >
            <i className="bx bx-check"></i>{" "}
            <span
              className="absolute text-xs border rounded-xl px-[8px] 
            py-[2px] font-semibold top-[-12px] right-[-12px] bg-white"
            >
              {prevOrders.length ? prevOrders[2].length : "..."}
            </span>
          </button>
          <button
            className={`px-[24px] rounded-lg text-2xl bg-white border 
              border-gray-300 text-red-400 relative opacity-65 
          transition-all ${
            activeCategory === 3 &&
            `opacity-100 shadow-md border-gray-400 translate-y-[-3px] 
            scale-125 mx-1 relative`
          }`}
            onClick={() => handleCategoryNumber(3)}
          >
            <span
              className="bg-red-400 w-[20px] h-[20px] inline-block 
            rounded-full absolute left-1/2 top-1/2 -translate-1/2"
            ></span>
            <span
              className="absolute text-xs border rounded-xl px-[8px] 
          py-[2px] font-semibold top-[-12px] right-[-12px] bg-white"
            >
              {prevOrders.length ? prevOrders[3].length : "..."}
            </span>
          </button>
        </div>
      );
    }

    return (
      <div
        className="order_processing w-full min-h-[calc(100dvh-90px)] 
      h-fit pb-[300px]"
      >
        <MonthPicker />
        <button
          className="text-primary flex items-center gap-1 border 
        rounded-lg px-2 py-1 mt-3 ml-[50%] -translate-x-1/2 
        active:bg-primary active:text-white transition-all"
          onClick={updateOrders}
        >
          <i className="bx bx-refresh text-3xl "></i>Refresh
        </button>
        <OrdersCategories />
        <div className="px-4 mt-5">
          <PreviousOrder />
        </div>
      </div>
    );
  }

  function RestaurantManagement() {
    const [restaurants, setRestaurants] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(
      restaurants[0]?.name
    );
    const [selectedCategory, setSelectedCategory] = useState("");
    const [dishes, setDishes] = useState([]);
    const [restaurantLoading, setRestaurantLoading] = useState(false);
    const [categoryLoading, setCategoryLoading] = useState(false);
    const [dishLoading, setDishLoading] = useState(false);

    useEffect(() => {
      updateRestaurants();
    }, []);

    async function updateRestaurants() {
      setRestaurantLoading(true);
      setCategoryLoading(true);
      const data = await server.getRestaurantNames();
      setRestaurants(data);
      setSelectedRestaurant(data[0]?.name);
      setRestaurantLoading(false);
      updateCategories(data[0]?.name);
    }

    async function updateCategories(restaurant) {
      setDishLoading(true);
      const data = await server.getCategoryNames(restaurant);
      setCategories(data);
      setSelectedCategory(data[0]?.name);
      setCategoryLoading(false);
      updateDishes(restaurant, data[0]?.name);
    }

    async function updateDishes(restaurant_name, category_name) {
      const data = await server.getDishes(restaurant_name, category_name);
      setDishes(data.dishes);
      setDishLoading(false);
    }

    // restaurant and category selection component
    function RestaurantSelection() {
      function ModifyButtons({ addFunction, removeFunction }) {
        return (
          <>
            <button
              className="bg-white active:bg-primary active:text-white transition-all cursor-pointer rounded-full px-2"
              onClick={removeFunction}
            >
              -
            </button>
            <button
              className="bg-white active:bg-primary active:text-white transition-all cursor-pointer rounded-full px-2"
              onClick={addFunction}
            >
              +
            </button>
          </>
        );
      }

      function Restaurants() {
        async function removeRestaurant() {
          const result = await helpers.removeDialogBox(
            "Restaurant Name",
            selectedRestaurant
          );

          if (result === "removed")
            await server
              .removeRestaurant(selectedRestaurant)
              .then((response) => {
                updateRestaurants();
                helpers.popUpMessage(
                  result,
                  result === "cancelled" ? "error" : "success"
                );
              });
        }

        async function addRestaurant() {
          const [params, result] = await helpers.addDialogBox(
            "Restaurant Name"
          );
          setRestaurantLoading(true);

          if (result) {
            await server.addNewRestaurant(result).then((response) => {
              updateRestaurants();
              setRestaurantLoading(true);
              helpers.popUpMessage(params[0], params[1]);
            });
          }
        }

        function handleRestaurantChange(e) {
          setCategoryLoading(true);
          updateCategories(e.target.value);
          setSelectedRestaurant(e.target.value);
        }

        return !restaurantLoading ? (
          <div className="">
            <div className="modify_restaurant absolute bottom-[15px] text-primary text-2xl flex justify-between w-[150px]">
              <ModifyButtons
                addFunction={addRestaurant}
                removeFunction={removeRestaurant}
              />
            </div>
            <select
              name="restaurant_name"
              className="restaurant_name_selector text-white w-[150px]"
              defaultValue={selectedRestaurant}
              onChange={handleRestaurantChange}
            >
              {restaurants.map((restaurant) => {
                return (
                  <option
                    key={restaurant.id}
                    value={restaurant.name}
                    className="text-black"
                  >
                    {restaurant.name}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="w-[25px] h-[25px]">
            <Spinner primary_color={"white"} />
          </div>
        );
      }

      function Categories() {
        async function removeCategory() {
          const result = await helpers.removeDialogBox(
            "Remove Category",
            selectedCategory
          );

          if (result === "removed") {
            setCategoryLoading(true);
            await server
              .removeCategory(selectedCategory, selectedRestaurant)
              .then((response) => {
                updateCategories(selectedRestaurant);
                helpers.popUpMessage(
                  result,
                  result === "cancelled" ? "error" : "success"
                );
              });
          }
        }

        async function addCategory() {
          const [params, result] = await helpers.addDialogBox("Category Name");

          if (result) {
            setCategoryLoading(true);
            await server
              .addNewCategory(result, selectedRestaurant)
              .then((response) => {
                updateCategories(selectedRestaurant);
                helpers.popUpMessage(params[0], params[1]);
              });
          }
        }

        function handleCategoryChange(e) {
          setDishLoading(true);
          updateDishes(selectedRestaurant, e.target.value);
          setSelectedCategory(e.target.value);
        }

        return !categoryLoading ? (
          <div className="">
            <div className="modify_restaurant absolute bottom-[15px] right-[15px] text-primary text-2xl flex justify-between w-[150px]">
              <ModifyButtons
                addFunction={addCategory}
                removeFunction={removeCategory}
              />
            </div>
            <select
              name="category_name"
              className="text-white w-[150px] h-fit overflow-visible"
              defaultValue={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category, index) => {
                return (
                  <option
                    key={category.id}
                    value={category.name}
                    className="text-black"
                  >
                    {category.name.replaceAll("_", " ")}
                  </option>
                );
              })}
            </select>
          </div>
        ) : (
          <div className="w-[25px] h-[25px] flex">
            <Spinner primary_color={"white"} />
          </div>
        );
      }

      return (
        <div className="w-dvw bg-primary px-4 pt-24 pb-14 rounded-b-4xl flex justify-between relative">
          <Restaurants />
          <Categories />
        </div>
      );
    }

    function Dishes() {
      function Dish({ dish }) {
        const [loading, setLoading] = useState(false);

        function DishImage({ dish }) {
          async function handleImageUpload(dish_name) {
            const response = await helpers.addImageDialogBox("Add Dish Image");
            setLoading(true);

            if (response[0][0] === "Success") {
              if (typeof response[1] == "object") {
                const base64 = await helpers.fileToBase64(response[1]);

                const result = await server.addDishImage(
                  selectedRestaurant,
                  selectedCategory,
                  dish_name,
                  base64
                );
                if (!result)
                  helpers.popUpMessage(
                    "invalid foramt or image too large",
                    "error"
                  );
                else helpers.popUpMessage("Data Updated", "success");
              } else {
                helpers.popUpMessage("Cancelled", "error");
              }
            } else {
              helpers.popUpMessage(response[0][0], response[0][1]);
            }
            await updateDishes(selectedRestaurant, selectedCategory);
          }

          async function handleImageRemove(dish_name) {
            const response = await helpers.removeDialogBox(
              "Remove Dish Image",
              ""
            );
            setLoading(true);

            if (response === "cancelled")
              helpers.popUpMessage("Cancelled", "error");
            else {
              const response = await server.removeDishImage(
                selectedRestaurant,
                selectedCategory,
                dish_name
              );

              if (response.message == "Image removed successfully")
                helpers.popUpMessage("Image Removed", "success");
            }
            await updateDishes(selectedRestaurant, selectedCategory);
          }

          return dish.image ? (
            <div className="relative" key={dish.dish_name}>
              <img src={dish.image} alt="" className="w-32 h-fit rounded-md" />
              <i
                className={`bx bx-minus absolute top-[-10px] right-[-10px] bg-red-400
                text-2xl text-white rounded-full`}
                onClick={() => handleImageRemove(dish.dish_name)}
              ></i>
              <i
                className={`bx bx-edit-alt bg-white absolute rounded-full bottom-[-10px]
                right-[-10px] text-xl p-1 shadow-xl text-primary border border-gray-400`}
                onClick={() => handleImageUpload(dish.dish_name)}
              ></i>
            </div>
          ) : (
            <button
              className="rounded-md w-32 border border-gray-300 relative"
              onClick={() => handleImageUpload(dish.dish_name)}
              key={dish.menu_item_id}
            >
              <i className="bx bx-bowl-hot text-3xl text-gray-300"></i>
              <i
                className={`bx bxs-plus-circle text-2xl text-gray-300 absolute
                bottom-[-10px] right-[-10px] opacity-75 bg-white rounded-full`}
              ></i>
            </button>
          );
        }

        async function updatePrice() {
          const result = await helpers.addDialogBox("New Price");
          setLoading(true);

          if (result[0][0] == "Success") {
            const response = await server.updateDishPrice(
              selectedRestaurant,
              selectedCategory,
              dish.dish_name,
              result[1]
            );

            await updateDishes(selectedRestaurant, selectedCategory);
            if (response.message == "Price updated successfully") {
              helpers.popUpMessage("Price Updated", "success");
            } else {
              helpers.popUpMessage("Error", "error");
            }
          } else {
            helpers.popUpMessage(result[0][0], result[0][1]);
          }
        }

        return (
          <div
            className={`dish flex justify-between gap-5 shadow p-2 py-3 rounded-2xl 
                        border border-gray-300 relative pr-12`}
          >
            <DishImage dish={dish} />
            <div className="w-full">
              <h2 className="font-semibold">{dish.dish_name}</h2>
              <span className="text-primary inline-block mt-1 relative">
                ₹{dish.price}/-
                <button
                  className="inline-block ml-2 text-xl absolute active:shadow transition-all rounded-full px-2"
                  onClick={updatePrice}
                >
                  <i className="bx bxs-edit"></i>
                </button>
              </span>
              <button
                className={`bg-red-400 rounded-xl text-white px-[4px] pt-[1px] absolute top-[5px] right-[5px] border-2 
                  border-red-400 active:bg-white active:text-red-400 text-xl transition-all`}
                onClick={() => removeDish(dish)}
              >
                <i className="bx bx-minus"></i>
              </button>
            </div>
            {loading && (
              <div
                className="flex justify-center items-center w-[20px] h-[20px] absolute bottom-[5px] right-[10px]"
                key={dish.menu_item_id}
              >
                <Spinner />
              </div>
            )}
          </div>
        );
      }

      function AddNewDish() {
        const [loading, setLoading] = useState(false);

        async function newDishForm() {
          const dish_name = await helpers.addNewDishDialogBox("New Dish Name");
          setLoading(true);

          if (dish_name[0][0] == "Success") {
            const response = await server.addNewDish(
              selectedRestaurant,
              selectedCategory,
              dish_name[1]
            );
            if (
              response.message ===
              "Dish already exists for this restaurant and category"
            ) {
              helpers.popUpMessage("Dish already Exists");
            } else if (response.message === "Dish added successfully") {
              helpers.popUpMessage("Dish added", dish_name[0][1]);
            } else {
              helpers.popUpMessage("Error Adding Dish", "error");
            }
          } else {
            helpers.popUpMessage(dish_name[0][0], dish_name[0][1]);
          }

          await updateDishes(selectedRestaurant, selectedCategory);
        }

        return (
          !dishLoading && (
            <button
              className={`border w-fit px-3 rounded-xl bg-primary text-white py-2 
              active:text-primary active:bg-white transition-all border-primary 
              flex items-center justify-center gap-2`}
              onClick={newDishForm}
            >
              {loading && (
                <div className="inline-block w-[24px] h-[24px]">
                  <Spinner primary_color="white" />
                </div>
              )}
              Add Dish
            </button>
          )
        );
      }

      async function removeDish(dish) {
        const response = await helpers.removeDialogBox(
          "Remove Dish",
          dish.dish_name
        );
        setDishLoading(true);

        if (response === "removed") {
          const result = await server.removeDish(
            selectedRestaurant,
            selectedCategory,
            dish.dish_name
          );

          if (result.message === "Dish removed successfully") {
            helpers.popUpMessage("Dish Removed", "success");
          } else {
            helpers.popUpMessage("Error Removing Dish", "error");
          }
        } else helpers.popUpMessage("cancelled", "error");

        await updateDishes(selectedRestaurant, selectedCategory);
      }

      return (
        <div
          className="dishes pb-10 px-4 flex flex-col gap-3 mt-3 relative"
          key="dishes"
        >
          {!dishLoading && <AddNewDish />}
          {!dishLoading ? (
            <>
              {dishes && dishes.length ? (
                dishes.map((dish, index) => {
                  return <Dish dish={dish} key={index} index={index} />;
                })
              ) : (
                <h2 className="text-center text-2xl text-gray-400 font-semibold mt-25">
                  No Dishes
                </h2>
              )}
            </>
          ) : (
            <div
              className="flex justify-center items-center w-[50px] h-[50px] mt-25 absolute top-1/2 left-1/2 -translate-1/2"
              key="spinner"
            >
              <Spinner />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="restaurant_management w-full min-h-[calc(100dvh-90px)] mb-[70px]">
        <RestaurantSelection />
        <Dishes />
      </div>
    );
  }

  function DeliveryManagegment() {
    return <div className="delivery_management">Delivery Management</div>;
  }

  function PaymentsFinance() {
    return (
      <div className="payments_finance w-full min-h-[calc(100dvh-90px)]">
        Payments & Finance
      </div>
    );
  }

  function PromotionsDiscounts() {
    return (
      <div className="promitions_discounts w-full min-h-[calc(100dvh-90px)]"></div>
    );
  }

  function CustomerFeedback() {
    return <div className="customer_feedback">Customer Feedback</div>;
  }

  function NotificationsAlerts() {
    return (
      <div className="notifications_alerts w-full min-h-[calc(100dvh-90px)]"></div>
    );
  }

  function DataAnalytics() {
    return <div className="data_analytics">Data Analytics</div>;
  }

  return (
    <div className="admin h-full flex flex-col items-center">
      <Dock />
      <ActiveComponent />
    </div>
  );
}

export default Admin;
