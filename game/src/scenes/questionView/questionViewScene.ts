import "highlight.js/styles/night-owl.css";
import * as Phaser from "phaser";
import TaskManager from "../../managers/taskManager";
import Question from "../../classes/question/question";
import {QuestionType} from "../../types/questionType";
import deviceBackgroundTilePng from "../../assets/Device-Background-Tile.png";
import DeviceButton from "../../ui/deviceButton";
import ChoiceQuestionScene from "./singleQuestionScenes/choiceQuestionScene";
import InputQuestionScene from "./singleQuestionScenes/inputQuestionScene";
import DragDropQuestionScene from "./singleQuestionScenes/dragDropQuestionScene";
import ClozeQuestionScene from "./singleQuestionScenes/clozeQuestionScene";
import SelectOneQuestionScene from "./singleQuestionScenes/selectOneQuestionScene";
import CreateQuestionScene from "./singleQuestionScenes/createQuestionScene";
import {globalEventBus} from "../../helpers/globalEventBus";

export default class QuestionViewScene extends Phaser.Scene {
    private taskManager: TaskManager;
    private currentQuestion: Question;

    private questionText: Phaser.GameObjects.Text;

    private textStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private textSidePadding: number = 100;

    private tilesprite: Phaser.GameObjects.TileSprite;

    private bottomButton: DeviceButton;
    private _startTime: number = 0;

    private progressBar: Phaser.GameObjects.Graphics;

    private currentQuestionScene:
        | ChoiceQuestionScene
        | InputQuestionScene
        | DragDropQuestionScene
        | ClozeQuestionScene
        | SelectOneQuestionScene
        | CreateQuestionScene;

    constructor(taskManager: TaskManager) {
        super("QuestionViewScene");
        this.taskManager = taskManager;
    }

    preload() {
        this.load.image("backgroundTile", deviceBackgroundTilePng);
    }

    create() {
        console.log("creating QUESTION VIEW")
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
        this.showSubmitButton();
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
        this._startTime = this.time.now;
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
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                // console.log("Choice");
                this.currentQuestionScene = new ChoiceQuestionScene(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ChoiveQuestionScene", this.currentQuestionScene);
                this.scene.launch("ChoiceQuestionScene");
                break;
            case QuestionType.SINGLE_INPUT:
                // console.log("single input");
                this.currentQuestionScene = new InputQuestionScene(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("InputQuestionScene", this.currentQuestionScene);
                this.scene.launch("InputQuestionScene");
                break;
            case QuestionType.DRAG_DROP:
                // console.log("drag drop");
                this.currentQuestionScene = new DragDropQuestionScene(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add(
                    "DragDropQuestionScene",
                    this.currentQuestionScene
                );
                this.scene.launch("DragDropQuestionScene");
                break;
            case QuestionType.CLOZE:
                // console.log("cloze");
                this.currentQuestionScene = new ClozeQuestionScene(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ClozeQuestionScene", this.currentQuestionScene);
                this.scene.launch("ClozeQuestionScene");
                break;
            case QuestionType.SELECT_ONE:
                // console.log("select one");
                this.currentQuestionScene = new SelectOneQuestionScene(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add(
                    "SelectOneQuestionScene",
                    this.currentQuestionScene
                );
                this.scene.launch("SelectOneQuestionScene");
                break;
            case QuestionType.CREATE:
                this.currentQuestionScene = new CreateQuestionScene(
                    this.questionText,
                    this.currentQuestion
                )
                this.scene.add(
                    "CreateQuestionScene",
                    this.currentQuestionScene
                );
                this.scene.launch("CreateQuestionScene");
                break;
            default:
                console.log("none");
                break;
        }
        // this.scene.bringToTop();
        this.showSubmitButton();
    }

    private checkAnswer() {
        this.currentQuestionScene.checkAnswer().then(correct => {
            console.log(correct)
            if (correct) {
                this.taskManager.questionAnsweredCorrectly(this._startTime - this.time.now);
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
        this.bottomButton?.destroy(true);
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
        this.scene.remove("ChoiceQuestionScene");
        this.scene.remove("InputQuestionScene");
        this.scene.remove("DragDropQuestionScene");
        this.scene.remove("ClozeQuestionScene");
        this.scene.remove("SelectOneQuestionScene");
        this.scene.remove("CreateQuestionScene");
        // this.scene.remove(this.currentQuestionScene);
    }

    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitQuestion(): void {
        this.scene.wake("worldViewScene");
        this.scene.wake("Room");
        this.scene.wake("controlPad");
        this.scene.wake("pauseChatButtons");
        this.removeAllQuestionScenes();
        this.scene.remove(this);
        globalEventBus.emit("save_game")
    }
}
