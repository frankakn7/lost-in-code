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

    constructor(questionText: Phaser.GameObjects.Text, currentQuestion: Question) {
        super("SelectOneQuestionView");
        this.questionText = questionText;
        this.currentQuestion = currentQuestion;
    }

    create(){
        this.displaySelectOneQuestion();
    }

    private async displaySelectOneQuestion(){
        let previousBottomY = this.questionText.y + this.questionText.height;
        for (let i = 0; i < this.currentQuestion.elements.length; i++) {
            let element = this.currentQuestion.elements[i];
            
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

    private selectCodeBlock(elementId: number){
        let selectedBlock: SelectableCodeBlock = this.selectableCodeBlocks.find((block) => block.getSelected())
        selectedBlock ? selectedBlock.deselect() : null;
        this.selectableCodeBlocks.find((block) => block.getElementId() === elementId).select();
    }

    public checkAnswer(){
        let selectedBlock = this.selectableCodeBlocks.find((block) => block.getSelected())
        let allCorrect = true;
        if(selectedBlock){
            let elementId = selectedBlock.getElementId();
            let correct = this.currentQuestion.elements.find((element: ChoiceQuestionElement) => element.id == elementId).isCorrect
            if(correct){
                selectedBlock.markCorrect()
            }else{
                allCorrect = false;
                selectedBlock.markWrong()
            }
        }else{
            this.selectableCodeBlocks.forEach((block) => block.markWrong());
        }
        return allCorrect;
    }
}