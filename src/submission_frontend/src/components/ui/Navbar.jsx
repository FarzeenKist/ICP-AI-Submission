import React from "react";
import Wallet from "./Wallet";

import QuizzImg from "../../assets/Quiz.png"
function Navbar({
  principal,
  balance,
  symbol,
  isAuthenticated,
  destroy,
}) {
  return (
    <nav className="bg-[#f5f5dc] shadow-lg">
      <div className="mx-auto flex justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-10 w-auto lg:h-20" src={QuizzImg} alt="Your Logo" />
          </div>
        </div>
        <div className="flex items-center">
            <Wallet
              principal={principal}
              balance={balance}
              symbol={symbol}
              isAuthenticated={isAuthenticated}
              destroy={destroy}
            />
          </div>
      </div>
    </nav>
  );
}

export default Navbar;
