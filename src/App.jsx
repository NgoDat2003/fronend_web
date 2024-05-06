import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LayoutUser from "./component/LayoutUser/LayoutUser";
import ErrorPage from "./component/ErrorPage/ErrorPage";
import HomePage from "./page/Home/HomePage";
import Product from "./page/Product/Product";
import Login from "./page/Login/Login";
import Register from "./page/Register/Register";
import { callGetAccount } from "./service/api";
import { useDispatch } from "react-redux";
import { login, loginFail } from "./redux/UserSlice";
import Profile from "./page/Profile/Profile";
import LayoutAdmin from "./component/LayoutAdmin/LayoutAdmin";
import "./App.scss";
import CategoryPage from "./page/Caterory/CategoryPage";
import CartPage from "./page/Cart/CartPage";
import CartManager from "./page/CartManager/CartManager";
export default function App() {
  // const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const getAccount = async () => {
    let res = await callGetAccount();
    if (res && +res.EC === 0) {
      dispatch(login(res.DT));
    } else {
      dispatch(loginFail());
    }
  };
  useEffect(() => {
    getAccount();
  }, [dispatch]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutUser />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, path: "/", element: <HomePage /> },
        { path: "/product/:id", element: <Product /> },
        { path: "/profile", element: <Profile /> },
        { path: "/category/:id", element: <CategoryPage /> },
        { path: "/cart", element: <CartPage /> },
        { path: "/cartManager", element: <CartManager /> },
      ],
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
    },
  ]);
  return (
    <div className="container">
      <RouterProvider router={router} />
    </div>
  );
}
