import * as Phaser from "phaser";
import Question from "../question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../questionElement";
import ChoiceButton from "../choiceButton";
import SelectableCodeBlock from "../selectableCodeBlock";

export default class SelectOneQuestionView extends Phaser.Scene {
    private currentQuestion: Question;

    private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private selectableCodeBlocks: SelectableCodeBlock[] = [];

    private correctAnswer: Phaser.GameObjects.Text;
    private correctTextStyle;

    constructor(
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        super("SelectOneQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create() {
        this.displaySelectOneQuestion();

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
        };
    }

    private async displaySelectOneQuestion() {
        let previousBottomY = this.questionText.y + this.questionText.height;
        for (let i = 0; i < this.currentQuestion.elements.length; i++) {
            let element = this.currentQuestion.elements[i];

            let selectableCodeBlock = new SelectableCodeBlock(
                this,
                element.id,
                element.content,
                () => {
                    this.selectCodeBlock(element.id);
                },
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

    private selectCodeBlock(elementId: number) {
        let selectedBlock: SelectableCodeBlock = this.selectableCodeBlocks.find(
            (block) => block.getSelected()
        );
        selectedBlock ? selectedBlock.deselect() : null;
        this.selectableCodeBlocks
            .find((block) => block.getElementId() === elementId)
            .select();
    }

    private showCorrectText() {
        let previousY =
            this.selectableCodeBlocks[this.selectableCodeBlocks.length - 1].y +
            this.selectableCodeBlocks[this.selectableCodeBlocks.length - 1]
                .height;
        this.correctAnswer = this.add
            .text(
                this.cameras.main.displayWidth / 2,
                previousY + 100,
                "Correct",
                this.correctTextStyle
            )
            .setOrigin(0.5, 0);
    }

    public checkAnswer() {
        let allCorrect = this.selectableCodeBlocks.every((block) => {
            const blockIsCorrect = this.currentQuestion.elements.find(
                (element: ChoiceQuestionElement) =>
                    element.id == block.getElementId()
            ).isCorrect
            const correct = blockIsCorrect == block.getSelected();
            if(block.getSelected() && correct){
                block.markCorrect();
            }else if(block.getSelected() || blockIsCorrect){
                block.markWrong();
            }
            return correct
        });
        if (allCorrect) {
            this.showCorrectText();
        }
        return allCorrect;
    }
}
