import { CohereClient } from 'cohere-ai';

// Initialize Cohere with your API key
const cohere = new CohereClient({
  token: 'COHERE_TOKEN'
})


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

// Function to generate quiz questions using Cohere AI
export async function generateQuiz(testing, topic, difficulty, questionsAmount) {
  const prompt = `
    Generate a quiz with the following criteria: 
    Topic: ${topic}, 
    Difficulty: ${difficulty}, 
    Number of Questions: ${questionsAmount}. 
    Provide questions in the format:
    1. [Question]
    a) [Option 1]
    b) [Option 2]
    c) [Option 3]
    d) [Option 4]
    Correct answer: [Correct Option]
  `;

  try {
    if (testing) {
      return parsedMockQuiz
    }
    // Call Cohere API to generate the quiz
    const response = await cohere.chat({
      message: prompt
    });

    const completionText = response.text;
    // Process and return the generated questions
    return parseQuizResponse(completionText);
  } catch (error) {
    console.error("Error generating quiz: ", error);
    throw error;
  }
}

// Function to parse the quiz response
const parseQuizResponse = (response) => {
  const quizData = response.split(/\d+\.\s+/).slice(1); // Split by question number (e.g., 1., 2., etc.)

  const parsedQuiz = quizData.map((quizItem) => {
    // Split into question and answer parts
    const [questionAndOptions, correctAnswerPart] = quizItem.split("Correct answer:");
    // Extract question and options
    const [question, ...optionsRaw] = questionAndOptions.trim().split(/\n/);

    // Parse options
    const options = optionsRaw.map(option => ({
      id: option.trim().charAt(0), // 'a', 'b', 'c', 'd'
      text: option.trim().slice(2)  // Text of the option, after 'a)', 'b)', etc.
    }));
    // Parse the correct answer (e.g., ' c')
    const correctAnswer = correctAnswerPart.trim().charAt(0);
    return {
      question,
      options,
      correctAnswer
    };
  });

  return parsedQuiz;
};
