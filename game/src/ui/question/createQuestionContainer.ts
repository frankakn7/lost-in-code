import * as Phaser from "phaser";
import Question from "../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../../classes/question/questionElement";
import ChoiceButton from "../choiceButton";
import DeviceButton from "../deviceButton";
import ApiHelper from "../../helpers/apiHelper";
import { SceneKeys } from "../../types/sceneKeys";
import { debugHelper } from "../../helpers/debugHelper";

export default class CreateQuestionContainer extends Phaser.GameObjects.Container {
    private _currentQuestion: Question;

    // private choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _correctAnswer: Phaser.GameObjects.Text;
    private _correctAnswerStyle: Phaser.Types.GameObjects.Text.TextStyle;
    private _outputTextStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private _codeBlock;

    private _correctTextStyle;

    private _evaluateButton: DeviceButton;

    private _apiHelper: ApiHelper = new ApiHelper();

    // readonly _sceneKey: SceneKeys;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question,
    ) {
        // let sceneKey = SceneKeys.CREATE_QUESTION_SCENE_KEY;
        super(scene, x, y);
        // this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
        this.initialiseUI();
    }

    private initialiseUI() {
        this.displayCreateQuestion();

        this._correctAnswerStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            color: "#f54747",
            wordWrap: {
                width: this.scene.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            lineSpacing: 0,
            align: "center",
        };

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
        };

        this._outputTextStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            // color: "#f54747",
            color: "#00c8ff",
            wordWrap: {
                width: this.scene.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        };
    }

    private async displayCreateQuestion() {
        this._codeBlock = this.displayCodeBlockCloze(
            this._currentQuestion.code_text + this._currentQuestion.elements[0].content,
        );
        const buttonWidth = this.scene.cameras.main.displayWidth / 2;
        this._evaluateButton = new DeviceButton(
            this.scene,
            this.scene.cameras.main.displayWidth / 2 - buttonWidth / 2,
            this._codeBlock.y + this._codeBlock.height + 100,
            buttonWidth,
            () => {
                this.evaluateCode();
            },
            "Evaluate",
        );
        this.scene.add.existing(this._evaluateButton);
        this.add(this._evaluateButton);
    }

    private evaluateCode() {
        let code = this.getCode();
        this._apiHelper
            .evaluateCode(code)
            .then((result: any) =>
                result
                    .json()
                    .then((data) => {
                        debugHelper.logValue("evaluate code response", data);
                        this.showOutput(data);
                    })
                    .catch((error) => console.error(error)),
            )
            .catch((error) => console.error(error));
    }

    private testCode(code: string) {
        return new Promise((resolve, reject) => {
            this._apiHelper
                .evaluateCode(code)
                .then((result: any) =>
                    result
                        .json()
                        .then((data) => {
                            debugHelper.logValue("evaluate code response", data);
                            if (data.error) {
                                resolve(data.error);
                            } else {
                                if (data.result == "1") {
                                    resolve(true);
                                } else {
                                    resolve(false);
                                }
                            }
                            // this.showOutput(data);
                        })
                        .catch((error) => reject(error)),
                )
                .catch((error) => reject(error));
        });
    }

    private showOutput(response: any) {
        if (response.result) {
            this.showOutputText(response.result);
        } else if (response.result == "") {
            this.showOutputText(".... nothing?");
        } else if (response.error) {
            this.showError(response.error);
        }
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
        dummyPre.style.letterSpacing = "5px";
        // dummyPre.style.display = "inline-block";
        dummyPre.style.width = `${this.scene.cameras.main.displayWidth - 200}px`;
        dummyPre.style.maxHeight = `${this.scene.cameras.main.displayHeight / 3}px`;
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

            let inputField = `<textarea type='text' id='${id}' maxlength='${length}' style="font-family: 'forwardRegular'; font-size: 25px; padding: 10px; border: 5px solid #00c8ff; background-color: #3f414a; color: #d1d6e0; resize: none;"`;

            if (whitespace === "false") {
                inputField += 'style="white-space: nowrap;" ';
            }

            inputField += "></textarea>";

            dummyDiv.innerHTML = dummyDiv.innerHTML.replace(match[0], inputField);
        }

        dummyPre.appendChild(dummyDiv);
        // dummyForm.appendChild(dummyPre);

        // Add the pre element to the Phaser DOM
        const domElement = this.scene.add
            .dom(
                this.scene.cameras.main.displayWidth / 2,
                this._questionText.y + this._questionText.height + 10,
                dummyPre,
            )
            .setOrigin(0.5, 0);
        this.add(domElement);
        return domElement;
    }

    private showCorrectText() {
        let previousY = this._evaluateButton.y + this._evaluateButton.height;
        this._correctAnswer?.destroy(false);
        this._correctAnswer = this.scene.add
            .text(
                this.scene.cameras.main.displayWidth / 2,
                previousY + 100,
                "These Tests were Passed",
                this._correctTextStyle,
            )
            .setOrigin(0.5, 0);
        this._correctAnswer.appendText(this._currentQuestion.elements[0].correct_answers.join("\n"));
        this.add(this._correctAnswer);
    }

    private showWrongText(text: string) {
        let previousY = this._evaluateButton.y + this._evaluateButton.height;
        this._correctAnswer?.destroy(false);
        this._correctAnswer = this.scene.add
            .text(
                this.scene.cameras.main.displayWidth / 2,
                previousY + 100,
                "One of these tests failed with the output: " + text,
                this._correctAnswerStyle,
            )
            .setOrigin(0.5, 0);
        this._correctAnswer.appendText(this._currentQuestion.elements[0].correct_answers.join("\n"));
        this.add(this._correctAnswer);
    }

    private showOutputText(text) {
        let previousY = this._evaluateButton.y + this._evaluateButton.height;
        this._correctAnswer?.destroy(false);
        this._correctAnswer = this.scene.add
            .text(
                this.scene.cameras.main.displayWidth / 2,
                previousY + 100,
                "The output is: " + text,
                this._outputTextStyle,
            )
            .setOrigin(0.5, 0);
        this.add(this._correctAnswer)
    }

    private showError(text: string) {
        let previousY = this._evaluateButton.y + this._evaluateButton.height;
        this._correctAnswer?.destroy(false);
        this._correctAnswer = this.scene.add
            .text(this.scene.cameras.main.displayWidth / 2, previousY + 100, "Error: " + text, this._correctAnswerStyle)
            .setOrigin(0.5, 0);
        this.add(this._correctAnswer);
    }

    private getUserCodeWithFunciton() {
        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let match;
        let fullCode;
        while ((match = regex.exec(this._currentQuestion.code_text)) !== null) {
            let inputField = <HTMLInputElement>(
                document.getElementById(this._currentQuestion.elements[0].element_identifier)
            );

            fullCode = this._currentQuestion.code_text.replace(match[0], inputField.value);
        }
        return fullCode;
    }

    private getCode() {
        return this.getUserCodeWithFunciton() + this._currentQuestion.elements[0].content;
    }

    public async checkAnswer() {
        let correct = false;

        let testCondition = this._currentQuestion.elements[0].correct_answers.join(" && ");

        const ifStatement = "\necho " + testCondition + " ? 1 : 0;";

        const fullTestCode = this.getUserCodeWithFunciton() + ifStatement;

        debugHelper.logValue("full test code", fullTestCode);

        let inputField = <HTMLInputElement>(
            document.getElementById(this._currentQuestion.elements[0].element_identifier)
        );

        const result: any = await this.testCode(fullTestCode);
        if (result == true) {
            this.showCorrectText();
            inputField.style.color = "#00ff7b";
            inputField.style.borderColor = "#00ff7b";
            return true;
        } else {
            this.showWrongText(result);
            inputField.style.color = "#f54747";
            inputField.style.borderColor = "#f54747";
            return false;
        }
    }
}
