const dev_url = "http://localhost:3000";
const prod_url = "https://kk-server.vercel.app";
const server_url = prod_url;

async function SearchForTerm(search_term) {
  return 0;
}

function greet() {
  console.log("hi");
}

async function getTableContent(table_name) {
  return await fetch(server_url + "/get_table", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table_name: table_name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getRestaurantNames() {
  return await fetch(server_url + "/restaurants", { method: "GET" }).then(
    (response) => response.json()
  );
}

async function getCategoryNames(restaurant_name) {
  return await fetch(server_url + "/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant_name: restaurant_name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function addNewRestaurant(name) {
  return await fetch(server_url + "/add_restaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function removeRestaurant(name) {
  return await fetch(server_url + "/remove_restaurant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function addNewCategory(name, restaurant_name) {
  return await fetch(server_url + "/add_category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      restaurant_name: restaurant_name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function removeCategory(name, restaurant_name) {
  return await fetch(server_url + "/remove_category", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      restaurant_name: restaurant_name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getDishes(restaurant_name, category_name) {
  return await fetch(server_url + "/get_dishes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      restaurant: restaurant_name,
      category: category_name,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function sendOtp(phoneNumber) {
  return await fetch(server_url + "/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function verifyOtp(phoneNumber, otp) {
  return await fetch(server_url + "/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phoneNumber: phoneNumber, otp: otp }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function addDishImage(restaurant_name, category_name, dish_name, base64) {
  try {
    const response = await fetch(server_url + "/add_dishimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurant_name,
        category_name: category_name,
        dish_name: dish_name,
        base64: base64,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function removeDishImage(restaurant_name, category_name, dish_name) {
  try {
    const response = await fetch(server_url + "/remove_dishimage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurant_name,
        category_name: category_name,
        dish_name: dish_name,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function updateDishPrice(
  restaurant_name,
  category_name,
  dish_name,
  new_price
) {
  try {
    const response = await fetch(server_url + "/update_dishprice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurant_name,
        category_name: category_name,
        dish_name: dish_name,
        new_price: new_price,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function addNewDish(restaurant_name, category_name, dish_name) {
  try {
    const response = await fetch(server_url + "/add_new_dish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurant_name,
        category_name: category_name,
        dish_name: dish_name,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function removeDish(restaurant_name, category_name, dish_name) {
  try {
    const response = await fetch(server_url + "/remove_dish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        restaurant_name: restaurant_name,
        category_name: category_name,
        dish_name: dish_name,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function addNewOrder(
  name,
  restaurantName,
  food_order_items,
  phone,
  address,
  location_url,
  totalAmount
) {
  try {
    const response = await fetch(server_url + "/add_new_order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        restaurant_name: restaurantName,
        food_order_items: food_order_items,
        phone: phone,
        address: address,
        location_url: location_url,
        total_amount: totalAmount,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! addDishImage: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding dish image:", error);
    return null;
  }
}

async function updateOrderStatus({
  id,
  name,
  restaurant_name,
  food_order_items,
  phone,
  address,
  location_url,
  total_amount,
  order_status,
}) {
  try {
    const response = await fetch(server_url + "/update_order_status", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: name,
        restaurant_name: restaurant_name,
        food_order_items: food_order_items,
        phone: phone,
        address: address,
        location_url: location_url,
        total_amount: total_amount,
        order_status: order_status,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Changnig Order Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error Changing Order Status:", error);
    return null;
  }
}

async function getUserOrders(phone) {
  return await fetch(server_url + "/get_user_orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: phone,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.orders;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getOrdersByDate(date) {
  return await fetch(server_url + "/get_orders_by_date", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      date: date,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.orders;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export default {
  SearchForTerm,
  greet,
  getTableContent,
  getRestaurantNames,
  getCategoryNames,
  addNewRestaurant,
  removeRestaurant,
  addNewCategory,
  removeCategory,
  getDishes,
  sendOtp,
  verifyOtp,
  addDishImage,
  removeDishImage,
  updateDishPrice,
  addNewDish,
  removeDish,
  addNewOrder,
  updateOrderStatus,
  getUserOrders,
  getOrdersByDate,
};
