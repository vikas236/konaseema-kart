import Carousel from "../components/Carousel";
import { recipes } from "../core/data";

function Menu({ cartItems, setCartItems }) {
  const active_restaurant = localStorage.getItem("kk_active_restaurant");
  let menu;

  Object.values(recipes).forEach((e) => {
    if (e.name === active_restaurant) menu = e;
  });
  let categories = Object.keys(menu).slice(1, Object.keys(menu).length);
  categories = categories.map((e) => e.replaceAll("_", " "));

  const carouselContent = categories.map((e) => {
    return { name: e, image: "" };
  });
  const menu_items = Object.values(menu).slice(1);

  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 50,
    slidesToShow: 2.7,
    slidesToScroll: 1,
  };

  return (
    <div className="menu">
      <h1 className="text-center font-semibold">Menu</h1>
      <Carousel
        carouselContent={carouselContent}
        carouselSettings={carouselSettings}
        menu_items={menu_items}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </div>
  );
}

export default Menu;
