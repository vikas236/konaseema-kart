import React, { useState, useEffect } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  PhoneAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../core/firebaseconfig.js";

const Auth = ({ user, setUser }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser.phoneNumber.replace("+91", ""));
        // helpers.default.popoUpMessage("hi");
        navigate("/");
      } else navigate("/auth");
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved!");
          },
          "expired-callback": () => {
            console.error("reCAPTCHA expired. Please try again.");
          },
        }
      );
    }
  };

  const handlePhoneSignIn = async () => {
    const formattedPhoneNumber = phoneNumber.trim();
    if (!/^\d{10}$/.test(formattedPhoneNumber)) {
      return console.error("Enter a valid phone number(e.g., 1234512345)");
    }

    setLoading(true);
    setupRecaptcha();

    try {
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        "+91" + formattedPhoneNumber,
        window.recaptchaVerifier
      );
      setVerificationId(confirmationResult.verificationId);
      setOtpSent(true);
    } catch (err) {
      console.error(err.message, "sign in error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!otp.trim()) {
      return console.error("Please enter the OTP.");
    }

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      setOtp("");
    } catch (err) {
      console.error("OTP verification error:", err);

      // Handle specific Firebase error codes
      if (err.code === "auth/invalid-verification-code") {
        console.error("Invalid OTP. Please try again.");
      } else if (err.code === "auth/code-expired") {
        console.error("OTP has expired. Request a new one.");
      } else if (err.code === "auth/too-many-requests") {
        console.error("Too many attempts. Try again later.");
      } else {
        console.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  function Logout() {
    async function handleLogout() {
      try {
        await signOut(auth);
        setUser(null, "sign out");
        setOtpSent(false);
        setPhoneNumber("");
        setOtp("");
        setVerificationId(null);

        // 🛠️ FIX: Reset reCAPTCHA on logout to prevent old references
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (err) {
        console.error("Logout error:", err);
        console.error("Failed to log out.");
      }
    }

    return (
      <div>
        <h2>✅ Signed in with {user.phoneNumber}</h2>
        <button
          onClick={handleLogout}
          className="w-[calc(100dvw-40px)] bg-[#F2003C] text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
        >
          Logout
        </button>
      </div>
    );
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
              className={`w-full outline-none border-b-2 border-gray-300 pb-2 mt-2 transition-all mb-7 text-lg pl-12 placeholder:text-gray-200`}
            />
            <div id="recaptcha-container" className="hidden"></div>
            <button
              onClick={handlePhoneSignIn}
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
              onClick={handleVerifyCode}
              disabled={loading}
              className="w-[calc(100dvw-40px)] bg-[#307a59] text-white rounded-xl py-4 text-center fixed bottom-[20px] left-[20px]"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Auth;
