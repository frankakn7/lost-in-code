import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import html2canvas from "html2canvas";
import * as Phaser from "phaser";

export default class SelectableCodeBlock extends Phaser.GameObjects.Container {
    private elementId: number;
    private code: string;
    private codeBlockImage: Phaser.GameObjects.Image;
    private graphics: Phaser.GameObjects.Graphics;
    private onClick: Function;
    private selected: boolean = false;

    constructor(
        scene: Phaser.Scene,
        elementId: number,
        code: string,
        onClick: Function,
        x?: number,
        y?: number,
        children?: Phaser.GameObjects.GameObject[]
    ) {
        super(scene, x, y, children);
        this.elementId = elementId;
        this.code = code;
        this.scene.add.existing(this);
        this.onClick = onClick;

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 100, 100),
            Phaser.Geom.Rectangle.Contains
        );
        // this.scene.input.setDraggable(this, true);
        // this.createCodeBlockImage();

        this.on("pointerdown", () => {
            this.onClick();
        });
    }

    getSelected(){
        return this.selected;
    }
    
    select(){
        this.markSelected();
        this.selected = true;
    }

    deselect(){
        this.graphics.clear()
        this.graphics.destroy()
        this.selected = false;
    }

    drawMarginColor(buttonMarginColor: number){
        this.graphics = this.scene.add.graphics();
        this.graphics.lineStyle(20, buttonMarginColor, 1);
        this.graphics.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        this.add(this.graphics)
    }

    markSelected(){
        this.drawMarginColor(0x00c8ff)
    }

    markCorrect(){
        this.drawMarginColor(0x00ff7b)
    }

    markWrong(){
        this.drawMarginColor(0xf54747)
    }

    async createCodeBlockImage() {
        hljs.registerLanguage("php", php);
        // console.log(this.code)
        let highlightedCode = hljs.highlight(this.code, {
            language: "php",
        }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        dummyPre.style.fontFamily = "forwardRegular";
        dummyPre.style.fontSize = "25px";
        dummyPre.style.lineHeight = "2";
        dummyPre.style.letterSpacing = "5px"
        // dummyDiv.style.display = "inline-block";
        dummyPre.style.width = `${
            this.scene.cameras.main.displayWidth - 200
        }px`;
        dummyPre.style.maxHeight = `${
            this.scene.cameras.main.displayHeight / 3
        }px`;
        dummyPre.style.overflow = "scroll";
        dummyPre.style.overscrollBehavior = "contain";
        dummyPre.style.backgroundColor = "white";
        dummyPre.style.padding = "20px";
        dummyPre.style.border = "10px solid #00c8ff";

        dummyPre.style.backgroundColor = "#1c1d21";
        dummyPre.style.color = "#c0c5ce";
        dummyPre.style.width = `${this.scene.cameras.main.width - 200}`;
        dummyPre.style.display = "none";
        let dummyPreId = "codeBlock" + this.elementId;
        dummyPre.id = dummyPreId;

        dummyPre.appendChild(dummyDiv);
        document.body.appendChild(dummyPre);

        let canvas = await html2canvas(dummyPre, {
            logging: false,
            scale: 1,
            onclone: function (clonedDoc) {
                dummyPre.remove();
                clonedDoc.getElementById(dummyPreId).style.display = "block";
            },
        });
        // html2canvas(dummyPre, <any>{dpi: 144}).then((canvas) => {
        // Add the canvas as a texture
        let texturekey = "codeBlockTexture" + this.elementId;
        this.scene.textures.remove(texturekey);
        
        let canvasTexture = this.scene.textures.addCanvas(texturekey, canvas);

        // Now you can use 'yourTextureKey' as a texture key in your game.
        // For instance:
        this.codeBlockImage = this.scene.add.image(0, 0, texturekey);
        this.add(this.codeBlockImage);
        this.setSize(this.codeBlockImage.width, this.codeBlockImage.height);
        this.input.hitArea = new Phaser.Geom.Rectangle(
            0,
            0,
            this.width,
            this.height
        );
    }

    public getElementId(): number {
        return this.elementId;
    }
}
