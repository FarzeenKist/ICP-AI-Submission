import React, { useState } from "react";
import QuestionCard from "./QuestionCard";

const QuizContainer = ({ quiz, updateAnswers, over, endQuiz, playAgain, answers }) => {
  return (
    <div className="p-8 lg:w-full mx-auto min-h-screen max-w-lg lg:max-w-lg xl:max-w-xl">
      {quiz.questions.map((question, index) => (
        <QuestionCard
          key={index}
          correctAnswer={question.correctAnswer}
          question={question.question}
          options={question.options}
          questionId={index}
          over={over}
          updateAnswers={updateAnswers}
          userAnswer={answers.find(answer => answer.id === index) || {}}
        />
      ))}
      <div className="max-w-md w-full flex justify-center">
        <button
          className="bg-red-500 mx-auto hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 active:scale-95"
          onClick={endQuiz}
        >
          End Quiz
        </button>
        {over && (
          <button
            className="bg-green-500 mx-auto hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
            onClick={() => {
              playAgain(false);
            }}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizContainer;
