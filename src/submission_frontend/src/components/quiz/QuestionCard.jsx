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
                over && correctAnswer === option.id
                  ? "border-green-500 bg-green-100" // Apply this only once for correct answer
                  : selectedOption === option.id
                  ? "border-blue-300 bg-blue-100 transform scale-105"
                  : ""
              }
              ${
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
