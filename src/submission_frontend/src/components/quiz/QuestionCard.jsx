import React, { useState } from "react";

function QuestionCard({ question, options, correctAnswer, questionId, over, updateAnswers, userAnswer }) {
  const [selectedOption, setSelectedOption] = useState(userAnswer.answer || "");
  const handleOnClick = (e, option) => {
    if (over) {
      return;
    }
    setSelectedOption(option.id)
    updateAnswers(questionId, option.id)
  };
  const renderOptions = () => {
    return (
      <ul className="space-y-3">
        {options.map((option) => (
          <li
            key={`question-${questionId}-${option.id}`}
            className={`text-sm p-3 border rounded-lg cursor-pointer shadow-md transition-transform duration-300 ease-in-out
              ${
                // If the quiz is over and this option is the correct answer, highlight it in green. If the quiz is still ongoing and the option is selected, highlight it in blue
                over && correctAnswer === option.id
                  ? "border-green-500 bg-green-100"
                  : selectedOption === option.id
                  ? "border-blue-300 bg-blue-100 transform scale-105"
                  : ""
              }
              ${
                // If the quiz is over and the selected option was incorrect, highlight it in red to indicate to the user that their answer for this option is wrong.
                over &&
                selectedOption === option.id &&
                selectedOption !== correctAnswer
                  ? "border-red-500 bg-red-100"
                  : ""
              }
            `}
            onClick={(e) => handleOnClick(e, option)}
          >
            {option.id}) {option.text}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-5 max-w-md w-full">
      <h3 className="text-lg font-semibold mb-3 break-words">
        {questionId + 1}. {question}
      </h3>
      {renderOptions()}
    </div>
  );
}

export default QuestionCard;
