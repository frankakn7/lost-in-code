import { globalEventBus } from "../../helpers/globalEventBus";
import { QuestionType } from "../../types/questionType";
import PlayView from "../playView";
import Question from "./question";
import {
    ChoiceQuestionElement, CreateQuestionElement,
    InputQuestionElement,
    OrderQuestionElement,
} from "./questionElement";
import {TaskManagerStateType} from "../../types/taskManagerStateType";
import DocView from "../docView/docView";
import {ChapterType} from "../docView/chapterManager";

export default class TaskManager {
    private availableQuestions: Question[] = [];

    private answeredQuestions: Question[] = [];
    //TODO: implement topic id properly
    public currentChapterNumber: number = 1;

    private repairedObjectsThisChapter: number = 0;

    private currentPerformanceIndex: number = 1;

    readonly currentChapterMaxDifficulty: number;

    private currentQuestionSetForObject = new Map<number, Question>();

    public currentDoneQuestions: number;
    public currentTotalQuestions: number;

    private scene: PlayView;

    // private defaultTaskManagerState: TaskManagerStateType = {
    //     answeredQuestions: [],
    //     currentChapterNumber: 1,
    //     repairedObjectsThisChapter: 0,
    //     currentPerformanceIndex: 1
    // }

    //TODO: Implement loading questions from api

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
        // console.log("PI: " + this.currentPerformanceIndex);
        for (
            let i = this.currentPerformanceIndex;
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
            }
            // console.log("Q Diff: "+question.difficulty)
            this.currentQuestionSetForObject.set(i, question);
        }
        this.currentDoneQuestions = 0;
        this.currentTotalQuestions = this.currentQuestionSetForObject.size;
    }

    public getCurrentQuestionFromQuestionSet() {
        let question = this.currentQuestionSetForObject.get(
            this.currentPerformanceIndex
        );
        // console.log("Q Diff: "+question.difficulty)
        return question;
    }

    private checkNextChapter() {
        this.repairedObjectsThisChapter ++;
        if(this.repairedObjectsThisChapter == 2){
            this.currentChapterNumber ++;
            this.repairedObjectsThisChapter = 0;
            this.scene.docView.newChapter = true;
            this.scene.docView.chapterManager.updateCurrentChapterOrder(this.currentChapterNumber);
            this.scene.docView.chapterManager.updateChapters()
        }
    }

    private onObjectFailed(){
        console.log("FAILED")
        if (this.scene.scene.isSleeping(this.scene)) {
            this.scene.queueTask(() => {
                globalEventBus.emit("taskmanager_object_failed");
            });
        } else {
            globalEventBus.emit("taskmanager_object_failed");
        }
    }

    private onObjectRepaired() {
        if (this.scene.scene.isSleeping(this.scene)) {
            this.scene.queueTask(() => {
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
        this.currentQuestionSetForObject.delete(this.currentPerformanceIndex);
        this.currentDoneQuestions++;
        if (this.currentQuestionSetForObject.size == 0) {
            this.onObjectRepaired();
        } else {
            this.currentPerformanceIndex = currentQuestion.difficulty + 1;
        }
        globalEventBus.emit("taskmanager_task_correct");
    }

    public questionAnsweredIncorrectly() {
        this.currentPerformanceIndex > 1
            ? this.currentPerformanceIndex--
            : null;
        this.onObjectFailed();
    }

    public saveAll(){
        return {
            // availableQuestions: [...this.availableQuestions.map(question => question.id)],
            answeredQuestions: [...this.answeredQuestions.map(quesion => quesion.id)],
            currentChapterNumber: this.currentChapterNumber,
            repairedObjectsThisChapter: this.repairedObjectsThisChapter,
            currentPerformanceIndex: this.currentPerformanceIndex
        }
    }

    private loadState(state: TaskManagerStateType){
        this.answeredQuestions = this.availableQuestions.filter(question => state.answeredQuestions.includes(question.id))
        this.availableQuestions = this.availableQuestions.filter(question => !state.answeredQuestions.includes(question.id))
        this.currentChapterNumber = state.currentChapterNumber;
        this.repairedObjectsThisChapter = state.repairedObjectsThisChapter;
        this.currentPerformanceIndex = state.currentPerformanceIndex;
    }

    constructor(scene: PlayView, savedTaskManagerState?:TaskManagerStateType) {
        this.scene = scene;

        const code = `<?php
$txt = "Hello world!";
$x = 5;
$y = 10.5;

echo $txt;
echo "<br>";
echo $x;
echo "<br>";
echo $y;
?>`;

        let questionElement = new ChoiceQuestionElement(1, "text output", true);
        let questionElement2 = new ChoiceQuestionElement(
            2,
            "graphical output",
            false
        );

        let inputQuestionElement = new InputQuestionElement(
            1,
            ["Hello There"],
            "input1"
        );

        let dragQuestionElement2 = new OrderQuestionElement(
            1,
            `<?php
        $txt = "Hello world!";
        $x = 5;`,
            1
        );
        let dragQuestionElement1 = new OrderQuestionElement(
            2,
            `       $y = 10.5;

        echo $txt;
        echo "<br>";`,
            2
        );
        let dragQuestionElement3 = new OrderQuestionElement(
            3,
            `       echo $x;
        echo "<br>";
        echo $y;
        $p = 0.5;
?>`,
            3
        );

        let clozeQuestionElement = new InputQuestionElement(
            1,
            ["Hello","hello"],
            "input1"
        );
        let clozeQuestionElement2 = new InputQuestionElement(
            2,
            ["There","there"],
            "input2"
        );

        this.availableQuestions.push(
            new Question(
                1,
                "What is the output of the following code?",
                "Just Answer",
                QuestionType.CHOICE,
                [questionElement, questionElement2],
                1,
                code
            )
        );

        this.availableQuestions.push(
            new Question(
                1,
                "What is php not capable of doing?",
                "Just Answer",
                QuestionType.CHOICE,
                [questionElement, questionElement2],
                2
            )
        );

        this.availableQuestions.push(
            new Question(
                2,
                "What is the output of the following code?",
                "Just Answer",
                QuestionType.SINGLE_INPUT,
                [inputQuestionElement],
                3,
                code
            )
        );

        this.availableQuestions.push(
            new Question(
                3,
                "Reorder these elements into the correct order!",
                "just order them",
                QuestionType.DRAG_DROP,
                [
                    dragQuestionElement1,
                    dragQuestionElement2,
                    dragQuestionElement3,
                ],
                4
            )
        );

        this.availableQuestions.push(
            new Question(
                4,
                "Fill in the blanks!",
                "just fill it in",
                QuestionType.CLOZE,
                [clozeQuestionElement, clozeQuestionElement2],
                3,
                `
<?php
    $txt = "Hello world!";
    $x = 5;
    $y = 10.5;

    echo $txt;
    echo "<br>";
    echo $x;
    echo "<br>";
    echo $y;
    echo "###INPUT|input1|20|true###";
    echo "<br>";
    echo "###INPUT|input2|15|false###";
?>
`
            )
        );

        let questionElementSelectBlock = new ChoiceQuestionElement(
            1,
            `<?php
        $txt = "Hello world!";
        echo $txt;
?>`,
            true
        );
        let questionElementSelectBlock2 = new ChoiceQuestionElement(
            2,
            `<?php
            $txt = "Hello There!";
            echo $txt;
    ?>`,
            false
        );

        this.availableQuestions.push(
            new Question(
                5,
                "Which code block outputs: Hello There! ",
                "Just Answer",
                QuestionType.SELECT_ONE,
                [questionElementSelectBlock, questionElementSelectBlock2],
                1,
                code
            )
        );
        // this.availableQuestions = questions;

        let questionElementCreate = new CreateQuestionElement(
            2,
            `echo calculateSum(5,10);`,
            ['calculateSum(5,10) == 15','calculateSum(20,20) == 40'],
            "input1"
        );

//         this.availableQuestions.push(
//             new Question(
//                 6,
//                 "Fill in the function so that it adds 2 numbers together",
//                 "just fill it in",
//                 QuestionType.CREATE,
//                 [questionElementCreate],
//                 5,
//                 `
// function calculateSum($x,$y){
//     ###INPUT|input1|40|true###;
// }
// `
//             )
//         );


        this.populateNewQuestionSet();

        this.loadState(savedTaskManagerState);

        this.currentChapterMaxDifficulty = Math.max(
            ...this.availableQuestions.map((q) => q.difficulty)
        );
    }
}
