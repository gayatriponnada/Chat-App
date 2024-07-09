import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Profile = ({ sender, senderGender }) => {
  const [profileShow, setProfileShow] = useState(false);
  const navigate = useNavigate();
  const logout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
  console.log(senderGender);
  console.log(sender);
  const profileClick = () => {
    setProfileShow(!profileShow);
  };
  return (
    <>
      <div
        className="flex flex-col gap-5 relative right-2"
        onClick={profileClick}
      >
        {senderGender === "female" ? (
          <img
            src="/lib/images/users-image.png"
            className="size-9 rounded-full cursor-pointer"
          />
        ) : (
          <img
            src="/lib/images/user-image.jpeg"
            className="size-9 cursor-pointer"
          />
        )}
        {profileShow && (
          <div className=" absolute top-12 right-[1px] flex flex-col border-2 border-slate-300 bg-white p-3 rounded-md shadow-md z-[5rem]">
            <div>{sender}</div>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
