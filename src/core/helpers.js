import { useEffect, useState } from "react";
import server from "./server";

export function camelCasing(arr) {
  const result = [];

  arr.forEach((e) => {
    result.push(e[0].toUpperCase() + e.slice(1, e.length));
  });
}

export function popUpMessage(message, type) {
  let bg_color = "bg-white border border-gray-300 text-black";
  if (type == "success") bg_color = "bg-[#307a59] text-white";
  else if (type == "error") bg_color = "bg-red-400 text-white";

  const span = document.createElement("span");
  span.innerHTML = message;
  span.className = `fixed bottom-[-125px] left-1/2 -translate-x-[50%] ${bg_color} px-4 text-xl py-1 rounded-lg transition-all duration-750 ease-out text-center`;
  document.querySelector("body").appendChild(span);

  setTimeout(() => {
    span.className = `fixed bottom-[105px] left-1/2 -translate-x-[50%] ${bg_color} px-4 text-xl py-1 rounded-lg transition-all duration-750 ease-out text-center`;
  }, 250);

  setTimeout(() => {
    span.classList.add("opacity-0");
  }, 3500);

  setTimeout(() => {
    span.remove();
  }, 5000);
}

export async function addDialogBox(question) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50px] left-[50%] -translate-x-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center items-center p-2">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <input type="text" class="w-full p-2 border border-gray-300 rounded-md mt-4 
        outline-none focus:outline-black" placeholder="Enter Text" autofocus />
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
      </div>
    `;

    setTimeout(() => {
      dialog.querySelector("input").focus();
    }, 50);

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[3].childNodes[1].addEventListener("click", () =>
      closeDialog("", "fail")
    );

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      closeDialog(dialog.querySelector("input").value, "success");
    });
  });
}

export async function removeDialogBox(question, name) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("cancelled"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[150px] p-2 
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
     <div class="w-full flex flex-col justify-center items-center px-2">
      <h1 class="text-lg w-full mt-2 font-normal">${question} : 
      <span class="block text-xl font-bold text-primary">${name}</span>
      </h1>
     </div>
     <div class="w-full flex justify-between p-2">
      <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
      <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
     </div>
    `;

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string) {
      dialog.remove();
      backgroundOverlay.remove();
      resolve(string);
    }

    // Add event listeners
    dialog.childNodes[3].childNodes[1].addEventListener("click", () =>
      closeDialog("cancelled")
    );

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      closeDialog("removed");
    });
  });
}

