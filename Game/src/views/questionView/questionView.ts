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
import ChoiceQuestionView from "./singleQuestionViews/choiceQuestionView";
import InputQuestionView from "./singleQuestionViews/inputQuestionView";
import DragDropQuestionView from "./singleQuestionViews/dragDropQuestionView";
import ClozeQuestionView from "./singleQuestionViews/clozeQuestionView";
import SelectOneQuestionView from "./singleQuestionViews/selectOneQuestionView";

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

    private bottomButton: DeviceButton;

    private questions: Question[] = [];

    private currentQuestionView:
        | ChoiceQuestionView
        | InputQuestionView
        | DragDropQuestionView
        | ClozeQuestionView
        | SelectOneQuestionView;

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

        this.showSubmitButton()

        this.getAndDisplayNewQuestion();
        // this.taskManager = new TaskManager(this.questions);
        // this.exitQuestion();
        // this.add.existing(draggableCodeBlock)
    }

    onWake() {
        console.log("i am awake");
    }

    private getAndDisplayNewQuestion() {
        this.currentQuestion =
            this.taskManager.getCurrentQuestionFromQuestionSet();
        if (this.currentQuestion) {
            this.displayQuestion();
        } else {
            this.questionText?.destroy(true)
            this.questionText = this.add
                .text(
                    this.cameras.main.displayWidth / 2,
                    100,
                    "The Object has been repaired!",
                    this.textStyle
                )
                .setOrigin(0.5, 0);
            this.showExitButton();
        }
    }

    private displayQuestion(): void {
        this.questionText ? this.questionText.destroy() : null;
        this.questionText = this.add
            .text(
                this.cameras.main.displayWidth / 2,
                100,
                this.currentQuestion.questionText,
                this.textStyle
            )
            .setOrigin(0.5, 0);
        this.removeAllQuestionScenes();
        this.showSubmitButton()
        switch (this.currentQuestion.type) {
            case QuestionType.CHOICE:
                console.log("Choice")
                this.currentQuestionView = new ChoiceQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ChoiceQuestionView", this.currentQuestionView);
                this.scene.launch("ChoiceQuestionView");
                break;
            case QuestionType.SINGLE_INPUT:
                console.log("single input");
                this.currentQuestionView = new InputQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("InputQuestionView", this.currentQuestionView);
                this.scene.launch("InputQuestionView");
                break;
            case QuestionType.DRAG_DROP:
                console.log("drag drop");
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
                console.log("cloze");
                this.currentQuestionView = new ClozeQuestionView(
                    this.questionText,
                    this.currentQuestion
                );
                this.scene.add("ClozeQuestionView", this.currentQuestionView);
                this.scene.launch("ClozeQuestionView");
                break;
            case QuestionType.SELECT_ONE:
                console.log("select one");
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
            default:
                console.log("none");
                break;
        }
    }

    private checkAnswer() {
        let correct = this.currentQuestionView.checkAnswer();
        if (correct) {
            this.taskManager.questionAnsweredCorrectly();
            this.showNextButton();
        } else {
            this.showExitButton();
        }
    }

    private showSubmitButton(): void {
        this.bottomButton = new DeviceButton(
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
        this.bottomButton.setY(this.bottomButton.y - this.bottomButton.height);
        this.add.existing(this.bottomButton);
    }

    private showNextButton(): void {
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

    update(time: number, delta: number): void {}

    private removeAllQuestionScenes() {
        this.scene.remove("ChoiceQuestionView")
        this.scene.remove("InputQuestionView")
        this.scene.remove("DragDropQuestionView")
        this.scene.remove("ClozeQuestionView")
        this.scene.remove("SelectOneQuestionView")
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
