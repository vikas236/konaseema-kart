import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";

const DockLink = ({ icon_type, page_name, path }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `dock_link flex flex-col items-center cursor-pointer transition-all 
         ${isActive ? "text-primary" : "text-gray-400"}`
      }
    >
      <i className={`bx ${icon_type} text-2xl px-3 pb-[2px]`}></i>
      <span className="text-xs">{page_name}</span>
    </NavLink>
  );
};

const Dock = ({ cartItems, redirectCart = "/cart" }) => {
  const location = useLocation();
  const disallowed_pathnames = ["/cart", "/admin", "/auth", "/payment"];

  const links = [
    { icon_type: "bxs-home", page_name: "Home", path: "/" },
    {
      icon_type: "bx-restaurant",
      page_name: "Restaurants",
      path: "/restaurants",
    },
    {
      icon_type: "bx-package",
      page_name: "Orders",
      path: "/orders",
    },
    {
      icon_type: "bxs-user",
      page_name: "Profile",
      path: "/profile",
    },
  ];

  return (
    !disallowed_pathnames.includes(location.pathname) && (
      <div className="dock w-dvw h-[70px] fixed bottom-0 left-0 bg-gray-100 shadow-2xl flex items-center justify-around z-10">
        <div
          className={
            cartItems.length
              ? "buy_button w-[100%-25px] absolute top-[-70px] right-[25px] h-[70px] flex items-center justify-center transition-all"
              : "buy_button w-[100%-25px] absolute top-[-70px] right-[-250px] h-[70px] flex items-center justify-center transition-all"
          }
        >
          <NavLink to={redirectCart}>
            <div className="buy_button">
              <button className="bg-primary text-white px-4 py-2 text-xl rounded-xl cursor-pointer">
                Go to cart
              </button>
            </div>
          </NavLink>
        </div>
        {links.map((link, index) => (
          <DockLink key={index} {...link} />
        ))}
      </div>
    )
  );
};

export default Dock;
