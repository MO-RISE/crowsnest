import React from "react";
import Login from "./Login";
import { Admin as ReactAdmin, Resource } from "react-admin";
import authProvider from "./authProvider";
import jsonServerProvider from "ra-data-json-server";
import { UserList, UserEdit, UserCreate } from "./users";

const protocol =
  window.location.hostname === "localhost" ? "http://" : "https://";
const dataProvider = jsonServerProvider(
  protocol + window.location.hostname + "/auth/api"
);

export default function Admin() {
  return (
    <ReactAdmin
      basename='/admin'
      loginPage={<Login />}
      dataProvider={dataProvider}
      authProvider={authProvider}
      requireAuth
    >
      <Resource
        name='users'
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />{" "}
      : null
    </ReactAdmin>
  );
}
