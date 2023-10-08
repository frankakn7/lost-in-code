import * as Phaser from "phaser";
import Question from "../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../../classes/question/questionElement";
import ChoiceButton from "../choiceButton";
import {SceneKeys} from "../../types/sceneKeys";
import {Scene} from "phaser";
import {debugHelper} from "../../helpers/debugHelper";

export default class ChoiceQuestionContainer extends Phaser.GameObjects.Container {
    private _currentQuestion: Question;

    private _choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _correctAnswer: Phaser.GameObjects.Text;

    private _correctAnswerStyle;

    private _correctTextStyle;

    private _buttonWidth = 100;

    readonly _sceneKey: SceneKeys;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        // let sceneKey = SceneKeys.CHOICE_QUESTION_SCENE_KEY;
        super(scene,x,y);
        // this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
        this.initialiseUI();
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
        dummyPre.style.width = `${this.scene.cameras.main.displayWidth - 200}px`;
        dummyPre.style.maxHeight = `${this.scene.cameras.main.displayHeight / 4}px`;
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
        const domElement = this.scene.add
            .dom(
                this.scene.cameras.main.displayWidth / 2,
                this._questionText.y + this._questionText.height + 10,
                dummyPre
            )
            .setOrigin(0.5, 0);
        this.add(domElement)
        return domElement
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
                    this.scene,
                    this.scene.cameras.main.displayWidth / 2 -
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
                this.scene.add.existing(answerButton);
                this.add(answerButton);
                this._choiceButtons.push(answerButton);
            }
        );
    }

    private showCorrectText(){
        let previousButtonY =
            this._choiceButtons[this._choiceButtons.length - 1].y +
            this._choiceButtons[this._choiceButtons.length - 1].height;
        this._correctAnswer = this.scene.add.text(
            this.scene.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct",
            this._correctTextStyle
        ).setOrigin(0.5,0);
        this.add(this._correctAnswer)
    }

    private showCorrectAnswers(correctAnswers: string[]) {
        let previousButtonY =
            this._choiceButtons[this._choiceButtons.length - 1].y +
            this._choiceButtons[this._choiceButtons.length - 1].height;
        this._correctAnswer = this.scene.add.text(
            this.scene.cameras.main.displayWidth / 2,
            previousButtonY + 50,
            "Correct answers would have been:",
            this._correctAnswerStyle
        ).setOrigin(0.5,0);
        this._correctAnswer.appendText(correctAnswers.join('\n'))
        this.add(this._correctAnswer)
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

    initialiseUI() {
        this._buttonWidth = this.scene.cameras.main.displayWidth - 300;
        this.displayChoiceQuestion();
        this._correctAnswerStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            color: "#f54747",
            wordWrap: {
                width: this.scene.cameras.main.displayWidth - 100, //once for left and once for right
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
                width: this.scene.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        }
    }
}
