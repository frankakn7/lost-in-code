import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import "highlight.js/styles/night-owl.css";
import html2canvas from "html2canvas";
import * as Phaser from "phaser";
import {SupportedLanguages} from "../../types/supportedLanguages";
import {GameState} from "../../managers/gameState";
import {gameController} from "../../main";

export default class DraggableCodeBlock extends Phaser.GameObjects.Container {
    private _elementId: number;
    private _code: string;
    private _codeBlockImage: Phaser.GameObjects.Image;
    private _graphics: Phaser.GameObjects.Graphics;
    private _parentContainer: Phaser.GameObjects.Container;

    constructor(
        scene: Phaser.Scene,
        parentContainer: Phaser.GameObjects.Container,
        elementId: number,
        code: string,
        x?: number,
        y?: number,
        children?: Phaser.GameObjects.GameObject[]
    ) {
        super(scene, x, y, children);
        this._parentContainer = parentContainer;
        this._elementId = elementId;
        this._code = code;
        this._parentContainer.add(this);

        this.setInteractive(
            new Phaser.Geom.Rectangle(0, 0, 100, 100),
            Phaser.Geom.Rectangle.Contains
        );
        this.scene.input.setDraggable(this, true);
        // this.createCodeBlockImage();

        this.on("drag", (pointer, dragX, dragY) => {
            // this.x = dragX;
            this.y = dragY;
        });

        this.on(Phaser.Input.Events.DRAG_START, () => {
            this.setDepth(1);  // Bring to front when dragging
          });

        this.on(Phaser.Input.Events.DRAG_END,() => {
            this.setDepth(0);  // Reset depth when done dragging
            this.scene.events.emit("blockDropped", this)
        })
    }

    drawMarginColor(buttonMarginColor: number){
        this._graphics = this.scene.add.graphics();
        this._graphics.lineStyle(10, buttonMarginColor, 1);
        this._graphics.strokeRect(-this.width/2, -this.height/2, this.width, this.height);
        this.add(this._graphics)
    }

    markCorrect(){
        this.drawMarginColor(0x00ff7b)
    }

    markWrong(){
        this.drawMarginColor(0xf54747)
    }

    async createCodeBlockImage() {
        hljs.registerLanguage(SupportedLanguages.PHP, php);
        hljs.registerLanguage(SupportedLanguages.JAVA, java);
        let highlightedCode = hljs.highlight(this._code, {
            language: gameController.gameStateManager.curriculum.progLang,
        }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        dummyPre.style.fontFamily = "forwardRegular";
        dummyPre.style.letterSpacing= ""
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

        dummyPre.style.whiteSpace = "pre-wrap";
        dummyPre.style.maxWidth = `${
            this.scene.cameras.main.displayWidth - 200
        }px`;

        dummyPre.style.backgroundColor = "#1c1d21";
        dummyPre.style.color = "#c0c5ce";
        dummyPre.style.width = `${this.scene.cameras.main.width - 200}`;
        dummyPre.style.display = "none";
        let dummyPreId = "codeBlock" + this._elementId;
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
        let texturekey = "codeBlockTexture" + this._elementId;
        this.scene.textures.remove(texturekey);
        
        // let canvasTexture = this.scene.textures.addCanvas(texturekey, canvas);
        this.scene.textures.addCanvas(texturekey, canvas);

        // Now you can use 'yourTextureKey' as a texture key in your game.
        // For instance:
        this._codeBlockImage = this.scene.add.image(0, 0, texturekey);
        this.add(this._codeBlockImage);
        this.setSize(this._codeBlockImage.width, this._codeBlockImage.height);
        this.input.hitArea = new Phaser.Geom.Rectangle(
            0,
            0,
            this.width,
            this.height
        );
    }

    public getElementId(): number {
        return this._elementId;
    }
}
