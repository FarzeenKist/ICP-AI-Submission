import {
    query,
    update,
    text,
    Record,
    StableBTreeMap,
    Variant,
    Vec,
    None,
    Some,
    Ok,
    Err,
    ic,
    Principal,
    Opt,
    nat64,
    Result,
    bool,
    Canister,
    Duration,
    nat,
    nat8,
} from "azle";
import {
    ICRC,
    TransferResult
} from "azle/canisters/icrc";
import { hexAddressFromPrincipal } from "azle/canisters/ledger";
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
const Option = Record({
    id: text,
    text: text
});
const Question = Record({
    id: nat,
    question: text,
    options: Vec(Option),
    correctAnswer: text,
    submittedAnswerId: Opt(text),
});
const QuestionPayload = Record({
    question: text,
    options: Vec(Option),
    correctAnswer: text
});
const Quiz = Record({
    id: text,
    questions: Vec(Question),
    principal: Principal,
    over: bool,
    rewarded: bool
});
const SubmittedAnswer = Record({
    id: nat8,
    answer: text
});
const Account = Record({
    id: Principal,
    quizIds: Vec(text),
    earnedAmount: nat
});
const Message = Variant({
    NotFound: text,
    NotOwner: text,
    InvalidPayload: text,
    Over: text,
    RewardingFailed: text,
    ApproveRequestFailed: text,
    AlreadyRegistered: text,
    TransferFromFailed: text,
});

const quizzesStorage = StableBTreeMap(0, text, Quiz);
const accountsStorage = StableBTreeMap(1, Principal, Account);

let icrc: typeof ICRC = ICRC(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

const REWARD_AMOUNT = 1 * 10**8; // in seconds

export default Canister({
    // This function is used to fetch the quiz data of the a quiz.
    getQuiz: query([text], Result(Quiz, Message), (quizId) => {
        const caller = ic.caller();
        const quizOpt = quizzesStorage.get(quizId);
        if ("None" in quizOpt) {
            return Err({ NotFound: `Quiz with id=${quizId} not found` });
        }
        if (caller.toString() !== quizOpt.Some.principal.toString()) {
            return Err({ NotOwner: `Caller isn't this Quiz taker.` });
        }
        return Ok(quizOpt.Some);
    }),
    getAccount: query([], Result(Account, Message), () => {
        const caller = ic.caller();
        const accountOpt = accountsStorage.get(caller);
        if ("None" in accountOpt) {
            return Err({ NotFound: `Account with id=${caller} not found` });
        }
        return Ok(accountOpt.Some);
    }),
    hasAccount: query([], bool, () => {
        return accountsStorage.containsKey(ic.caller());
    }),
    createAccount: update([], Result(Account, Message), () => {
        const caller = ic.caller();
        const isRegistered = accountsStorage.containsKey(caller);
        if (isRegistered) {
            return Err({ AlreadyRegistered: `Account with id=${caller} already exists.` });
        }
        const account = {
            id: caller,
            quizIds: [],
            earnedAmount: 0
        }
        accountsStorage.insert(caller, account)
        return Ok(account);
    }),
    // This function is used to fetch the quizzes data of the caller.
    getQuizzes: query([], Result(Vec(Quiz), Message), () => {
        const caller = ic.caller();
        const accountOpt = accountsStorage.get(caller);
        if ("None" in accountOpt) {
            return Err({ NotFound: `Account with id=${caller} not found` });
        }
        const account = accountOpt.Some;
        const quizzes = account.quizIds.map(quizId => quizzesStorage.get(quizId).Some)
        return Ok(quizzes);
    }),
    createQuiz: update([Vec(QuestionPayload)], Result(Quiz, Message), (generatedQuiz) => {
        const caller = ic.caller();
        const accountOpt = accountsStorage.get(caller);
        if ("None" in accountOpt) {
            return Err({ NotFound: `Account with id=${caller} not found` });
        }
        const questionsVec = generatedQuiz.map((question, index) => ({
            ...question,
            id: index,
            submittedAnswerId: None,
        }));
        const quiz = {
            id: uuidv4(),
            questions: questionsVec,
            principal: caller,
            over: false,
            rewarded: false
        }
        accountsStorage.insert(caller, { ...accountOpt.Some, quizIds: [...accountOpt.Some.quizIds, quiz.id] })
        quizzesStorage.insert(quiz.id, quiz)
        return Ok(quiz);
    }),
    submitAnswers: update([text, Vec(SubmittedAnswer)], Result(Quiz, Message), async (quizId, submittedAnswers) => {
        const caller = ic.caller();
        const accountOpt = accountsStorage.get(caller);
        if ("None" in accountOpt) {
            return Err({ NotFound: `Account with id=${caller} not found` });
        }
        const quizOpt = quizzesStorage.get(quizId);
        if ("None" in quizOpt) {
            return Err({ NotFound: `Quiz with id=${quizId} not found` });
        }
        const quiz = quizOpt.Some
        if (quiz.over) {
            return Err({ Over: `Quiz with id=${quiz.id} is over.` });
        }
        if (caller.toString() !== quiz.principal.toString()) {
            return Err({ NotOwner: `Caller isn't this Quiz taker.` });
        }
        if (submittedAnswers.length !== quiz.questions.length) {
            return Err({ InvalidPayload: `All questions need to be answered.` });
        }
        let numCorrectAnswers = 0;
        submittedAnswers.forEach((answer) => {
            quiz.questions[answer.id].submittedAnswerId = Some(answer.answer)
            if (quiz.questions[answer.id].correctAnswer === answer.answer) {
                numCorrectAnswers++;
            }
        });
        console.log(numCorrectAnswers)
        if (numCorrectAnswers === quiz.questions.length) {
            // reward users
            let transferArgs = {
                from_subaccount: None,
                to: { owner: caller, subaccount: None },
                amount: REWARD_AMOUNT,
                fee: None,
                memo: None,
                created_at_time: Some(ic.time()),
            };
            // to implement checks and handle insufficient funds issues
            const transfer = await ic.call(icrc.icrc1_transfer, {
                args: [transferArgs],
            });
            if (transfer.Err) {
                return Err({ RewardingFailed: `Failed.` });
            }
            const account = accountOpt.Some;
            account.earnedAmount = account.earnedAmount + REWARD_AMOUNT;
            accountsStorage.insert(account.id, account)
        }
        quiz.over = true;
        quizzesStorage.insert(quiz.id, quiz)
        return Ok(quiz);
    }),
    /*
          a helper function to get address from the principal
          the address is later used in the transfer method
      */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),
    // This function is used to fetch the id of the canister
    getCanisterId: query([], Principal, () => {
        return ic.id();
    }),
})


// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    },
}