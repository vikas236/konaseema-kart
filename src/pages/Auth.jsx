import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

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
              className={`w-full outline-none border-b-2 border-gray-300 pb-2 mt-2 transition-all mb-7 text-lg pl-12 placeholder:text-gray-200`}
            />
            <div id="recaptcha-container"></div>
            <button
              disabled={loading}
              className="w-[calc(100dvw-40px)] bg-[#307a59] text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
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
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Auth;
