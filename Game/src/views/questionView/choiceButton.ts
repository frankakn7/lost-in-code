import DeviceButton from "../../ui/deviceButton";
import * as Phaser from "phaser";

export default class ChoiceButton extends DeviceButton {
    private associatedElementId: number;
    private selected: boolean = false;
    private selectedLabelStyle: Phaser.Types.GameObjects.Text.TextStyle;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        func: Function,
        label: string,
        associatedElementId: number
    ) {
        super(scene, x, y, width, func, label);
        this.associatedElementId = associatedElementId;

        this.selectedLabelStyle = {
            fontSize: "30px",
            fontFamily: "forwardRegular",
            color: "#000",
            wordWrap: {
                width: this.width - this.textPadding * 2, //once for left and once for right
                useAdvancedWrap: true,
            },
            align: "center",
        }

        this.on("pointerdown", () => {
            this.selected = !this.selected
            if(this.selected){
                this.drawButton(this.labelString,0x00c8ff,0x00c8ff,this.selectedLabelStyle);
            }else{
                this.drawButton(this.labelString);
            }
        });
    }

    public colorCorrectSelected(): void {
        this.drawButton(this.labelString,0x00ff7b,0x00ff7b,this.selectedLabelStyle)
    }

    public colorIncorrectSelected(): void {
        this.drawButton(this.labelString,0xf54747,0xf54747,this.selectedLabelStyle)
    }

    // public colorCorrectNotSelected(): void {
    //     this.drawButton(this.labelString,0x000000,0x00ff7b,this.defaultLabelStyle)
    // }

    public colorIncorrectNotSelected(): void {
        // this.drawButton(this.labelString,0x000000,0xde1d1d,this.defaultLabelStyle)
        this.drawButton(this.labelString,0x000000,0x00ff7b,this.defaultLabelStyle)
    }

    public getElementId(): number{
        return this.associatedElementId;
    }

    public isSelected(): boolean{
        return this.selected;
    }


}
