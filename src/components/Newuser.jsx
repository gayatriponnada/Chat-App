const Newuser = ({ newUser, setNewUser, loggedIn }) => {
  return (
    <div className="flex justify-center items-center flex-col gap-2 p-3">
      <h2 className="font-bold">Enter Username</h2>
      <input
        className="p-3 "
        type="text"
        placeholder="Enter Username"
        value={newUser}
        onChange={(e) => {
          setNewUser(e.target.value);
        }}
      />
      <button
        className="bg-green-500 text-white w-20 p-2 rounded-md"
        onClick={loggedIn}
      >
        Join
      </button>
    </div>
  );
};

export default Newuser;
