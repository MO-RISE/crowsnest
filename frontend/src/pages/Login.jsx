import React from "react";
import { useNavigate } from "react-router-dom";

const protocol =
  window.location.hostname === "localhost" ? "http://" : "https://";

function validateString(input, variable) {
  if (typeof input !== "string") {
    throw new Error(variable + " is not a string.");
  }
  if (input === "") {
    throw new Error(variable + " is empty.");
  }
  if (input.trim() === "") {
    throw new Error(variable + "is whitespace only.");
  }
  return null;
}

export async function login(username, password) {
  validateString(username, "Username");
  validateString(password, "Password");
  const request = new Request(
    protocol + window.location.hostname + "/auth/api/login",
    {
      method: "POST",
      credentials: "include",
      body:
        "username=" +
        username +
        "&password=" +
        password +
        "&grant_type=password",
      headers: new Headers({
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      }),
    }
  );
  const response = await fetch(request);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail);
  }
  return response;
}

export default function Login() {
  let navigate = useNavigate();
  let params = new URLSearchParams(window.location.search);
  let from = params.get("from") || "/";

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      return navigate(from);
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            Sign in
          </h2>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className='mt-8 space-y-6'>
          <div className='rounded-md shadow-sm -space-y-px'>
            <div>
              <label htmlFor='username' className='sr-only'>
                Username
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Username'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Password
              </label>
              <input
                id='password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                placeholder='Password'
              />
            </div>
          </div>

          <div>
            <button
              onClick={() => handleLogin(username, password)}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              Login
            </button>
          </div>
        </form>
        <p className='text-center text-red-500 mt-4'>{message}</p>
      </div>
    </div>
  );
}
