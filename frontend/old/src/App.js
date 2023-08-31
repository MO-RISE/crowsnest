import * as React from "react";
import { Admin, Resource } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserList, UserEdit, UserCreate } from "./users";
import { LoginPage } from "./login";
import authProvider from "./authProvider";
import UserIcon from "@mui/icons-material/Group";

const protocol =
  window.location.hostname === "localhost" ? "http://" : "https://";
const dataProvider = jsonServerProvider(
  protocol + window.location.hostname + "/auth/api"
);

const ReactAdmin = () => {
  return (
    <Admin
      basename='/admin'
      loginPage={<LoginPage admin />}
      dataProvider={dataProvider}
      authProvider={authProvider}
      requireAuth
    >
      <Resource
        name='users'
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
        icon={UserIcon}
      />{" "}
      : null
    </Admin>
  );
};

const App = () => (
  <BrowserRouter basename='/auth'>
    <Routes>
      <Route path='/admin/*' element={<ReactAdmin />} />
      <Route path='/auth' element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
