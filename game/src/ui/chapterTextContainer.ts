import ChatTextContainer from "./chatTextContainer";
import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import html2canvas from "html2canvas";
import "highlight.js/styles/night-owl.css";
import Phaser from "phaser";
import { SupportedLanguages } from "../types/supportedLanguages";
import { gameController } from "../main";

interface TextBlock {
    type: "text" | "code";
    content: string;
}

export default class ChapterTextContainer extends ChatTextContainer {
    private _textureKeys: Array<String> = [];

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        // this.addCodeBlock("<?php function test(){} ?>").then(value => {
        //     debugHelper.logString("Added code block")
        // })
    }

    async addCodeBlock(code: string) {
        hljs.registerLanguage(SupportedLanguages.PHP, php);
        hljs.registerLanguage(SupportedLanguages.JAVA, java);
        let highlightedCode = hljs.highlight(code, {
            language: gameController.gameStateManager.curriculum.progLang,
        }).value;

        // Create a dummy div and apply the highlighted code to it
        let dummyPre = document.createElement("pre");
        let dummyDiv = document.createElement("div");
        // let dummyForm = document.createElement("form");
        dummyDiv.innerHTML = highlightedCode;

        dummyPre.style.fontFamily = "forwardRegular";
        dummyPre.style.letterSpacing = "";
        dummyPre.style.fontSize = "25px";
        dummyPre.style.lineHeight = "2";
        dummyPre.style.letterSpacing = "5px";
        // dummyDiv.style.display = "inline-block";
        dummyPre.style.width = `${this.scene.cameras.main.displayWidth - 200}px`;
        dummyPre.style.maxHeight = `${this.scene.cameras.main.displayHeight / 3}px`;
        dummyPre.style.overflow = "scroll";
        dummyPre.style.overscrollBehavior = "contain";
        dummyPre.style.backgroundColor = "white";
        dummyPre.style.padding = "20px";
        dummyPre.style.border = "10px solid #00c8ff";

        dummyPre.style.whiteSpace = "pre-wrap";
        dummyPre.style.maxWidth = `${this.scene.cameras.main.displayWidth - 200}px`;

        dummyPre.style.backgroundColor = "#1c1d21";
        dummyPre.style.color = "#c0c5ce";
        dummyPre.style.width = `${this.scene.cameras.main.width - 200}`;
        dummyPre.style.display = "none";
        let dummyPreId = "codeBlock" + this._textureKeys.length;
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
        let texturekey = "codeBlockTexture" + this._textureKeys.length;
        this.scene.textures.remove(texturekey);
        this._textureKeys.push(texturekey);

        // let canvasTexture = this.scene.textures.addCanvas(texturekey, canvas);
        this.scene.textures.addCanvas(texturekey, canvas);

        // let codeBlockImage = this.scene.add.image(this.textSidePadding, this.calcNewTextY(), texturekey);
        let codeBlockImage = this.scene.add.image(
            this.scene.cameras.main.displayWidth / 2,
            this.calcNewTextY(),
            texturekey,
        );
        codeBlockImage.setOrigin(0.5, 0);
        this.pushAndAdd(codeBlockImage);
    }

    private createTextQueue(text: string): TextBlock[] {
        const regex = /###CODE###[\s\S]*?###\/CODE###|[\s\S]+?(?=###CODE###|$)/g;

        const matches = text.matchAll(regex);
        const outputArray: TextBlock[] = [];

        for (const match of matches) {
            let block = match[0];

            if (block.startsWith("###CODE###")) {
                // Remove the ###code### and ###/code### markers
                block = block.replace("###CODE###", "").replace("###/CODE###", "");
                outputArray.push({ type: "code", content: block.trim() });
            } else {
                outputArray.push({ type: "text", content: block.trim() });
            }
        }

        return outputArray;
    }

    public async addFullDocText(text: string) {
        let textArray = this.createTextQueue(text);

        for (const block of textArray) {
            if (block.type === "code") {
                await this.addCodeBlock(block.content);
            } else {
                this.addFullRecievedText(block.content);
            }
        }
    }
}
