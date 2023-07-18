import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

// Game State Management Routes

router.post("/", (req, res) => {
    const userId = req.body.user_id;
    const gameState = req.body.state_data;

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
});


router.get("/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = "SELECT * FROM `game_state` WHERE user_id = ?;";
    const params = [userId];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error querying from the database:", error);
            return res.status(500).send("Server error");
        });
});


router.put("/:userId", (req, res) => {
    const userId = req.params.userId;
    const game_state = req.body.game_state;

    const sql = "UPDATE `game_state` SET `state_data` = ? WHERE `user_id` = ?;";
    const params = [game_state, userId];

    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error("Error updating the database:", error);
            return res.status(500).send("Server error");
        });
});


router.delete("/:userId", (req, res) => {
    const userId = req.params.userId;

    const sql = "DELETE FROM `game_state` WHERE `user_id` = ?;";
    const params = [userId];

    db.query(sql, params)
        .then((results) => {
            res.send(`Game state for user ID ${userId} deleted.`);
        })
        .catch((error) => {
            console.error("Error deleting from the database:", error);
            return res.status(500).send("Server error");
        });
});


export default router;
