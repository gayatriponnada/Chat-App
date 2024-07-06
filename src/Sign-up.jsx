import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z]/, "Username must start with an uppercase letter"),
  email: z.string().email("Please enter the email"),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
      "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, number and special character"
    ),
});
const SignUp = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState(""); //success message
  const [errorMessage, setErrorMessage] = useState(""); //error message

  useEffect(() => {
    let timer;
    if (message || errorMessage) {
      timer = setTimeout(() => {
        setMessage("");
        setErrorMessage("");
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [message, errorMessage]);

  const submit = (users) => {
    console.log(users);
    axios
      .post(" http://localhost:3000/sign-up", users)
      .then((res) => {
        if (res.status == 201) {
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
        setMessage(res.data.message);
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <>
      <form
        className="w-[100vw] h-[100vh] flex justify-center items-center flex-col"
        type="submit"
        onSubmit={handleSubmit(submit)}
        method="post"
      >
        <div className="text-center ">
          {message && (
            <p className={`p-5 ${message ? "text-green-500" : ""}`}>
              {message}
            </p>
          )}
          {errorMessage && <p className="p-5 text-red-500">{errorMessage}</p>}
        </div>
        <div className="border-black border-2  w-1/3 h-auto rounded-md">
          <h3 className=" text-center p-5 text-xl font-bold">Sign Up</h3>
          <div className="p-5 flex gap-2 flex-col">
            <label>Username:</label>
            <input
              className={`p-3  focus:outline-none focus-within:border-2 w-full rounded ${
                errors.username ? "border-red-500" : " "
              }`}
              placeholder="Enter your name"
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <p className=" text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div className="p-5 flex gap-2 flex-col">
            <label>Email:</label>
            <input
              className={`p-3 focus:outline-none focus-within:border-2 w-4/5 rounded ${
                errors.email ? "border-red-500" : " "
              }`}
              placeholder="Enter your email"
              type="text"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="p-5 flex gap-2 flex-col">
            <label>Password:</label>
            <input
              className={`p-3 focus:outline-none focus-within:border-2 w-4/5 rounded ${
                errors.password ? "border-red-500" : " "
              }`}
              placeholder="Enter your password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className=" text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="p-5">
            <button
              type="submit"
              className="p-2 border-2 border-black w-full rounded-md bg-black text-white"
            >
              Create Account
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;
