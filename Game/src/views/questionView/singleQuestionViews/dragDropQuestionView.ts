import * as Phaser from "phaser";
import Question from "../../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement, OrderQuestionElement } from "../../../classes/question/questionElement";
import ChoiceButton from "../../../ui/choiceButton";
import DraggableCodeBlock from "../../../ui/question/draggableCodeBlock";

export default class DragDropQuestionView extends Phaser.Scene {
    private currentQuestion: Question;

    private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private draggableCodeBlocks: DraggableCodeBlock[] = [];

    private correctAnswer: Phaser.GameObjects.Text;
    private correctTextStyle;


    constructor(questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        super("DragDropQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create(){
        this.displayDragDropQuestion();

        this.events.on("blockDropped", (droppedBlock: DraggableCodeBlock) => {
            this.reorderBlocks(droppedBlock);
        });

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
    
    private async displayDragDropQuestion() {
        let previousBottomY = this.questionText.y + this.questionText.height;
        for (let i = 0; i < this.currentQuestion.elements.length; i++) {
            let element = this.currentQuestion.elements[i];

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

    private reorderBlocks(droppedBlock: DraggableCodeBlock) {
        this.draggableCodeBlocks.sort((a, b) => a.y - b.y);
        // Update positions of all blocks
        let previousBottomY = this.questionText.y + this.questionText.height;
        this.draggableCodeBlocks.forEach((block, index) => {
            block.setY(previousBottomY + 50 + block.height / 2);
            previousBottomY = block.y + block.height / 2;
        });
    }

    private showCorrectText(){
        let previousY = this.draggableCodeBlocks[this.draggableCodeBlocks.length -1 ].y + this.draggableCodeBlocks[this.draggableCodeBlocks.length -1 ].height
        this.correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this.correctTextStyle
        ).setOrigin(0.5,0);
    }

    public checkAnswer() {
        let correct = true;
        this.draggableCodeBlocks.forEach((block, index) => {
            let element: OrderQuestionElement = <OrderQuestionElement>(
                this.currentQuestion.elements.find(
                    (element: OrderQuestionElement) => {
                        return element.id === block.getElementId();
                    }
                )
            );
            if (element.correct_order_position === index + 1) {
                block.markCorrect();
            } else {
                correct = false;
                block.markWrong();
            }
        });
        if(correct){
            this.showCorrectText()
        }
        return new Promise((resolve) => resolve(correct));
    }

}