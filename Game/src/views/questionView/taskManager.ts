import { QuestionType } from "../../types/questionType";
import Question from "./question";
import { ChoiceQuestionElement, InputQuestionElement, OrderQuestionElement } from "./questionElement";

export default class TaskManager {
    private availableQuestions: Question[] = [];
    //TODO: implement topic id properly
    private currentChapterNumber: number = 1;

    private currentPerformanceIndex: number = 1;

    private currentChapterMaxDifficulty: number;

    private currentQuestionSetForObject = new Map<number, Question>;

    //TODO: Implement loading questions from api

    private shuffleQuestions(questions: Question[]) {
        for (let i = questions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = questions[i];
          questions[i] = questions[j];
          questions[j] = temp;
        }
      }

    getRandomQuestion(){
        // this.shuffleQuestions(this.availableQuestions);
        return this.availableQuestions.pop();
    }

    public populateNewQuestionSet(){
        this.currentChapterMaxDifficulty = Math.max(...this.availableQuestions.map(q => q.difficulty));
        console.log(this.currentChapterMaxDifficulty)
        this.shuffleQuestions(this.availableQuestions)
        console.log(this.availableQuestions)
        for(let i = 1; i <= this.currentChapterMaxDifficulty; i++){
            this.currentQuestionSetForObject.set(i, this.availableQuestions.find(question => question.difficulty == i));
        }
    }

    public getCurrentQuestionFromQuestionSet(){
        return this.currentQuestionSetForObject.get(this.currentPerformanceIndex);
    }

    public questionAnsweredCorrectly(){
        this.currentQuestionSetForObject.delete(this.currentPerformanceIndex);
        this.currentPerformanceIndex ++;
        if(this.currentPerformanceIndex == this.currentChapterMaxDifficulty){
            console.log("OBJECT REPAIRED")
        }else{

        }
    }

    public questionAnsweredIncorrectly(){
        this.currentPerformanceIndex --;
    }

    constructor(questions: Question[]){
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
            ["Hello"],
            "input1"
        );
        let clozeQuestionElement2 = new InputQuestionElement(
            2,
            ["There"],
            "input2"
        );

        this.availableQuestions.push(new Question(
            1,
            "What is the output of the following code?",
            "Just Answer",
            QuestionType.CHOICE,
            [questionElement, questionElement2],
            1,
            code
        ));

        this.availableQuestions.push(new Question(
          1,
          "What is php not capable of doing?",
          "Just Answer",
          QuestionType.CHOICE,
          [questionElement, questionElement2],
          2
      ));

        this.availableQuestions.push(new Question(
            2,
            "What is the output of the following code?",
            "Just Answer",
            QuestionType.SINGLE_INPUT,
            [inputQuestionElement],
            3,
            code
        ));

        this.availableQuestions.push(new Question(
            3,
            "Reorder these elements into the correct order!",
            "just order them",
            QuestionType.DRAG_DROP,
            [dragQuestionElement1, dragQuestionElement2, dragQuestionElement3],
            4
        ));

        this.availableQuestions.push(new Question(
            4,
            "Fill in the blanks!",
            "just fill it in",
            QuestionType.CLOZE,
            [clozeQuestionElement, clozeQuestionElement2],
            5,
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
        ));

        let questionElementSelectBlock = new ChoiceQuestionElement(1, `<?php
        $txt = "Hello world!";
        echo $txt;
?>`, true);
        let questionElementSelectBlock2 = new ChoiceQuestionElement(
            2,
            `<?php
            $txt = "Hello There!";
            echo $txt;
    ?>`,
            false
        );

        this.availableQuestions.push(new Question(
            5,
            "Which code block outputs: Hello There! ",
            "Just Answer",
            QuestionType.SELECT_ONE,
            [questionElementSelectBlock, questionElementSelectBlock2],
            1,
            code
        ));
        // this.availableQuestions = questions;
        this.populateNewQuestionSet();
        console.log(this.currentQuestionSetForObject)
    }
}