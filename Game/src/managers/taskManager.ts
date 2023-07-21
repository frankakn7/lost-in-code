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

    private currentChapterMaxDifficulty: number;

    private currentQuestionSetForObject = [];


    public currentDoneQuestions: number;
    public currentTotalQuestions: number;

    private rootNode: RootNode;

    private apiHandler = new ApiHelper();

    // private defaultTaskManagerState: TaskManagerStateType = {
    //     answeredQuestions: [],
    //     currentChapterNumber: 1,
    //     repairedObjectsThisChapter: 0,
    //     currentPerformanceIndex: 1
    // }

    private loadQuestions() {
        this.apiHandler.getFullChapter(this.rootNode.user.chapterNumber)
            .then((response:any) => {
                console.log(response)
                this.availableQuestions = response.questions;
                this.currentChapterMaxDifficulty = Math.max(
                    ...this.availableQuestions.map((q) => q.difficulty)
                );
                console.log(response);
            })
            .catch((error) => console.error(error))
    }

    private shuffleQuestions(questions: Question[]) {
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = questions[i];
            questions[i] = questions[j];
            questions[j] = temp;
        }
    }

    getRandomQuestion() {
        // this.shuffleQuestions(this.availableQuestions);
        return this.availableQuestions.pop();
    }

    public populateNewQuestionSet() {
        this.shuffleQuestions(this.availableQuestions);
        this.shuffleQuestions(this.answeredQuestions);
        console.log("PI: " + this.rootNode.user.performanceIndex);
        console.log(this.currentChapterMaxDifficulty)
        console.log(this.availableQuestions)
        for (
            let i = this.rootNode.user.performanceIndex;
            i <= this.currentChapterMaxDifficulty;
            i++
        ) {
            let question = this.availableQuestions.find(
                (question) => question.difficulty == i
            );
            if (question === undefined) {
                question = this.answeredQuestions.find(
                    (question) => question.difficulty == i
                );
                continue;
            }
            // console.log("Q Diff: "+question.difficulty)
            // this.currentQuestionSetForObject.set(i, question);
            console.log(question)
            this.currentQuestionSetForObject.push(question);
        }
        this.currentDoneQuestions = 0;
        this.currentTotalQuestions = this.currentQuestionSetForObject.length;
    }

    public getCurrentQuestionFromQuestionSet() {
        // let question = this.currentQuestionSetForObject.get(
        //     this.currentPerformanceIndex
        // );
        //let question = this.currentQuestionSetForObject.shift()
        let question = this.currentQuestionSetForObject[0];
        // console.log("Q Diff: "+question.difficulty)
        console.log(question)
        return question;
    }

    private checkNextChapter() {
        this.rootNode.user.increaseRepairedObjectsThisChapter();
        if (this.rootNode.user.repairedObjectsThisChapter == 2) {
            this.rootNode.user.increaseChapterNumber();
            this.rootNode.user.repairedObjectsThisChapter = 0;
            this.rootNode.user.newChapter = true;
            this.rootNode.docView.chapterManager.updateCurrentChapterOrder(this.rootNode.user.chapterNumber);
            this.rootNode.docView.chapterManager.updateChapters()
        }
    }

    private onObjectFailed() {
        console.log("FAILED")
        if (this.rootNode.scene.isSleeping(this.rootNode)) {
            this.rootNode.queueTask(() => {
                globalEventBus.emit("taskmanager_object_failed");
            });
        } else {
            globalEventBus.emit("taskmanager_object_failed");
        }
    }

    private onObjectRepaired() {
        if (this.rootNode.scene.isSleeping(this.rootNode)) {
            this.rootNode.queueTask(() => {
                globalEventBus.emit("taskmanager_object_finished");
            });
        } else {
            globalEventBus.emit("taskmanager_object_finished");
        }
        this.checkNextChapter();
    }

    public questionAnsweredCorrectly() {
        const currentQuestion = this.getCurrentQuestionFromQuestionSet();
        this.availableQuestions = this.availableQuestions.filter(
            (question) => question !== currentQuestion
        );
        this.answeredQuestions.push(currentQuestion);
        this.currentQuestionSetForObject.shift()
        this.currentDoneQuestions++;
        if (this.currentQuestionSetForObject.length == 0) {
            this.onObjectRepaired();
        } else {
            this.rootNode.user.performanceIndex = currentQuestion.difficulty + 1;
        }
        globalEventBus.emit("taskmanager_task_correct");
    }

    public questionAnsweredIncorrectly() {
        this.rootNode.user.performanceIndex > 1
            ? this.rootNode.user.performanceIndex--
            : null;
        this.onObjectFailed();

    }

    // public saveAll() {
    //     return {
    //         // availableQuestions: [...this.availableQuestions.map(question => question.id)],
    //         answeredQuestions: [...this.answeredQuestions.map(quesion => quesion.id)],
    //         currentChapterNumber: this.currentChapterNumber,
    //         repairedObjectsThisChapter: this.repairedObjectsThisChapter,
    //         currentPerformanceIndex: this.currentPerformanceIndex
    //     }
    // }

    private loadState(answeredQuestionIds: number[]) {
        this.answeredQuestions = this.availableQuestions.filter(question => answeredQuestionIds.includes(question.id))
        this.availableQuestions = this.availableQuestions.filter(question => !answeredQuestionIds.includes(question.id))
    }

    constructor(rootNode: RootNode) {
        this.rootNode = rootNode;

        //Test data!
        //this.availableQuestions = availableQuestions;
        console.log(rootNode.user)
        this.loadState(rootNode.user.answeredQuestionIds);

        this.loadQuestions();

        this.populateNewQuestionSet();
    }
}
