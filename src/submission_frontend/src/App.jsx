import { useCallback, useEffect, useState } from "react";
import { submission_backend } from "declarations/submission_backend";
import Cover from "./components/utils/Cover";
import Loader from "./components/utils/Loader";
import { toast } from "react-toastify";
import {
  NotificationError,
  NotificationSuccess,
  Notification,
} from "./components/utils/Notifications";
import QuizContainer from "./components/quiz/QuizContainer";
import QuizForm from "./components/quiz/QuizForm";
import { generateQuiz } from "./utils/quiz";
import { getAccount as fetchAccount, createQuiz as saveQuiz, submitAnswers } from "./utils/quizCanister";
import { login, logout as destroy } from "./utils/auth";
import Navbar from "./components/ui/Navbar";

const parsedMockQuiz = [
  {
    question: "What is the capital of France?",
    options: [
      { id: "a", text: "Berlin" },
      { id: "b", text: "Madrid" },
      { id: "c", text: "Paris" },
      { id: "d", text: "Rome" },
    ],
    correctAnswer: "c",
  },
  {
    question: "Which element has the atomic number 1?",
    options: [
      { id: "a", text: "Helium" },
      { id: "b", text: "Hydrogen" },
      { id: "c", text: "Oxygen" },
      { id: "d", text: "Nitrogen" },
    ],
    correctAnswer: "b",
  },
  {
    question: "Who wrote 'Pride and Prejudice'?",
    options: [
      { id: "a", text: "Charles Dickens" },
      { id: "b", text: "Emily Bronte" },
      { id: "c", text: "Jane Austen" },
      { id: "d", text: "Mark Twain" },
    ],
    correctAnswer: "c",
  },
  {
    question: "What is the largest planet in the solar system?",
    options: [
      { id: "a", text: "Earth" },
      { id: "b", text: "Mars" },
      { id: "c", text: "Jupiter" },
      { id: "d", text: "Venus" },
    ],
    correctAnswer: "c",
  },
  {
    question: "What year did World War II end?",
    options: [
      { id: "a", text: "1942" },
      { id: "b", text: "1945" },
      { id: "c", text: "1939" },
      { id: "d", text: "1944" },
    ],
    correctAnswer: "b",
  },
];
function App() {
  const [quiz, setQuiz] = useState();
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(window.auth?.isAuthenticated);
  const [answers, setAnswers] = useState([]);

  const getAccount = useCallback(async () => {
    try {
      setAccount(await fetchAccount());
    } catch (error) {
      console.log({ error });
    }
  });
  const createQuiz = async (quizConfiguration) => {
    try {
      // setLoading(true);
      // const quizResponse = await generateQuiz(
      //   quizConfiguration.topic,
      //   quizConfiguration.difficulty,
      //   quizConfiguration.questionsAmount
      // );
      const quizResponse = parsedMockQuiz;
      const quiz = await saveQuiz(quizResponse);
      console.log(quiz);
      setQuiz(quiz.Ok);
      setPlaying(true);
      toast(<NotificationSuccess text="Quiz has been generated." />);
    } catch (error) {
      console.log({ error });
      toast(
        <NotificationError text={`Failed to create quiz. ${error.message}`} />
      );
    } finally {
      setLoading(false);
    }
  };
  const endQuiz = async () => {
    try {
      if (answers.length !== quiz.length) {
        toast.warn(
          "All questions needs to be answered before you can end the quiz.",
          {
            className: "bg-[#e0ebeb] text-[#2c3e50] p-4 rounded-lg shadow-lg",
          }
        );
        return;
      }
      if (quiz.over) {
        toast.warn("Quiz has already ended.", {
          className: "bg-[#e0ebeb] text-[#2c3e50] p-4 rounded-lg shadow-lg",
        });
        return;
      }
      setLoading(true);
      const response = await submitAnswers(quiz.id, answers);
      if (response.Err) {
        console.log(response.Err);
        toast(
          <NotificationError text={`Failed to end quiz. ${response.Err}`} />
        );
        return;
      }
      setQuiz(response.Ok);
      toast(
        <NotificationSuccess
          text={`Quiz has ended. You have successfully answered ${numCorrectAnswers} out of ${quiz.length} questions.`}
        />
      );
    } catch (error) {
      console.log({ error });
      toast(
        <NotificationError text={`Failed to end quiz. ${error.message}`} />
      );
    } finally {
      setLoading(false);
    }
  };

  const updateAnswers = (questionId, selectedOption) => {
    console.log(questionId, selectedOption);
    const exists = answers.findIndex((answer) => answer.id === questionId);
    console.log("exists", exists);
    console.log(answers);
    if (exists > -1) {
      setAnswers((prevAnswers) =>
        prevAnswers.map((answer) =>
          answer.id === questionId
            ? { ...answer, answer: selectedOption }
            : answer
        )
      );
    } else {
      setAnswers((prevAnswers) => [
        ...prevAnswers,
        { id: questionId, answer: selectedOption },
      ]);
    }
  };

  useEffect(() => {
    console.log("Answers updated:", answers);
  }, [answers]);

  useEffect(() => {
    getAccount()
  }, [quiz])

  return (
    <main className="bg-[#f5f5dc]">
      <Notification />
      {!loading && isLoggedIn ? (
        <Navbar
          principal={window.auth.principalText}
          balance={100}
          symbol={"ICP"}
          isAuthenticated={isLoggedIn}
          destroy={destroy}
        />
      ) : (
        ""
      )}
      {/* If not loading, check if the user is logged in */}
      {!loading ? (
        isLoggedIn ? (
          // If logged in, check if the user is playing
          playing ? (
            <QuizContainer
              quiz={quiz}
              over={quiz.over}
              updateAnswers={updateAnswers}
              endQuiz={endQuiz}
            /> // Render the quiz if playing
          ) : (
            <QuizForm createQuiz={createQuiz} /> // Render the form if not playing
          )
        ) : (
          // Render the login cover if not logged in
          <Cover title={"Quiz AI"} login={login} />
        )
      ) : (
        // Show loader if still loading
        <Loader />
      )}
    </main>
  );
}

export default App;
