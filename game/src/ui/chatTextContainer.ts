import * as Phaser from "phaser";

/**
 * A container for handling the display, the storage and the scrolling of the whole chat
 */
export default class ChatTextContainer extends Phaser.GameObjects.Container {
    /**
     * Stores all the texts of the whole chat
     */
    protected texts: Array<Phaser.GameObjects.Text | Phaser.GameObjects.Image> = [];

    /**
     * The side padding / margin of the text
     */
    protected textSidePadding = 100;
    /**
     * The top padding of all the texts
     */
    private textTopPadding = 50;

    /**
     * The style of the texts coming TO the player
     */
    private textStyle: Phaser.Types.GameObjects.Text.TextStyle;
    /**
     * The style of the texts coming FROM the player
     */
    private answerStyle: Phaser.Types.GameObjects.Text.TextStyle;

    private maxY = 0;

    /**
     * Constructs the container, and **adds itself to the scene**
     * @param scene the scene the container will be added to
     * @param x the x coordinate of the container (defaults to 0)
     * @param y the y coordinate of the container (defaults to 0)
     */
    constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
        super(scene, x, y);
        this.maxY = y;
        //Set the style of the text coming TO the player (blue)
        this.textStyle = {
            fontSize: "30px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width: this.scene.cameras.main.displayWidth - this.textSidePadding * 2,
                useAdvancedWrap: true,
            },
        };

        //Set the style of the text coming FROM the player (green)
        this.answerStyle = {
            ...this.textStyle,
            color: "#00ff7b",
            align: "right",
        };
        //Adding the container itself to the scene
        this.scene.add.existing(this);
        //Set the container interactive over the whole screen
        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, this.scene.cameras.main.displayWidth, 0),
            Phaser.Geom.Rectangle.Contains,
        );
        //Enable dragging (important for scrolling)
        this.scene.input.setDraggable(this, true);

        this.on("drag", (pointer, dragX, dragY) => {
            //Ensure that the container can only go to 0 (first text at the very top) or have the last text be at half the display height
            this.y = Phaser.Math.Clamp(
                dragY,
                Math.min(this.scene.cameras.main.displayHeight / 2 - this.input.hitArea.height, 0),
                this.maxY,
            );
        });
    }

    /**
     * Adds the text to the text array as well as to the container itself.
     * Additionally sets the hitarea to be as high as all the texts in the container (up until the last text)
     * @param text the text to be added
     */
    protected pushAndAdd(text: Phaser.GameObjects.Text | Phaser.GameObjects.Image): void {
        this.texts.push(text);
        this.add(text);
        this.calculateNewInputHitArea();
    }

    public calculateNewInputHitArea() {
        this.input.hitArea = new Phaser.Geom.Rectangle(0, 0, this.scene.cameras.main.displayWidth, this.calcNewTextY());
    }

    public scrollToBottom() {
        this.y = Math.min(this.scene.cameras.main.displayHeight / 2 - this.input.hitArea.height, 0);
    }

    /**
     * Calculates the new Y position for the next text
     * @returns the y coordinate the new text can be placed at
     */
    protected calcNewTextY(): number {
        return this.texts.length
            ? this.texts[this.texts.length - 1].y + this.texts[this.texts.length - 1].height + this.textTopPadding
            : this.textTopPadding;
    }

    /**
     * adds a text coming TO the player to the container and scene
     * @returns the created text
     */
    public addReceivedText(): Phaser.GameObjects.Text {
        let text = this.scene.add.text(this.textSidePadding, this.calcNewTextY(), "", this.textStyle);
        this.pushAndAdd(text);
        return text;
    }

    public addFullRecievedText(fullText: string): Phaser.GameObjects.Text {
        let text = this.scene.add.text(this.textSidePadding, this.calcNewTextY(), fullText, this.textStyle);
        this.pushAndAdd(text);
        return text;
    }

    /**
     * Adds a text coming FROM the player to the container and scene
     * @param text the text to be displayed immediately
     * @returns the newly created text object
     */
    public addAnswerText(text: string): Phaser.GameObjects.Text {
        let answer = this.scene.add
            .text(
                this.scene.cameras.main.displayWidth - this.textSidePadding,
                this.calcNewTextY(),
                text,
                this.answerStyle,
            )
            .setOrigin(1, 0);
        this.pushAndAdd(answer);
        return answer;
    }
}
