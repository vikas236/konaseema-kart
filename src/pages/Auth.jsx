import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { popUpMessage } from "../core/helpers.js";
import server from "../core/server.js";

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(
    localStorage.getItem("kk_phone") || ""
  );
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(true);
  const [userInfoEdit, setUserInfoEdit] = useState(true);
  const [address, setAddress] = useState(
    localStorage.getItem("kk_address") || ""
  );

  async function verifyNumber() {
    if (!loading) {
      const input = document.querySelector(".phone_input");
      if (/^[0-9]{10}$/.test(input.value)) {
        setLoading(true);
        // send mobile number to node server
        await server.sendOtp(input.value).then((response) => {
          if (response.message == "Invalid Numbers") {
            popUpMessage("Invalid Number", "error");
          } else {
            popUpMessage("OTP Sent", "success");
            setOtpSent(true);
            setError(null);
            setLoading(false);
          }
        });
      } else {
        setError("Please enter a valid phone number");
      }
    }
  }

  async function verifyOtp() {
    if (!loading) {
      setLoading(true);
      await server.verifyOtp(phoneNumber, otp).then((response) => {
        if (response.message == "Incorrect OTP") {
          popUpMessage("Incorrect OTP", "error");
          setError("incorrect otp");
          setLoading(false);
        } else {
          setError(null);
          setLoading(false);
          setUserInfoEdit(true);
          popUpMessage("OTP Verified", "success");
        }
      });
    }
  }

  function UserInfoEdit() {
    function updateAddress() {
      setAddress(" Loading...");
      navigator.geolocation.getCurrentPosition((position) => {
        const longitude = position.coords.longitude;
        const latitude = position.coords.latitude;
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (data.display_name) {
              const address = data.display_name;
              popUpMessage("Address found", "success");
              setAddress(address);
              localStorage.setItem("kk_address", address);
              localStorage.setItem(
                "kk_location_url",
                `https://www.google.com/maps?q=${longitude},${latitude}`
              );
            } else {
              popUpMessage("No address found", "error");
              setAddress("click to add address");
            }
          })
          .catch((error) => {
            console.error(error);
            popUpMessage("Error occurred while fetching address", "error");
          });
      });
    }

    function handleSubmit() {
      if (!loading) {
        setLoading(true);

        if (/^\d{10}$/.test(phoneNumber))
          localStorage.setItem("kk_phone", phoneNumber);
        else setError("phone number is invalid");
        if (!address.length > 5) setError("address should not be empty");

        if (/^\d{10}$/.test(phoneNumber) && address.length > 5) {
          setTimeout(() => {
            setLoading(false);
            navigate("/cart");
          }, 500);
        }
      }
    }

    return (
      <div className="pb-7">
        <div className="mb-4">
          <label className="block  text-lg mb-2" htmlFor="name">
            Phone
          </label>
          <input
            type="number"
            id="name"
            className={`block w-full outline-none border-b-2 border-gray-300 
              pb-2 mt-2 transition-all text-lg placeholder:text-gray-200 
              appearance-none [&::-webkit-inner-spin-button]:appearance-none 
              [&::-webkit-outer-spin-button]:appearance-none 
              [&::-moz-appearance:textfield] border p-2 rounded-md`}
            placeholder="your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoFocus={true}
            maxLength={10}
          />
        </div>
        <div className="mb-4">
          <label className="block  text-lg mb-2" htmlFor="address">
            Address
          </label>
          <span className="w-full outline-none border-2 border-gray-300 p-2 rounded-md mt-2 transition-all placeholder:text-gray-200 flex justify-between text-md">
            {address || "click to add address"}
            <button
              className="h-fit bg-primary px-2 text-white rounded-md py-1 ml-2 active:opacity-75 transition-all"
              onClick={updateAddress}
            >
              Detect
            </button>
          </span>
        </div>
        <button
          className="w-[calc(100dvw-50px)] bg-primary text-white px-4 py-3 rounded-md mt-4 absolute active:opacity-90 transition-all"
          onClick={handleSubmit}
        >
          {loading ? "Loading..." : "Save and Continue"}
          {error && (
            <span className="absolute -top-[22px] left-0 text-xs text-red-500">
              {error}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="auth px-1 pt-4">
      {userInfoEdit ? (
        <UserInfoEdit />
      ) : (
        <div>
          <h2 className="text-2xl">
            {!otpSent ? "Sign In with Phone" : "Enter Otp For Verfication"}
          </h2>

          {!otpSent ? (
            <div className="relative mt-7">
              <span className="absolute left-2 top-[8px] text-gray-400 text-lg">
                +91{" "}
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="your phone number"
                autoFocus={true}
                maxLength={10}
                className={`phone_input w-full outline-none border-b-2 border-gray-300 pb-2 mt-2 transition-all text-lg pl-12 placeholder:text-gray-200`}
              />
              <div id="recaptcha-container"></div>
              <button
                disabled={loading}
                className="continue_btn w-[calc(100dvw-40px)] bg-primary text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
                onClick={verifyNumber}
              >
                {loading ? "Sending OTP..." : "Continue"}
              </button>
            </div>
          ) : (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                maxLength={6}
                className="w-full outline-none border-b-2 border-gray-300 pb-2 mt-4 transition-all text-lg placeholder:text-gray-200"
              />
              <button
                disabled={loading}
                className="w-[calc(100dvw-40px)] bg-primary text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
                onClick={verifyOtp}
              >
                {loading ? "Verifying..." : "Verify OTP"}
                <span className="inline-block mt-5 text-sm absolute top-[-45px] text-black w-full left-0">
                  It may take some time to receive the otp
                </span>
              </button>
            </>
          )}

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Auth;
