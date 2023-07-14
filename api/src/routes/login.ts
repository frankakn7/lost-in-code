import bcrypt from "bcrypt"
import express, { Request, Response } from "express";
import db from "../db";
import { generateAuthToken } from "../auth";

const router = express.Router();


/**
 * Login
 */
router.post("/", (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT `id`, `password_hash`, `role` FROM `user` WHERE `email` = ?;'
    const params = [email];

    db.query(sql, params).then(async results => {
        // Here we suppose that results[0] is the user's data in the database
        if (!results[0] || !(await bcrypt.compare(password, results[0].password_hash))) {
            return res.status(401).send('Invalid email or password');
        }

        // Generate token
        const token = generateAuthToken(results[0].id, results[0].role);
        res.json({ token });
    }).catch(error => {
        console.error('Error inserting into the database:', error);
        return res.status(500).send('Server error');
    })
});

export default router;