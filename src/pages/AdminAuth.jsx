import { useNavigate } from "react-router-dom";
import helpers from "../core/helpers";

function AdminAuth() {
  const navigate = useNavigate();

  function handleInput() {
    const input = document.querySelector(".admin_auth input");
    console.log(input.value);

    if (input.value == "kk admin") {
      localStorage.setItem("kk_admin_user", "in");
      navigate("/admin");
      helpers.popUpMessage("Login Successfull", "success");
    } else helpers.popUpMessage("Wrong Credentials", "error");
  }

  return (
    <div className="admin_auth w-dvw h-dvh flex flex-col items-center justify-center p-4 relative">
      <label
        htmlFor="admin_user"
        className="w-[calc(100dvw-30px)] text-xl mb-3 -mt-5 font-semibold text-gray-400"
      >
        Admin Username
      </label>
      <input
        id="admin_user"
        type="text"
        className="w-[calc(100dvw-30px)] border outline-hidden rounded-md px-2 py-3"
        autoFocus
      />
      <button
        onClick={handleInput}
        className={`w-[calc(100dvw-30px)] text-white bg-primary rounded-lg py-3 text-lg active:opacity-90 
            transition-all absolute bottom-[10px]`}
      >
        Login
      </button>
    </div>
  );
}

export default AdminAuth;
