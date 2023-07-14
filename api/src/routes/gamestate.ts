import express, { Request, Response } from "express";

const router = express.Router();

// Game State Management Routes

router.post("/", (req: Request, res: Response) => {
    res.send("Create a new game state for a user");
});

router.get("/:userId", (req: Request, res: Response) => {
    const userId = req.params.userId;
    res.send(`Get game state of user with ID: ${userId}`);
});

router.put("/:userId", (req: Request, res: Response) => {
    const userId = req.params.userId;
    res.send(`Update game state of user with ID: ${userId}`);
});

router.delete("/:userId", (req: Request, res: Response) => {
    const userId = req.params.userId;
    res.send(`Delete game state of user with ID: ${userId}`);
});

export default router;
