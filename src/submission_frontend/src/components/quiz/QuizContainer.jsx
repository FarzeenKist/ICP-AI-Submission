import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

const QuizContainer = ({ quiz, updateAnswers, over, endQuiz }) => {
  return (
    <div className="p-8 lg:w-full mx-auto min-h-screen max-w-lg lg:max-w-lg xl:max-w-xl">
      {quiz.questions.map((quiz, index) => (
        <QuestionCard
          key={index} // Using index as key for simplicity; ideally, use a unique ID
          correctAnswer={quiz.correctAnswer}
          question={quiz.question}
          options={quiz.options}
          questionId={index}
          over={over}
          updateAnswers={updateAnswers}
        />
      ))}
      <div className="max-w-md w-full flex justify-center">
        <button
          className="bg-red-500 mx-auto hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 active:scale-95"
          onClick={endQuiz}
        >
          End Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizContainer;
