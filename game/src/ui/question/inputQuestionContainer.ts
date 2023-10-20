import * as Phaser from "phaser";
import Question from "../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import "highlight.js/styles/night-owl.css";
import {SceneKeys} from "../../types/sceneKeys";
import {debugHelper} from "../../helpers/debugHelper";
import {SupportedLanguages} from "../../types/supportedLanguages";
import {gameController} from "../../main";

export default class InputQuestionContainer extends Phaser.GameObjects.Container {
    private _currentQuestion: Question;

    private _questionText: Phaser.GameObjects.Text;

    private _correctAnswer: Phaser.GameObjects.Text;
    private _correctAnswerStyle:Phaser.Types.GameObjects.Text.TextStyle;

    private _codeBlock;
    private _inputField;

    private _correctTextStyle;

    readonly _sceneKey: SceneKeys;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        // let sceneKey = SceneKeys.INPUT_QUESTION_SCENE_KEY;
        super(scene,x,y);
        // this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
        this.initialiseUI();
    }

    initialiseUI() {
        this.displayInputQuestion();

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

    private displayCodeBlock(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage(SupportedLanguages.PHP, php);
        hljs.registerLanguage(SupportedLanguages.JAVA, java);
        let highlightedCode = hljs.highlight(code, { language: gameController.gameStateManager.curriculum.progLang }).value;

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

        debugHelper.logValue("dummy pre",dummyPre)

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

    private displayInputQuestion(): void {
        if(this._currentQuestion.code_text){
            this._codeBlock = this.displayCodeBlock(this._currentQuestion.code_text)
            this._inputField = this.displayInputField(
                this._currentQuestion.elements[0].element_identifier,
                this._codeBlock.y,
                this._codeBlock.height
            );
        }else{
            this._inputField = this.displayInputField(
                this._currentQuestion.elements[0].element_identifier,
                this._questionText.y,
                this._questionText.height
            );
        }
    }

    private displayInputField(
        elementId: string,
        codeBlockY: number,
        codeBlockHeight: number
    ): Phaser.GameObjects.DOMElement {
        let inputField = document.createElement("input");
        inputField.style.width = `${this.scene.cameras.main.displayWidth / 2}px`;
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

        const inputFieldDomElement = this.scene.add
            .dom(
                this.scene.cameras.main.displayWidth / 2,
                codeBlockY + codeBlockHeight + 100,
                inputField
            )
            .setOrigin(0.5, 0);
        this.add(inputFieldDomElement)
        return inputFieldDomElement;
    }

    private showCorrectAnswers(correctAnswers: [string[]]) {
        let previousY = this._inputField.y + this._inputField.height
        this._correctAnswer = this.scene.add.text(
            this.scene.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct answers would have been:",
            this._correctAnswerStyle
        ).setOrigin(0.5,0);
        correctAnswers.forEach((answers) => {
            this._correctAnswer.appendText(answers.join(" / "))
        })
        this.add(this._correctAnswer);
        debugHelper.logValue("correct answer text", this._correctAnswer.text)
    }

    private showCorrectText(){
        let previousY = this._inputField.y + this._inputField.height
        this._correctAnswer = this.scene.add.text(
            this.scene.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this._correctTextStyle
        ).setOrigin(0.5,0);
        this.add(this._correctAnswer);
    }

    public checkAnswer() {
        let correct = true;
        let correctAnswers:any = [this._currentQuestion.elements[0].correct_answers];
        let inputField = <HTMLInputElement>(
            document.getElementById(
                this._currentQuestion.elements[0].element_identifier
            )
        );
        if (
            !this._currentQuestion.elements[0].correct_answers.includes(
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
        return new Promise((resolve) => resolve(correct));
    }
}
