import Carousel from "../components/Carousel.jsx";

function Menu({ cartItems, setCartItems }) {
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
        carouselSettings={carouselSettings}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
    </div>
  );
}

export default Menu;
