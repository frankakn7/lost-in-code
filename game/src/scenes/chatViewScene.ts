import * as Phaser from "phaser";
import { ChatFlowNode } from "../classes/chat/chatFlowNode";
import ChatFlow from "../classes/chat/chatFlow";
import DeviceButton from "../ui/deviceButton";
import ChatTextContainer from "../ui/chatTextContainer";
import deviceBackgroundTilePng from "../assets/Device-Background-Tile.png";
import {globalEventBus} from "../helpers/globalEventBus";
import WorldViewScene from "./worldViewScene";
import {gameController} from "../main";
import {GameEvents} from "../types/gameEvents";
import {SceneKeys} from "../types/sceneKeys";
import SpriteButton from "../ui/SpriteButton";

/**
 * The ChatViewScene displaying the chat
 * Handles the animation of the text as well as displaying choice buttons
 */
export default class ChatViewScene extends Phaser.Scene {

    /**
     * The current {@link ChatFlow} being handled by the chatView
     */
    private _currentChatFlow: ChatFlow;

    /**
     * The text coming TO the player that should have animation
     */
    private _textToAnimate: Phaser.GameObjects.Text;
    /**
     * The text coming FROM the player
     */
    private _answerText: Phaser.GameObjects.Text;

    /**
     * Array of all the choice buttons (used for destroying buttons when choice was made)
     */
    private _choiceButtons: Array<DeviceButton> = [];

    /**
     * The TimerEvent for handling delayed text character display
     */
    private _updateTextAnimationEvent: Phaser.Time.TimerEvent;
    /**
     * The delay of each character in milliseconds
     */
    private _characterDelayMilli = 50;

    /**
     * Padding between choice buttons
     */
    private _buttonPadding = 80;
    /**
     * Width of all the choice buttons
     */
    private _buttonWidth = 500;

    /**
     * The container of all the texts
     */
    private _chatTextContainer: ChatTextContainer;

    /**
     * The exit button for the chat view
     */
    // private _exitButton: DeviceButton;
    private _exitButton: SpriteButton;

    private _skipButton: DeviceButton;

    private _tilesprite: Phaser.GameObjects.TileSprite;

    private _destroyOnExit = false;

    private _exitFunction:Function = this.exitChat;

    private _textToSave: string[][] = [];

    private _chatHistory: string[][] = [];

    private _sceneKey: SceneKeys;


    /**
     *
     * @param chatFlow The first {@link ChatFlow} to be handled by the chat view
     */
    // constructor(worldViewScene: WorldViewScene, chatFlow?: ChatFlow, chatHistory?: string[][], sceneKey?:string, destroyOnExit?:boolean, customExitFunc?:Function) {
    constructor(chatFlow?: ChatFlow, chatHistory?: string[][], sceneKey?:SceneKeys, destroyOnExit?:boolean, customExitFunc?:Function) {

        super(sceneKey ?? SceneKeys.STORY_CHAT_VIEW_SCENE_KEY);

        this._sceneKey = sceneKey;

        this._chatHistory = chatHistory;
        destroyOnExit ? this._destroyOnExit = destroyOnExit : null;
        chatFlow ? this._currentChatFlow = chatFlow : null;
        customExitFunc ? this._exitFunction = customExitFunc : null;
    }

    public create() {
        //Set background color to black
        // this.cameras.main.setBackgroundColor("rgba(0,0,0,1)");
        this._tilesprite = this.add.tileSprite(0,0,this.cameras.main.displayWidth / 3, this.cameras.main.displayHeight / 3, "backgroundTile").setOrigin(0,0).setScale(3)

        //create the text container
        this._chatTextContainer = new ChatTextContainer(this, 0, 225);

        this._chatHistory?.length ? this.applyChatHistory() : null;


        //start the new chat flow
        this._currentChatFlow ? this.startNewChatFlow(this._currentChatFlow) : this.showExitButton();
    }

    private applyChatHistory() {
        this._chatHistory.forEach(message => {
            message[0] === "M" ? this._chatTextContainer.addFullRecievedText(message[1]) : null;
            message[0] === "A" ? this._chatTextContainer.addAnswerText(message[1]) : null;
        })
        this._chatTextContainer.scrollToBottom();
    }

    private skipTextAnimation(): void {
        if (this._updateTextAnimationEvent) {
            // Remove the animation event
            this._updateTextAnimationEvent.remove(false);

            // Show the full text
            this._textToAnimate.setText(this._currentChatFlow.getCurrentText());

            this._chatTextContainer.calculateNewInputHitArea()

            // Display the choices
            this.removeSkipButton();
            this.showChoices(this._currentChatFlow.getCurrentChoices());
        }
    }


