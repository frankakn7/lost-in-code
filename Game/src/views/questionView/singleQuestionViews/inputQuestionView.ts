import * as Phaser from "phaser";
import Question from "../question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";

export default class InputQuestionView extends Phaser.Scene {
    private currentQuestion: Question;

    private questionText: Phaser.GameObjects.Text;

    private correctAnswer: Phaser.GameObjects.Text;
    private correctAnswerStyle:Phaser.Types.GameObjects.Text.TextStyle;

    private codeBlock;
    private inputField;

    private correctTextStyle;

    constructor(
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        super("InputQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create() {
        this.displayInputQuestion();

        this.correctAnswerStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            color: "#f54747",
            wordWrap: {
                width: this.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            lineSpacing: 0,
            align: "center",
        }

        this.correctTextStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            // color: "#f54747",
            color: "#00ff7b",
            wordWrap: {
                width: this.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        }
    }

    private displayCodeBlock(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage("php", php);
        let highlightedCode = hljs.highlight(code, { language: "php" }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        dummyPre.style.fontFamily = "forwardRegular";
        dummyPre.style.fontSize = "25px";
        dummyPre.style.lineHeight = "2";
        dummyPre.style.letterSpacing = "5px";
        // dummyPre.style.display = "inline-block";
        dummyPre.style.width = `${this.cameras.main.displayWidth - 200}px`;
        dummyPre.style.maxHeight = `${this.cameras.main.displayHeight / 3}px`;
        dummyPre.style.overflow = "scroll";
        dummyPre.style.overscrollBehavior = "contain";
        dummyPre.style.backgroundColor = "white";
        dummyPre.style.padding = "20px";
        dummyPre.style.border = "10px solid #00c8ff";

        dummyPre.style.backgroundColor = "#1c1d21";
        dummyPre.style.color = "#c0c5ce";

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

    private displayInputQuestion(): void {
        this.codeBlock = this.displayCodeBlock(this.currentQuestion.codeText);
        this.inputField = this.displayInputField(
            this.currentQuestion.elements[0].elementIdentifier,
            this.codeBlock.y,
            this.codeBlock.height
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
                codeBlockY + codeBlockHeight + 100,
                inputField
            )
            .setOrigin(0.5, 0);
    }

    private showCorrectAnswers(correctAnswers: [string[]]) {
        let previousY = this.inputField.y + this.inputField.height
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct answers would have been:",
            this.correctAnswerStyle
        ).setOrigin(0.5,0);
        correctAnswers.forEach((answers) => {
            this.correctAnswer.appendText(answers.join(" / "))
        })
        console.log(this.correctAnswer.text);
    }

    private showCorrectText(){
        let previousY = this.inputField.y + this.inputField.height
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this.correctTextStyle
        ).setOrigin(0.5,0);
    }

    public checkAnswer() {
        let correct = true;
        let correctAnswers:any = [this.currentQuestion.elements[0].correctAnswers];
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
        if(!correct){
            this.showCorrectAnswers(correctAnswers);
        }else{
            this.showCorrectText()
        }
        return correct;
    }
}
