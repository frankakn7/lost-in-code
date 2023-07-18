import db from "../db";

export const createGamestate = (req: any, res: any, userId: any, gameState: any) => {
    const sql = "INSERT INTO `game_state` (`state_data`, `user_id`) VALUES (?, ?);";
    const params = [JSON.stringify(gameState), userId];

    db.query(sql, params)
        .then((results) => {
            res.send(`New game state created for user ID ${userId}.`);
        })
        .catch((error) => {
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
}

export const getGameState = (req: any, res: any, userId: any) => {
    const sql = "SELECT * FROM `game_state` WHERE user_id = ?;";
    const params = [userId];

    db.query(sql, params)
        .then((results:any) => {
            res.send(results[0]);
        })
        .catch((error) => {
            console.error("Error querying from the database:", error);
            return res.status(500).send("Server error");
        });
}

export const updateGameState = (req: any, res: any, userId: any, game_state:any) => {
    const sql = "UPDATE `game_state` SET `state_data` = ? WHERE `user_id` = ?;";
    const params = [JSON.stringify(game_state), userId];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error updating the database:", error);
            return res.status(500).send("Server error");
        });
}