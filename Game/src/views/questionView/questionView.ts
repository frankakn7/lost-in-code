import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import html2canvas from "html2canvas";
import * as Phaser from "phaser";
import TaskManager from "./taskManager";
import Question from "./question";
import { QuestionType } from "../../types/questionType";
import deviceBackgroundTilePng from "../../assets/Device-Background-Tile.png";
import DeviceButton from "../../ui/deviceButton";
import {
    ChoiceQuestionElement,
    InputQuestionElement,
    OrderQuestionElement,
} from "./questionElement";
import ChoiceButton from "./choiceButton";
import DraggableCodeBlock from "./draggableCodeBlock";

//TODO: put this code block into a question view!!
//         hljs.registerLanguage("php", php);
//         const highlightedCode = hljs.highlight("php", code).value;
//         console.log(highlightedCode);
//         let dummyPre = document.createElement("pre"); // Create a dummy div
//         let dummyDiv = document.createElement("div");
//         dummyDiv.innerHTML = highlightedCode;
//         // dummyPre.style.display = "inline-block";
//         dummyPre.style.display = "none";
//         dummyPre.id = "codeBlock"

//         dummyDiv.style.backgroundColor = "#1c1d21"
//         dummyDiv.style.color = "#c0c5ce"
//         dummyDiv.style.fontFamily = "forwardRegular"
//         dummyDiv.style.lineHeight = "2"

//         dummyPre.appendChild(dummyDiv)
//         console.log(dummyPre)

//         document.body.appendChild(dummyPre);
//         html2canvas(dummyPre, {scale: 1, onclone: (clonedDoc) => {
//             clonedDoc.getElementById("codeBlock").style.display = 'inline-block'
//         }}).then((canvas) => {

//             console.log(canvas);
//             let canvasTexture = this.textures.addCanvas("yourTextureKey", canvas);
//             console.log(canvasTexture)

//             // Now you can use 'yourTextureKey' as a texture key in your game.
//             // For instance:
//             this.add.image(50, 50, "yourTextureKey").setScale(1);
//         });
export default class QuestionView extends Phaser.Scene {
    private taskManager: TaskManager;
    private currentQuestion: Question;

    private questionText: Phaser.GameObjects.Text;

    private textStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private textSidePadding: number = 100;

    private tilesprite: Phaser.GameObjects.TileSprite;

    // private choiceButtons = new Map<string, DeviceButton>();
    private choiceButtons: ChoiceButton[] = [];

    private draggableCodeBlocks: DraggableCodeBlock[] = [];

    private submitButton: DeviceButton;

    constructor(taskManager: TaskManager) {
        super("QuestionView");
        this.taskManager = taskManager;
    }

    preload() {
        this.load.image("backgroundTile", deviceBackgroundTilePng);
    }

    create() {
        console.log("i was created");
        this.events.on("wake", this.onWake);

        this.tilesprite = this.add
            .tileSprite(
                0,
                0,
                this.cameras.main.displayWidth / 3,
                this.cameras.main.displayHeight / 3,
                "backgroundTile"
            )
            .setOrigin(0, 0)
            .setScale(3);

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
            1,
            ["There"],
            "input2"
        );

        // this.currentQuestion = new Question(
        //     1,
        //     "What is the output of the following code?",
        //     "Just Answer",
        //     QuestionType.CHOICE,
        //     [questionElement, questionElement2],
        //     1,
        //     code
        // );

        this.currentQuestion = new Question(
            2,
            "What is the output of the following code?",
            "Just Answer",
            QuestionType.SINGLE_INPUT,
            [inputQuestionElement],
            1,
            code
        );

