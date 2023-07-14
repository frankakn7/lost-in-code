import express, { Request, Response } from "express";
import db from "../db";

const router = express.Router();

/**
 * Create user
 */
router.post("/", (req, res) => {
    const user = req.body;

    const sql = 'INSERT INTO `user` (`username`, `email`, `password_hash`, `group_id`) VALUES (?, ?, ?, ?)';
    const params = [user.username, user.email, user.password_hash, user.group_id];

    db.query(sql, params).then(results => {
        res.send(results);
    }).catch(error => {
        console.error('Error inserting into the database:', error);
        return res.status(500).send('Server error');
    })
});

/**
 * Get all users
 */
router.get("/", (req: Request, res: Response) => {
    const sql = 'SELECT * FROM `user`;'
    db.query(sql).then(results => {
        res.send(results)
    }).catch(error => {
        console.error(error)
        return res.status(500).send("Server error")
    })
});

/**
 * Get specific user
 */
router.get("/:id", (req: Request, res: Response) => {
    const sql = 'SELECT * FROM user WHERE id = ?;'
    const params = [req.params.id]
    db.query(sql,params).then(results => {
        res.send(results)
    }).catch(error => {
        console.error(error)
        return res.status(500).send("Server error")
    })
});

/**
 * Update specific user
 */
router.put("/:id", (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = req.body;
    const sql = 'UPDATE `user` SET `username` = ?, `email` = ?, `password_hash` = ?, `group_id` = ? WHERE `id` = ?;'
    const params = [user.username, user.email, user.password_hash, user.group_id, userId];
    db.query(sql,params).then(results => {
        res.send(results)
    }).catch(error => {
        console.error(error)
        return res.status(500).send("Server error")
    })
});

/**
 * Delete specific user
 */
router.delete("/:id", (req: Request, res: Response) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM `user` WHERE `id` = ?'
    const params = [userId];
    db.query(sql,params).then(results => {
        res.send(results)
    }).catch(error => {
        console.error(error)
        return res.status(500).send("Server error")
    })
});

/**
 * Move user to specific group
 */
router.post("/:userId/groups/:groupId", (req: Request, res: Response) => {
    const groupId = req.params.groupId;
    const userId = req.params.userId;

    const sql = 'UPDATE `user` SET `group_id` = ? WHERE `id` = ?;'
    const params = [groupId,userId]
    db.query(sql,params).then(results => {
        res.send(results)
    }).catch(error => {
        console.error(error)
        return res.status(500).send("Server error")
    })
});

// router.delete("/:groupId/users/:userId", (req: Request, res: Response) => {
//     const groupId = req.params.groupId;
//     const userId = req.params.userId;
//     res.send(`Remove user with ID ${userId} from group with ID ${groupId}`);
// });

export default router;
