import axios from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/,
      "Password must be at least 8 characters and contain an uppercase letter, lowercase letter, and number"
    ),
});

const Login = () => {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const submit = (data) => {
    axios
      .post("http://localhost:3000/login", data)
      .then((res) => {
        setMessage(res.data.message);
        Cookies.set("token", res.data.token);
        if (res.status == 200) {
          setTimeout(() => {
            navigate("/");
          }, 3000);
        }
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    if (message || errorMessage) {
      setTimeout(() => {
        setMessage("");
        setErrorMessage("");
      }, 3000);
    }
  }, [message, errorMessage]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  return (
    <>
      <form
        className="w-[100vw] h-[100vh] flex justify-center items-center flex-col"
        onSubmit={handleSubmit(submit)}
        method="post"
      >
        <div className="text-center">
          {message && (
            <p className={`p-5 ${message ? "text-green-500" : ""}`}>
              {message}
            </p>
          )}
          <div>
            {errorMessage && (
              <p className={`p-5 ${errorMessage ? "text-green-500" : ""}`}>
                {errorMessage}
              </p>
            )}
          </div>
        </div>
        <div className="border-black border-2  w-1/3 h-auto rounded-md">
          <h3 className=" text-center p-5 text-xl font-bold">Login</h3>
          <div className="p-5 flex gap-2 flex-col">
            <label>Email:</label>
            <input
              className={`p-3  focus:outline-none rounded-md focus-within:border-2 ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
              type="text"
              name="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="w-1/2 text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="p-5 flex gap-2 flex-col">
            <label>Password:</label>
            <input
              className={`p-3  focus:outline-none rounded-md focus-within:border-2 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder="Enter your email"
              type="password"
              name="password"
              {...register("password")}
            />
            {errors.password && (
              <p className=" text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>
          <div className="p-5">
            <button className="p-2 border-2 border-black w-full rounded-md bg-black text-white">
              Login
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
