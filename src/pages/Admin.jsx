import React, { useEffect, useState, useTransition } from "react";
import server from "../core/server";
import helpers, { popUpMessage } from "../core/helpers.js";
import { useNavigate } from "react-router-dom";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

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
  const navigate = useNavigate();
  useEffect(() => {
    const admin_user = localStorage.getItem("kk_admin_user");
    if (!admin_user) {
      if (admin_user != "in") navigate("/admin_auth");
    }
  });

  const now = new Date();
  const [activeModule, setActiveModule] = useState("2");
  const [selectedDate, setSelectedDate] = useState([
    now.getDate(),
    months[now.getMonth()],
  ]);
  const [totalDays, setTotalDays] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
  );
  const panelFeatures = [
    ["Dashboard Overview"],
    ["Order Processing", OrderProcessing],
    ["Restaurant Management", RestaurantManagement],
    ["User Control", UserManagement],
    ["Delivery Management", DeliveryManagegment],
    ["Payment & Finance", PaymentsFinance],
    ["Promotions & Discounts", PromotionsDiscounts],
    ["Customer Feedback", CustomerFeedback],
    ["Notifications & Alerts", NotificationsAlerts],
    ["Data & Analytics", DataAnalytics],
  ];
  const ActiveComponent = panelFeatures[activeModule][1];

  function HamMenu() {
    function handleClick() {
      const ham = document.querySelector(".ham");
      const strips = document.querySelectorAll(".ham .bar");

      ham.classList.toggle("active");
      ham.classList.toggle("rotate-225");
      strips[1].classList.toggle("opacity-0");
      strips[2].classList.toggle("-rotate-270");
      strips[2].classList.toggle("translate-y-[-8px]");
      strips[0].classList.toggle("translate-y-[9px]");
      strips.forEach((strip) => {
        strip.classList.toggle("bg-white");
        strip.classList.toggle("bg-primary");
      });

      const sidebar = document.querySelector(".sidebar");
      sidebar.classList.toggle("right-[-100%]");
      sidebar.classList.toggle("right-0");
    }

    return (
      <div
        className={`ham w-[35px] h-[23px] rounded-xl fixed top-[35px] right-[35px] 
          flex flex-col justify-between items-center transition-all duration-500
           ease-in-out cursor-pointer z-10`}
        onClick={handleClick}
      >
        <div className="bar w-full h-[5px] bg-white rounded-xl transition-all"></div>
        <div className="bar w-full h-[5px] bg-white rounded-xl transition-all"></div>
        <div className="bar w-full h-[5px] bg-white rounded-xl transition-all"></div>
      </div>
    );
  }

  function SideBar() {
    return (
      <div
        className={`sidebar w-dvw h-dvh shadow-xl bg-white transition-all  
          ease-in-out fixed top-0 right-[-100%] flex flex-col justify-between 
          items-center border border-gray-400 px-5 py-5 gap-2 overflow-scroll 
          z-5 pt-[80px] duration-1000`}
      >
        {panelFeatures.map((feature, index) => (
          <span
            key={index}
            className="w-full border rounded-lg text-center py-2 px-3 cursor-pointer"
            onClick={() => setActiveModule(index)}
          >
            {feature[0]}
          </span>
        ))}
      </div>
    );
  }

  function MonthPicker() {
    function handleChange(e) {
      setSelectedDate([1, e.target.value]);
      setTotalDays(
        new Date(
          new Date().getFullYear(),
          months.indexOf(selectedDate[1]),
          0
        ).getDate()
      );
    }

    return (
      <div className="date_picker w-full bg-primary text-white rounded-b-3xl pt-[100px] pb-[35px] px-4 flex justify-between">
        <select
          name="month_picker"
          id="month_picker"
          className="text-2xl p-0 w-[calc(fit-content + 200px)] rounded-md"
          defaultValue={selectedDate[1]}
          onChange={handleChange}
        >
          {months.map((month, index) => {
            return (
              <option
                value={month}
                key={index}
                className="bg-white shadow-2xl text-black"
              >
                {month[0].toUpperCase() + month.slice(1)}
              </option>
            );
          })}
        </select>
        <select
          className="day_picker px-3 bg-white rounded-full text-primary"
          defaultValue={selectedDate[0]}
          onChange={(e) =>
            setSelectedDate([parseInt(e.target.value), selectedDate[1]])
          }
        >
          {Array.from({ length: totalDays }, (_, index) => {
            return (
              <option key={index} className="text-black border text-center">
                {index + 1}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  function UserManagement() {
    return (
      <div className="user_management w-full min-h-[calc(100dvh-90px)]">
        <div className="date">
          <select name="month" id="month_picker">
            <option value="january">january</option>
            <option value="february">february</option>
            <option value="march">march</option>
            <option value="april">april</option>
            <option value="may">may</option>
            <option value="june">june</option>
            <option value="july">july</option>
            <option value="august">august</option>
            <option value="september">september</option>
            <option value="october">october</option>
            <option value="november">november</option>
            <option value="december">december</option>
          </select>
        </div>
      </div>
    );
  }

  function OrderProcessing() {
    return (
      <div className="order_processing w-full min-h-[calc(100dvh-90px)]">
        <MonthPicker />
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
            setLoading(false);
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
            setLoading(false);
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

            if (response.message == "Price updated successfully") {
              helpers.popUpMessage("Price Updated", "success");
            } else {
              helpers.popUpMessage("Error", "error");
            }
          } else {
            helpers.popUpMessage(result[0][0], result[0][1]);
          }

          await updateDishes(selectedRestaurant, selectedCategory);
          setLoading(false);
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
                onClick={() => removeDish(dish, setLoading)}
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
          setLoading(false);
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

        setDishLoading(false);
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
              {dishes.length ? (
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
      <div className="restaurant_management w-full min-h-[calc(100dvh-90px)]">
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
      <HamMenu />
      <SideBar />
      <ActiveComponent />
    </div>
  );
}

export default Admin;
