import * as Phaser from "phaser";
//import forwardRegularTtf from '../assets/fonts/fff-forward.regular.ttf';

export default class ChatView extends Phaser.Scene {
    private animText: Phaser.GameObjects.Text;
    private FullText =
        "Hello Astronaut, this is mission control do you copy? Do you copy Astronaut?";
    private answer = "Copy that mission control, here is Astronaut!";
    private answerText: Phaser.GameObjects.Text;
    private pixelFont: FontFace;
    private updateTextEvent: Phaser.Time.TimerEvent;
    private textDelayMilli = 50;

    constructor() {
        super("chatView");
    }

    public preload() {
        // this.pixelFont = new FontFace("forwardRegular", `url(${forwardRegularTtf})`)
        // this.pixelFont.load().then((loaded) => {
        //     console.log(loaded);
        //     console.log(document.fonts.check("2px forwardRegular", "hello"));
        //     (document.fonts as any).add(loaded);
        // }).catch((error) => {
        //     console.log(error)
        // });
        // document.fonts.load('10px "forwardRegular');
    }

    public create() {
        this.animText = this.add.text(100, 100, "", {
            fontSize: "20px",
            fontFamily: "forwardRegular",
            color: "#00c8ff",
            wordWrap: {
                width: this.cameras.main.displayWidth - 200,
                useAdvancedWrap: true,
            },
        });

        this.updateTextEvent = this.time.addEvent({
            delay: this.textDelayMilli,
            callback: this.updateText,
            args: [],
            repeat: this.FullText.length - 1,
            callbackScope: this,
        });

        let buttonWidth = 360;
        let buttonHeight = 80;

        // Create a graphics object
        let graphics = this.add.graphics();

        this.time.delayedCall(
            this.textDelayMilli * this.FullText.length + 1000,
            () => {
                graphics.lineStyle(4, 0x00c8ff, 1);
                // Draw stroke rectangle (border)
                graphics.strokeRect(0, 0, buttonWidth, buttonHeight);
                // Create some text
                let text = this.add.text(
                    buttonWidth / 2,
                    buttonHeight / 2,
                    "Copy that mission control",
                    {
                        fontSize: "20px",
                        fontFamily: "forwardRegular",
                        color: "#00c8ff",
                    }
                );
                text.setOrigin(0.5); // Center align text

                // Create a container and add the graphics and the text to it.
                let button = this.add.container(
                    this.cameras.main.displayWidth / 2 - buttonWidth / 2,
                    this.cameras.main.displayHeight - buttonHeight * 2,
                    [graphics, text]
                );
                // Make the container interactive
                button.setInteractive(
                    new Phaser.Geom.Rectangle(0, 0, buttonWidth, buttonHeight),
                    Phaser.Geom.Rectangle.Contains
                );

                // Event listeners for button
                button.on("pointerover", () =>
                    graphics.fillStyle(0x00ff00, 0.5)
                );
                button.on("pointerout", () => graphics.fillStyle(0x00ff00, 1));
                button.on("pointerdown", () => {
                    // Actions on button click
                    // console.log("Button clicked");
                    button.destroy()
                    this.answerText = this.add.text(
                        this.cameras.main.displayWidth - 100,
                        this.animText.y + this.animText.height + 50,
                        "",
                        {
                            fontSize: "20px",
                            fontFamily: "forwardRegular",
                            color: "#00ff7b",
                            wordWrap: {
                                width: this.cameras.main.displayWidth - 200,
                                useAdvancedWrap: true,
                            },
                        }
                    );

                    this.answerText.setOrigin(1,0)

                    this.updateTextEvent = this.time.addEvent({
                        delay: this.textDelayMilli,
                        callback: this.updateAnswerText,
                        args: [],
                        repeat: this.answer.length - 1,
                        callbackScope: this,
                    });

                    // console.log(answerText)
                });
            }
        );
    }

    private updateText() {
        this.animText.setText(this.animText.text + this.FullText[0]);
        this.FullText = this.FullText.substring(1);
        // console.log(this.animText.getBounds());
    }

    private updateAnswerText(){
        this.answerText.appendText(this.answer[0], false)
        this.answer = this.answer.substring(1);
    }
}
