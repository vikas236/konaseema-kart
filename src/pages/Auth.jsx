import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
});

const Auth = () => {
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [verificationId, setVerificationId] = useState("");
  const [phoneNumberBackup, setPhoneNumberBackup] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged((user) => setUser(user));
    return () => {
      unsubscribe();
      firebase.auth().getUid(); // Revoke the access token when the user signs out
    };
  }, []);

  useEffect(() => {
    const phone = phoneNumber.replace(/\D+/g, "");
    if (/^[0-9]{3}-?[0-9]{3}-?[0-9]{4}$/.test(phone)) {
      setPhoneNumberBackup(phone);
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (!phoneNumberBackup || phoneNumberBackup.length < 10) {
      setPhoneNumberError(
        "Invalid phone number format. Please use XXX-XXX-XXXX."
      );
    } else {
      setPhoneNumberError(null);
    }
  }, [phoneNumberBackup]);

  const handlePhoneNumberInput = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handlePhoneSignIn = async () => {
    if (signInLoading || !phoneNumberBackup) return;
    setSignInLoading(true);
    try {
      const provider = new firebase.auth.PhoneAuthProvider();
      console.log(provider);
      const verificationId = await firebase
        .auth()
        .signInWithPhoneNumber(`+${phoneNumberBackup}`);
      setVerificationId(verificationId);
      setPhoneNumberBackup(`+9${phoneNumberBackup.slice(1)}`);
      setSignInLoading(false);
    } catch (error) {
      setError(error.message + "" + "sign in error");
      setSignInLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (signInLoading || !verificationId) return;
    setSignInLoading(true);
    try {
      const otpInput = document.getElementById("otp-input");
      const otpEntered = otpInput.value;
      await firebase.auth().signInWithCredential(verificationId, otpEntered);
      setUser(firebase.auth().currentUser);
      signinSuccess();
      setSignInLoading(false);
    } catch (error) {
      setError(error.message + " " + "verification error");
      setSignInLoading(false);
    }
  };

  const signinSuccess = () => {
    resetStates();
  };

  const resetStates = () => {
    setUser(null);
    setPhoneNumber("");
    setPhoneNumberError(null);
    setSignInLoading(false);
    setVerificationId("");
    setPhoneNumberBackup("");
    setCode("");
    setError(null);
  };

  const handleLogout = async () => {
    resetStates();
    try {
      await firebase.auth().signOut();
    } catch (error) {
      setError("You are not authenticated.");
    }
  };

  return (
    <div className="auth">
      {user ? (
        <div>
          <h2>Welcome {user.phoneNumber}</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Please Sign In</h2>
          <form id="phone-sign-in-form" style={{ display: "flex" }}>
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberInput}
              placeholder="Enter your phone number"
              style={{ width: "100%" }}
            />
          </form>
          <button
            type="button"
            onClick={handlePhoneSignIn}
            disabled={signInLoading}
            style={{ width: "100%" }}
          >
            {signInLoading ? "Signing In..." : "Sign In"}
          </button>
          <div
            id="otp-verify-form"
            style={{
              display: signInLoading ? "none" : "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <input
              type="number"
              id="otp-input"
              value={code}
              placeholder="Enter OTP"
              style={{ width: "100%" }}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={signInLoading}
              style={{ width: "100%" }}
            >
              {signInLoading ? "Verifying..." : "Verify"}
            </button>
            {phoneNumberError && (
              <p style={{ color: "red" }}>{phoneNumberError}</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
