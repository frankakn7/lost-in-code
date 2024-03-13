import { GameStateType } from "../types/gameStateType";
import { GameState } from "../managers/gameState";
import { debugHelper } from "./debugHelper";
import { gameController } from "../main";
import {LeaderboardUserType} from "../types/leaderboardUserType";

/**
 * Helper class for making API requests related to the game.
 */
export default class ApiHelper {
    /**
     * The base URL for the API.
     * @type {string}
     * @private
     */
    private apiUrl = `${process.env.API_URL}`;

    /**
     * The URL for the php server.
     * @type {string}
     * @private
     */
    private phpUrl = `${process.env.PHP_URL}`;

    /**
     * Evaluate the given code on the server.
     * @param {string} code - The code to be evaluated.
     * @returns {Promise} - A Promise that resolves with the server response or rejects with an error message.
     */
    public evaluateCode(code: string) {
        // const url = this.phpUrl;
        const url = "http://localhost:6500";
        const formData = new FormData();
        debugHelper.logValue("php url", url);
        formData.append("code", code);
        debugHelper.logValue("form data", formData);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                // credentials: "include",
                body: formData,
            })
                .then((response) => {
                    if (response.ok) {
                        resolve(response);
                    } else {
                        reject("Evalutaion failed");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    /**
     * Get chapters specific to the current user.
     * @returns {Promise} - A Promise that resolves with the user's chapters data or rejects with an error message.
     */
    public getChapters() {
        const url = this.apiUrl + "/chapters/me";
        return new Promise((resolve, reject) => {
            fetch(url, { method: "GET", credentials: "include" })
                .then((response) => {
                    response.json().then((data) => {
                        resolve(data);
                    });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    public async getFullChapter(chapterNumber: number) {
        try {
            //Get curriculum Data
            const curriculumDataUrl = `${this.apiUrl}/users/me/curriculum_data`;
            const curriculumDataResponse = await this.getIncludingCredentials(curriculumDataUrl);
            const curriculumData = await curriculumDataResponse.json();

            //Get all chapters
            const chaptersUrl = `${this.apiUrl}/chapters/`;
            const chaptersResponse = await this.getIncludingCredentials(chaptersUrl);
            const chaptersData: any = await chaptersResponse.json();

            //find current chapter id
            const chapter = chaptersData.find(
                (chapter: any) =>
                    chapter.order_position == chapterNumber && chapter.curriculum_id == curriculumData.curriculum_id,
            );

            if (!chapter) {
                throw new Error("Chapter not found");
            }

            //Get full chapter using id
            const fullChapterUrl = `${this.apiUrl}/chapters/${chapter.id}/full`;
            const fullChapterResponse = await this.getIncludingCredentials(fullChapterUrl);
            const fullChapter: any = await fullChapterResponse.json();

            return fullChapter;
        } catch (error) {
            console.error(error);
            // throw new Error(error);
        }
    }

    public async getGroupLeaderboard(): Promise<LeaderboardUserType[]> {
        try {
            const url = this.apiUrl + "/groups/me/leaderboard";
            const response = await this.getIncludingCredentials(url);
            const leaderboardData = await response.json();

            // return leaderboardData;
            // console.log(leaderboardData);
            return leaderboardData;
        } catch (error) {
            console.error(error);
            // throw new Error(error);
        }
    }

    /**
     * Get the game state data for the current user.
     * @returns {Promise} - A Promise that resolves with the user's game state data or rejects with an error message.
     */
    public getStateData() {
        const url = this.apiUrl + "/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, { method: "GET", credentials: "include" })
                .then((response) => {
                    response
                        .json()
                        .then((data) => {
                            resolve(data);
                        })
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    public getProgLang(): Promise<string> {
        const url = this.apiUrl + "/curriculums/me/prog-lang";
        return new Promise((resolve, reject) => {
            fetch(url, { method: "GET", credentials: "include" })
                .then((response) => {
                    response
                        .json()
                        .then((data) => {
                            resolve(data[0].curriculum_prog_lang);
                        })
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Update the game state data for the current user.
     * @param {GameStateType} state_data - The new game state data to be updated.
     * @returns {Promise} - A Promise that resolves with the updated game state data or rejects with an error message.
     */
    // public updateStateData(state_data: GameStateType
    public updateStateData(state_data: GameState) {
        const gameState = { game_state: state_data };
        // debugHelper.logValue("json gamestate", JSON.stringify(gameState))
        const url = this.apiUrl + "/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(gameState),
            })
                .then((response) => {
                    response
                        .json()
                        .then((data) => resolve(data))
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Update the game state data for the current user.
     * @param {GameStateType} state_data - The new game state data to be updated.
     * @returns {Promise} - A Promise that resolves with the updated game state data or rejects with an error message.
     */
    // public updateStateData(state_data: GameStateType
    public deleteGameStateData() {
        // debugHelper.logValue("json gamestate", JSON.stringify(gameState))
        const url = this.apiUrl + "/gamestates/me";
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            })
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Check the login status of the current user.
     * @returns {Promise} - A Promise that resolves if the user is logged in, or rejects with an error message otherwise.
     */
    public checkLoginStatus() {
        const url = this.apiUrl + "/me";
        return new Promise((resolve, reject) => {
            fetch(url, { method: "GET", credentials: "include" })
                .then((response) => {
                    debugHelper.logValue("api/me response", response);
                    if (response.status == 200) {
                        response
                            .json()
                            .then((data) => {
                                debugHelper.logValue("user data", data.user);
                                data.user ? resolve(data) : reject("not logged in");
                            })
                            .catch((error) => reject(error));
                    } else {
                        reject("response status not 200");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Log in the user with the provided email and password.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise} - A Promise that resolves with the user data if login is successful, or rejects with an error message otherwise.
     */
    public login(email, password) {
        const url = this.apiUrl + "/login";
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            })
                .then((response) => {
                    if (response.ok) {
                        response
                            .json()
                            .then((data) => {
                                debugHelper.logValue("login response data", data);
                                data.user ? resolve(data) : reject("no user data");
                            })
                            .catch((error) => reject(error));
                    } else {
                        reject("login failed");
                    }
                })
                .catch((error) => reject(error));
        });
    }

    /**
     * Log out the current user.
     * @returns {Promise} - A Promise that resolves if the logout is successful, or rejects with an error message otherwise.
     */
    public logout() {
        const url = this.apiUrl + "/logout";
        return new Promise((resolve, reject) => {
            fetch(url, { method: "POST", credentials: "include" })
                .then((response) => {
                    if (response.status == 200) {
                        resolve(response);
                    } else {
                        reject(new Error("could not log out"));
                    }
                })
                .catch((error) => reject(error));
        });
    }

    private async getIncludingCredentials(url: string) {
        return fetch(url, { method: "GET", credentials: "include" });
    }
}
