import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Nav({ cartItems, setCartItems }) {
  const disallowed_pathnames = ["/cart", "/admin"];
  const location = useLocation();

  const CartIcon = () => {
    return (
      <NavLink
        to="/cart"
        className="cart_icon relative top-[5px] right-[10px] active:text-primary"
      >
        <span className="cart_items_count absolute bg-primary text-white text-xs h-fit px-1 rounded-sm top-[-6px] right-[-7px]">
          {cartItems.length}
        </span>
        <i className="bx bx-cart-alt text-2xl text-gray-400"></i>
      </NavLink>
    );
  };

  return (
    !disallowed_pathnames.includes(location.pathname) && (
      <nav className="w-full pt-5 pb-8 flex items-center justify-between">
        <a className="font-bold text-3xl" href="/">
          Konaseema Kart
        </a>
        <CartIcon />
      </nav>
    )
  );
}

export default Nav;
