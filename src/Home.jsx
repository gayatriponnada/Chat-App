import axios from "axios";
import Cookies from "js-cookie";
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Chat from "./Chat";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [sender, setSender] = useState();
  const [receiving, setReceiving] = useState();
  const [socket, setSocket] = useState();

  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("token");
    navigate("/login");
  };
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
        <div className="flex gap-2 flex-col p-2">
          {users.length > 0 && (
            <div className="p-3 ">
              <ul className="flex  flex-col w-1/2 gap-5">
                {users.map((user) => {
                  return (
                    <div className="flex justify-between" key={user.email}>
                      <button
                        className="rounded-md p-1"
                        onClick={() => {
                          join(sender.username, user.username);
                        }}
                      >
                        <li>
                          name:{user.username}, email:{user.email}
                        </li>
                      </button>
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
          <button
            className="bg-black text-white rounded-md p-2 w-24"
            onClick={logout}
          >
            Logout
          </button>
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
