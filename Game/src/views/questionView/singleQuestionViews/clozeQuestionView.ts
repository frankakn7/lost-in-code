import * as Phaser from "phaser";
import Question from "../question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../questionElement";
import ChoiceButton from "../choiceButton";

export default class ClozeQuestionView extends Phaser.Scene {

    private currentQuestion: Question;

    // private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private correctAnswer: Phaser.GameObjects.Text;
    private correctAnswerStyle:Phaser.Types.GameObjects.Text.TextStyle;

    private codeBlock;

    private correctTextStyle;


    constructor(questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        super("ClozeQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create(){
        this.displayClozeQuestion();

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

    private async displayClozeQuestion() {
        this.codeBlock = this.displayCodeBlockCloze(
            this.currentQuestion.code_text
        );
    }

    private displayCodeBlockCloze(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage("php", php);
        let highlightedCode = hljs.highlight(code, { language: "php" }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        dummyPre.style.fontFamily = "forwardRegular";
        dummyPre.style.fontSize = "25px";
        dummyPre.style.lineHeight = "2.5";
        dummyPre.style.letterSpacing = "5px"
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

    private showCorrectText(){
        let previousY = this.codeBlock.y + this.codeBlock.height
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this.correctTextStyle
        ).setOrigin(0.5,0);
    }

    private showCorrectAnswers(correctAnswers: [string[]]) {
        let previousY = this.codeBlock.y + this.codeBlock.height
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

    public checkAnswer() {
        let correct = true;
        let correctAnswers:any = [];
        this.currentQuestion.elements.forEach((element) => {
            let inputField = <HTMLInputElement>(
                document.getElementById(element.element_identifier)
            );
            correctAnswers.push(element.correct_answers);
            if (element.correct_answers.includes(inputField.value)) {
                inputField.style.color = "#00ff7b";
                inputField.style.borderColor = "#00ff7b";
            } else {
                inputField.style.color = "#f54747";
                inputField.style.borderColor = "#f54747";
                correct = false;
            }
        });
        if(!correct){
            this.showCorrectAnswers(correctAnswers)
        }else{
            this.showCorrectText()
        }
        return new Promise((resolve) => resolve(correct));
    }
}