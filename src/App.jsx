import React from "react";

function App() {
  // Handles menu activation
  function menuActivate(e) {
    const links = document.querySelectorAll(".menu .navigation span");
    let menu_no;

    links.forEach((link, i) => {
      link.classList.remove("bg-gray-200");
      link.classList.remove("text-orange-400");
      if (link.innerHTML === e.currentTarget.innerHTML) {
        menu_no = i;
      }
    });

    e.currentTarget.classList.add("bg-gray-200");
    e.currentTarget.classList.add("text-orange-400");

    if (menu_no !== undefined) {
      showMenu(menu_no);
    }
  }

  function activateCategory(menu_no, e) {
    let category_no;
    const categories_links = document.querySelectorAll(".categories span");

    categories_links.forEach((link, i) => {
      link.classList.remove("bg-orange-400");
      link.classList.remove("text-white");
      if (link.innerHTML === e.currentTarget.innerHTML) category_no = i;
    });

    e.currentTarget.classList.add("bg-orange-400");
    e.currentTarget.classList.add("text-white");
    addMenuItems(menu_no, category_no);
  }

  function addMenuItems(menu_no, category_no) {
    const category_items = document.querySelector(".category_items");

    if (category_items) {
      // Setting the className and clearing the innerHTML
      category_items.className =
        "category_items w-[calc(100dvw-30px)] h-screen flex flex-col gap-2 bg-blue-100 py-3 mt-5 rounded-2xl mb-7 cursor-pointer px-4 py-4 overflow-y-scroll";
      category_items.innerHTML = ""; // Clear the existing items
    }

    // Accessing the menu and category from the recipes object
    const restaurants = Object.values(recipes);
    const dishes = Object.values(restaurants[menu_no])[category_no + 1];

    // Loop through the dishes and log each one
    for (let i = 0; i < dishes.length; i++) {
      const dish_name = dishes[i][0];
      const dish_price = dishes[i][1];

      const dish_container = document.createElement("div");
      const name_container = document.createElement("span");
      const price_container = document.createElement("span");

      dish_container.className =
        "flex justify-between w-full border-[1px] border-orange-400 pb-1 px-2 rounded-lg py-1";

      name_container.innerHTML = dish_name;
      price_container.innerHTML = "₹" + dish_price.toString() + "/-";

      dish_container.appendChild(name_container);
      dish_container.appendChild(price_container);
      category_items.appendChild(dish_container);
    }
  }

  // Displays menu items based on selected menu number
  function showMenu(menu_no) {
    const active_menu = Object.values(recipes)[menu_no];
    const categories = Object.keys(active_menu).filter((key) => key !== "name"); // Exclude the "name" key
    const container = document.querySelector(".menu_items");
    if (container) container.innerHTML = "";

    const categories_container = document.createElement("div");
    const category_items = document.createElement("div");
    categories_container.className =
      "categories w-screen px-4 flex gap-x-3 gap-y-5 flex-wrap mt-5 justify-left";
    category_items.classList.add("category_items");

    categories.forEach((category) => {
      const span = document.createElement("span");
      span.className = "rounded-md py-2 px-3 bg-gray-200 cursor-pointer";
      span.innerHTML = category.replaceAll("_", " ");

      // Correctly type the event as a React.MouseEvent<HTMLSpanElement, MouseEvent>
      span.addEventListener("click", (e) => {
        activateCategory(menu_no, e);
      });

      categories_container.appendChild(span);
    });

    if (container && container.childNodes.length === 0) {
      container.appendChild(categories_container);
      container.appendChild(category_items);
    }

    setTimeout(() => {
      const firstChild = categories_container.childNodes[0];
      if (firstChild) {
        firstChild.click();
      }
    }, 150);
  }

  // Initial menu display
  React.useEffect(() => {
    showMenu(0);
  }, []);

  return (
    <div className="menu w-dvw h-fit overflow-x-hidden overflow-y-scroll flex flex-col">
      <div className="navigation w-full flex flex-col justify-center overflow-hidden">
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 font-semibold bg-gray-200 text-orange-400"
          onClick={menuActivate}
        >
          {recipes.restaurant0.name}
        </span>
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 font-semibold"
          onClick={menuActivate}
        >
          {recipes.restaurant1.name}
        </span>
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 font-semibold"
          onClick={menuActivate}
        >
          {recipes.restaurant2.name}
        </span>
        <span
          className="cursor-pointer hover:bg-gray-200 p-3 font-semibold"
          onClick={menuActivate}
        >
          {recipes.restaurant3.name}
        </span>
      </div>
      <div className="menu_items w-full h-fit flex flex-col items-center overflow-hidden"></div>
    </div>
  );
}

