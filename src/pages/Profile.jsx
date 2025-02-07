import { useState, useEffect } from "react";

function Profile() {
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const savedPhone = localStorage.getItem("kk_user_phone");
    if (savedPhone) {
      setPhone(savedPhone);
    }
  }, []);

  function handlePhoneChange(e) {
    const value = e.target.value.replace(/\D/g, ""); // Only allow numbers
    setPhone(value);
  }

  function savePhone() {
    if (phone.length >= 10) {
      localStorage.setItem("kk_user_phone", phone);
      alert("Phone number saved!");
    } else {
      alert("Enter a valid phone number.");
    }
  }

  return (
    <div className="profile max-w-md mx-auto mt-10 p-5 bg-white border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-semibold mb-5 text-center">Profile</h1>

      <label className="block text-gray-600 mb-2">Phone Number:</label>
      <input
        type="tel"
        value={phone}
        onChange={handlePhoneChange}
        maxLength="10"
        placeholder="Enter phone number"
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#307a59]"
      />

      <button
        onClick={savePhone}
        className="mt-4 w-full bg-[#307a59] text-white py-2 rounded-md hover:bg-[#255c44] transition"
      >
        Save
      </button>
    </div>
  );
}

export default Profile;
