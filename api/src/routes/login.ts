import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import db from "../db";
import { generateAuthToken } from "../auth";
import { RowDataPacket } from "mysql2";

const router = express.Router();

/**
 * Login
 */
router.post("/", (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    const sql =
        "SELECT `id`, `password_hash`, `role` FROM `user` WHERE `email` = ?;";
    const params = [email];

    db.query(sql, params)
        .then(async (results: any) => {
            console.log("Okay");
            // Here we suppose that results[0] is the user's data in the database
            const row = <any>results[0];
            if (!row || !(await bcrypt.compare(password, row.password_hash))) {
                return res.status(401).send("Invalid email or password");
            }

            // Generate token and set it in a HttpOnly cookie
            generateAuthToken(row.id, row.role, res);

            // Send back a success message
            res.json({ success: true });
        })
        .catch((error) => {
            console.error("Error inserting into the database:", error);
            return res.status(500).send("Server error");
        });
});

export default router;
