import * as Phaser from "phaser";
import PauseButtonPng from "../assets/ui/Pause-Button.png";
import PhoneButtonPng from "../assets/ui/phone-button.png";

export default class PauseChatButtons extends Phaser.Scene {
    public pausePressed: boolean;
    public phonePressed: boolean;

    private pauseButton: Phaser.GameObjects.Image;
    private phoneButton: Phaser.GameObjects.Image;

    constructor() {
        super("PauseChatButtons");
    }

    private resize(
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
    ) {
        this.phoneButton.setPosition(
            this.cameras.main.displayWidth - 180,
            180
        );
    }

    public preload() {
        this.load.image("pauseButton", PauseButtonPng);
        this.load.image("phoneButton", PhoneButtonPng);
    }

    public create() {
        this.pauseButton = this.add
            .image(180, 225, "phoneButton")
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.pausePressed = true;
            })
            .on("pointerup", () => {
                this.pausePressed = false;
            })
            .on("pointerout", () => {
                this.pausePressed = false;
            });
    }
}
