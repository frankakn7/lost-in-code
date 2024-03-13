import * as Phaser from "phaser";
import {LeaderboardUserType} from "../../types/leaderboardUserType";
import {gameController} from "../../main";

/**
 * A container for handling the display of the top three players on the leaderboard
 */
export default class RestLeaderboardContainer extends Phaser.GameObjects.Container {

    constructor(scene: Phaser.Scene, x: number, y: number, leaderBoard: LeaderboardUserType[]) {
        super(scene, x, y);

        let namesContainer = document.createElement("div");
        // let dummyForm = document.createElement("form");
        // namesContainer.innerHTML = "<p>Hello THere test</p>";

        namesContainer.style.fontFamily = "forwardRegular";
        namesContainer.style.fontSize = "35px";
        namesContainer.style.lineHeight = "2";
        namesContainer.style.letterSpacing = "5px";
        namesContainer.style.color = "#00c8ff";
        namesContainer.style.width = `${this.scene.cameras.main.displayWidth * 0.7}px`;
        namesContainer.style.maxHeight = `${this.scene.cameras.main.displayHeight / 2}px`;
        namesContainer.style.height = `${this.scene.cameras.main.displayHeight / 2}px`;
        namesContainer.style.overflow = "scroll";
        namesContainer.style.overscrollBehavior = "contain";
        namesContainer.style.border = "10px solid #00c8ff"
        namesContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        namesContainer.style.paddingTop = "10px";

        let table = document.createElement("table");

        table.style.width = "100%";
        table.style.border = "none";
        table.style.borderCollapse = "collapse";

        let tableBody = document.createElement("tbody");

        // for(let i = 0; i < 4; i++) {
        leaderBoard.slice(3).forEach((user, index) => {

            let tableRow = document.createElement("tr");

            if(user.id == gameController.user.id){
                tableRow.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
            }

            let rankCell = document.createElement("td");
            let usernameCell = document.createElement("td");
            let pointsCell = document.createElement("td");

            rankCell.innerHTML = (index + 4) + ".";
            usernameCell.innerHTML = user.username;
            pointsCell.innerHTML = "" + user.points;

            rankCell.style.padding = "10px"
            rankCell.style.textAlign = "center"
            // rankCell.style.paddingLeft = "20px"
            usernameCell.style.padding = "10px"
            pointsCell.style.padding = "10px"

            tableRow.appendChild(rankCell)
            tableRow.appendChild(usernameCell)
            tableRow.appendChild(pointsCell)

            tableBody.appendChild(tableRow);
        })
        // }

        table.appendChild(tableBody);

        namesContainer.appendChild(table);


        const domElement = this.scene.add
            .dom(
                this.scene.cameras.main.displayWidth / 2,
                this.scene.cameras.main.displayHeight / 2.5,
                namesContainer
            )
            .setOrigin(0.5, 0);
        this.add(domElement)
    }
}