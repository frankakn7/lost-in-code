import * as Phaser from "phaser";
import {LeaderboardUserType} from "../../types/leaderboardUserType";
import {gameController} from "../../main";

/**
 * A container for handling the display of the top three players on the leaderboard
 */
export default class TopThreeContainer extends Phaser.GameObjects.Container {

    private _bronzeColor: string = "#CD7F32"
    private _silverColor: string = "#C0C0C0"
    private _goldColor: string = "#FFD700"

    constructor(scene: Phaser.Scene, x: number, y: number, topUsers: LeaderboardUserType[]) {
        super(scene, x, y);

        let namesContainer = document.createElement("div");
        let table = document.createElement("table");

        namesContainer.style.fontFamily = "forwardRegular";
        namesContainer.style.fontSize = "45px";
        namesContainer.style.lineHeight = "2";
        namesContainer.style.letterSpacing = "5px";
        namesContainer.style.color = "#00c8ff";
        // namesContainer.style.border = "10px solid #00c8ff"
        namesContainer.style.border = "10px solid white"
        namesContainer.style.width = `${this.scene.cameras.main.displayWidth * 0.7}px`;


        table.style.width = "100%";
        table.style.border = "none";
        table.style.borderCollapse = "collapse";

        let tableBody = document.createElement("tbody");

        // for(let i = 0; i < 4; i++) {
        topUsers.forEach((user, index) => {

            let tableRow = document.createElement("tr");

            if (index == 0) {
                tableRow.style.color = this._goldColor
            } else if (index == 1) {
                tableRow.style.color = this._silverColor
            } else if (index == 2) {
                tableRow.style.color = this._bronzeColor
            }

            if(user.id == gameController.user.id){
                tableRow.style.backgroundColor = "rgba(255, 255, 255, 0.5)"
            }

            let rankCell = document.createElement("td");
            let usernameCell = document.createElement("td");
            let pointsCell = document.createElement("td");

            rankCell.innerHTML = (index + 1) + ".";
            usernameCell.innerHTML = user.username;
            pointsCell.innerHTML = "" + user.points;

            rankCell.style.padding = "10px"
            // rankCell.style.paddingLeft = "20px"
            rankCell.style.textAlign = "center"
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
                300,
                namesContainer
            )
            .setOrigin(0.5, 0);
        this.add(domElement)
    }
}