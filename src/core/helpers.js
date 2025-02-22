export function camelCasing(arr) {
  const result = [];

  arr.forEach((e) => {
    result.push(e[0].toUpperCase() + e.slice(1, e.length));
  });
}

export function popUpMessage(message) {
  const span = document.createElement("span");
  span.innerHTML = message;
  span.className =
    "fixed bottom-[-125px] left-50 translate-x-[-50%] text-white bg-[#307a59] border-2 border-white px-4 text-xl py-1 rounded-lg transition-all duration-750 ease-out";
  document.querySelector("body").appendChild(span);

  setTimeout(() => {
    span.className =
      "fixed bottom-[20px] left-50 translate-x-[-50%] text-white bg-[#307a59] border-2 border-white px-4 text-xl py-1 rounded-lg transition-all duration-750 ease-out";
  }, 250);

  setTimeout(() => {
    span.className =
      "fixed bottom-[20px] left-50 translate-x-[-50%] text-white bg-[#307a59] border-2 border-white px-4 text-xl py-1 rounded-lg transition-all duration-750 ease-out opacity-0";
  }, 3500);

  setTimeout(() => {
    span.remove();
  }, 5000);
}

export default { popUpMessage, camelCasing };
