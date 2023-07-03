import * as Phaser from "phaser";
import { ChatFlowNode } from "./chatFlowNode";
import ChatFlow from "./chatFlow";
import AnswerButton from "./chatButton";
import ChatButton from "./chatButton";
import ChatTextContainer from "./chatTextContainer";

/**
 * The ChatView displaying the chat
 * Handles the animation of the text as well as displaying choice buttons
 */
export default class ChatView extends Phaser.Scene {

    /**
     * The current {@link ChatFlow} being handled by the chatView
     */
    private currentChatFlow: ChatFlow;

    /**
     * The text coming TO the player that should have animation
     */
    private textToAnimate: Phaser.GameObjects.Text;
    /**
     * The text coming FROM the player
     */
    private answerText: Phaser.GameObjects.Text;

    /**
     * Array of all the choice buttons (used for destroying buttons when choice was made)
     */
    private choiceButtons: Array<AnswerButton> = [];

    /**
     * The TimerEvent for handling delayed text character display
     */
    private updateTextAnimationEvent: Phaser.Time.TimerEvent;
    /**
     * The delay of each character in milliseconds
     */
    private characterDelayMilli = 50;

    /**
     * Padding between choice buttons
     */
    private buttonPadding = 40;
    /**
     * Width of all the choice buttons
     */
    private buttonWidth = 500;

    /**
     * The container of all the texts
     */
    private chatTextContainer: ChatTextContainer;

    /**
     * The exit button for the chat view
     */
    private exitButton: ChatButton;

    /**
     * 
     * @param chatFlow The first {@link ChatFlow} to be handled by the chat view
     */
    constructor(chatFlow: ChatFlow) {
        super("chatView");
        this.currentChatFlow = chatFlow
    }

    public create() {
        //Set background color to black
        this.cameras.main.setBackgroundColor("rgba(0,0,0,1)");

        //create the text container
        this.chatTextContainer = new ChatTextContainer(this, 0, 0);

        //start the new chat flow
        this.startNewChatFlow(this.currentChatFlow)
    }

    /**
     * Starts a new Chat flow loop
     * @param chatFlow the chat flow to be started
     */
    public startNewChatFlow(chatFlow: ChatFlow) {
        //Sets the given chat Flow to the current one
        this.currentChatFlow = chatFlow;

        //If a previous exit button still exists => destroy it
        if(this.exitButton){
            this.exitButton.destroy()
        }

        //Add a new text element for animation
        this.textToAnimate = this.chatTextContainer.addReceivedText()

        //Animate the text then show the choices
        this.showTextThenChoices(
            this.textToAnimate,
            this.currentChatFlow.getCurrentText(),
            this.currentChatFlow.getCurrentChoices()
        );
    }

    /**
     * Starts the Text animation timer loop
     * @param textToAnimate the text object the animated text is placed in
     * @param fullText the whole text string that should be animated
     * @param onAnimationEnd function to call when the animation is done (usually function displaying the choices)
     */
    private startTextAnimation(
        textToAnimate: Phaser.GameObjects.Text,
        fullText: string,
        onAnimationEnd: Function
    ) {
        //remaining text has to be an object to be able to pass it by reference
        let remainingText = { text: fullText };
        //create a new timer event for the animation
        this.updateTextAnimationEvent = this.time.addEvent({
            delay: this.characterDelayMilli,    //delay is the defined characterDelay
            callback: this.onAnimateTextEvent,  //calls the onAnimateTextEvent function
            args: [textToAnimate, remainingText, onAnimationEnd],       //the arguments that need to be passed to the function
            repeat: this.currentChatFlow.getCurrentText().length - 1,   //repeat it exactly as often as there are characters in the string to be animated
            callbackScope: this,
        });
    }

