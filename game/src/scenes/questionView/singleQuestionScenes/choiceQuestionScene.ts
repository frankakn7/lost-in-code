import * as Phaser from "phaser";
import Question from "../../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../../../classes/question/questionElement";
import ChoiceButton from "../../../ui/choiceButton";
import {SceneKeys} from "../../../types/sceneKeys";
import {Scene} from "phaser";

export default class ChoiceQuestionScene extends Phaser.Scene {
    private _currentQuestion: Question;

    private _choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _correctAnswer: Phaser.GameObjects.Text;

    private _correctAnswerStyle;

    private _correctTextStyle;

    private _buttonWidth = 100;

    readonly _sceneKey: SceneKeys;

    constructor(
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        let sceneKey = SceneKeys.CHOICE_QUESTION_SCENE_KEY;
        super(sceneKey);
        this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
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
        dummyPre.style.maxHeight = `${this.cameras.main.displayHeight / 4}px`;
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
                this._questionText.y + this._questionText.height + 10,
                dummyPre
            )
            .setOrigin(0.5, 0);
    }

    private displayChoiceQuestion(): void {
        let codeBlock;
        if (this._currentQuestion.code_text) {
            codeBlock = this.displayCodeBlock(this._currentQuestion.code_text);
        }
        this._currentQuestion.elements.forEach(
            (element: ChoiceQuestionElement) => {
                let previousButtonY = this._choiceButtons.length
                    ? this._choiceButtons[this._choiceButtons.length - 1].y +
                      this._choiceButtons[this._choiceButtons.length - 1].height
                    : codeBlock
                    ? codeBlock.y + codeBlock.height
                    : this._questionText.y + this._questionText.height;
                let answerButton = new ChoiceButton(
                    this,
                    this.cameras.main.displayWidth / 2 -
                        this._buttonWidth / 2,
                    previousButtonY + 100,
                    this._buttonWidth  ,
                    () => {
                        // console.log(element.checkIfCorrect(true));
                    },
                    element.content,
                    element.id
                );
                // answerButton.setY(answerButton.y - answerButton.height);
                this.add.existing(answerButton);
                this._choiceButtons.push(answerButton);
            }
        );
    }

    private showCorrectText(){
        let previousButtonY =
            this._choiceButtons[this._choiceButtons.length - 1].y +
            this._choiceButtons[this._choiceButtons.length - 1].height;
        this._correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct",
            this._correctTextStyle
        ).setOrigin(0.5,0);
    }

    private showCorrectAnswers(correctAnswers: string[]) {
        let previousButtonY =
            this._choiceButtons[this._choiceButtons.length - 1].y +
            this._choiceButtons[this._choiceButtons.length - 1].height;
        this._correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct answers would have been:",
            this._correctAnswerStyle
        ).setOrigin(0.5,0);
        this._correctAnswer.appendText(correctAnswers.join('\n'))
    }

    public checkAnswer() {
        let correct = true;
        let correctAnswers = [];
        this._choiceButtons.forEach((button) => {
            let element = this._currentQuestion.elements.find(
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
        this._buttonWidth = this.cameras.main.displayWidth - 300;
        this.displayChoiceQuestion();
        this._correctAnswerStyle = {
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

        this._correctTextStyle = {
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
