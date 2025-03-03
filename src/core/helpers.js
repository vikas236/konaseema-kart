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
        outline-none focus:outline-black" placeholder="Enter Text" autofocus />
      </div>
      <div class="w-full flex justify-between p-2">
        <button class="bg-red-400 text-white rounded-xl px-4 py-2">Cancel</button>
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
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
        <button class="bg-primary text-white rounded-xl px-4 py-2 text-xl"><i class="bx bx-check"></i></button>
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

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    console.log(file);
    reader.readAsDataURL(file); // Read file as Data URL (Base64)
    reader.onload = () => resolve(reader.result); // Resolve with Base64 string
    reader.onerror = (error) => reject(error); // Handle errors
  });
};

export default {
  popUpMessage,
  camelCasing,
  addDialogBox,
  removeDialogBox,
  addImageDialogBox,
  fileToBase64,
};
