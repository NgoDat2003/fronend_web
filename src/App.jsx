import React, { useEffect, useState } from 'react';
import { createBrowserRouter,RouterProvider, } from "react-router-dom";

import LayoutUser from './component/LayoutUser/LayoutUser';
import ErrorPage from './component/ErrorPage/ErrorPage';
import HomePage from './page/Home/HomePage';
import Product from './component/Product/Product';
import Login from './component/Login/Login';
import Register from './component/Register/Register';
import { callGetAccount } from './service/api';
import { useDispatch } from 'react-redux';
import { login } from './redux/UserSlice';
export default function App() {
  // const count = useSelector(selectCount);
  const dispatch = useDispatch();
  // const [incrementAmount, setIncrementAmount] = useState('2');

  // const incrementValue = Number(incrementAmount) || 0;
  const getAccount = async () => {
    let res = await callGetAccount();
    console.log(res);
    if (res && +res.EC === 0) {
      dispatch(login(res.DT));
    } 
  }
  useEffect(() => {
    getAccount()
  }, [dispatch]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutUser />,
      errorElement:<ErrorPage />,
      children:[
        {index:true,path: "/", element: <HomePage />},
        {path:"/product",element:<Product/>},
      ]
    },
    {
      path:"login",
      element:<Login />
    },
    {
      path:"register",
      element:<Register />
    }
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