const recipes = {
  restaurant0: {
    name: "vinay biryanis",
    biryanis: [
      ["dum biryani half", 130],
      ["dum biryani half", 130],
      ["dum biryani full", 200],
      ["dum biryani family", 250],
      ["dum biryani half", 130],
      ["dum biryani full", 200],
      ["dum biryani family", 250],
      ["fry piece biryani half", 130],
      ["fry piece biryani full", 180],
      ["fry piece biryani family", 250],
    ],
  },
  restaurant1: {
    name: "vindhu family restaruant (punjaby dhaba)",
    veg_curries: [
      ["paneer butter masala", 220],
      ["mushroom curry", 220],
      ["meethi chaman", 230],
      ["paneer kaaju curry", 250],
      ["mushroom kaaju", 250],
      ["three step curry", 250],
      ["kaaju masala", 240],
      ["kaaju tomato", 230],
      ["veg mixed curry", 180],
      ["veg navabhi", 200],
    ],
    soups: [
      ["veg sweet corn soup", 100],
      ["mushroom keema soup", 100],
      ["chicken cormn soup", 130],
      ["chicken hot sour soup", 120],
    ],
    tandoori: [
      ["batti kabab", 100],
      ["chicken gaint", 130],
      ["1/2 tandoori", 260],
      ["full tandoori", 500],
      ["chicken tikka", 300],
      ["hyderabad tikka", 320],
      ["malala tikka", 320],
      ["butter non", 60],
      ["garlic non", 90],
      ["mitai roti", 120],
      ["tandoori roti", 40],
      ["plain non", 40],
      ["pulka", 8],
    ],
    non_veg_curries: [
      ["doopudu pothu flesh curry", 380],
      ["pacchi royyala kodi kura iguru", 350],
      ["thala kaya curry", 270],
      ["seelavathi chepa pulusu", 150],
      ["mutton curry", 380],
      ["chicken curry(bone)", 230],
      ["prawns curry", 340],
      ["boneless chicken curry", 260],
      ["chicken navabhi", 280],
      ["hyderabad chicken curry", 280],
      ["murigi masala", 300],
      ["tikka masala", 320],
      ["kaaju pitta curry", 200],
      ["dhamka curry full", 300],
      ["butter chicken", 280],
      ["egg burri", 160],
      ["anda mughalai", 160],
      ["chicken mughalai curry", 280],
    ],
    biryanis: [
      ["chicken dum biryani (pot)", 300],
      ["chicken fry peace biryani", 250],
      ["chicken mughalai biryani", 300],
      ["prawns biryani", 360],
      ["mutton biryani", 400],
      ["dum mughalai biryani", 330],
      ["guntoor chicken biryani", 320],
      ["avakay chicken biryani", 320],
      ["mixed biryani", 370],
      ["mixed mughalai biryani", 380],
      ["prawns mughalai biryani", 380],
      ["mutton mughalai biryani", 420],
      ["chicken special biryani", 320],
      ["mushroom biryani", 300],
      ["veg biryani", 180],
      ["veg mughalai biryani", 290],
      ["three star biryani", 300],
      ["egg biryani", 220],
    ],
    fried_rice: [
      ["veg fried rice", 180],
      ["veg fried rice special", 260],
      ["veg mughalai fried rice", 280],
      ["mushroom fried rice", 300],
      ["three stars fried rice", 300],
      ["kaaju fried rice", 300],
      ["egg fried rice", 200],
      ["egg mughalai fried rice", 230],
      ["egg manchuria fried rice", 250],
      ["chicken fried rice", 250],
      ["chicken special fried rice", 300],
      ["mughalai fried rice", 300],
      ["mixed fried rice", 370],
      ["prawns fried rice", 360],
      ["mutton fried rice", 400],
      ["fry piece fried biryani", 250],
      ["gongura chicken fried rice", 330],
    ],
    nonveg_starters: [
      ["chilli chicken", 290],
      ["rr chicken", 290],
      ["lemon chicken", 290],
      ["chicken-65", 290],
      ["sathayi chicken", 320],
      ["kasturi chicken", 300],
      ["kabab", 90],
      ["mughalai kabab", 100],
      ["kashmir kabab", 100],
      ["fried wings", 270],
      ["chilli wings", 300],
      ["chicken lollipop", 300],
      ["kaaju pitta fry", 200],
      ["loose prawns", 360],
      ["prawns fry", 360],
      ["fish fry", 350],
      ["chilli egg", 200],
      ["kaaju chicken", 370],
      ["mutton fry", 400],
      ["crab pakodi", 320],
      ["chicken 555", 350],
      ["bangla kodi", 320],
      ["fish chips", 370],
      ["chicken chips", 370],
      ["stick prawns", 420],
      ["mutton ghee roast", 420],
    ],
    veg_starters: [
      ["chilli mushroom", 250],
      ["chilli paneer", 250],
      ["paneer 65", 250],
      ["veg spring roast", 220],
      ["veg manchuria", 220],
      ["sweet corn pakodi", 200],
      ["fever kaaju", 240],
      ["three step pakodi", 300],
      ["bangla paneer", 270],
    ],
  },
  restaurant2: {
    name: "sri bhaskara",
    soups: [
      ["veg hot & sour soup", 100],
      ["veg sweet corn soup", 100],
      ["veg manchow soup", 100],
      ["veg lemon coriander soup", 100],
      ["tomato soup", 100],
      ["non veg hot & sour soup", 130],
      ["non veg sweet corn soup", 130],
      ["non veg manchow soup", 130],
      ["non veg lemon corainder soup", 130],
      ["cream of mushroom soup", 100],
      ["cream of chicken soup", 130],
    ],
    papads: [
      ["masala papad", 45],
      ["roasted papad", 35],
    ],
    grill_items: [
      ["vanjaram tandoori", 450],
      ["half alfham chicken", 280],
      ["full alfham chicken", 550],
      ["half grill chicken", 280],
      ["full grill chicken", 550],
    ],
    salads: [
      ["cucumber salad", 100],
      ["green salad", 100],
      ["curd", 40],
      ["curd rice", 100],
      ["sp curd rice", 130],
    ],
    beverages: [
      ["cool drink", 25],
      ["water bottle", 25],
      ["soda", 20],
      ["badam milk 1lt", 150],
      ["buttermilk", 40],
      ["lemon soda", 40],
      ["lassi (sweet/salt)", 60],
    ],
    veg_starters: [
      ["rr veg", 220],
      ["crispy veg", 220],
      ["dragon veg", 220],
      ["veg manchurian", 220],
      ["cashew fry", 240],
      ["paneer majestick", 240],
      ["chilli paneer", 240],
      ["paneer manchurian", 240],
      ["chilli paneer", 240],
      ["garlic paneer", 240],
      ["paneer 65", 240],
      ["chilli baby corn", 240],
      ["baby corn manchurian", 240],
      ["crispy baby corn", 240],
      ["chilli mushroom", 240],
      ["mushroom manchurian", 240],
      ["mushroom (salt & pepper)", 240],
      ["mushroom 65", 240],
      ["paneer tikka", 250],
    ],
    nonveg_starters: [
      ["chilli chicken", 330],
      ["chicken manchurian", 330],
      ["chicken 65", 330],
      ["garlic chicken", 330],
      ["rr chicken", 330],
      ["schezwan chicken", 330],
      ["dragon chicken", 330],
      ["hongkong chicken", 330],
      ["cashewnut chicken", 330],
      ["chicken dry roast", 330],
      ["crispy chicken", 330],
      ["pepper chicken", 330],
      ["oil kabab", 90],
      ["chilli kabab", 100],
      ["mogalai kabab", 120],
      ["chicken lollypops (dry)", 300],
      ["chicken lollypops (wet)", 320],
      ["chicken liver fry", 180],
      ["chicken fry (bone)", 180],
      ["chicken fry (boneless)", 270],
      ["chicken majestic", 330],
      ["tandoori chicken (half)", 280],
      ["tandoori chicken (full)", 540],
      ["tangdi kabab - 4 pcs", 360],
      ["chicken tikka - 8 pcs", 320],
      ["mutton fry", 390],
      ["chilly mutton", 390],
      ["mutton manchurian", 390],
      ["mutton 65", 390],
      ["rr mutton", 390],
      ["ginger mutton", 390],
      ["garlic mutton", 390],
      ["chilly egg", 200],
      ["egg manchurian", 200],
      ["egg 65", 200],
      ["chilly prawns", 340],
      ["prawns fry", 340],
      ["prawns manchurian", 340],
      ["prawns 65", 340],
      ["garlic prawns", 340],
      ["ginger prawns", 340],
      ["prawns salts pepper", 340],
      ["loose prawns", 340],
      ["dragon prawns", 340],
      ["apolo fish", 340],
      ["chilly fish", 340],
      ["fish manchurian", 340],
      ["fish 65", 340],
      ["fish schezwan", 340],
      ["fish fry", 340],
      ["dry roast", 340],
      ["fish majestic", 340],
      ["mangolian fish", 340],
    ],
    veg_fried_rice: [
      ["veg fried rice", 170],
      ["veg sp fried rice (mushroom curry)", 240],
      ["veg sp fried rice (paneer curry)", 240],
      ["veg sp mogalai fried rice (mushroom curry)", 270],
      ["veg sp mogalai fried rice (paneer curry)", 270],
      ["jeera rice", 170],
      ["schezwan veg fried rice", 200],
      ["veg corn fried rice", 200],
      ["veg garlic fried rice", 200],
      ["corn & cashewnut fried rice", 260],
    ],
    nonveg_fried_rice: [
      ["chicken fried rice", 200],
      ["prawns fried rice", 300],
      ["mutton fried rice", 340],
      ["chicken sp fried rice", 280],
      ["prawns sp fried rice", 350],
      ["mutton sp fried rice", 380],
      ["chicken fry piece fried rice", 250],
      ["chicken mogalai fried rice", 270],
      ["prawns mogalai fried rice", 340],
      ["mutton mogalai fried rice", 380],
      ["schezwan chicken fried rice", 240],
      ["mixed fried rice", 320],
      ["mixed mogalai fried rice", 350],
      ["egg fried rice", 180],
      ["sp egg fried rice", 250],
      ["schezwan egg fried rice", 200],
    ],
    nanns_rotis: [
      ["pulkha (only evening)", 10],
      ["butter pulkha (only evening)", 15],
      ["plain naan", 50],
      ["butter naan", 60],
      ["plain roti", 40],
      ["butter roti", 45],
      ["plain kulcha", 70],
      ["masala kulcha", 80],
      ["moghalai naan", 100],
      ["garlic naan", 80],
      ["aloo paratha", 90],
    ],
    veg_indian_curriees: [
      ["mix veg curry", 180],
      ["kadai veg curry", 200],
      ["veg kolapuri", 220],
      ["veg jaipuri", 220],
      ["paneer butter masala", 200],
      ["tomato cashew curry", 240],
      ["paneer cashew curry", 240],
      ["plain cashew curry", 240],
      ["mushroom kadai curry", 220],
      ["paneer kadai curry", 220],
      ["paneer mushroom curry", 240],
      ["mushroom cashew curry", 240],
      ["green peas masala", 160],
      ["paneer tikka masala", 240],
      ["methi chaman curry", 230],
      ["rasmalai curry", 220],
      ["babycorn masala curry", 220],
      ["mushroom masala", 220],
      ["veg chatpat curry", 200],
    ],
    nonveg_indian_curries: [
      ["chicken curry (bone)", 220],
      ["chicken curry (boneless)", 220],
      ["methi chicken", 200],
      ["butter chicken", 230],
      ["kadai chicken", 260],
      ["cashew chicken", 280],
      ["chicken mogalai curry", 300],
      ["kabab masala", 280],
      ["chicken tikka masala", 300],
      ["liver curry", 300],
      ["andhra chicken curry", 240],
      ["chicken chatnadu", 300],
      ["chicken maharani", 200],
      ["punjabi chicken", 260],
      ["mutton curry", 300],
      ["gongura mutton", 300],
      ["mutton keema curry", 300],
      ["mutton rogan josh", 350],
      ["kadai mutton", 380],
      ["mutton masala", 400],
      ["Gongura Prawns Curry", 320],
      ["Prawns Masala", 280],
      ["Fish Masala", 280],
      ["Egg Curry", 180],
      ["Egg Mogalai Curry", 200],
    ],
    veg_biryani: [
      ["Veg Biryani", 180],
      ["Veg Sp Biryani (Mushroom Curry)", 250],
      ["Veg Sp Biryani (Paneer Curry)", 250],
      ["Paneer Biryani", 280],
      ["Cashew Biryani", 280],
      ["Mushroom Biryani", 280],
      ["Veg Mixed Mogalai Biryani", 260],
      ["Veg Sp Mogalai Biryani (Paneer)", 300],
      ["Veg Sp Mogalai Biryani (Mushroom)", 300],
    ],
    nonveg_biryani: [
      ["Chicken Fry Bit Biryani", 240],
      ["Pot Biryani", 300],
      ["Chicken Sp Biryani", 280],
      ["Prawns Sp Biryani", 340],
      ["Mutton Sp Biryani", 400],
      ["Kabab Biryani", 320],
      ["Aavakayi Chicken Biryani", 300],
      ["Vulavacharu Chicken Biryani", 300],
      ["Chicken Moghalai Biryani", 300],
      ["Prawns Moghalai Biryani", 340],
      ["Mutton Moghalai Biryani", 400],
      ["Mixed Biryani", 320],
      ["Liver Biryani", 260],
      ["Dilkush Biryani", 400],
      ["Mixed Mogalai Biryani", 350],
      ["Egg Biryani", 200],
      ["Sp Egg Biryani", 250],
      ["Mutton Biryani", 360],
      ["Mutton Keema Biryani", 380],
      ["Prawns Biryani", 320],
      ["Fish Biryani (Boneless)", 320],
      ["Potlam Biryani", 380],
      ["Tandoori Biryani", 400],
    ],
    ice_creams: [
      ["Vanilla (2 Scoops)", 80],
      ["Strawberry (2 Scoops)", 80],
      ["Blackcurrant (2 Scoops)", 100],
      ["Butterscotch (2 Scoops)", 130],
      ["Chocolate (2 Scoops)", 130],
      ["American Dry Fruit (2 Scoops)", 140],
      ["Caramel Nuts (2 Scoops)", 150],
      ["Sithapal (2 Scoops)", 100],
      ["Sapota (2 Scoops)", 90],
      ["Jackfruit (2 Scoops)", 100],
      ["TenderCoconut (2 Scoops)", 120],
      ["Blueberry (2 Scoops)", 110],
      ["Pineapple (2 Scoops)", 80],
      ["Kiwi (2 Scoops)", 90],
    ],
    kulfi_cones: [
      ["Malai Kulfi", 25],
      ["Rajbhoj Kulfi", 30],
      ["Matka Kulfi", 60],
      ["Chocochips Cone", 40],
      ["Strawberry Cone", 30],
      ["Butterscotch Cone", 40],
      ["Choco Cookie Cone", 45],
      ["Badam Roasted Cone", 50],
      ["Fruit Salad", 100],
      ["Fruit Salad with Icecream (Vanilla)", 140],
    ],
    mocktails: [
      ["Lemon Mojito", 120],
      ["Orange Mojito", 120],
      ["Mint Mojito", 120],
      ["Mosambi Mojito", 120],
      ["Pineapple Mojito", 120],
      ["Watermelon Mojito", 120],
      ["Greenapple Mojito", 120],
      ["Kiwi Mojito", 120],
      ["Blue Mojito", 120],
      ["Guava Mojito", 120],
      ["Grape Mojito", 120],
      ["Fruit Punch", 140],
      ["Perfect Lady", 140],
      ["Blue Loogan", 120],
      ["Blossom Ice", 120],
      ["Green Cooler", 120],
      ["Raspberry Mojito", 120],
    ],
    juice_milkshake: [
      ["Watermelon Juice", 60],
      ["Apple Juice", 70],
      ["Grape Juice", 70],
      ["Pineapple Juice", 70],
      ["Kharbuja Juice", 70],
      ["Papaya Juice", 70],
      ["Banana Juice", 70],
      ["Promogranate Juice", 100],
      ["Lemon Juice", 40],
      ["Vanilla Milkshake", 150],
      ["Strawberry Milkshake", 150],
      ["Blackcurrant Milkshake", 150],
      ["Chocolate Milkshake", 150],
      ["Butterscotch Milkshake", 150],
      ["Caramel Milkshake", 150],
      ["American Nuts Milkshake", 180],
      ["Dry Fruit Milkshake", 200],
    ],
    falooda: [
      ["rose falooda", 110],
      ["dry fruit falooda", 150],
      ["fruit special falooda", 150],
      ["bhaskar special falooda", 180],
    ],
  },
  restaurant3: {
    name: "new biryanis",
    all: [
      ["chicken mugalai biryani", 200],
      ["mixed biryani", 250],
      ["mutton biryani", 270],
      ["mutton mughalai biryani", 250],
      ["prawns biryani", 200],
      ["prawns mughalai biryani", 220],
      ["chicken fry", 80],
      ["biryani rice", 70],
      ["chicken lollipop full dry", 180],
      ["chicken lollipop half dry", 120],
      ["chicken lollipop full wet", 200],
      ["chhicken lollipop full wet", 140],
      ["chicken joint piece", 100],
      ["chicken kabab 1pc", 80],
      ["chicken fried rice full", 160],
      ["chicken fried rice half", 120],
      ["chicken biryani full", 160],
      ["chicken biryani half", 120],
      ["egg fried rice", 120],
    ],
  },
};

export default App;
