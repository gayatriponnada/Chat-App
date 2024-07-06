import React, { useCallback, useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react";

const Chat = ({ socket, sender, receiver, setShow }) => {
  const [messages, setMessages] = useState([]); // to store all previous messages
  const [input, setInput] = useState("");

  useEffect(() => {
    const roomId = [sender, receiver].sort().join("-");
    const result = localStorage.getItem(roomId);
    console.log("print...");
    console.log(JSON.parse(result));
    if (result) {
      setMessages(JSON.parse(result));
    }
    socket.on("message-received", (message) => {
      setMessages((prevMessages) => {
        const messages = [...prevMessages, message];
        localStorage.setItem(roomId, JSON.stringify(messages));
        console.log(messages);
        return messages;
      });
    });
  }, [sender, receiver]);

  const send = useCallback(
    (input) => {
      const roomId = [sender, receiver].sort().join("-");
      console.log(input);
      const currentTime = new Date().toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      socket.emit("message-sent", {
        input,
        sender,
        receiver,
        time: [currentTime],
      });
      setMessages((prev) => {
        const messages = [
          ...prev,
          { input, sender, receiver, time: [currentTime] },
        ];
        localStorage.setItem(roomId, JSON.stringify(messages));
        return messages;
      });
      setInput("");
    },
    [socket, sender, receiver]
  );

  return (
    <main className="max-w-3xl mx-auto">
      <div className="text-black">
        <div>
          <header className="bg-black/10  h-12 rounded-md flex items-center px-2 ">
            <button
              className="font-semibold  flex items-center "
              onClick={() => setShow(false)}
            >
              <ChevronLeft className=" size-4" />
              <span className="text-xl"> {receiver}</span>
            </button>
          </header>

          <div className="flex flex-col mt-3 gap-3">
            {messages.map(({ input, sender: me, time }) => {
              return (
                <div>
                  <div
                    className={`flex px-2 ${
                      sender == me ? "justify-end" : "justify-start"
                    }`}
                  >
                    {sender === me ? (
                      <div className=" p-2 rounded-t-md rounded-bl-md bg-blue-500 max-w-[50vw] text-white font-mono font-light">
                        <div>{input}</div>
                        <div className="text-xs">{time}</div>
                      </div>
                    ) : (
                      <div className=" p-2  rounded-t-md rounded-br-md max-w-[50vw] bg-zinc-300  text-black font-mono font-light">
                        <div>{input}</div>
                        <div className="text-xs">{time}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex w-1/2 justify-between rounded-md p-2 border-2 border-blue-300 absolute bottom-10">
          <input
            className="p-2 focus:outline-none w-full "
            type="text"
            placeholder="Start your gossip here!!!"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <button
            className="p-2 bg-blue-500 rounded-md text-white"
            onClick={() => {
              send(input);
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default Chat;
