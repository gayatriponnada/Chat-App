import axios from "axios";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { io } from "socket.io-client";
import { CircleUserRound } from "lucide-react";
import Chat from "./Chat";
import Profile from "./Profile";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState();
  const [receiving, setReceiving] = useState();
  const [socket, setSocket] = useState();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const getDetails = useCallback(() => {
    const token = Cookies.get("token");
    axios
      .get("http://localhost:3000/all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users);
        setSender(response.data.user);
      })

      .catch(() => {
        navigate("/login");
      });
    console.log(users);
  }, [setUsers, navigate]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect", () => {
      console.log("server connected");
    });
    setSocket(socket);
  }, []);

  const join = useCallback(
    (sender, receiver) => {
      socket.emit("join-room", sender, receiver);
      setReceiving(receiver);
      setShow(true);
    },
    [socket]
  );

  return (
    <>
      {!show && (
        <div className="flex gap-2 flex-col  p-2  max-w-3xl mx-auto">
          <h2 className="font-bold text-center text-2xl cursor-pointer  text-blue-500  hover:tracking-[1rem] translate hover:scale-x-150  transition ease-out duration-150   ">
            Talk Zone
          </h2>
          <div className="flex justify-end ">
            {sender && (
              <Profile sender={sender.username} senderGender={sender.gender} />
            )}
          </div>
          {users.length > 0 && (
            <div className="p-3 ">
              <ul className="flex  flex-col   gap-5 border-2 border-slate-200 rounded-md">
                {users.map((user) => {
                  return (
                    <div className="flex justify-start px-5" key={user.email}>
                      <button
                        className="rounded-md p-1 w-10"
                        onClick={() => {
                          join(sender.username, user.username);
                        }}
                      >
                        <li className="flex gap-2 hover:text-blue-300  ">
                          {user.gender === "female" ? (
                            <img
                              src="/lib/images/users-image.png"
                              className="size-9 rounded-full"
                            />
                          ) : (
                            <img
                              src="/lib/images/user-image.jpeg"
                              className="size-9"
                            />
                          )}
                          {user.username}
                        </li>
                      </button>
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
      {show && (
        <Chat
          sender={sender.username}
          receiver={receiving}
          socket={socket}
          setShow={setShow}
        />
      )}
    </>
  );
};

export default Home;
