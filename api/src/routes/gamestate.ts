import express, { Request, Response } from "express";
import db from "../db";
import {createGamestate, deleteGamestatesFromGroup, getGameState, updateGameState} from "../handlers/gamestateHandler";

const router = express.Router();

// Game State Management Routes

router.post("/", (req, res) => {
    const userId = req.body.user_id;
    const gameState = req.body.state_data;

    createGamestate(req,res,userId,gameState);
});


router.get("/me", (req, res) => {
    const userId = req.body.user.id;
    getGameState(req,res,userId);
});

router.get("/:userId", (req, res) => {
    const userId = req.params.userId;

    getGameState(req,res,userId);
});



router.put("/me", (req, res) => {
    const userId = req.body.user.id;
    const game_state = req.body.game_state;
    updateGameState(req,res,userId,game_state)
});

router.put("/:userId", (req, res) => {
    const userId = req.params.userId;
    const game_state = req.body.game_state;

   updateGameState(req,res,userId,game_state)
});

router.delete("/me", (req, res) => {
    const userId = req.body.user.id;

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

router.delete("/group/:groupId", (req, res) => {
    const groupId = req.params.groupId;

    deleteGamestatesFromGroup(req,res,groupId);
});


export default router;