export async function addImageDialogBox(question) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center items-center p-2">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <input type="file" class="w-full p-2 border border-gray-300 rounded-md mt-4 
        outline-none focus:outline-black" placeholder="Enter Text" autofocus />
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl active:bg-white active:text-primary"><i class="bx bx-check"></i></button>
      </div>
    `;

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[3].childNodes[1].addEventListener("click", () =>
      closeDialog("", "fail")
    );

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      closeDialog(dialog.querySelector("input").files[0], "success");
    });
  });
}

export async function addNewDishDialogBox(question) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center items-center p-2">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <input type="text" class="w-full p-2 border border-gray-300 rounded-md mt-4 
        outline-none focus:outline-black" placeholder="Enter Dish Name" autofocus />
      </div>
      <div class="selected_result w-[calc(100%-17px)] h-[65px] rounded-2xl px-2 border 
      border-gray-300 py-3 flex items-center justify-center relative"><h2 class="text-xl 
      font-semibold text-gray-300 pl-3">Name Not Selected</h2><span class="error 
      text-red-500 absolute left-[5px] -top-[18px] text-xs"></span></div>
      <div class="search_results w-[calc(100%-17px)] h-[calc(100dvh-350px)] rounded-2xl px-2 
      overflow-scroll border border-gray-300 py-3 flex gap-1 flex-col relative"><h2 class=
      "text-2xl font-semibold text-gray-300 absolute left-1/2 top-1/2 -translate-1/2">List 
      Empty</h2></div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl active:bg-white 
        active:text-primary border border-primary"><i class="bx bx-check"></i></button>
      </div>
    `;

    document.body.append(backgroundOverlay, dialog);

    dialog.querySelector("input").addEventListener("input", searchDishNames);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[7].childNodes[1].addEventListener("click", () =>
      closeDialog("", "fail")
    );

    async function getSortedDishNames() {
      const string = dialog.querySelector("input").value;
      const dishes = await server.getTableContent("menu_items");
      const regex = new RegExp(string);
      const dish_names = dishes.map((dish) => dish.name);
      const matches = dish_names.filter((dish_name) => regex.test(dish_name));

      return matches;
    }

    function addDishName(dish_name, container) {
      const span = document.createElement("span");
      const button = document.createElement("button");

      span.className = `w-full block px-2 py-2 bg-gray-100 rounded-xl flex justify-between`;
      span.innerHTML = dish_name;
      button.className = `px-3 py-1 text-white bg-primary rounded-xl h-fit`;
      button.innerHTML = "+";

      span.appendChild(button);
      container.appendChild(span);
      span.addEventListener("click", () => {
        addSeectedResult(dish_name);
      });

      function addSeectedResult(dish_name) {
        const selected_container = dialog.querySelector(".selected_result");
        const h2 = document.createElement("h2");

        h2.className = `w-full block px-2 py-2 bg-gray-100 rounded-xl flex justify-between
        items-center text-center border border-gray-300`;
        h2.innerHTML = dish_name;

        selected_container.innerHTML = "";
        selected_container.appendChild(h2);
      }
    }

    async function searchDishNames() {
      const container = dialog.querySelector(".search_results");
      container.innerHTML = `
          <div class="w-[50px] h-[50px] absolute top-1/2 left-1/2 -translate-1/2 overflow-hidden rounded-full animate-spin">
            <span class="w-[60%] h-full absolute top-1/2 left-1/2 bg-primary z-10"></span>
            <span class="w-full h-full absolute left-0 rounded-full opacity-25 bg-primary z-10"></span>
            <span class="w-[75%] h-[75%] absolute top-1/2 left-1/2 -translate-1/2 bg-white rounded-full z-30"></span>
          </div>`;

      const sortedList = await getSortedDishNames();
      container.innerHTML = ``;

      if (sortedList.length) {
        sortedList.forEach((dish_name) => {
          addDishName(dish_name, container);
        });
      } else {
        addDishName(dialog.querySelector("input").value, container);
      }
    }

    dialog.childNodes[7].childNodes[3].addEventListener("click", async () => {
      const selected_container = document.querySelector(".selected_result");
      // console.log(selected_container.childNodes.length);
      if (selected_container.childNodes.length == 1) {
        const new_dish_name = selected_container.childNodes[0].innerHTML;
        closeDialog(new_dish_name, "success");
      } else {
        const error_container = dialog.querySelector(".error");
        error_container.innerHTML = "dish name not selected";
      }
    });
  });
}

