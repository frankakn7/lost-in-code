import "highlight.js/styles/night-owl.css";
import * as Phaser from "phaser";
import Question from "../classes/question/question";
import { QuestionType } from "../types/questionType";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import DeviceButton from "../ui/deviceButton";
import ChoiceQuestionContainer from "../ui/question/choiceQuestionContainer";
import InputQuestionContainer from "../ui/question/inputQuestionContainer";
import DragDropQuestionContainer from "../ui/question/dragDropQuestionContainer";
import ClozeQuestionContainer from "../ui/question/clozeQuestionContainer";
import SelectOneQuestionContainer from "../ui/question/selectOneQuestionContainer";
import CreateQuestionContainer from "../ui/question/createQuestionContainer";
import { globalEventBus } from "../helpers/globalEventBus";
import { SceneKeys } from "../types/sceneKeys";
import { gameController } from "../main";
import { GameEvents } from "../types/gameEvents";
import { debugHelper } from "../helpers/debugHelper";
import { shuffleArray } from "../helpers/helperFunctions";

export default class QuestionViewScene extends Phaser.Scene {
    private currentQuestion: Question;

    private questionText: Phaser.GameObjects.Text;

    private textStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private textSidePadding: number = 100;

    private tilesprite: Phaser.GameObjects.TileSprite;

    private bottomButton: DeviceButton;
    private _startTime: number = Date.now();

    private progressBar: Phaser.GameObjects.Graphics;

    private _currentQuestionContainer:
        | ChoiceQuestionContainer
        | InputQuestionContainer
        | DragDropQuestionContainer
        | ClozeQuestionContainer
        | SelectOneQuestionContainer
        | CreateQuestionContainer;

    constructor() {
        super(SceneKeys.QUESTION_VIEW_SCENE_KEY);
    }

    preload() {
        this.load.image("backgroundTile", deviceBackgroundTilePng);
    }

    create() {
        debugHelper.logString("creating question view");
        this.scene;

        this.tilesprite = this.add
            .tileSprite(0, 0, this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile")
            .setOrigin(0, 0)
            .setScale(3);

        this.textStyle = {
            fontSize: "40px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width: this.cameras.main.displayWidth - this.textSidePadding * 2,
                useAdvancedWrap: true,
            },
            align: "center",
        };

        // this.cameras.main.setBackgroundColor("rgba(6,24,92,1)");

        // gameController.taskManager.populateNewQuestionSet();
        gameController.taskManager.resetStatus();
        this.getAndDisplayNewQuestion();

        this.progressBar = this.add.graphics();
        const totalWidth = this.cameras.main.displayWidth - 100;
        this.progressBar.clear();
        this.progressBar.fillStyle(0x1c1d21, 1);
        // this.progressBar.fillStyle(0x00c8ff, 1);
        this.progressBar.fillRect(50, 50, totalWidth, 50);
        this.progressBar.lineStyle(3, 0x00c8ff);
        this.progressBar.strokeRect(50, 50, totalWidth, 50);
        this.updateProgressBar();
        this.showSubmitButton();
    }

    private updateProgressBar(correct = true) {
        const progress =
            gameController.taskManager.currentCorrectQuestions / gameController.taskManager.correctQuestionsNeeded;
        const totalWidth = this.cameras.main.displayWidth - 100 - 10; // Adjust the width of the bar as per your need. 100 is the sum of left and right padding (50 each).
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
        // this.currentQuestion = gameController.taskManager.getCurrentQuestionFromQuestionSet();
        this.currentQuestion = gameController.taskManager.getNextQuestion();
        if (gameController.taskManager.failed) {
            this.deleteCurrentQuestionContainer();
            // gameController.questionSceneController.removeAllQuestionScenes();
            this.questionText?.destroy(false);
            const failedStyle = { ...this.textStyle };
            failedStyle.color = "#f54747";
            this.questionText = this.add
                .text(
                    this.cameras.main.displayWidth / 2,
                    this.cameras.main.displayHeight / 2,
                    "The Object could not be repaird...",
                    failedStyle,
                )
                .setOrigin(0.5, 0.5);
            this.updateProgressBar(false);
            this.showExitButton();
        } else if (this.currentQuestion && !gameController.taskManager.finished) {
            this.displayQuestion();
        } else {
            this.deleteCurrentQuestionContainer();
            // gameController.questionSceneController.removeAllQuestionScenes();
            this.questionText?.destroy(false);
            const repairedStyle = { ...this.textStyle };
            repairedStyle.color = "#00ff7b";
            this.questionText = this.add
                .text(
                    this.cameras.main.displayWidth / 2,
                    this.cameras.main.displayHeight / 2,
                    "The Object has been repaired!",
                    repairedStyle,
                )
                .setOrigin(0.5, 0.5);
            this.showExitButton();
        }
    }

