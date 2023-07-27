import * as Phaser from "phaser";
import Question from "../../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import {ChoiceQuestionElement} from "../../../classes/question/questionElement";
import ChoiceButton from "../../../ui/choiceButton";
import DeviceButton from "../../../ui/deviceButton";
import ApiHelper from "../../../helpers/apiHelper";

export default class CreateQuestionView extends Phaser.Scene {

    private currentQuestion: Question;

    // private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private correctAnswer: Phaser.GameObjects.Text;
    private correctAnswerStyle: Phaser.Types.GameObjects.Text.TextStyle;
    private outputTextStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private codeBlock;

    private correctTextStyle;

    private evaluateButton: DeviceButton;

    private apiHelper: ApiHelper = new ApiHelper();


    constructor(questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        super("CreateQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create() {
        this.displayCreateQuestion();

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

        this.outputTextStyle = {
            fontSize: "35px",
            fontFamily: "forwardRegular",
            // color: "#00c8ff",
            // color: "#f54747",
            color: "#00c8ff",
            wordWrap: {
                width: this.cameras.main.displayWidth - 100, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        }
    }

    private async displayCreateQuestion() {
        this.codeBlock = this.displayCodeBlockCloze(
            this.currentQuestion.code_text + this.currentQuestion.elements[0].content
        );
        const buttonWidth = this.cameras.main.displayWidth / 2;
        this.evaluateButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - buttonWidth / 2,
            this.codeBlock.y + this.codeBlock.height + 100,
            buttonWidth,
            () => {
                this.evaluateCode()
            },
            "Evaluate"
        )
        this.add.existing(this.evaluateButton)
    }

    private evaluateCode() {
        console.log(this.getCode());
        let code = this.getCode();
        this.apiHelper.evaluateCode(code)
            .then((result: any) => result.json()
                .then(data => {
                    console.log(data)
                    this.showOutput(data);
                })
                .catch(error => console.error(error)))
            .catch(error => console.error(error))
    }

    private testCode(code: string) {
        return new Promise((resolve,reject) => {
            this.apiHelper.evaluateCode(code)
                .then((result: any) => result.json()
                    .then(data => {
                        console.log(data)
                        if(data.error){
                            resolve(data.error)
                        }else{
                            if(data.result == "1"){
                                resolve(true)
                            }else{
                                resolve(false)
                            }
                        }
                        // this.showOutput(data);
                    })
                    .catch(error => reject(error)))
                .catch(error => reject(error))
        })
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
        let highlightedCode = hljs.highlight(code, {language: "php"}).value;

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

            let inputField = `<textarea type='text' id='${id}' maxlength='${length}' style="font-family: 'forwardRegular'; font-size: 25px; padding: 10px; border: 5px solid #00c8ff; background-color: #3f414a; color: #d1d6e0; resize: none;"`;

            if (whitespace === "false") {
                inputField += 'style="white-space: nowrap;" ';
            }

            inputField += "></textarea>";

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

    private showCorrectText() {
        let previousY = this.evaluateButton.y + this.evaluateButton.height
        this.correctAnswer?.destroy(true);
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "These Tests were Passed",
            this.correctTextStyle
        ).setOrigin(0.5, 0);
        this.correctAnswer.appendText(this.currentQuestion.elements[0].correct_answers.join("\n"))
    }

    private showWrongText(text:string) {
        let previousY = this.evaluateButton.y + this.evaluateButton.height
        this.correctAnswer?.destroy(true);
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "One of these tests failed with the output: "+text,
            this.correctAnswerStyle
        ).setOrigin(0.5, 0);
        this.correctAnswer.appendText(this.currentQuestion.elements[0].correct_answers.join("\n"))
    }

    private showOutputText(text) {
        let previousY = this.evaluateButton.y + this.evaluateButton.height
        this.correctAnswer?.destroy(true);
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "The output is: " + text,
            this.outputTextStyle
        ).setOrigin(0.5, 0);
    }

    private showError(text: string) {
        let previousY = this.evaluateButton.y + this.evaluateButton.height
        this.correctAnswer?.destroy(true);
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Error: " + text,
            this.correctAnswerStyle
        ).setOrigin(0.5, 0);
    }

    private getUserCodeWithFunciton() {
        let regex = /###INPUT\|(.+?)\|(.+?)\|(.+?)###/g;
        let match;
        let fullCode;
        while ((match = regex.exec(this.currentQuestion.code_text)) !== null) {

            let inputField = <HTMLInputElement>(
                document.getElementById(this.currentQuestion.elements[0].element_identifier)
            );

            fullCode = (this.currentQuestion.code_text).replace(
                match[0],
                inputField.value
            );
        }
        return fullCode;
    }

    private getCode() {

        return this.getUserCodeWithFunciton() + this.currentQuestion.elements[0].content;
    }

    public async checkAnswer() {
        let correct = false;

        let testCondition = this.currentQuestion.elements[0].correct_answers.join(' && ')

        const ifStatement = "\necho " + testCondition +" ? 1 : 0;";

        const fullTestCode = this.getUserCodeWithFunciton() + ifStatement;

        console.log(fullTestCode)

        let inputField = <HTMLInputElement>(
            document.getElementById(this.currentQuestion.elements[0].element_identifier)
        );

        const result:any = await this.testCode(fullTestCode)
        if(result == true){
            this.showCorrectText();
            inputField.style.color = "#00ff7b";
            inputField.style.borderColor = "#00ff7b";
            return true;
        }else{
            this.showWrongText(result);
            inputField.style.color = "#f54747";
            inputField.style.borderColor = "#f54747";
            return false;
        }
    }
}