        this.currentQuestion = new Question(
            3,
            "Reorder these elements into the correct order!",
            "just order them",
            QuestionType.DRAG_DROP,
            [dragQuestionElement1, dragQuestionElement2, dragQuestionElement3],
            1
        );

//         this.currentQuestion = new Question(
//             3,
//             "Fill in the blanks!",
//             "just fill it in",
//             QuestionType.CLOZE,
//             [clozeQuestionElement, clozeQuestionElement2],
//             1,
//             `
// <?php
// $txt = "Hello world!";
// $x = 5;
// $y = 10.5;

// echo $txt;
// echo "<br>";
// echo $x;
// echo "<br>";
// echo $y;
// echo "###INPUT|input1|20|true###";
// echo "<br>";
// echo "###INPUT|input2|15|false###";
// ?>
// `
//         );

        this.textStyle = {
            fontSize: "40px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width:
                    this.cameras.main.displayWidth - this.textSidePadding * 2,
                useAdvancedWrap: true,
            },
            align: "center",
        };

        // this.cameras.main.setBackgroundColor("rgba(6,24,92,1)");

        this.submitButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 -
                this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                console.log("Submit");
                this.checkAnswer();
            },
            "Submit"
        );
        this.submitButton.setY(this.submitButton.y - this.submitButton.height);
        this.add.existing(this.submitButton);

        this.displayQuestion();
        // this.exitQuestion();
        // this.add.existing(draggableCodeBlock)

        this.events.on("blockDropped", (droppedBlock: DraggableCodeBlock) => {
            this.reorderBlocks(droppedBlock);
        });
    }

    onWake() {
        console.log("i am awake");
    }

    private displayCodeBlockCloze(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage("php", php);
        let highlightedCode = hljs.highlight(code, { language: "php" }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        // dummyDiv.style.fontFamily = "forwardRegular";
        dummyDiv.style.fontSize = "25px";
        dummyDiv.style.lineHeight = "2.5";
        // dummyDiv.style.display = "inline-block";
        dummyDiv.style.width = `${this.cameras.main.displayWidth - 200}px`;
        dummyDiv.style.maxHeight = `${this.cameras.main.displayHeight / 3}px`;
        dummyDiv.style.overflow = "scroll";
        dummyDiv.style.overscrollBehavior = "contain";
        dummyDiv.style.backgroundColor = "white";
        dummyDiv.style.padding = "20px";
        dummyDiv.style.border = "10px solid #00c8ff";

        dummyDiv.style.backgroundColor = "#1c1d21";
        dummyDiv.style.color = "#c0c5ce";

        // Extract the placeholders and their information
        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let match;
        while ((match = regex.exec(dummyDiv.innerHTML)) !== null) {
            let id = match[1];
            let length = match[2];
            let whitespace = match[3];

            let inputField = `<input type='text' id='${id}' maxlength='${length}' style="font-family: 'forwardRegular'; font-size: 25px; padding: 10px; border: 5px solid #00c8ff; background-color: #3f414a; color: #d1d6e0"`;

            if (whitespace === "false") {
                inputField += 'style="white-space: nowrap;" ';
            }

            inputField += "/>";

            dummyDiv.innerHTML = dummyDiv.innerHTML.replace(
                match[0],
                inputField
            );
        }

        dummyPre.appendChild(dummyDiv);
        // dummyForm.appendChild(dummyPre);

        // Add the pre element to the Phaser DOM
        return this.add
            .dom(
                this.cameras.main.displayWidth / 2,
                this.questionText.y + this.questionText.height + 10,
                dummyPre
            )
            .setOrigin(0.5, 0);
    }

    private displayCodeBlock(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage("php", php);
        let highlightedCode = hljs.highlight(code, { language: "php" }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        // dummyDiv.style.fontFamily = "forwardRegular";
        dummyDiv.style.fontSize = "25px";
        dummyDiv.style.lineHeight = "2";
        // dummyDiv.style.display = "inline-block";
        dummyDiv.style.width = `${this.cameras.main.displayWidth - 200}px`;
        dummyDiv.style.maxHeight = `${this.cameras.main.displayHeight / 3}px`;
        dummyDiv.style.overflow = "scroll";
        dummyDiv.style.overscrollBehavior = "contain";
        dummyDiv.style.backgroundColor = "white";
        dummyDiv.style.padding = "20px";
        dummyDiv.style.border = "10px solid #00c8ff";

        dummyDiv.style.backgroundColor = "#1c1d21";
        dummyDiv.style.color = "#c0c5ce";

        dummyPre.appendChild(dummyDiv);
        // dummyForm.appendChild(dummyPre);

        // Add the pre element to the Phaser DOM
        return this.add
            .dom(
                this.cameras.main.displayWidth / 2,
                this.questionText.y + this.questionText.height + 10,
                dummyPre
            )
            .setOrigin(0.5, 0);
    }

    private displayChoiceQuestion(): void {
        let codeBlock = this.displayCodeBlock(this.currentQuestion.codeText);
        this.currentQuestion.elements.forEach(
            (element: ChoiceQuestionElement) => {
                let previousButtonY = this.choiceButtons.length
                    ? this.choiceButtons[this.choiceButtons.length - 1].y +
                      this.choiceButtons[this.choiceButtons.length - 1].height
                    : codeBlock.y + codeBlock.height;
                let answerButton = new ChoiceButton(
                    this,
                    this.cameras.main.displayWidth / 2 -
                        this.cameras.main.displayWidth / 4,
                    previousButtonY + 100,
                    this.cameras.main.displayWidth / 2,
                    () => {
                        // console.log(element.checkIfCorrect(true));
                    },
                    element.content,
                    element.id
                );
                // answerButton.setY(answerButton.y - answerButton.height);
                this.add.existing(answerButton);
                this.choiceButtons.push(answerButton);
            }
        );
    }

    private displayInputField(
        elementId: string,
        codeBlockY: number,
        codeBlockHeight: number
    ): Phaser.GameObjects.DOMElement {
        let inputField = document.createElement("input");
        inputField.style.width = `${this.cameras.main.displayWidth / 2}px`;
        inputField.style.fontFamily = "forwardRegular";
        inputField.style.fontSize = "30px";
        // inputField.style.lineHeight = "2";
        inputField.style.height = "100px";
        inputField.style.backgroundColor = "#1c1d21";
        inputField.style.color = "#c0c5ce";
        inputField.style.border = "10px solid #00c8ff";
        inputField.style.padding = "0 50px";
        inputField.placeholder = "Your Input";
        inputField.id = elementId;

        return this.add
            .dom(
                this.cameras.main.displayWidth / 2,
                codeBlockY + codeBlockHeight + 50,
                inputField
            )
            .setOrigin(0.5, 0);
    }

    private displayInputQuestion(): void {
        let codeBlock = this.displayCodeBlock(this.currentQuestion.codeText);
        let input = this.displayInputField(
            this.currentQuestion.elements[0].elementIdentifier,
            codeBlock.y,
            codeBlock.height
        );
    }

    private reorderBlocks(droppedBlock: DraggableCodeBlock) {
        this.draggableCodeBlocks.sort((a, b) => a.y - b.y);
        // Update positions of all blocks
        let previousBottomY = this.questionText.y + this.questionText.height;
        this.draggableCodeBlocks.forEach((block, index) => {
            block.setY(previousBottomY + 50 + block.height / 2);
            previousBottomY = block.y + block.height / 2;
        });
    }

    private async displayDragDropQuestion() {
        let previousBottomY = this.questionText.y + this.questionText.height;
        for (let i = 0; i < this.currentQuestion.elements.length; i++) {
            let element = this.currentQuestion.elements[i];
            console.log(previousBottomY);
            let draggableCodeBlock = new DraggableCodeBlock(
                this,
                element.id,
                element.content,
                this.cameras.main.displayWidth / 2,
                previousBottomY + 50
            );
            await draggableCodeBlock.createCodeBlockImage();
            draggableCodeBlock.setY(
                draggableCodeBlock.y + draggableCodeBlock.height / 2
            );
            this.draggableCodeBlocks.push(draggableCodeBlock);
            previousBottomY =
                draggableCodeBlock.y + draggableCodeBlock.height / 2;
        }
    }

    private async displayClozeQuestion() {
        let codeBlock = this.displayCodeBlockCloze(
            this.currentQuestion.codeText
        );
    }

    private displayQuestion(): void {
        this.questionText = this.add
            .text(
                this.cameras.main.displayWidth / 2,
                100,
                this.currentQuestion.questionText,
                this.textStyle
            )
            .setOrigin(0.5, 0);
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                console.log("choice");
                this.displayChoiceQuestion();
                break;
            case QuestionType.SINGLE_INPUT:
                console.log("single input");
                this.displayInputQuestion();
                break;
            case QuestionType.DRAG_DROP:
                console.log("drag drop");
                this.displayDragDropQuestion();
                break;
            case QuestionType.CLOZE:
                console.log("cloze");
                this.displayClozeQuestion();
            default:
                console.log("none");
                break;
        }
    }

    private checkAnswerClozeQuestion() {
        let correct = true;
        this.currentQuestion.elements.forEach((element) => {
            let inputField = <HTMLInputElement>(
                document.getElementById(element.elementIdentifier)
            );
            if (element.correctAnswers.includes(inputField.value)) {
                inputField.style.color = "#00ff7b";
                inputField.style.borderColor = "#00ff7b";
            } else {
                inputField.style.color = "#f54747";
                inputField.style.borderColor = "#f54747";
                correct = false;
            }
        });
        console.log(correct)
    }

    private checkAnswerOrderQuestion() {
        let correct = true;
        this.draggableCodeBlocks.forEach((block, index) => {
            let element: OrderQuestionElement = <OrderQuestionElement>(
                this.currentQuestion.elements.find(
                    (element: OrderQuestionElement) => {
                        return element.id === block.getElementId();
                    }
                )
            );
            console.log(element);
            if (element.correctOrderPosition === index + 1) {
                block.markCorrect();
            } else {
                correct = false;
                block.markWrong();
            }
        });
        console.log(correct);
    }

    private checkAnswerInputQuestion() {
        let correct = true;
        let inputField = <HTMLInputElement>(
            document.getElementById(
                this.currentQuestion.elements[0].elementIdentifier
            )
        );
        if (
            !this.currentQuestion.elements[0].correctAnswers.includes(
                inputField.value
            )
        ) {
            inputField.style.color = "#f54747";
            inputField.style.borderColor = "#f54747";
            correct = false;
        } else {
            inputField.style.color = "#00ff7b";
            inputField.style.borderColor = "#00ff7b";
        }
        console.log(correct);
    }

    private checkAnswerChoiceQuestion() {
        let correct = true;
        this.choiceButtons.forEach((button) => {
            let element = this.currentQuestion.elements.find(
                (element) => element.id == button.getElementId()
            );
            if (!(button.isSelected() === element.isCorrect)) {
                if (button.isSelected()) {
                    button.colorIncorrectSelected();
                } else {
                    button.colorIncorrectNotSelected();
                }
                correct = false;
            } else {
                if (button.isSelected()) {
                    button.colorCorrectSelected();
                }
            }
        });
        console.log(correct);
    }

    private checkAnswer() {
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                this.checkAnswerChoiceQuestion();
                break;
            case QuestionType.SINGLE_INPUT:
                this.checkAnswerInputQuestion();
                break;
            case QuestionType.DRAG_DROP:
                this.checkAnswerOrderQuestion();
                break;
            case QuestionType.CLOZE:
                this.checkAnswerClozeQuestion();
                break;
            default:
                console.log("none");
                break;
        }
        this.submitButton.destroy(true);
        this.submitButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 -
                this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.exitQuestion();
            },
            "Exit"
        );
        this.submitButton.setY(this.submitButton.y - this.submitButton.height);
        this.add.existing(this.submitButton);
    }

    update(time: number, delta: number): void {}

    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitQuestion(): void {
        this.scene.wake("Play");
        this.scene.wake("Room");
        this.scene.wake("controlPad");
        this.scene.wake("pauseChatButtons");
        this.scene.sleep(this);
    }
}
