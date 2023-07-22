import {globalEventBus} from "../helpers/globalEventBus";
import {QuestionType} from "../types/questionType";
import RootNode from "../views/rootNode";
import Question from "../classes/question/question";
import {
    ChoiceQuestionElement, CreateQuestionElement,
    InputQuestionElement,
    OrderQuestionElement,
} from "../classes/question/questionElement";
import DocView from "../views/docView/docView";
import {ChapterType} from "./chapterManager";
import ApiHelper from "../helpers/apiHelper";
import availableQuestions from "./availableQuestionsTestData";

export default class TaskManager {

    private availableQuestions: Question[] = [];

    private answeredQuestions: Question[] = [];

    private currentChapterMaxDifficulty: number = 5;

    private currentQuestionSetForObject = [];


    public currentDoneQuestions: number;
    public currentTotalQuestions: number;

    private _rootNode: RootNode;

    private apiHandler = new ApiHelper();

    // private defaultTaskManagerState: TaskManagerStateType = {
    //     answeredQuestions: [],
    //     currentChapterNumber: 1,
    //     repairedObjectsThisChapter: 0,
    //     currentPerformanceIndex: 1
    // }

    private loadQuestions() {
        this.apiHandler.getFullChapter(this._rootNode.user.chapterNumber)
            .then((response:any) => {
                this.availableQuestions = response.questions;
                this.currentChapterMaxDifficulty = Math.max(
                    ...this.availableQuestions.map((q) => q.difficulty)
                );
            })
            .catch((error) => console.error(error))
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

        const availableQuestionsMap = this.availableQuestions.reduce((map, question) => {
            if (!map[question.difficulty]) map[question.difficulty] = [];
            map[question.difficulty].push(question);
            return map;
        }, {});

        for (let i = this._rootNode.user.performanceIndex; i <= this.currentChapterMaxDifficulty; i++) {
            const questionsWithDifficulty = availableQuestionsMap[i];
            if (questionsWithDifficulty && questionsWithDifficulty.length > 0) {
                const question = questionsWithDifficulty.pop();
                this.currentQuestionSetForObject.push(question);
            }
        }

        this.currentDoneQuestions = 0;
        this.currentTotalQuestions = this.currentQuestionSetForObject.length;
    }

    public getCurrentQuestionFromQuestionSet() {
        let question = this.currentQuestionSetForObject[0];
        return question;
    }

    private checkNextChapter() {
        this._rootNode.user.increaseRepairedObjectsThisChapter();
        if (this._rootNode.user.repairedObjectsThisChapter == 2) {
            this._rootNode.user.increaseChapterNumber();
            this._rootNode.user.repairedObjectsThisChapter = 0;
            this._rootNode.user.newChapter = true;
            this._rootNode.user.performanceIndex --;
            this.loadQuestions()
            this._rootNode.docView.chapterManager.updateCurrentChapterOrder(this._rootNode.user.chapterNumber);
            this._rootNode.docView.chapterManager.updateChapters()
        }
    }

    private onObjectFailed() {
        console.log("FAILED")
        if (this._rootNode.scene.isSleeping(this._rootNode)) {
            this._rootNode.queueTask(() => {
                globalEventBus.emit("taskmanager_object_failed");
            });
        } else {
            globalEventBus.emit("taskmanager_object_failed");
        }
    }

    private onObjectRepaired() {
        if (this._rootNode.scene.isSleeping(this._rootNode)) {
            this._rootNode.queueTask(() => {
                globalEventBus.emit("taskmanager_object_finished");
            });
        } else {
            globalEventBus.emit("taskmanager_object_finished");
        }
        this.checkNextChapter();
    }

    public questionAnsweredCorrectly() {
        const currentQuestion = this.getCurrentQuestionFromQuestionSet();
        const index = this.availableQuestions.indexOf(currentQuestion);
        if (index > -1) {
            this.availableQuestions.splice(index, 1);
        }
        this.answeredQuestions.push(currentQuestion);
        this.currentQuestionSetForObject.shift();
        this.currentDoneQuestions++;
        if (this.currentQuestionSetForObject.length === 0) {
            this.onObjectRepaired();
        } else {
            this._rootNode.user.performanceIndex = currentQuestion.difficulty + 1;
        }
        globalEventBus.emit("taskmanager_task_correct");
    }

    public questionAnsweredIncorrectly() {
        this._rootNode.user.performanceIndex > 1
            ? this._rootNode.user.performanceIndex--
            : null;
        this.onObjectFailed();
    }

    private loadState(answeredQuestionIds: number[]) {
        this.answeredQuestions = this.availableQuestions.filter(question => answeredQuestionIds.includes(question.id))
        this.availableQuestions = this.availableQuestions.filter(question => !answeredQuestionIds.includes(question.id))
    }

    constructor(rootNode: RootNode) {
        this._rootNode = rootNode;

        //Test data!
        //this.availableQuestions = availableQuestions;
        console.log(rootNode.user)
        this.loadState(rootNode.user.answeredQuestionIds);

        this.loadQuestions();

        this.populateNewQuestionSet();
    }
}
