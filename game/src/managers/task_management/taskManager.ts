import { globalEventBus } from "../../helpers/globalEventBus";
import Question from "../../classes/question/question";
import ApiHelper from "../../helpers/apiHelper";
import { gameController } from "../../main";
import { GameEvents } from "../../types/gameEvents";
import { debugHelper } from "../../helpers/debugHelper";
import BayesianKnowledgeTracingManager from "./bayesianKnowledgeTracingManager";

/**
 * Manages tasks and questions for the game.
 */
export default class TaskManager {
    private availableQuestions: Question[] = [];

    private answeredQuestions: Question[] = [];

    private currentQuestion: Question;

    public currentDoneQuestions: number = 0;
    public currentCorrectQuestions: number = 0;
    public finished = false;
    public failed = false;

    private bktManager = new BayesianKnowledgeTracingManager();

    readonly correctQuestionsNeeded: number = 3;
    readonly maxQuestionsAllowed: number = 5;

    public resetStatus() {
        this.currentDoneQuestions = 0;
        this.currentCorrectQuestions = 0;
        this.finished = false;
        this.failed = false;
    }

    /**
     * Load the questions from the current chapter through the api and pull out the difficulties array
     * @private
     */
    private loadQuestions() {
        return new Promise((resolve, reject) => {
            gameController.apiHelper
                .getFullChapter(gameController.gameStateManager.user.chapterNumber)
                .then((response: any) => {
                    this.availableQuestions = response.questions;
                    resolve(null);
                })
                .catch((error) => reject(error));
        });
    }

    private shuffleQuestions(questions: Question[]) {
        let m = questions.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [questions[m], questions[i]] = [questions[i], questions[m]];
        }
    }

    /**
     * Gets the next question based on bkt values and available questions
     */
    public getNextQuestion() {
        this.shuffleQuestions(this.availableQuestions);
        this.shuffleQuestions(this.answeredQuestions);

        const availableQuestionsMap: { [key: number]: Question[] } = this.availableQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        const answeredQuestionsMap: { [key: number]: Question[] } = this.answeredQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        //Get available difficulties from map where questions are available and put it into number array
        let availableDifficulties = (
            Object.keys(availableQuestionsMap).length
                ? Object.keys(availableQuestionsMap)
                : Object.keys(answeredQuestionsMap)
        ).map((key) => parseInt(key));

        const nextDifficulty = this.bktManager.getNextQuestionDifficulty(availableDifficulties);

        console.log(gameController.gameStateManager.bkt.masteryProbability);

        const questionsAtNextDifficulty =
            availableQuestionsMap[nextDifficulty] || answeredQuestionsMap[nextDifficulty] || [];
        let nextQuestion = questionsAtNextDifficulty.length > 0 ? questionsAtNextDifficulty[0] : null;

        //If the next question is the same one again, pick a different one or a different difficulty
        if (this.currentQuestion === nextQuestion) {
            if (questionsAtNextDifficulty.length > 1) {
                nextQuestion = questionsAtNextDifficulty[1];
            } else {
                let otherDifficulties = availableDifficulties.filter((difficulty) => difficulty != nextDifficulty);
                const otherDifficulty = this.bktManager.getNextQuestionDifficulty(availableDifficulties);
                nextQuestion = questionsAtNextDifficulty.length > 0 ? questionsAtNextDifficulty[0] : null;
            }
        }
        this.currentQuestion = nextQuestion;
        return nextQuestion;
    }

    private shuffleArray(array: []) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    private checkNextChapter() {
        gameController.gameStateManager.increaseRepairedObjectsThisChapter();
        if (
            gameController.gameStateManager.user.repairedObjectsThisChapter == 2 &&
            gameController.gameStateManager.user.chapterNumber <
                gameController.gameStateManager.curriculum.maxChapterNumber
        ) {
            gameController.gameStateManager.increaseChapterNumber();
            gameController.gameStateManager.user.repairedObjectsThisChapter = 0;
            gameController.gameStateManager.user.newChapter = true;
            gameController.gameStateManager.user.performanceIndex--;
            this.loadQuestions();
            // this._worldViewScene.docView.chapterManager.updateCurrentChapterOrder(gameController.gameStateManager.user.chapterNumber);
            // this._worldViewScene.docView.chapterManager.updateChapters()
            gameController.chapterManager.updateChapters();
        }
    }

    private onObjectFailed() {
        debugHelper.logString("failed");
        this.failed = true;
        gameController.worldSceneController.queueWorldViewTask(() => {
            globalEventBus.emit(GameEvents.TASKMANAGER_OBJECT_FAILED);
        });
    }

    private onObjectRepaired() {
        this.finished = true;
        gameController.worldSceneController.queueWorldViewTask(() => {
            globalEventBus.emit(GameEvents.TASKMANAGER_OBJECT_FINISHED);
        });
        this.checkNextChapter();
    }

    public questionAnsweredCorrectly(duration: number) {
        // const currentQuestion = this.getCurrentQuestionFromQuestionSet();
        const index = this.availableQuestions.indexOf(this.currentQuestion);
        if (index > -1) {
            this.availableQuestions.splice(index, 1);
        }
        // console.log(currentQuestion);
        this.answeredQuestions.push(this.currentQuestion);
        gameController.gameStateManager.addAnsweredQuestionIds(this.currentQuestion.id);
        // this.currentQuestionSetForObject.shift();
        this.currentDoneQuestions++;
        this.currentCorrectQuestions++;
        // if (this.currentQuestionSetForObject.length === 0) {
        if (this.currentCorrectQuestions >= this.correctQuestionsNeeded) {
            this.onObjectRepaired();
        }
        // else {
        //     gameController.gameStateManager.user.performanceIndex = currentQuestion.difficulty + 1;
        // }

        this.bktManager.calcAndUpdateMasteryProbability(true);

        globalEventBus.emit(GameEvents.TASKMANAGER_TASK_CORRECT, duration);
    }

    public questionAnsweredIncorrectly() {
        // gameController.gameStateManager.user.performanceIndex > 1
        //     ? gameController.gameStateManager.user.performanceIndex--
        //     : null;
        this.currentDoneQuestions++;
        this.bktManager.calcAndUpdateMasteryProbability(false);
        // If its not possible anymore to get the correct questions needed
        if (
            this.maxQuestionsAllowed - this.currentDoneQuestions + this.currentCorrectQuestions <
            this.correctQuestionsNeeded
        ) {
            this.onObjectFailed();
        }
        globalEventBus.emit(GameEvents.TASKMANAGER_TASK_INCORRECT);
    }

    private loadState(answeredQuestionIds: number[]) {
        this.answeredQuestions = this.availableQuestions.filter((question) =>
            answeredQuestionIds.includes(question.id),
        );
        this.availableQuestions = this.availableQuestions.filter(
            (question) => !answeredQuestionIds.includes(question.id),
        );
    }

    public initialiseQuestionSet() {
        this.loadQuestions()
            .then((result) => {
                this.loadState(gameController.gameStateManager.user.answeredQuestionIds);
                // this.populateNewQuestionSet();
            })
            .catch((error) => console.error(error));
    }
}
