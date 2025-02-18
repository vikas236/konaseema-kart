import { useEffect, useState } from "react";
import * as server from "../core/server.js";

function Search() {
  const [targetTime, setTargetTime] = useState(getTime());

  function getTime() {
    const currentTime = new Date().toLocaleString();
    return parseInt(currentTime.slice(currentTime.length - 5).slice(0, 2));
  }

  function handleInput(e) {
    setTargetTime(getTime() + 2);
    setTimeout(() => {
      if (targetTime >= getTime() - 2) handleSearch(e.target.value);
    }, 1500);
  }

  function handleSearch(search_term) {
    server.default.SearchForTerm(search_term);
    setTargetTime(getTime() + 2);
  }

  return (
    <div className="search w-full h-dvw flex flex-col items-center justify-center px-1">
      <h1 className="text-2xl text-gray-300">coming soon</h1>
      <div className="search_bar relative w-full hidden">
        <i className="bx bx-search absolute left-0 top-2 text-2xl"></i>
        <input
          type="text"
          autoFocus={true}
          placeholder="Search for a dish, recipe, or a restaurant......"
          className="w-full border-b p-2 pb-3 pl-10 outline-none"
          onInput={handleInput}
        />
      </div>
    </div>
  );
}

export default Search;
