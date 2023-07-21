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

        for (let i = this.rootNode.user.performanceIndex; i <= this.currentChapterMaxDifficulty; i++) {
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
        this.rootNode.user.increaseRepairedObjectsThisChapter();
        if (this.rootNode.user.repairedObjectsThisChapter == 2) {
            this.rootNode.user.increaseChapterNumber();
            this.rootNode.user.repairedObjectsThisChapter = 0;
            this.rootNode.user.newChapter = true;
            this.rootNode.user.performanceIndex --;
            this.loadQuestions()
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
