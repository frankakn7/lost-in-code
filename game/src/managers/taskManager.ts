import {globalEventBus} from "../helpers/globalEventBus";
import {QuestionType} from "../types/questionType";
import WorldViewScene from "../scenes/worldViewScene";
import Question from "../classes/question/question";
import {
    ChoiceQuestionElement, CreateQuestionElement,
    InputQuestionElement,
    OrderQuestionElement,
} from "../classes/question/questionElement";
import DocViewScene from "../scenes/docView/docViewScene";
import {ChapterType} from "./chapterManager";
import ApiHelper from "../helpers/apiHelper";
import availableQuestions from "./availableQuestionsTestData";

/**
 * Manages tasks and questions for the game.
 */
export default class TaskManager {

    private availableQuestions: Question[] = [];

    private answeredQuestions: Question[] = [];

    private currentChapterMaxDifficulty: number = 5;

    private currentQuestionSetForObject = [];


    public currentDoneQuestions: number;
    public currentTotalQuestions: number;

    private _worldViewScene: WorldViewScene;

    private apiHandler = new ApiHelper();

    // private defaultTaskManagerState: TaskManagerStateType = {
    //     answeredQuestions: [],
    //     currentChapterNumber: 1,
    //     repairedObjectsThisChapter: 0,
    //     currentPerformanceIndex: 1
    // }

    private loadQuestions() {
        return new Promise((resolve, reject) => {
            this.apiHandler.getFullChapter(this._worldViewScene.gameStateManager.user.chapterNumber)
                .then((response:any) => {
                    this.availableQuestions = response.questions;
                    this.currentChapterMaxDifficulty = Math.max(
                        ...this.availableQuestions.map((q) => q.difficulty)
                    );
                    console.log(availableQuestions)
                    resolve(null);
                })
                .catch((error) => reject(error))
        })
    }

    private shuffleQuestions(questions: Question[]) {
        let m = questions.length;
        while (m) {
            const i = Math.floor(Math.random() * m--);
            [questions[m], questions[i]] = [questions[i], questions[m]];
        }
    }

    public populateNewQuestionSet() {
        this.shuffleQuestions(this.availableQuestions);
        this.shuffleQuestions(this.answeredQuestions);

        this.currentQuestionSetForObject = [];

        const availableQuestionsMap = this.availableQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        const answeredQuestionsMap = this.answeredQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        for (let i = this._worldViewScene.gameStateManager.user.performanceIndex; i <= this.currentChapterMaxDifficulty; i++) {
            let questionsWithDifficulty = availableQuestionsMap[i];
            let j = 0;
            let increasing = true
            while((!questionsWithDifficulty || questionsWithDifficulty.length <= 0) && j >= 0){
                questionsWithDifficulty = availableQuestionsMap[i+j];
                if (!questionsWithDifficulty || questionsWithDifficulty.length <= 0) {
                    questionsWithDifficulty = answeredQuestionsMap[i+j];
                }
                increasing ? j++ : j--;
                j >= this.currentChapterMaxDifficulty ? increasing = false : null;
            }
            const question = questionsWithDifficulty.pop();
            this.currentQuestionSetForObject.push(question);
        }

        console.log(this.currentQuestionSetForObject);

        this.currentDoneQuestions = 0;
        this.currentTotalQuestions = this.currentQuestionSetForObject.length;
    }

    public getCurrentQuestionFromQuestionSet() {
        let question = this.currentQuestionSetForObject[0];
        return question;
    }

    private checkNextChapter() {
        this._worldViewScene.gameStateManager.increaseRepairedObjectsThisChapter();
        if (this._worldViewScene.gameStateManager.user.repairedObjectsThisChapter == 2) {
            this._worldViewScene.gameStateManager.increaseChapterNumber();
            this._worldViewScene.gameStateManager.user.repairedObjectsThisChapter = 0;
            this._worldViewScene.gameStateManager.user.newChapter = true;
            this._worldViewScene.gameStateManager.user.performanceIndex --;
            this.loadQuestions()
            this._worldViewScene.docView.chapterManager.updateCurrentChapterOrder(this._worldViewScene.gameStateManager.user.chapterNumber);
            this._worldViewScene.docView.chapterManager.updateChapters()
        }
    }

    private onObjectFailed() {
        console.log("FAILED")
        if (this._worldViewScene.scene.isSleeping(this._worldViewScene)) {
            this._worldViewScene.queueTask(() => {
                globalEventBus.emit("taskmanager_object_failed");
            });
        } else {
            globalEventBus.emit("taskmanager_object_failed");
        }
    }

    private onObjectRepaired() {
        if (this._worldViewScene.scene.isSleeping(this._worldViewScene)) {
            this._worldViewScene.queueTask(() => {
                globalEventBus.emit("taskmanager_object_finished");
            });
        } else {
            globalEventBus.emit("taskmanager_object_finished");
        }
        this.checkNextChapter();
    }

    public questionAnsweredCorrectly(duration: number) {
        const currentQuestion = this.getCurrentQuestionFromQuestionSet();
        const index = this.availableQuestions.indexOf(currentQuestion);
        if (index > -1) {
            this.availableQuestions.splice(index, 1);
        }
        console.log(currentQuestion)
        this.answeredQuestions.push(currentQuestion);
        this._worldViewScene.gameStateManager.addAnsweredQuestionIds(currentQuestion.id);
        this.currentQuestionSetForObject.shift();
        this.currentDoneQuestions++;
        if (this.currentQuestionSetForObject.length === 0) {
            this.onObjectRepaired();
        } else {
            this._worldViewScene.gameStateManager.user.performanceIndex = currentQuestion.difficulty + 1;
        }


        globalEventBus.emit("taskmanager_task_correct", duration);
    }

    public questionAnsweredIncorrectly() {
        this._worldViewScene.gameStateManager.user.performanceIndex > 1
            ? this._worldViewScene.gameStateManager.user.performanceIndex--
            : null;
        this.onObjectFailed();
        globalEventBus.emit("taskmanager_task_incorrect");
    }

    private loadState(answeredQuestionIds: number[]) {
        this.answeredQuestions = this.availableQuestions.filter(question => answeredQuestionIds.includes(question.id))
        this.availableQuestions = this.availableQuestions.filter(question => !answeredQuestionIds.includes(question.id))
    }

    constructor(worldViewScene: WorldViewScene) {
        this._worldViewScene = worldViewScene;

        //Test data!
        //this.availableQuestions = availableQuestions;
        // console.log(worldViewScene.user)

        this.loadQuestions().then((result => {
            this.loadState(worldViewScene.gameStateManager.user.answeredQuestionIds);
            this.populateNewQuestionSet();
        })).catch(error => console.error(error));

    }
}
