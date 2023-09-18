import ControlPadContainer from "../ui/controlPadContainer";
import ArrowLeftPng from "../assets/ui/Arrow-Button-Left.png";
import ArrowRightPng from "../assets/ui/Arrow-Button-right.png";
import ArrowUpPng from "../assets/ui/Arrow-Button-up.png";
import ArrowDownPng from "../assets/ui/Arrow-Button-Down.png";
import PhoneButtonPng from "../assets/ui/phone-button.png";
import {gameController} from "../main";
import ProgressBarContainer from "../ui/progressBarContainer";

export default class UiScene extends Phaser.Scene {

    private controlPadContainer: ControlPadContainer;
    private phoneButton: Phaser.GameObjects.Image;
    private progressBarContainer: ProgressBarContainer;
    constructor() {
        super({ key: 'uiScene' });
    }

    preload() {
        //Controll-pad
        this.load.image("arrowLeft", ArrowLeftPng);
        this.load.image("arrowRight", ArrowRightPng);
        this.load.image("arrowUp", ArrowUpPng);
        this.load.image("arrowDown", ArrowDownPng);

        this.load.image("phoneButton", PhoneButtonPng);
    }

    create(){

        this.progressBarContainer = new ProgressBarContainer(this);

        this.controlPadContainer = new ControlPadContainer(this);
        this.controlPadContainer.setPosition(this.cameras.main.width / 2,this.cameras.main.height - 250)

        this.phoneButton = this.add
            .image(180, 225, "phoneButton")
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                gameController.buttonStates.phonePressed = true;
            })
            .on("pointerup", () => {
                gameController.buttonStates.phonePressed = false;
            })
            .on("pointerout", () => {
                gameController.buttonStates.phonePressed = false;
            });
    }
}