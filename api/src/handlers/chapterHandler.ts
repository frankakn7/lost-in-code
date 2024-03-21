import { OkPacket } from 'mysql';
import db from '../db';
import {
    QuestionValues,
    createFullQuestion,
    extractQuestionsFromRows,
} from './questionHandler';

export type ChapterValue = {
    id?: number;
    name: string;
    material: string;
    curriculum_id: number;
    order_position: number;
    questions: QuestionValues[];
};

export const createChapterWithQuestions = (requestBody: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql =
            'INSERT INTO `chapter` (`name`, `material`, `curriculum_id`, `order_position`) VALUES (?, ?, ?, ?);';
        const params = [
            requestBody.name,
            requestBody.material,
            requestBody.curriculum_id,
            requestBody.order_position,
        ];
        db.query(sql, params)
            .then((result: any) => {
                const questionPromises = requestBody.questions.map(
                    (question: QuestionValues) => {
                        const okPacket = <OkPacket>result;
                        question.chapter_id = result.insertId;
                        return createFullQuestion(question);
                    }
                );

                Promise.all(questionPromises)
                    .then(() => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const extractChaptersFromRows = (rows: any): ChapterValue[] => {
    const chaptersMap = new Map<number, ChapterValue>();

    rows.forEach((row: any) => {
        let chapter = chaptersMap.get(row.chapter_id);

        // If chapter doesn't exist, create a new one
        if (!chapter && row.chapter_id) {
            chapter = {
                id: row.chapter_id,
                name: row.chapter_name,
                material: row.chapter_material, // assuming it's in the rows
                curriculum_id: row.chapter_curriculum_id, // assuming it's in the rows
                order_position: row.chapter_order_position,
                questions: [],
            };
            chaptersMap.set(row.chapter_id, chapter);
            // Get all rows related to the current chapter
            const chapterRows = rows.filter(
                (r: any) => chapter && r.chapter_id === chapter.id
            );

            // Use the transformQuestionData function to get the questions
            const questions = extractQuestionsFromRows(chapterRows);

            // Add the questions to the chapter
            chapter.questions = questions;
        }
    });

    return Array.from(chaptersMap.values());
};

export const getChapterWithQuestions = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM `chapter_questions` WHERE `chapter_id` = ?;';
        const params = [id];
        db.query(sql, params)
            .then((results) => {
                let chapter = extractChaptersFromRows(results)[0];
                resolve(chapter);
            })
            .catch((error) => reject(error));
    });
};
