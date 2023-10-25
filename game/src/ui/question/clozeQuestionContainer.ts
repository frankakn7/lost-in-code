import * as Phaser from "phaser";
import Question from "../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import "highlight.js/styles/night-owl.css";
import {SupportedLanguages} from "../../types/supportedLanguages";
import {gameController} from "../../main";

export default class ClozeQuestionContainer extends Phaser.GameObjects.Container {

    private _currentQuestion: Question;

    // private choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _correctAnswer: Phaser.GameObjects.Text;
    private _correctAnswerStyle:Phaser.Types.GameObjects.Text.TextStyle;

    private _codeBlock;

    private _correctTextStyle;

    // readonly _sceneKey: SceneKeys;


    constructor(scene: Phaser.Scene, x:number, y:number, questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        // let sceneKey = SceneKeys.CLOZE_QUESTION_SCENE_KEY;
        super(scene,x,y);
        // this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
        this.initialiseUI();
    }

    private initialiseUI(){
        this.displayClozeQuestion();

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

    private async displayClozeQuestion() {
        this._codeBlock = this.displayCodeBlockCloze(
            this._currentQuestion.code_text
        );
    }

    private displayCodeBlockCloze(code: string): Phaser.GameObjects.DOMElement {
        hljs.registerLanguage(SupportedLanguages.PHP, php);
        hljs.registerLanguage(SupportedLanguages.JAVA, java);

        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let parts = code.split(regex);

        let processedParts = [];

        for (let i = 0; i < parts.length; i += 4) {
            processedParts.push(hljs.highlight(parts[i], { language: gameController.gameStateManager.curriculum.progLang }).value);

            if (i + 1 < parts.length) {
                let id = parts[i + 1];
                let length = parts[i + 2];
                let whitespace = parts[i + 3] === "true" ? "" : ' style="white-space: nowrap;"';

                processedParts.push(`<input type='text' id='${id}' maxlength='${length}' style="width: ${length}ch; font-family: 'forwardRegular'; font-size: 25px; padding: 10px; border: 5px solid #00c8ff; background-color: #3f414a; color: #d1d6e0"${whitespace}/>`);
            }
        }

        let highlightedCode = processedParts.join("");

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
        dummyPre.style.width = `${this.scene.cameras.main.displayWidth - 200}px`;
        dummyPre.style.maxHeight = `${this.scene.cameras.main.displayHeight / 4}px`;
        dummyPre.style.overflow = "scroll";
        dummyPre.style.overscrollBehavior = "contain";
        dummyPre.style.backgroundColor = "white";
        dummyPre.style.padding = "20px";
        dummyPre.style.border = "10px solid #00c8ff";

        dummyPre.style.backgroundColor = "#1c1d21";
        dummyPre.style.color = "#c0c5ce";

        // Extract the placeholders and their information
        // console.log(dummyDiv.innerHTML)
        // let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        // let match;
        // while ((match = regex.exec(dummyDiv.innerHTML)) !== null) {
        //     console.log(match);
        //     let id = match[1];
        //     let length = match[2];
        //     let whitespace = match[3];
        //
        //     let inputField = `<input type='text' id='${id}' maxlength='${length}' style="font-family: 'forwardRegular'; font-size: 25px; padding: 10px; border: 5px solid #00c8ff; background-color: #3f414a; color: #d1d6e0"`;
        //
        //     if (whitespace === "false") {
        //         inputField += 'style="white-space: nowrap;" ';
        //     }
        //
        //     inputField += "/>";
        //
        //     dummyDiv.innerHTML = dummyDiv.innerHTML.replace(
        //         match[0],
        //         inputField
        //     );
        // }

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
        this.add(domElement);
        return domElement;
    }

    private showCorrectText(){
        let previousY = this._codeBlock.y + this._codeBlock.height
        this._correctAnswer = this.scene.add.text(
            this.scene.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this._correctTextStyle
        ).setOrigin(0.5,0);
        this.add(this._correctAnswer);
    }

    private showCorrectAnswers(correctAnswers: [string[]]) {
        let previousY = this._codeBlock.y + this._codeBlock.height
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
    }

    public checkAnswer() {
        let correct = true;
        let correctAnswers:any = [];
        this._currentQuestion.elements.forEach((element) => {
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