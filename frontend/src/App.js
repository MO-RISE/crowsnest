import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  Outlet,
  useRouteLoaderData,
} from "react-router-dom";

import Login from "./pages/Login";
import Monitor from "./pages/Monitor";
import Admin from "./pages/Admin";
import Topbar from "./components/Topbar";
import Error from "./pages/Error";

function getToken() {
  const name = "crowsnest-auth-access";
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}

async function getUser() {
  const protocol =
    window.location.hostname === "localhost" ? "http://" : "https://";
  const request = new Request(
    protocol + window.location.hostname + "/auth/api/me",
    {
      credentials: "include",
      headers: { Accept: "application/json" },
    }
  );
  const response = await fetch(request);
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.detail);
  }
  return response;
}

async function protectedLoader({ request }) {
  const token = getToken();
  if (!token) {
    let params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }
  try {
    return await getUser();
  } catch (error) {
    throw Error(error);
  }
}

function Layout() {
  let user = useRouteLoaderData("root");
  return (
    <div>
      <Topbar user={user} />
      <Outlet />
    </div>
  );
}

const router = createBrowserRouter([
  {
    id: "root",
    path: "/",
    loader: protectedLoader,
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Monitor />,
      },
      {
        path: "/ecdis",
        element: <Monitor />,
      },
    ],
    errorElement: <Error />,
  },
  {
    id: "login",
    path: "/login",
    element: <Login />,
  },
  {
    id: "admin",
    path: "/admin/*",
    element: <Admin />,
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}
