import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photo, setPhoto] = useState(
    localStorage.getItem("photo") ? localStorage.getItem("photo") : ""
  );
  const [name, setName] = useState(localStorage.getItem("kk_name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("kk_phone") || "");
  const [address, setAddress] = useState(
    localStorage.getItem("kk_address") || ""
  );

  function PersonalInfo() {
    // Define the InputForm component
    function InputForm() {
      function handleSubmit(e) {
        e.preventDefault();

        /^[A-Za-z]{2,}$/.test(name)
          ? localStorage.setItem("name", name)
          : setError("Name must be at least 2 characters long");

        /^(\+?\d{1,3}[-.\s]?)?\d{10}$/.test(phone)
          ? localStorage.setItem("phone", phone)
          : setError("phone number is not valid");

        /^[A-Za-z]{5,}$/.test(address)
          ? localStorage.setItem("address", address)
          : setError("Address must be at least 5 characters long");

        if (error === null) {
          setIsEditing(false);
        }
      }

      return (
        <div>
          {/* <div className="mt-5 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="profile_image"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="profile_image"
              type="file"
              placeholder="Your Name"
              onChange={(e) => setPhoto(e.target.value)}
              value={photo}
              autoFocus={true}
            />
          </div> */}
          <div className="mt-5 mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Your Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoFocus={true}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="phone"
              type="text"
              placeholder="Your Phone"
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
              autoFocus={true}
            />
          </div>
          <div>
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="address"
            >
              Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              type="text"
              placeholder="Your Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              autoFocus={true}
            />
          </div>
          <span className="block mb-4 text-xs text-red-400">
            {error ? error : ""}
          </span>
          <button
            className="bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleSubmit}
          >
            Save Changes
          </button>
        </div>
      );
    }

    // Define the PersonalDetailsBox component
    function PersonalDetailsBox() {
      return (
        <div className="mt-14 relative">
          <div className="w-full flex justify-between absolute top-[-35px]">
            <span className="">Personal Details</span>
          </div>
          <div className="mt-2 shadow-md p-4 rounded-2xl border border-gray-200 flex gap-3">
            {/* <img
              src=""
              alt=""
              className="w-22 h-16 rounded-md border border-gray-300"
            /> */}
            <div className="content flex flex-col w-full">
              <h3 className="text-sm font-semibold">Your Name</h3>
              <span className="email text-xs text-gray-400 pt-1">
                {phone ? phone : "Your Phone"}
              </span>
              <hr className="border-0 border-b-1 border-b-gray-300 w-full pt-1" />
              <span className="email text-xs text-gray-400 pt-1">
                {address ? address : "Your Address"}
              </span>
            </div>
          </div>
        </div>
      );
    }

    return isEditing ? <InputForm /> : <PersonalDetailsBox />;
  }

  return (
    <div className="profile">
      <h1 className="text-2xl font-semibold ml-3">My profile</h1>
      {/* personal details */}
      <PersonalInfo />
      {/* orders button */}
      <Link
        to="/orders"
        className="border mt-4 p-3 pl-4 rounded-xl border-gray-300 shadow-md text-sm flex justify-between items-center font-semibold"
      >
        Orders<i className="bx bx-chevron-right text-2xl"></i>
      </Link>
      <h2 className="border mt-4 p-3 pl-4 rounded-xl border-gray-300 shadow-md text-sm flex justify-between items-center font-semibold">
        Help<i className="bx bx-chevron-right text-2xl"></i>
      </h2>
    </div>
  );
}

export default Profile;
