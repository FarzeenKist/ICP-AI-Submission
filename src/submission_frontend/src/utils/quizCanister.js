export async function createAccount() {
  return window.canister.quiz.createAccount();
}

export async function getAccount() {
  try {
    let result = await window.canister.quiz.getAccount();
    if (result.Err) {
      return;
    } else {
      return result.Ok;
    }
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
export async function hasAccount() {
  try {
    return await window.canister.quiz.hasAccount();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
export async function getQuiz(quizId) {
  try {
    let result = await window.canister.quiz.getQuiz(quizId);
    if (result.Err) {
      return;
    } else {
      return result.Ok;
    }
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getQuizzes() {
  try {
    let result = await window.canister.quiz.getQuizzes();
    if (result.Err) {
      return result.Err;
    } else {
      return result.Ok;
    }
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}
export async function createQuiz(generatedQuiz) {
  return window.canister.quiz.createQuiz(generatedQuiz);
}
export async function submitAnswers(quizId, submittedAnswers) {
  return window.canister.quiz.submitAnswers(quizId, submittedAnswers);
}