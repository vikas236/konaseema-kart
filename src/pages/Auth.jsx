import React, { useState, useEffect } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
  signOut,
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { app } from "../core/firebaseconfig"; // Ensure Firebase is initialized properly

const auth = getAuth(app);

const Auth = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  if (user) console.log(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
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
    setError(null);
    const formattedPhoneNumber = phoneNumber.trim();
    if (!/^\d{10}$/.test(formattedPhoneNumber)) {
      return setError("Enter a valid phone number(e.g., 1234512345)");
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError(null);
    if (!otp.trim()) {
      return setError("Please enter the OTP.");
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
        setError("Invalid OTP. Please try again.");
      } else if (err.code === "auth/code-expired") {
        setError("OTP has expired. Request a new one.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many attempts. Try again later.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  async function handleLogout() {
    try {
      await signOut(auth);
      setUser(null);
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
      setError("Failed to log out.");
    }
  }

  return (
    <div className="auth">
      {user ? (
        <div>
          <h2>✅ Signed in with {user.phoneNumber}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Sign In with Phone</h2>

          {!otpSent ? (
            <>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone (e.g., 1234512345)"
                autoFocus={true}
              />
              <div id="recaptcha-container"></div>
              <button onClick={handlePhoneSignIn} disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <button onClick={handleVerifyCode} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Auth;
