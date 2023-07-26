import * as Phaser from "phaser";
import ArrowLeftPng from "../assets/ui/Arrow-Button-Left.png";
import ArrowRightPng from "../assets/ui/Arrow-Button-right.png";
import ArrowUpPng from "../assets/ui/Arrow-Button-up.png";
import ArrowDownPng from "../assets/ui/Arrow-Button-Down.png";
import InteractPng from "../assets/ui/Interact-Button.png";

export default class ControlPadScene extends Phaser.Scene {
    public leftPress: boolean;
    public rightPress: boolean;
    public upPress: boolean;
    public downPress: boolean;
    public interactPress: boolean;

    private controlPadCenter = { x: 0, y: 0 };

    private arrowLeft: Phaser.GameObjects.Image;
    private arrowRight: Phaser.GameObjects.Image;
    private arrowUp: Phaser.GameObjects.Image;
    private arrowDown: Phaser.GameObjects.Image;
    // private interactButton: Phaser.GameObjects.Image;

    constructor() {
        super("ControlPad");
    }

    /**
     * Function to calculate new button positions for when website is resized
     * @param gameSize
     * @param baseSize
     * @param displaySize
     * @param previousWidth
     * @param previousHeight
     */
    private resize(
        gameSize: Phaser.Structs.Size,
        baseSize: Phaser.Structs.Size,
        displaySize: Phaser.Structs.Size,
        previousWidth: number,
        previousHeight: number
    ) {
        // this.controlPadCenter = {
        //     x: this.cameras.main.width / 2,
        //     y: this.cameras.main.height - 350,
        // };
        // this.arrowLeft.setPosition(
        //     this.controlPadCenter.x - 200,
        //     this.controlPadCenter.y
        // );
        // this.arrowRight.setPosition(
        //     this.controlPadCenter.x + 200,
        //     this.controlPadCenter.y
        // );
        // this.arrowUp.setPosition(
        //     this.controlPadCenter.x,
        //     this.controlPadCenter.y - 200
        // );
        // this.arrowDown.setPosition(
        //     this.controlPadCenter.x,
        //     this.controlPadCenter.y + 100
        // );
        // this.interactButton.setPosition(
        //     this.controlPadCenter.x,
        //     this.controlPadCenter.y
        // );
    }

    public preload() {
        this.load.image("arrowLeft", ArrowLeftPng);
        this.load.image("arrowRight", ArrowRightPng);
        this.load.image("arrowUp", ArrowUpPng);
        this.load.image("arrowDown", ArrowDownPng);
        this.load.image("interact", InteractPng);
    }

    public create() {
        this.controlPadCenter = {
            x: this.cameras.main.width / 2,
            y: this.cameras.main.height - 250,
        };
        this.arrowLeft = this.add
            .image(
                this.controlPadCenter.x - 200,
                this.controlPadCenter.y,
                "arrowLeft"
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.leftPress = true;
            })
            .on("pointerup", () => {
                this.leftPress = false;
            })
            .on("pointerout", () => {
                this.leftPress = false;
            });
        this.arrowRight = this.add
            .image(
                this.controlPadCenter.x + 200,
                this.controlPadCenter.y,
                "arrowRight"
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.rightPress = true;
            })
            .on("pointerup", () => {
                this.rightPress = false;
            })
            .on("pointerout", () => {
                this.rightPress = false;
            });

        this.arrowUp = this.add
            .image(
                this.controlPadCenter.x,
                this.controlPadCenter.y - 200,
                "arrowUp"
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.upPress = true;
            })
            .on("pointerup", () => {
                this.upPress = false;
            })
            .on("pointerout", () => {
                this.upPress = false;
            });

        this.arrowDown = this.add
            .image(
                this.controlPadCenter.x,
                this.controlPadCenter.y,
                "arrowDown"
            )
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on("pointerdown", () => {
                this.downPress = true;
            })
            .on("pointerup", () => {
                this.downPress = false;
            })
            .on("pointerout", () => {
                this.downPress = false;
            });
        // this.interactButton = this.add
        //     .image(this.controlPadCenter.x, this.controlPadCenter.y, "interact")
        //     .setOrigin(0.5, 0.5)
        //     .setInteractive()
        //     .on("pointerdown", () => {
        //         this.interactPress = true;
        //     })
        //     .on("pointerup", () => {
        //         this.interactPress = false;
        //     })
        //     .on("pointerout", () => {
        //         this.interactPress = false;
        //     });

        this.scale.on("resize", this.resize, this);
    }
}