    private displayQuestion(): void {
        this._startTime = Date.now();
        this.questionText ? this.questionText.destroy() : null;
        this.questionText = this.add
            .text(this.cameras.main.displayWidth / 2, 150, this.currentQuestion.question_text, this.textStyle)
            .setOrigin(0.5, 0);
        // gameController.questionSceneController.removeAllQuestionScenes();
        this.deleteCurrentQuestionContainer();
        shuffleArray(this.currentQuestion.elements);
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                this._currentQuestionContainer = new ChoiceQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartChoiceQuestionScene(this.currentQuestionContainer);
                this.add.existing(this._currentQuestionContainer);
                break;
            case QuestionType.SINGLE_INPUT:
                this._currentQuestionContainer = new InputQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartInputQuestionScene(this.currentQuestionContainer)
                this.add.existing(this._currentQuestionContainer);
                break;
            case QuestionType.DRAG_DROP:
                this._currentQuestionContainer = new DragDropQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartDragDropQuestionScene(this.currentQuestionContainer);
                this.add.existing(this._currentQuestionContainer);
                break;
            case QuestionType.CLOZE:
                this._currentQuestionContainer = new ClozeQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartClozeQuestionScene(this.currentQuestionContainer);
                this.add.existing(this._currentQuestionContainer);
                break;
            case QuestionType.SELECT_ONE:
                this._currentQuestionContainer = new SelectOneQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartSelectOneQuestionScene(this.currentQuestionContainer);
                this.add.existing(this._currentQuestionContainer);
                break;
            case QuestionType.CREATE:
                this._currentQuestionContainer = new CreateQuestionContainer(
                    this,
                    0,
                    0,
                    this.questionText,
                    this.currentQuestion,
                );
                // gameController.questionSceneController.addAndStartCreateQuestionScene(this.currentQuestionContainer)
                this.add.existing(this._currentQuestionContainer);
                break;
            default:
                console.error("question type does not exist");
                break;
        }
        // this.scene.bringToTop();
        this.showSubmitButton();
    }

    private checkAnswer() {
        this._currentQuestionContainer.checkAnswer().then((correct) => {
            if (correct) {
                //Duration calculated in milliseconds
                gameController.taskManager.questionAnsweredCorrectly(Date.now() - this._startTime);
                this.showNextButton();
                this.updateProgressBar();
            } else {
                // this.updateProgressBar(false);
                gameController.taskManager.questionAnsweredIncorrectly();
                // this.showExitButton();
                this.showNextButton();
            }
        });
    }

    private showSubmitButton(): void {
        this.bottomButton?.destroy(true);
        this.bottomButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.checkAnswer();
            },
            "Submit",
        );
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.bottomButton.setDepth(5);
        this.add.existing(this.bottomButton);
    }

    private showNextButton(): void {
        this.bottomButton.destroy(true);
        this.bottomButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.getAndDisplayNewQuestion();
            },
            "Next",
        );
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    private showExitButton(): void {
        this.bottomButton.destroy(true);
        this.bottomButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - this.cameras.main.displayWidth / 4,
            this.cameras.main.displayHeight - 100,
            this.cameras.main.displayWidth / 2,
            () => {
                this.exitQuestion();
            },
            "Exit",
        );
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitQuestion(): void {
        gameController.questionSceneController.exitQuestionView();
        gameController.worldSceneController.resumeWorldViewScenes();
        globalEventBus.emit(GameEvents.SAVE_GAME);
    }

    private deleteCurrentQuestionContainer() {
        this._currentQuestionContainer?.destroy();
        delete this._currentQuestionContainer;
    }
}
