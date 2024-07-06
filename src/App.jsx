import { useState } from "react";
import Newuser from "./components/Newuser";
import Chat from "./Chat";

const App = () => {
  const [newUser, setNewUser] = useState("");
  const [user, setUser] = useState("");

  const loggedIn = () => {
    setUser(newUser);
  };
  return (
    <>
      {user && <div>Logged in as {user}</div>}
      {!user && (
        <Newuser
          newUser={newUser}
          setNewUser={setNewUser}
          loggedIn={loggedIn}
        />
      )}
    </>
  );
};

export default App;
