import * as Phaser from "phaser";

/**
 * A button to be used in the chat view. contains styling and a label text as well as a function to be called when clicked
 */
export default class DeviceButton extends Phaser.GameObjects.Container {
    /**
     * The graphical styling of the button
     */
    protected graphics: Phaser.GameObjects.Graphics;
    /**
     * The text label displayed on the button
     */
    protected label: Phaser.GameObjects.Text;
    protected labelString: string;
    protected defaultLabelStyle: Phaser.Types.GameObjects.Text.TextStyle;

    /**
     * The padding of the text label inside the button
     */
    protected textPadding = 10;

    /**
     * The width of the button
     */
    public width: number;
    /**
     * The height of the button
     */
    public height: number;

    /**
     * The function to be called when the button is pressed
     */
    protected onClick: Function;

    /**
     * The constructor for the button
     * @param scene the scene the button is added to
     * @param x the x coordinate of the button
     * @param y the y coordinate of the button
     * @param width the width of the button (has to be set because text uses word wrap to stay inside width)
     * @param func the function to be called when button is clicked
     * @param label the label displayed on the button
     * @param labelStyle optional parameter for setting a label style
     */
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        func: Function,
        label: string,
        labelStyle?: Phaser.Types.GameObjects.Text.TextStyle
    ) {
        super(scene, x, y);

        this.width = width;
        this.onClick = func;
        this.labelString = label;
        this.defaultLabelStyle = {
            fontSize: "30px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width: this.width - this.textPadding * 2, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        }

        this.drawButton(this.labelString,0x000000,0x00c8ff,labelStyle)

        //Create a rectangle a hitbox making sure it covers the visible button
        let newRectangle = new Phaser.Geom.Rectangle(
            this.width / 2,
            this.height / 2,
            this.width,
            this.height
        );
        //Make button interactive
        this.setInteractive(newRectangle, Phaser.Geom.Rectangle.Contains);
        
        //When button is clicked execute the defined onClick function
        this.on("pointerdown", () => {
            this.onClick();
        });
    }

    protected drawButton(label: string, buttonBackgroundColor: number=0x000000,buttonMarginColor: number=0x00c8ff, labelStyle?: Phaser.Types.GameObjects.Text.TextStyle){
        this.removeAll(true)
        //Add the label text to the scene using either preset labelStyle or the given labelstyle
        this.label = this.scene.add.text(
            this.width / 2,
            this.textPadding,
            label,
            labelStyle
                ? labelStyle
                : this.defaultLabelStyle
        );
        //Make sure the text is centered and aligned to the top
        this.label.setOrigin(0.5, 0);

        //Add graphics
        this.graphics = this.scene.add.graphics();
        //The height of the button = the height of the text + padding for top and bottom
        this.height = this.label.height + this.textPadding * 2;

        //A black background
        this.graphics.clear()
        this.graphics.fillStyle(0x000000, 0.5)
        this.graphics.fillRect(10, 10, this.width+10, this.height+10);
        this.graphics.fillStyle(buttonBackgroundColor, 1);
        this.graphics.fillRect(0, 0, this.width, this.height);
        //And a blue margin
        this.graphics.lineStyle(10, buttonMarginColor, 1);
        this.graphics.strokeRect(0, 0, this.width, this.height);

        //Add the label and the margin to the container (the order has to be this way otherwise black background is rendered over text)
        this.add(this.graphics);
        this.add(this.label);
    }
}
