import React, { useEffect, useState } from 'react'


function QuizForm({createQuiz}) {
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("easy");
    const [questionsAmount, setQuestionsAmount] = useState(3);


    const handleSubmit = (e) => {
        e.preventDefault()
        createQuiz({topic,difficulty,questionsAmount})
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-8 lg:w-full mx-auto max-w-lg lg:max-w-lg xl:max-w-xl">
                <h2 className="text-2xl font-semibold mb-6 text-center">Welcome to Quiz AI</h2>
                <form action="/start-quiz" method="POST">
                    <div className="mb-4">
                        <label htmlFor="topic" className="block text-md font-medium mb-2">Select Quiz Topic</label>
                        <input type="text" id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} name="topic" placeholder="e.g. Science, History" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="difficulty" className="block text-md font-medium mb-2">Select Difficulty</label>
                        <select id="difficulty" name="difficulty" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="numQuestions" className="block text-md font-medium mb-2">Number of Questions</label>
                        <select id="numQuestions" name="numQuestions" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" value={questionsAmount} onChange={(e) => setQuestionsAmount(parseInt(e.target.value))}>
                            <option value="3">3</option>
                            <option value="5">5</option>
                            <option value="7">7</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out" onClick={handleSubmit}>Start Quiz</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default QuizForm