export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export async function addPhoneNumber(question, value) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50px] left-[50%] -translate-x-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center items-center p-2">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <input type="tel" class="w-full p-2 border border-gray-300 rounded-md mt-4 
        outline-none focus:outline-black" placeholder="Phone Number" autofocus 
        maxLength="10" />
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
      </div>
    `;

    dialog.querySelector("input").defaultValue = value;
    setTimeout(() => {
      dialog.querySelector("input").focus();
    }, 50);

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[3].childNodes[1].addEventListener("click", () =>
      closeDialog("", "fail")
    );

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      closeDialog(dialog.querySelector("input").value, "success");
    });
  });
}

export async function addAddress(question) {
  let address;
  let loading = false;

  async function getLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              if (data.display_name) {
                const address = data.display_name;
                popUpMessage("Address found", "success");
                localStorage.setItem("kk_address", address);
                localStorage.setItem(
                  "kk_location_url",
                  `https://www.google.com/maps?q=${longitude},${latitude}`
                );
                resolve(address);
              } else {
                popUpMessage("No address found", "error");
                resolve("");
              }
            })
            .catch((error) => {
              console.error(error);
              popUpMessage("Error occurred while fetching address", "error");
              resolve("");
            });
        },
        (error) => {
          console.error(error);
          popUpMessage("Geolocation error", "error");
          resolve("");
        }
      );
    });
  }

  async function addLocation(e, p) {
    loading = true;
    if (e.target.innerHTML != "Loading..." && p.innerHTML != "Loading...") {
      e.target.innerHTML = `
        <div class="w-[27px] h-[27px]">
          <div class="w-full h-full relative overflow-hidden rounded-full 
          animate-spin">
            <span class="w-[60%] h-full absolute top-1/2 left-1/2 bg-white 
              z-10"></span>
            <span class="w-full h-full absolute left-0 rounded-full opacity-25 
            bg-white z-10"></span>
            <span class="w-[75%] h-[75%] absolute top-1/2 left-1/2 -translate-1/2 
            bg-primary rounded-full z-30"></span>
          </div>
        </div>`;
      p.innerHTML = "Loading...";
      const result = await getLocation();
      p.innerHTML = result;
      e.target.innerHTML = "Detect Location";
    }
    loading = false;
  }

  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50px] left-[50%] -translate-x-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center p-2 relative">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <p class="address w-full h-fit overflow-hidden border border-gray-300 
        rounded-lg py-1 mt-5 pl-2 text-gray-400">Your Location</p>
        <button class="detect bg-primary px-2 py-2 text-white rounded-xl 
        text-lg mt-5 flex justify-center items-center">Detect</button>
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel
        </button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl">
        <i class="bx bx-check"></i></button>
      </div>
    `;

    dialog
      .querySelector(".detect")
      .addEventListener("click", (e) =>
        addLocation(e, dialog.querySelector(".address"))
      );

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[3].childNodes[1].addEventListener("click", () => {
      closeDialog("", "fail");
    });

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      if (!loading)
        closeDialog(dialog.querySelector(".address").innerHTML, "success");
      else popUpMessage("Please Wait", "");
    });
  });
}

export async function addName(question, value) {
  return new Promise((resolve) => {
    // Create dialog and overlay
    const backgroundOverlay = Object.assign(document.createElement("div"), {
      className: "fixed top-0 left-0 w-dvw h-dvh bg-black opacity-25 z-40",
      onclick: () => closeDialog("", "fail"),
    });

    const dialog = Object.assign(document.createElement("div"), {
      className: `fixed top-[50px] left-[50%] -translate-x-[50%] 
        rounded-3xl w-[calc(100dvw-50px)] h-fit bg-white flex items-center gap-3 
        justify-center z-50 shadow-md border border-gray-300 min-h-[200px] p-4
        flex-col`,
    });

    // Create content
    dialog.innerHTML = `
      <div class="w-full flex flex-col justify-center items-center p-2">
        <h1 class="text-lg font-semibold w-full mt-2">${question}:</h1>
        <input type="text" class="w-full p-2 border border-gray-300 rounded-md mt-4 
        outline-none focus:outline-black" placeholder="Enter Name" autofocus 
        defaultValue=${value} />
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
      </div>
    `;

    dialog.querySelector("input").defaultValue = value ? value : "";
    setTimeout(() => {
      dialog.querySelector("input").focus();
    }, 50);

    document.body.append(backgroundOverlay, dialog);

    function closeDialog(string, type) {
      let params;

      dialog.remove();
      backgroundOverlay.remove();

      if (type == "success" && string) params = ["Success", "success"];
      else if (type == "fail") params = ["Cancelled", "error"];
      else params = ["It's Empty", ""];

      resolve([params, string]); // Resolve the promise with the input value
    }

    dialog.childNodes[3].childNodes[1].addEventListener("click", () =>
      closeDialog("", "fail")
    );

    dialog.childNodes[3].childNodes[3].addEventListener("click", () => {
      closeDialog(dialog.querySelector("input").value, "success");
    });
  });
}

export default {
  popUpMessage,
  camelCasing,
  addDialogBox,
  removeDialogBox,
  addImageDialogBox,
  fileToBase64,
  addNewDishDialogBox,
  addPhoneNumber,
  addAddress,
  addName,
};
