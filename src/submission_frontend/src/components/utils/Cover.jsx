import React from "react";
// import PropTypes from "prop-types";
// import { Button } from "react-bootstrap";
import QuizzImg from "../../../src/assets/Quiz.png"
const Cover = ({ title, login }) => {
  if ((title, login)) {
    return (
      <div
        className="flex justify-center flex-col text-center min-h-[100vh]"
      >
        <div className="mt-auto text-[#5c504f] mb-5">
          <div
            className="aspect-square mx-auto my-0 max-w-[320px]"
            
          >
            <img src={QuizzImg} />
          </div>
          <h1 className="text-3xl mb-3">Welcome to {title}</h1>
          <p className="text-lg">Please connect your wallet to continue.</p>
          <button
            onClick={login}
            className="px-6 py-2 my-6 bg-[#c5a880] hover:bg-[#cbad84] text-white rounded-lg"
          >
            Connect Wallet
          </button>
        </div>
        <p className="mt-auto text-md mb-2">Powered by Internet Computer</p>
      </div>
    );
  }
  return null;
};

// Cover.propTypes = {
//   title: PropTypes.string,
// };

// Cover.defaultProps = {
//   title: "",
// };

export default Cover;