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
import SelectableCodeBlock from "./selectableCodeBlock";

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

    private selectableCodeBlocks: SelectableCodeBlock[] = [];

    private submitButton: DeviceButton;

    private questions: Question[] = [];

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

        // this.taskManager = new TaskManager(this.questions);
        this.currentQuestion = this.taskManager.getRandomQuestion();
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
        if(this.currentQuestion.codeText){
            codeBlock = this.displayCodeBlock(this.currentQuestion.codeText);
        }
        this.currentQuestion.elements.forEach(
            (element: ChoiceQuestionElement) => {
                let previousButtonY = this.choiceButtons.length
                    ? this.choiceButtons[this.choiceButtons.length - 1].y +
                      this.choiceButtons[this.choiceButtons.length - 1].height
                    : (codeBlock ? codeBlock.y + codeBlock.height : this.questionText.y + this.questionText.height);
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

    private selectCodeBlock(elementId: number){
        let selectedBlock: SelectableCodeBlock = this.selectableCodeBlocks.find((block) => block.getSelected())
        selectedBlock ? selectedBlock.deselect() : null;
        this.selectableCodeBlocks.find((block) => block.getElementId() === elementId).select();
    }

    private async displaySelectOneQuestion(){
        let previousBottomY = this.questionText.y + this.questionText.height;
        for (let i = 0; i < this.currentQuestion.elements.length; i++) {
            let element = this.currentQuestion.elements[i];
            console.log(previousBottomY);
            console.log(element.content)
            let selectableCodeBlock = new SelectableCodeBlock(
                this,
                element.id,
                element.content,
                () => {this.selectCodeBlock(element.id)},
                this.cameras.main.displayWidth / 2,
                previousBottomY + 50
            );
            await selectableCodeBlock.createCodeBlockImage();
            selectableCodeBlock.setY(
                selectableCodeBlock.y + selectableCodeBlock.height / 2
            );
            this.selectableCodeBlocks.push(selectableCodeBlock);
            previousBottomY =
            selectableCodeBlock.y + selectableCodeBlock.height / 2;
        }
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
                break;
            case QuestionType.SELECT_ONE:
                console.log("select one");
                this.displaySelectOneQuestion();
                break;
            default:
                console.log("none");
                break;
        }
    }

    private checkAnswerSelectOneQuestion(){
        let selectedBlock = this.selectableCodeBlocks.find((block) => block.getSelected())
        if(selectedBlock){
            let elementId = selectedBlock.getElementId();
            let correct = this.currentQuestion.elements.find((element: ChoiceQuestionElement) => element.id == elementId).isCorrect
            if(correct){
                selectedBlock.markCorrect()
            }else{
                selectedBlock.markWrong()
            }
        }else{
            this.selectableCodeBlocks.forEach((block) => block.markWrong());
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
            case QuestionType.SELECT_ONE:
                this.checkAnswerSelectOneQuestion();
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
        this.scene.remove(this);
    }
}
