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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <img className="h-10 w-auto" src={QuizzImg} alt="Your Logo" />
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
      </div>
    </nav>
  );
}

export default Navbar;
