import * as Phaser from "phaser";
import Question from "../question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../questionElement";
import ChoiceButton from "../choiceButton";

export default class ChoiceQuestionView extends Phaser.Scene {
    private currentQuestion: Question;

    private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private correctAnswer: Phaser.GameObjects.Text;

    private correctAnswerStyle;

    private correctTextStyle;

    constructor(
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        super("ChoiceQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
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

    private displayChoiceQuestion(): void {
        let codeBlock;
        if (this.currentQuestion.code_text) {
            codeBlock = this.displayCodeBlock(this.currentQuestion.code_text);
        }
        this.currentQuestion.elements.forEach(
            (element: ChoiceQuestionElement) => {
                let previousButtonY = this.choiceButtons.length
                    ? this.choiceButtons[this.choiceButtons.length - 1].y +
                      this.choiceButtons[this.choiceButtons.length - 1].height
                    : codeBlock
                    ? codeBlock.y + codeBlock.height
                    : this.questionText.y + this.questionText.height;
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

    private showCorrectText(){
        let previousButtonY =
            this.choiceButtons[this.choiceButtons.length - 1].y +
            this.choiceButtons[this.choiceButtons.length - 1].height;
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct",
            this.correctTextStyle
        ).setOrigin(0.5,0);
    }

    private showCorrectAnswers(correctAnswers: string[]) {
        let previousButtonY =
            this.choiceButtons[this.choiceButtons.length - 1].y +
            this.choiceButtons[this.choiceButtons.length - 1].height;
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct answers would have been:",
            this.correctAnswerStyle
        ).setOrigin(0.5,0);
        this.correctAnswer.appendText(correctAnswers.join('\n'))
    }

    public checkAnswer() {
        let correct = true;
        let correctAnswers = [];
        this.choiceButtons.forEach((button) => {
            let element = this.currentQuestion.elements.find(
                (element) => element.id == button.getElementId()
            );
            if (element.is_correct) {
                correctAnswers.push(element.content);
            }
            if (!(button.isSelected() === element.is_correct)) {
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
        if (!correct) {
            this.showCorrectAnswers(correctAnswers)
        }else{
            this.showCorrectText()
        }
        return new Promise((resolve) => resolve(correct));
    }

    create() {
        this.displayChoiceQuestion();
        this.correctAnswerStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            color: "#f54747",
            wordWrap: {
                width: this.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
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
}
