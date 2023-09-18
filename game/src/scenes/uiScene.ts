import ControlPadGroup from "../ui/controlPadGroup";
import ArrowLeftPng from "../assets/ui/Arrow-Button-Left.png";
import ArrowRightPng from "../assets/ui/Arrow-Button-right.png";
import ArrowUpPng from "../assets/ui/Arrow-Button-up.png";
import ArrowDownPng from "../assets/ui/Arrow-Button-Down.png";

export default class UiScene extends Phaser.Scene {
    constructor() {
        super({ key: 'uiScene' });
    }

    preload() {
        this.load.image("arrowLeft", ArrowLeftPng);
        this.load.image("arrowRight", ArrowRightPng);
        this.load.image("arrowUp", ArrowUpPng);
        this.load.image("arrowDown", ArrowDownPng);
    }

    create(){
        const controlPadGroup = new ControlPadGroup(this);
        controlPadGroup.addToScene();
        controlPadGroup.setPosition(this.cameras.main.width / 2,this.cameras.main.height - 250)

        console.log(controlPadGroup)
    }
}