const dev_url = "http://localhost:3000";
const prod_url = "https://kk-server.vercel.app";
const server_url = prod_url;

function SearchForTerm(search_term) {
  return 0;
}

function greet() {
  console.log("hi");
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
  console.log(restaurant_name);
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

export default {
  SearchForTerm,
  greet,
  getRestaurantNames,
  getCategoryNames,
  addNewRestaurant,
  removeRestaurant,
  addNewCategory,
  removeCategory,
  getDishes,
  sendOtp,
  verifyOtp,
};
