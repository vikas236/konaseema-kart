import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import logo from "../assets/kk_logo.png";

function Nav({ cartItems, setCartItems }) {
  const disallowed_pathnames = [
    "/cart",
    "/admin",
    "/payment",
    "/admin_auth",
    "/auth",
    "/processorder",
  ];
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
      <nav className="w-full pt-5 pb-3 flex items-center justify-between">
        <NavLink to="/">
          <img src={logo} alt="konaseema kart logo" className="max-w-[150px]" />
        </NavLink>
        <CartIcon />
      </nav>
    )
  );
}

export default Nav;
