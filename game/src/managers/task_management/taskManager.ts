import { globalEventBus } from '../../helpers/globalEventBus';
import Question from '../../classes/question/question';
import ApiHelper from '../../helpers/apiHelper';
import { gameController } from '../../main';
import { GameEvents } from '../../types/gameEvents';
import { debugHelper } from '../../helpers/debugHelper';
import BayesianKnowledgeTracingManager from './bayesianKnowledgeTracingManager';
import { shuffleArray } from '../../helpers/helperFunctions';
import { achievements } from '../../constants/achievements';
import { roomMap } from '../../constants/roomMap';

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

    private _pointsFactor: number = 10;
    private points: number = this.maxQuestionsAllowed * this._pointsFactor;


    private _totalTaskObjects = [...roomMap]
        .map(([key, roomScene]) => roomScene.numberOfObjects)
        .reduce((partialSum, numOfObjects) => partialSum + numOfObjects, 0);

    /* Number of objects / maxChapterNumber */
    private minRepairedObjectsPerChapter = 2;
    private maxRepairedObjectsPerChapter =
        this.minRepairedObjectsPerChapter + 1;

    private minPLPerChapter = 0.6; //the minimum required mastery probability to continue to the next chapter

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
                .getFullChapter(
                    gameController.gameStateManager.user.chapterNumber
                )
                .then((response: any) => {
                    this.availableQuestions = response.questions;
                    resolve(null);
                })
                .catch((error) => reject(error));
        });
    }

    private async loadAllQuestions() {
        this.availableQuestions = [];
        try {

            await Promise.all(Array.from({ length: gameController.gameStateManager.curriculum.maxChapterNumber }, (_, i) => i + 1)
                .map(async (chapterNumber) => {
                    let chapterQuestions = await gameController.apiHelper.getFullChapter(chapterNumber);
                    this.availableQuestions.push(...chapterQuestions.questions);
                    return null;
                }));
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Gets the next question based on bkt values and available questions
     */
    public getNextQuestion() {
        shuffleArray(this.availableQuestions);
        shuffleArray(this.answeredQuestions);

        const availableQuestionsMap: {
            [key: number]: Question[];
        } = this.availableQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        const answeredQuestionsMap: {
            [key: number]: Question[];
        } = this.answeredQuestions.reduce((map, question) => {
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

        const nextDifficulty = this.bktManager.getNextQuestionDifficulty(
            availableDifficulties
        );

        const questionsAtNextDifficulty = this.getQuestionsAtDifficulty(
            nextDifficulty,
            availableQuestionsMap,
            answeredQuestionsMap
        );
        let nextQuestion =
            questionsAtNextDifficulty.length > 0
                ? questionsAtNextDifficulty[0]
                : null;

        //If the next question is the same one again, pick a different one or a different difficulty
        if (this.currentQuestion === nextQuestion) {
            if (questionsAtNextDifficulty.length > 1) {
                nextQuestion = questionsAtNextDifficulty[1];
            } else {
                let otherDifficulties = availableDifficulties.filter(
                    (difficulty) => difficulty != nextDifficulty
                );
                if (otherDifficulties.length > 0) {
                    const otherDifficulty =
                        this.bktManager.getNextQuestionDifficulty(
                            otherDifficulties
                        );
                    const questionsAtOtherDifficulty =
                        this.getQuestionsAtDifficulty(
                            otherDifficulty,
                            availableQuestionsMap,
                            answeredQuestionsMap
                        );
                    nextQuestion =
                        questionsAtOtherDifficulty.length > 0
                            ? questionsAtOtherDifficulty[0]
                            : this.currentQuestion;
                } else {
                    const questionsAtSameDifficulty =
                        this.getQuestionsAtDifficulty(
                            nextDifficulty,
                            availableQuestionsMap,
                            answeredQuestionsMap
                        );
                    nextQuestion =
                        questionsAtSameDifficulty.length > 0
                            ? questionsAtSameDifficulty[0]
                            : this.currentQuestion;
                }
            }
        }
        this.currentQuestion = nextQuestion;
        return nextQuestion;
    }

    private getQuestionsAtDifficulty(
        difficulty: number,
        availableQuestionsMap: {
            [key: number]: Question[];
        },
        answeredQuestionsMap: {
            [key: number]: Question[];
        }
    ) {
        return (
            availableQuestionsMap[difficulty] ||
            answeredQuestionsMap[difficulty] ||
            []
        );
    }

    private checkNextChapter() {
        gameController.gameStateManager.increaseRepairedObjectsThisChapter();
        if (
            (gameController.gameStateManager.user.repairedObjectsThisChapter >=
                this.minRepairedObjectsPerChapter &&
                gameController.gameStateManager.bkt.masteryProbability >=
                this.minPLPerChapter) ||
            gameController.gameStateManager.user.repairedObjectsThisChapter >=
            this.maxRepairedObjectsPerChapter
        ) {
            if (
                gameController.gameStateManager.user.chapterNumber <
                gameController.gameStateManager.curriculum.maxChapterNumber
            ) {
                gameController.worldSceneController.queueWorldViewTask(() => {
                    // globalEventBus.emit(GameEvents.BROADCAST_NEWS, achievement.text);
                    globalEventBus.emit(
                        GameEvents.BROADCAST_NEWS,
                        'New Knowledge Unlocked'
                    );
                });
                this.points += Math.floor(
                    50 /
                    gameController.gameStateManager.user
                        .repairedObjectsThisChapter
                );
                gameController.gameStateManager.increaseChapterNumber();
                gameController.gameStateManager.user.repairedObjectsThisChapter = 0;
                gameController.gameStateManager.user.newChapter = true;
                gameController.gameStateManager.user.performanceIndex--;
                gameController.gameStateManager.bkt.masteryProbability =
                    gameController.gameStateManager.bkt.masteryProbability / 2;
                this.loadQuestions();
                // this._worldViewScene.docView.chapterManager.updateCurrentChapterOrder(gameController.gameStateManager.user.chapterNumber);
                // this._worldViewScene.docView.chapterManager.updateChapters()
                gameController.chapterManager.updateChapters();
            } else if (gameController.gameStateManager.user.allChaptersDone == false) {
                gameController.gameStateManager.user.allChaptersDone = true;
                this.loadAllQuestions();
            }
        }
        gameController.gameStateManager.addPoints(this.points);
    }

    private onObjectFailed() {
        debugHelper.logString('failed');
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
        gameController.gameStateManager.increaseTotalRepairedObjects();
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
        gameController.gameStateManager.addAnsweredQuestionIds(
            this.currentQuestion.id
        );

        this.currentDoneQuestions++;
        this.currentCorrectQuestions++;
        this.bktManager.calcAndUpdateMasteryProbability(true);

        if (this.currentCorrectQuestions >= this.correctQuestionsNeeded) {
            this.onObjectRepaired();
        }

        globalEventBus.emit(GameEvents.TASKMANAGER_TASK_CORRECT, duration);
    }

    public questionAnsweredIncorrectly() {
        //Every incorrect question removes a point
        this.points -= this._pointsFactor;
        this.currentDoneQuestions++;
        this.bktManager.calcAndUpdateMasteryProbability(false);
        // If its not possible anymore to get the correct questions needed
        if (
            this.maxQuestionsAllowed -
            this.currentDoneQuestions +
            this.currentCorrectQuestions <
            this.correctQuestionsNeeded
        ) {
            this.onObjectFailed();
        }
        globalEventBus.emit(GameEvents.TASKMANAGER_TASK_INCORRECT);
    }

    private loadState(answeredQuestionIds: number[]) {
        this.answeredQuestions = this.availableQuestions.filter((question) =>
            answeredQuestionIds.includes(question.id)
        );
        this.availableQuestions = this.availableQuestions.filter(
            (question) => !answeredQuestionIds.includes(question.id)
        );
    }

    public initialiseBktValues() {
        this._totalTaskObjects = [...roomMap]
            .map(([key, roomScene]) => roomScene.numberOfObjects)
            .reduce((partialSum, numOfObjects) => partialSum + numOfObjects, 0);

        /* Number of objects / maxChapterNumber */
        this.minRepairedObjectsPerChapter =
            Math.floor((this._totalTaskObjects -
                    gameController.gameStateManager.curriculum.maxChapterNumber) /
                gameController.gameStateManager.curriculum.maxChapterNumber);
        this.maxRepairedObjectsPerChapter =
            this.minRepairedObjectsPerChapter + 1;

        // console.log(this._totalTaskObjects);
        // console.log(this.minRepairedObjectsPerChapter);
        // console.log(this.maxRepairedObjectsPerChapter);
    }

    public initialiseQuestionSet() {

        if (gameController.gameStateManager.user.allChaptersDone) {
            this.loadAllQuestions()
                .then((result) => {
                    this.loadState(
                        gameController.gameStateManager.user.answeredQuestionIds
                    );
                })
                .catch((error) => console.error(error));
        } else {
            this.loadQuestions()
                .then((result) => {
                    this.loadState(
                        gameController.gameStateManager.user.answeredQuestionIds
                    );
                    // this.populateNewQuestionSet();
                })
                .catch((error) => console.error(error));
        }
    }
}
