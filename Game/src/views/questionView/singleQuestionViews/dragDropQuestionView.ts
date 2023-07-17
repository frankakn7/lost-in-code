import * as Phaser from "phaser";
import Question from "../question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement, OrderQuestionElement } from "../questionElement";
import ChoiceButton from "../choiceButton";
import DraggableCodeBlock from "../draggableCodeBlock";

export default class DragDropQuestionView extends Phaser.Scene {
    private currentQuestion: Question;

    private choiceButtons: ChoiceButton[] = [];

    private questionText: Phaser.GameObjects.Text;

    private draggableCodeBlocks: DraggableCodeBlock[] = [];

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

    private reorderBlocks(droppedBlock: DraggableCodeBlock) {
        this.draggableCodeBlocks.sort((a, b) => a.y - b.y);
        // Update positions of all blocks
        let previousBottomY = this.questionText.y + this.questionText.height;
        this.draggableCodeBlocks.forEach((block, index) => {
            block.setY(previousBottomY + 50 + block.height / 2);
            previousBottomY = block.y + block.height / 2;
        });
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
            console.log(element);
            if (element.correctOrderPosition === index + 1) {
                block.markCorrect();
            } else {
                correct = false;
                block.markWrong();
            }
        });
        return correct;
    }

}