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
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
});

export default router;
