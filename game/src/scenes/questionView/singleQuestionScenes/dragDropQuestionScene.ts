import * as Phaser from "phaser";
import Question from "../../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement, OrderQuestionElement } from "../../../classes/question/questionElement";
import ChoiceButton from "../../../ui/choiceButton";
import DraggableCodeBlock from "../../../ui/question/draggableCodeBlock";
import {SceneKeys} from "../../../types/sceneKeys";

export default class DragDropQuestionScene extends Phaser.Scene {
    private _currentQuestion: Question;

    private _choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _draggableCodeBlocks: DraggableCodeBlock[] = [];

    private _correctAnswer: Phaser.GameObjects.Text;
    private _correctTextStyle;

    readonly _sceneKey: SceneKeys;


    constructor(questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        let sceneKey = SceneKeys.DRAG_DROP_QUESTION_SCENE_KEY;
        super(sceneKey);
        this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
    }

    create(){
        this.displayDragDropQuestion();

        this.events.on("blockDropped", (droppedBlock: DraggableCodeBlock) => {
            this.reorderBlocks(droppedBlock);
        });

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
    
    private async displayDragDropQuestion() {
        let previousBottomY = this._questionText.y + this._questionText.height;
        for (let i = 0; i < this._currentQuestion.elements.length; i++) {
            let element = this._currentQuestion.elements[i];

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
            this._draggableCodeBlocks.push(draggableCodeBlock);
            previousBottomY =
                draggableCodeBlock.y + draggableCodeBlock.height / 2;
        }
    }

    private reorderBlocks(droppedBlock: DraggableCodeBlock) {
        this._draggableCodeBlocks.sort((a, b) => a.y - b.y);
        // Update positions of all blocks
        let previousBottomY = this._questionText.y + this._questionText.height;
        this._draggableCodeBlocks.forEach((block, index) => {
            block.setY(previousBottomY + 50 + block.height / 2);
            previousBottomY = block.y + block.height / 2;
        });
    }

    private showCorrectText(){
        let previousY = this._draggableCodeBlocks[this._draggableCodeBlocks.length -1 ].y + this._draggableCodeBlocks[this._draggableCodeBlocks.length -1 ].height
        this._correctAnswer = this.add.text(
            this.cameras.main.displayWidth / 2,
            previousY + 100,
            "Correct",
            this._correctTextStyle
        ).setOrigin(0.5,0);
    }

    public checkAnswer() {
        let correct = true;
        this._draggableCodeBlocks.forEach((block, index) => {
            let element: OrderQuestionElement = <OrderQuestionElement>(
                this._currentQuestion.elements.find(
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