    /**
     * Adds a character from the remainingText to the text element
     * If the remainingText is empty {@link onAnimationEnd} is called
     * @param text the text element where the animation is displayed
     * @param remainingText the remaining text to be displayed
     * @param onAnimationEnd the function to be called when the animation is over (the remaining text is empty)
     */
    private onAnimateTextEvent(
        text: Phaser.GameObjects.Text,
        remainingText: { text: string },
        onAnimationEnd: Function
    ) {
        //append the character to the text element
        text.appendText(remainingText.text[0], false);
        //remove character from remaining text
        remainingText.text = remainingText.text.substring(1);
        //if remaining text is empty
        if (!remainingText.text) {
            //remove the timer event
            this.updateTextAnimationEvent.remove(false);
            //call the given animation end function
            onAnimationEnd();
        }
    }

    /**
     * Starts the text animation and displays the possible choices when it ends
     * @param textObject the textObject where the animation is occurring
     * @param text the whole string that should be displayed 
     * @param choices the choices that should be displayed as buttons
     */
    private showTextThenChoices(
        textObject: Phaser.GameObjects.Text,
        text: string,
        choices: Array<string>
    ) {
        //start the animation
        this.startTextAnimation(textObject, text, () => {
            //when animation is over show the choices as buttons
            this.showChoices(choices);
        });
    }

    /**
     * Show the choices as buttons at the bottom of the screen
     * If no choices are available the exit button will be shown
     * @param choices array of strings containing the possible choices
     */
    private showChoices(choices: Array<string>) {
        // The lowest position a button can go is the displayHeight
        let previousY = this.cameras.main.displayHeight;
        //if there are choices
        if (choices.length) {
            //Loop through the choices in reverse (to display the first one at the top)
            choices.reverse().forEach((choiceString) => {
                //Create a new choice button
                let choiceButton = new ChatButton(
                    this,
                    this.cameras.main.displayWidth / 2 - this.buttonWidth / 2,  //center it horizontally
                    previousY - this.buttonPadding,     //add padding above the last button
                    this.buttonWidth,
                    () => {
                        //when choice button is clicked
                        this.onChoiceClick(choiceString); 
                    }, //needs to be anonymous function for "this" to be the scene
                    choiceString    //the string to be displayed on the button
                );
                //calculate Y to ensure that button is placed with its height above the padding
                let newY = choiceButton.y - choiceButton.height;
                choiceButton.setY(newY);
                //Save the calculated Y as the new previousY
                previousY = newY;
                //add the button to the scene and to the buttons array
                this.add.existing(choiceButton);
                this.choiceButtons.push(choiceButton);
            });
        //if there are no choices
        } else {
            //create the exit button
            this.exitButton = new ChatButton(
                this,
                this.cameras.main.displayWidth / 2 - this.buttonWidth / 2,  //center button horizontally
                previousY - this.buttonPadding,
                this.buttonWidth,
                () => {
                    //call exit chat function on click
                    this.exitChat();
                }, //needs to be anonymous function for this to equal
                "Exit"  //text to be displayed on the button
            );
            //set y to include the button height
            this.exitButton.setY(this.exitButton.y - this.exitButton.height);
            //add exit button to the scene
            this.add.existing(this.exitButton);
        }
    }

    /**
     * Function to be executed when a choice is clicked
     * Handles:
     * - the selection of a new choice in the {@link currentChatFlow}
     * - the destruction of all the other {@link choiceButtons}
     * - the start if a new loop {@link showTextThenChoices}
     * @param choiceText the string of the selected choice
     */
    private onChoiceClick(choiceText: string) {
        //Adds the answer text to the scene and container without animation
        this.answerText = this.chatTextContainer.addAnswerText(choiceText);
        //Create a new text object for animation
        this.textToAnimate = this.chatTextContainer.addReceivedText();

        //Select the selected choice in the current chat flow
        this.currentChatFlow.selectChoice(choiceText);
        //destroy all other existing buttons
        this.choiceButtons.forEach((button) => {
            button.destroy();
        });
        //empty the references from the array
        this.choiceButtons = [];
        //Start a new loop sequence
        this.showTextThenChoices(
            this.textToAnimate,
            this.currentChatFlow.getCurrentText(),
            this.currentChatFlow.getCurrentChoices()
        );
    }

    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitChat(): void {
        this.scene.wake("Play");
        this.scene.wake("Room");
        this.scene.wake("controlPad");
        this.scene.wake("pauseChatButtons");
        this.scene.sleep(this);
    }
}
