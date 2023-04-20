import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import './index.css';
import reportWebVitals from './reportWebVitals';

import App from './App';
import ListPage from './ListPage';
import Train from './Train';
import Config from './Config';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/stations/:stationId",
        element: <ListPage />,
    },
    {
        path: "/trains/:trainId",
        element: <Train />,
    },
    {
        path: "/config/:work/:home",
        element: <Config />,
    }
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
