import React, { useState } from "react";

const Wallet = ({ principal, balance, symbol, isAuthenticated, destroy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    console.log;
    setIsOpen(!isOpen);
  };
  if (isAuthenticated) {
    return (
      <div className="relative inline-block text-left">
          <button
            type="button"
            onClick={toggleDropdown}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            View Account
            <svg
              className="w-4 h-4 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isOpen && (
            <div
              id="dropdown-menu"
              className="absolute right-0 w-full top-full mt-2 py-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
              aria-labelledby="dropdown-button"
            >
              <div className="px-4 py-2 text-sm text-gray-700">
                <div className="flex items-center space-x-2">
                  <i className="bi bi-person-circle text-xl" />
                  <span className="font-mono">{`${principal.slice(0, 5)}...${principal.slice(-3)}`}</span>
                </div>
              </div>

              <div className="px-4 py-2 text-sm text-gray-700">
                <div className="flex items-center text-sm space-x-2">
                  <span>Balance: {balance}</span>
                  <span className="ml-1">{symbol}</span>
                </div>
              </div>

              <div className="border-t border-gray-200"></div>

              <button
                type="button"
                className="w-full px-4 py-2 text-sm text-gray-700 flex items-center space-x-2 hover:bg-gray-100"
                onClick={() => {
                  destroy();
                }}
              >
                <i className="bi bi-box-arrow-right text-xl" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
    );
  }

  return null;
};

export default Wallet;
