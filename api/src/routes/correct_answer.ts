import express, { Request, Response } from "express";
import db from "../db";
import { createCorrectAnswer } from "../handlers/correctAnswerHandler";
import { requireAdminRole } from "../auth";

const router = express.Router();

/**
 * Create new correct answer
 */
router.post("/", requireAdminRole, (req: Request, res: Response) => {
    createCorrectAnswer(req.body)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * get all correct answers
 */
router.get("/", (req: Request, res: Response) => {
    const sql = "SELECT * FROM `correct_answer`;";
    db.query(sql)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * get a specific question element
 */
router.get("/:id", (req: Request, res: Response) => {
    const correctAnswerId = req.params.id;
    const sql = "SELECT * FROM `correct_answer` WHERE `id` = ?;";
    const params = [correctAnswerId];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Update a question
 */
router.put("/:id", requireAdminRole, (req: Request, res: Response) => {
    const correctAnswerId = req.params.id;
    const correctAnswer = req.body;
    const sql =
        "UPDATE `correct_answer` SET `answer` = ?, `question_element_id` = ? WHERE `id` = ?;";
    const params = [
        correctAnswer.answer,
        correctAnswer.question_element_id,
        correctAnswerId,
    ];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * delete a specific question_element
 */
router.delete("/:id", requireAdminRole, (req: Request, res: Response) => {
    const correctAnswerId = req.params.id;
    const sql = "DELETE FROM `correct_answer` WHERE `id` = ?;";
    const params = [correctAnswerId];
    db.query(sql, params)
        .then((results) => {
            res.send(results);
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).send("Server error");
        });
});

/**
 * Change question element
 */
router.post(
    "/:correctAnswerId/question_element/:questionElementId",
    requireAdminRole,
    (req: Request, res: Response) => {
        const correctAnswerId = req.params.correctAnswerId;
        const questionElementId = req.params.questionElementId;
        const sql =
            "UPDATE `correct_answer` SET `question_element_id` = ? WHERE `id` = ?;";
        const params = [questionElementId, correctAnswerId];
        db.query(sql, params)
            .then((results) => {
                res.send(results);
            })
            .catch((error) => {
                console.error(error);
                return res.status(500).send("Server error");
            });
    }
);

// router.delete(
//     "/:questionId/chapters/:chapterId",
//     (req: Request, res: Response) => {
//         const questionId = req.params.questionId;
//         const chapterId = req.params.chapterId;
//         res.send(
//             `Remove question with ID ${questionId} from chapter with ID ${chapterId}`
//         );
//     }
// );

export default router;
