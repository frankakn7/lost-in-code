import * as Phaser from "phaser";
import Question from "../../../classes/question/question";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import { ChoiceQuestionElement } from "../../../classes/question/questionElement";
import ChoiceButton from "../../../ui/choiceButton";
import SelectableCodeBlock from "../../../ui/question/selectableCodeBlock";
import {SceneKeys} from "../../../types/sceneKeys";

export default class SelectOneQuestionScene extends Phaser.Scene {
    private _currentQuestion: Question;

    private _choiceButtons: ChoiceButton[] = [];

    private _questionText: Phaser.GameObjects.Text;

    private _selectableCodeBlocks: SelectableCodeBlock[] = [];

    private _correctAnswer: Phaser.GameObjects.Text;
    private _correctTextStyle;

    readonly _sceneKey: SceneKeys;

    constructor(
        questionText: Phaser.GameObjects.Text,
        currentQuestion: Question
    ) {
        let sceneKey = SceneKeys.SELECT_ONE_QUESTION_SCENE_KEY;
        super(sceneKey);
        this._sceneKey = sceneKey;
        this._questionText = questionText;
        this._currentQuestion = currentQuestion;
    }

    create() {
        this.displaySelectOneQuestion();

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
        };
    }

    private async displaySelectOneQuestion() {
        let previousBottomY = this._questionText.y + this._questionText.height;
        for (let i = 0; i < this._currentQuestion.elements.length; i++) {
            let element = this._currentQuestion.elements[i];

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
            this._selectableCodeBlocks.push(selectableCodeBlock);
            previousBottomY =
                selectableCodeBlock.y + selectableCodeBlock.height / 2;
        }
    }

    private selectCodeBlock(elementId: number) {
        let selectedBlock: SelectableCodeBlock = this._selectableCodeBlocks.find(
            (block) => block.getSelected()
        );
        selectedBlock ? selectedBlock.deselect() : null;
        this._selectableCodeBlocks
            .find((block) => block.getElementId() === elementId)
            .select();
    }

    private showCorrectText() {
        let previousY =
            this._selectableCodeBlocks[this._selectableCodeBlocks.length - 1].y +
            this._selectableCodeBlocks[this._selectableCodeBlocks.length - 1]
                .height;
        this._correctAnswer = this.add
            .text(
                this.cameras.main.displayWidth / 2,
                previousY + 100,
                "Correct",
                this._correctTextStyle
            )
            .setOrigin(0.5, 0);
    }

    public checkAnswer() {
        let allCorrect = this._selectableCodeBlocks.every((block) => {
            const blockIsCorrect = this._currentQuestion.elements.find(
                (element: ChoiceQuestionElement) =>
                    element.id == block.getElementId()
            ).is_correct
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
        return new Promise((resolve) => resolve(allCorrect));
    }
}