    /**
     * Starts a new Chat flow loop
     * @param chatFlow the chat flow to be started
     */
    public startNewChatFlow(chatFlow: ChatFlow) {
        //Sets the given chat Flow to the current one
        this._currentChatFlow = chatFlow;

        //If a previous exit button still exists => destroy it
        if(this._exitButton){
            this._exitButton.destroy()
        }

        //Add a new text element for animation
        this._textToAnimate = this._chatTextContainer.addReceivedText()

        //Animate the text then show the choices
        this.showTextThenChoices(
            this._textToAnimate,
            this._currentChatFlow.getCurrentText(),
            this._currentChatFlow.getCurrentChoices()
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
        this._updateTextAnimationEvent = this.time.addEvent({
            delay: this._characterDelayMilli,    //delay is the defined characterDelay
            callback: this.onAnimateTextEvent,  //calls the onAnimateTextEvent function
            args: [textToAnimate, remainingText, onAnimationEnd],       //the arguments that need to be passed to the function
            repeat: this._currentChatFlow.getCurrentText().length - 1,   //repeat it exactly as often as there are characters in the string to be animated
            callbackScope: this,
        });
        //Show skip button
        this.showSkipButton()
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
            this._updateTextAnimationEvent.remove(false);
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
        this._textToSave.push(["M",text])
        //start the animation
        this.startTextAnimation(textObject, text, () => {
            //when animation is over show the choices as buttons
            this.removeSkipButton();
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
                let choiceButton = new DeviceButton(
                    this,
                    this.cameras.main.displayWidth / 2 - this._buttonWidth / 2,  //center it horizontally
                    previousY - this._buttonPadding,     //add padding above the last button
                    this._buttonWidth,
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
                this._choiceButtons.push(choiceButton);
            });
        //if there are no choices
        } else {
            this.showExitButton();
        }
    }

    private showSkipButton(){
        // this._exitButton?.destroy(true);
        //create the exit button
        this._skipButton = new DeviceButton(
            this,
            this.cameras.main.displayWidth / 2 - this._buttonWidth / 2,  //center button horizontally
            this.cameras.main.displayHeight - this._buttonPadding,
            this._buttonWidth,
            () => {
                //call exit chat function on click
                // this.exitChat();
                this.skipTextAnimation()
            }, //needs to be anonymous function for this to equal
            "Skip"  //text to be displayed on the button
        );
        //set y to include the button height
        this._skipButton.setY(this._skipButton.y - this._skipButton.height);
        //add exit button to the scene
        this.add.existing(this._skipButton);
    }

    private removeSkipButton(){
        this._skipButton?.destroy(true);
        delete this._skipButton;
    }

    private showExitButton(){

        this._exitButton = new SpriteButton(
            this,
            "returnButtonTexture",
            180,
            180,
            () => {this._exitFunction()}
        );
        //add exit button to the scene
        this.add.existing(this._exitButton);
    }

    /**
     * Function to be executed when a choice is clicked
     * Handles:
     * - the selection of a new choice in the {@link _currentChatFlow}
     * - the destruction of all the other {@link _choiceButtons}
     * - the start if a new loop {@link showTextThenChoices}
     * @param choiceText the string of the selected choice
     */
    private onChoiceClick(choiceText: string) {
        this._textToSave.push(["A",choiceText]);
        //Adds the answer text to the scene and container without animation
        this._answerText = this._chatTextContainer.addAnswerText(choiceText);
        //Create a new text object for animation
        this._textToAnimate = this._chatTextContainer.addReceivedText();

        //Select the selected choice in the current chat flow
        this._currentChatFlow.selectChoice(choiceText);
        //destroy all other existing buttons
        this._choiceButtons.forEach((button) => {
            button.destroy();
        });
        //empty the references from the array
        this._choiceButtons = [];
        //Start a new loop sequence
        this.showTextThenChoices(
            this._textToAnimate,
            this._currentChatFlow.getCurrentText(),
            this._currentChatFlow.getCurrentChoices()
        );
    }

    public getSavedText() {
        return this._textToSave;
    }

    //TODO remove this function
    /**
     * Sends this scene to sleep and reawakes all the other scenes
     */
    private exitChat(): void {
        gameController.storyManager.addTextHistory(this._textToSave);

        this._textToSave = [];

        globalEventBus.emit(GameEvents.SAVE_GAME)
        globalEventBus.emit(GameEvents.CHAT_CLOSED);

        gameController.chatSceneController.exitChat(this._sceneKey, this._destroyOnExit)
        gameController.worldSceneController.resumeWorldViewScenes();
    }
}
