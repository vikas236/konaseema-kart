import { useEffect } from "react";
import Carousel from "../components/Carousel";
import { NavLink } from "react-router-dom";

function HugeOffer() {
  return (
    <div
      className="w-full huge_offer py-4 px-6 relative mt-5 bg-[#307a59] text-white rounded-lg 
  before:w-[calc(100%-20px)] before:h-[50px] before:bg-[#307a59]/20 before:content-[''] before:absolute before:bottom-[-8px] 
  before:left-[10px] before:rounded-xl before:z-[-1] cursor-pointe"
    >
      <h1 className="text-md font-semibold">
        Huge Offer
        <i className="bx bx-chevron-right absolute right-[13px] text-3xl bg-[#266247] rounded-full"></i>
      </h1>
      <p className="font-light text-md">very good offer!!!</p>
      <button className="bg-white text-[#307a59] mt-3 px-2 py-1 rounded-md text-sm font-semibold">
        place order
      </button>
    </div>
  );
}

function PopularChoices() {
  const arr = [
    ["bx-restaurant", "restaurants"],
    ["bx-search-alt", "search"],
    ["bx-cart-alt", "cart"],
    ["bxs-user", "profile"],
  ];

  return (
    <div className="popular_choices mt-4">
      <div className="flex items-center flex-wrap gap-3">
        {arr.map((e, index) => (
          <NavLink
            key={index}
            to={`/${e[1]}`}
            className="w-[calc(50%-6px)] h-[50px] bg-gray-200 text-gray-500 flex items-center px-4 rounded-lg"
          >
            <i className={`bx ${e[0]} text-xl pr-2`}></i>
            <span className="">{e[1]}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function SearchBar() {
  return (
    <div className="w-full search_bar relative">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-md mt-5 outline-hidden py-2 pl-10 bg-gray-100/50"
        placeholder="Search on Konaseema Kart"
      />
      <i className="bx bx-search absolute left-3 top-[29px] text-2xl text-gray-400"></i>
    </div>
  );
}

function Home() {
  return (
    <div className="home w-full h-fit overflow-hidden">
      <h1 className="font-semibold text-center">Home</h1>
      {/* <SearchBar /> */}
      <PopularChoices />
      <div className="popular_categories mt-7">
        {/* <h1 className="font-semibold text-xl flex items-center justify-between">
          Popular Categories{" "}
          <NavLink
            className="text-xs pr-5 text-gray-400  active:text-[#307a59]"
            to="/restaurants"
          >
            view more
          </NavLink>
        </h1> */}
        {/* <Carousel /> */}
      </div>
    </div>
  );
}

export default Home;
