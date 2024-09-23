import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => (
    <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
    />
);

const NotificationSuccess = ({ text }) => (
    <div className="flex items-center p-4 bg-green-100 text-green-800 border border-green-200 rounded-lg shadow-md">
        <i className="bi bi-check-circle-fill text-green-500 mx-2" />
        <span className="text-green-800 mx-1">{text}</span>
    </div>
);


const NotificationError = ({ text }) => (
    <div className="flex items-center p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg shadow-md">
        <i className="bi bi-x-circle-fill text-red-500 mx-2" />
        <span className="text-red-800 mx-1">{text}</span>
    </div>
);


export { Notification, NotificationSuccess, NotificationError };