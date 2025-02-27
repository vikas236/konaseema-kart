import React, { useEffect, useState } from "react";
import server from "../core/server";
import helpers from "../core/helpers";
import { data } from "react-router-dom";

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

function Admin() {
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

    useEffect(() => {
      updateRestaurants();
    }, []);

    async function updateRestaurants() {
      const data = await server.getRestaurantNames();
      setRestaurants(data);
      setSelectedRestaurant(data[0]?.name);
      updateCategories(data[0]?.name);
    }

    async function updateCategories(restaurant) {
      const data = await server.getCategoryNames(restaurant);
      setCategories(data);
      setSelectedCategory(data[0]?.name);
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

      function handleRestaurantChange(e) {
        updateCategories(e.target.value);
        setSelectedRestaurant(e.target.value);
      }

      function handleCategoryChange(e) {
        setSelectedCategory(e.target.value);
      }

      async function removeRestaurant() {
        const result = await helpers.removeDialogBox(
          "Restaurant Name",
          selectedRestaurant
        );

        if (result === "removed")
          await server.removeRestaurant(selectedRestaurant).then((response) => {
            updateRestaurants();
            helpers.popUpMessage(
              result,
              result === "cancelled" ? "error" : "success"
            );
          });
      }

      async function addRestaurant() {
        const [params, result] = await helpers.addDialogBox("Restaurant Name");

        if (result) {
          await server.addNewRestaurant(result).then((response) => {
            updateRestaurants();
            helpers.popUpMessage(params[0], params[1]);
          });
        }
      }

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
              console.log(response);
            });
        }
      }

      return (
        <div className="restaurant_name w-dvw bg-primary px-4 pt-24 pb-14 rounded-b-4xl flex justify-between relative">
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
      );
    }

    function Dishes() {
      const [dishes, setDishes] = useState([]);

      useEffect(() => {
        async function getData() {
          if (selectedRestaurant && selectedCategory) {
            const data = await server.getDishes(
              selectedRestaurant,
              selectedCategory
            );
            setDishes(data.dishes);
          }
        }
        getData();
      }, [selectedRestaurant, selectedCategory]); // Re-run when these change

      return (
        <div className="dishes">
          {dishes.map((dish, index) => (
            <div
              key={index}
              className="dish px-4 flex justify-between gap-5 flex-col pt-5"
            >
              <img src="" alt="" className="w-full h-fit min-h-[250px]" />
              <div className="w-full">
                <h2>{dish.dish_name}</h2>
                <span>{dish.price}</span>
              </div>
            </div>
          ))}
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
