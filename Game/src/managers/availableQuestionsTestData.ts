import {
    ChoiceQuestionElement,
    CreateQuestionElement,
    InputQuestionElement,
    OrderQuestionElement
} from "../classes/question/questionElement";
import Question from "../classes/question/question";
import {QuestionType} from "../types/questionType";

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

let availableQuestions = []

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
    ["Hello", "hello"],
    "input1"
);
let clozeQuestionElement2 = new InputQuestionElement(
    2,
    ["There", "there"],
    "input2"
);

availableQuestions.push(
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

availableQuestions.push(
    new Question(
        1,
        "What is php not capable of doing?",
        "Just Answer",
        QuestionType.CHOICE,
        [questionElement, questionElement2],
        2
    )
);

availableQuestions.push(
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

availableQuestions.push(
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

availableQuestions.push(
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

availableQuestions.push(
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
    ['calculateSum(5,10) == 15', 'calculateSum(20,20) == 40'],
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

export default availableQuestions;