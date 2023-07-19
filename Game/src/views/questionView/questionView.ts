import "highlight.js/styles/night-owl.css";
import * as Phaser from "phaser";
import TaskManager from "./taskManager";
import Question from "./question";
import {QuestionType} from "../../types/questionType";
import deviceBackgroundTilePng from "../../assets/Device-Background-Tile.png";
import DeviceButton from "../../ui/deviceButton";
import ChoiceQuestionView from "./singleQuestionViews/choiceQuestionView";
import InputQuestionView from "./singleQuestionViews/inputQuestionView";
import DragDropQuestionView from "./singleQuestionViews/dragDropQuestionView";
import ClozeQuestionView from "./singleQuestionViews/clozeQuestionView";
import SelectOneQuestionView from "./singleQuestionViews/selectOneQuestionView";
import CreateQuestionView from "./singleQuestionViews/createQuestionView";

export default class QuestionView extends Phaser.Scene {
    private taskManager: TaskManager;
    private currentQuestion: Question;

    private questionText: Phaser.GameObjects.Text;

    private textStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private textSidePadding: number = 100;

    private tilesprite: Phaser.GameObjects.TileSprite;

    private bottomButton: DeviceButton;

    private progressBar: Phaser.GameObjects.Graphics;

    private currentQuestionView:
        | ChoiceQuestionView
        | InputQuestionView
        | DragDropQuestionView
        | ClozeQuestionView
        | SelectOneQuestionView
        | CreateQuestionView;

    constructor(taskManager: TaskManager) {
        super("QuestionView");
        this.taskManager = taskManager;
    }

    preload() {
        this.load.image("backgroundTile", deviceBackgroundTilePng);
    }

    create() {
        this.scene;

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

        this.showSubmitButton();

        this.taskManager.populateNewQuestionSet();
        this.getAndDisplayNewQuestion();

        this.progressBar = this.add.graphics();
        const totalWidth = this.cameras.main.displayWidth - 100;
        this.progressBar.clear();
        this.progressBar.fillStyle(0x1c1d21, 1);
        // this.progressBar.fillStyle(0x00c8ff, 1);
        this.progressBar.fillRect(50, 50, totalWidth, 50);
        this.progressBar.lineStyle(3, 0x00c8ff)
        this.progressBar.strokeRect(50, 50, totalWidth, 50)
        this.updateProgressBar()
    }

    private updateProgressBar(correct = true) {
        const progress = this.taskManager.currentDoneQuestions / this.taskManager.currentTotalQuestions;
        const totalWidth = this.cameras.main.displayWidth - 100 - 10;  // Adjust the width of the bar as per your need. 100 is the sum of left and right padding (50 each).
        // this.progressBar.clear();  // Clear previous drawing
        // this.progressBar.fillStyle(0x00c8ff, 1);
        if (correct) {
            this.progressBar.fillStyle(0x00ff7b, 1);
        } else {
            this.progressBar.fillStyle(0xf54747, 1);
        }
        this.progressBar.fillRect(55, 55, progress * totalWidth, 40);
    }

    private getAndDisplayNewQuestion() {
        this.currentQuestion =
            this.taskManager.getCurrentQuestionFromQuestionSet();
        if (this.currentQuestion) {
            this.displayQuestion();
        } else {
            this.removeAllQuestionScenes();
            this.questionText?.destroy(true);
            const repairedStyle = {...this.textStyle}
            repairedStyle.color = "#00ff7b";
            this.questionText = this.add
                .text(
                    this.cameras.main.displayWidth / 2,
                    this.cameras.main.displayHeight / 2,
                    "The Object has been repaired!",
                    repairedStyle
                )
                .setOrigin(0.5, 0.5);
            this.showExitButton();
        }
    }

    private displayQuestion(): void {
        this.questionText ? this.questionText.destroy() : null;
        this.questionText = this.add
            .text(
                this.cameras.main.displayWidth / 2,
                150,
                this.currentQuestion.question_text,
                this.textStyle
            )
            .setOrigin(0.5, 0);
        this.removeAllQuestionScenes();
        this.showSubmitButton();
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                // console.log("Choice");
                this.currentQuestionView = new ChoiceQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ChoiceQuestionView", this.currentQuestionView);
                this.scene.launch("ChoiceQuestionView");
                break;
            case QuestionType.SINGLE_INPUT:
                // console.log("single input");
                this.currentQuestionView = new InputQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("InputQuestionView", this.currentQuestionView);
                this.scene.launch("InputQuestionView");
                break;
            case QuestionType.DRAG_DROP:
                // console.log("drag drop");
                this.currentQuestionView = new DragDropQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add(
                    "DragDropQuestionView",
                    this.currentQuestionView
                );
                this.scene.launch("DragDropQuestionView");
                break;
            case QuestionType.CLOZE:
                // console.log("cloze");
                this.currentQuestionView = new ClozeQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ClozeQuestionView", this.currentQuestionView);
                this.scene.launch("ClozeQuestionView");
                break;
            case QuestionType.SELECT_ONE:
                // console.log("select one");
                this.currentQuestionView = new SelectOneQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add(
                    "SelectOneQuestionView",
                    this.currentQuestionView
                );
                this.scene.launch("SelectOneQuestionView");
                break;
            case QuestionType.CREATE:
                this.currentQuestionView = new CreateQuestionView(
                    this.questionText,
                    this.currentQuestion
                )
                this.scene.add(
                    "CreateQuestionView",
                    this.currentQuestionView
                );
                this.scene.launch("CreateQuestionView");
                break;
            default:
                console.log("none");
                break;
        }
    }

    private checkAnswer() {
        this.currentQuestionView.checkAnswer().then(correct => {
            console.log(correct)
            if (correct) {
                this.taskManager.questionAnsweredCorrectly();
                this.showNextButton();
                this.updateProgressBar()
            } else {
                this.updateProgressBar(false)
                this.taskManager.questionAnsweredIncorrectly()
                this.showExitButton();
            }
        });
    }

    private showSubmitButton(): void {
        this.bottomButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 -
            this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.checkAnswer();
            },
            "Submit"
        );
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    private showNextButton(): void {
        this.bottomButton.destroy(true);
        this.bottomButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 -
            this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.getAndDisplayNewQuestion();
            },
            "Next"
        );
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    private showExitButton(): void {
        this.bottomButton.destroy(true);
        this.bottomButton = new DeviceButton(
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
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    update(time: number, delta: number): void {
    }

    private removeAllQuestionScenes() {
        this.scene.remove("ChoiceQuestionView");
        this.scene.remove("InputQuestionView");
        this.scene.remove("DragDropQuestionView");
        this.scene.remove("ClozeQuestionView");
        this.scene.remove("SelectOneQuestionView");
        this.scene.remove("CreateQuestionView");
        // this.scene.remove(this.currentQuestionView);
    }

    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitQuestion(): void {
        this.scene.wake("Play");
        this.scene.wake("Room");
        this.scene.wake("controlPad");
        this.scene.wake("pauseChatButtons");
        this.removeAllQuestionScenes();
        this.scene.remove(this);
    }
}
