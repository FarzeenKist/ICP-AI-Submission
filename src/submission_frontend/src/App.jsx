import { useCallback, useEffect, useState } from "react";
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
import {
  getAccount,
  hasAccount,
  createAccount,
  createQuiz as saveQuiz,
  submitAnswers,
} from "./utils/quizCanister";
import { login, logout as destroy } from "./utils/auth";
import Navbar from "./components/ui/Navbar";
import { balance as fetchBalance } from "./utils/ledger";

function App() {
  const [quiz, setQuiz] = useState();
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(window.auth.isAuthenticated);
  const [answers, setAnswers] = useState([]);
  const [balance, setBalance] = useState("0");

  const testing = false;

  // Function to get the user's balance if they are logged in
  const getBalance = useCallback(async () => {
    if (isLoggedIn) {
      setBalance(await fetchBalance());
    }
  });

  // Function to create a quiz based on user-provided configuration
  // It generates a quiz, saves it, and sets the playing state to true
  // Displays success or error notifications depending on the result
  // Finally, loading state is reset after operation
  const createQuiz = async (quizConfiguration) => {
    try {
      setLoading(true);
      const quizResponse = await generateQuiz(
        testing,
        quizConfiguration.topic,
        quizConfiguration.difficulty,
        quizConfiguration.questionsAmount
      );
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

  // Function to end the quiz
  const endQuiz = async () => {
    try {
      // Display a warning notification if not all the questions have been answered
      if (answers.length !== quiz.questions.length) {
        toast.warn(
          "All questions needs to be answered before you can end the quiz.",
          {
            className: "bg-[#e0ebeb] text-[#2c3e50] p-4 rounded-lg shadow-lg",
          }
        );
        return;
      }
      // Users can only end a quiz once
      if (quiz.over) {
        toast.warn("Quiz has already ended.", {
          className: "bg-[#e0ebeb] text-[#2c3e50] p-4 rounded-lg shadow-lg",
        });
        return;
      }
      setLoading(true);
      const response = await submitAnswers(quiz.id, answers);
      // Display an error notification if users failed to end the quiz
      if (response.Err) {
        console.log(response.Err);
        toast(
          <NotificationError text={`Failed to end quiz. ${response.Err}`} />
        );
        return;
      }
      setQuiz(response.Ok);
      toast(<NotificationSuccess text={`Quiz has ended.`} />);
    } catch (error) {
      console.log({ error });
      toast(
        <NotificationError text={`Failed to end quiz. ${error.message}`} />
      );
    } finally {
      setLoading(false);
    }
  };
  // Function to reset the state and play another quiz
  const playAgain = async () => {
    try {
      if (!quiz.over) {
        toast.warn("Quiz isn't over.", {
          className: "bg-[#e0ebeb] text-[#2c3e50] p-4 rounded-lg shadow-lg",
        });
        return;
      }
      setLoading(true);
      setQuiz([]);
      setAnswers([]);
      setPlaying(false);
    } catch (error) {
      console.log({ error });
      toast(
        <NotificationError text={`Failed to play again. ${error.message}`} />
      );
    } finally {
      setLoading(false);
    }
  };
  const fetchAccount = useCallback(async () => {
    try {
      const isRegistered = await hasAccount();
      if (isRegistered) {
        setAccount(await getAccount());
      } else {
        const response = await createAccount();
        if (response.Err) {
          throw response.Err;
        }
        setAccount(response.Ok);
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if(isLoggedIn){
      fetchAccount();
    }
  }, [isLoggedIn]);
  useEffect(() => {
    getBalance();
  }, [getBalance]);

  // Function to update the user's answers for a given question
  // Checks if the answer already exists and either updates or adds the answer
  const updateAnswers = (questionId, selectedOption) => {
    const exists = answers.findIndex((answer) => answer.id === questionId);
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
    if(quiz && isLoggedIn){
      fetchAccount();
    }
  }, [quiz]);

  return (
    <main className="bg-[#f5f5dc]">
      <Notification />
      {!loading && isLoggedIn ? (
        <Navbar
          principal={window.auth.principalText}
          balance={balance}
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
              playAgain={playAgain}
              answers={answers}
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
