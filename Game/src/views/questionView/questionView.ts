import hljs from "highlight.js/lib/core";
import php from "highlight.js/lib/languages/php";
import "highlight.js/styles/night-owl.css";
import html2canvas from "html2canvas";

//TODO: put this code block into a question view!!
const code = `
<?php
$txt = "Hello world!";
$x = 5;
$y = 10.5;

echo $txt;
echo "<br>";
echo $x;
echo "<br>";
echo $y;
?>
  `;
        hljs.registerLanguage("php", php);
        const highlightedCode = hljs.highlight("php", code).value;
        console.log(highlightedCode);
        let dummyPre = document.createElement("pre"); // Create a dummy div
        let dummyDiv = document.createElement("div");
        dummyDiv.innerHTML = highlightedCode;
        // dummyPre.style.display = "inline-block";
        dummyPre.style.display = "none";
        dummyPre.id = "codeBlock"

        dummyDiv.style.backgroundColor = "#1c1d21"
        dummyDiv.style.color = "#c0c5ce"
        dummyDiv.style.fontFamily = "forwardRegular"
        dummyDiv.style.lineHeight = "2"

        dummyPre.appendChild(dummyDiv)
        console.log(dummyPre)

        document.body.appendChild(dummyPre);
        html2canvas(dummyPre, {scale: 1, onclone: (clonedDoc) => {
            clonedDoc.getElementById("codeBlock").style.display = 'inline-block'
        }}).then((canvas) => {

            console.log(canvas);
            let canvasTexture = this.textures.addCanvas("yourTextureKey", canvas);
            console.log(canvasTexture)

            // Now you can use 'yourTextureKey' as a texture key in your game.
            // For instance:
            this.add.image(50, 50, "yourTextureKey").setScale(1);
        });