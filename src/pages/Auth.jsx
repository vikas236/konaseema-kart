import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { popUpMessage } from "../core/helpers.js";
import server from "../core/server.js";

function Spinner({ primary_color }) {
  let bg_color, text_color;
  if (primary_color == "white") {
    bg_color = "bg-white";
    text_color = "bg-primary";
  } else {
    text_color = "bg-white";
    bg_color = "bg-primary";
  }

  return (
    <div className="w-full h-full relative overflow-hidden rounded-full animate-spin">
      <span
        className={`w-[60%] h-full absolute top-1/2 left-1/2 ${bg_color} z-10`}
      ></span>
      <span
        className={`w-full h-full absolute left-0 rounded-full opacity-25 ${bg_color} z-10`}
      ></span>
      <span
        className={`w-[75%] h-[75%] absolute top-1/2 left-1/2 -translate-1/2 ${text_color} rounded-full z-30`}
      ></span>
    </div>
  );
}

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("kk_phone") || ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("kk_address") || ""
  );
  const [name, setName] = useState(localStorage.getItem("kk_name") || "");
  const [error, setError] = useState(false);

  return (
    <div className="auth px-1 pt-4 flex flex-col">
      <label htmlFor="phone">
        Phone
        <input
          type="number"
          id="phone"
          defaultValue={phoneNumber}
          className="w-full"
        />
      </label>
      <label htmlFor="name">
        Name
        <input type="text" id="name" className="w-full" defaultValue={name} />
      </label>
      <label htmlFor="address">
        address
        <input
          type="text"
          id="address"
          className="w-full"
          defaultValue={address}
        />
      </label>
    </div>
  );
};

export default Auth;
