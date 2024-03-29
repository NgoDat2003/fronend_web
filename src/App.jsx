import React, { useState } from 'react';
import { createBrowserRouter,RouterProvider, } from "react-router-dom";

import LayoutUser from './component/LayoutUser/LayoutUser';
import ErrorPage from './component/ErrorPage/ErrorPage';
import HomePage from './page/Home/HomePage';
import Product from './component/Product/Product';

export default function App() {
  // const count = useSelector(selectCount);
  // const dispatch = useDispatch();
  // const [incrementAmount, setIncrementAmount] = useState('2');

  // const incrementValue = Number(incrementAmount) || 0;
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
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
