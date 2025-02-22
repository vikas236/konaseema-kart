import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { popUpMessage } from "../core/helpers.js";

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter your phone number");
      return 0;
    }
    setLoading(true);

    try {
      const response = await fetch();
      // `${import.meta.env.VITE_FAST2SMS_BASE_URL}?authorization=${
      //   import.meta.env.VITE_FAST2SMS_AUTHORIZATION
      // }&route=otp&variables_values=${otp}&flash=0&numbers=${NUMBER}`
      const data = await response.json();
      if (data.status === "success") {
        setOtpSent(true);
        setVerificationId(data.verification_id);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  function verifyNumber() {
    const input = document.querySelector(".phone_input");
    const random_number = Math.floor(Math.random() * 9000) + 1000;
    if (/^[0-9]{10}$/.test(input.value)) {
      setLoading(true);
      setVerificationId(random_number);
      console.log(random_number);
      setOtpSent(true);
      setError(null);
      setLoading(false);
    } else {
      setError("Please enter a valid phone number");
    }
  }

  function verifyOtp() {
    setLoading(true);
    if (verificationId === parseInt(otp)) {
      console.log("you are logged in succesfully");
    }
    setLoading(false);
  }

  return (
    <div className="auth px-1 pt-4">
      <div>
        <h2 className="text-2xl">Sign In with Phone</h2>

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
              className="continue_btn w-[calc(100dvw-40px)] bg-[#307a59] text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
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
              className="w-[calc(100dvw-40px)] bg-[#307a59] text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
              onClick={verifyOtp}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default Auth;
