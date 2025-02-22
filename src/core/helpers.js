function camelCasing(arr) {
  const result = [];

  arr.forEach((e) => {
    result.push(e[0].toUpperCase() + e.slice(1, e.length));
  });
}

function popoUpMessage(message) {
  const span = document.createElement("span");
  span.innerHTML = message;
  span.className =
    "fixed bottom-0 left-50 translate-x-[-50%] border border-[#307a59]";
}

export default { camelCasing, popoUpMessage };
