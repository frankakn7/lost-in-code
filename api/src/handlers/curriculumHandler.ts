import db from "../db";
import { ChapterValue, createChapterWithQuestions, extractChaptersFromRows } from "./chapterHandler";

type CurriculumValue = {
    id: number,
    name: string,
    description: string,
    chapters: ChapterValue[]
}

export const createFullCurriculum = (requestBody: any): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO `curriculum` (`name`, `description`) VALUES (?, ?);'
        const params = [requestBody.name, requestBody.description]
        db.query(sql,params).then(results => {
            const chapterPromises = requestBody.chapters.map((chapter: ChapterValue) => {
                chapter.curriculum_id = results.insertId;
                return createChapterWithQuestions(chapter);
            });

            Promise.all(chapterPromises)
                .then(() => {
                    resolve(results);
                })
                .catch(error => {
                    reject(error);
                });

        }).catch(error => {reject(error)})
    })
}

export const extractCurriculumFromRows = (rows: any): CurriculumValue[] => {
    const curriculumMap = new Map<number, CurriculumValue>();

    rows.forEach((row: any) => {
        let curriculum = curriculumMap.get(row.chapter_id);

        // If chapter doesn't exist, create a new one
        if (!curriculum) {
            curriculum = {
                id: row.curriculum_id,
                name: row.curriculum_name,
                description: row.curriculum_description, // assuming it's in the rows
                chapters: [],
            };
            curriculumMap.set(row.curriculum_id, curriculum);
            // Get all rows related to the current chapter
            const curriculumRows = rows.filter(
                (r: any) => curriculum && r.curriculum_id == curriculum.id
            );

            // Use the transformQuestionData function to get the questions
            const chapters = extractChaptersFromRows(curriculumRows);

            // Add the questions to the chapter
            curriculum.chapters = chapters;
        }
    });

    return Array.from(curriculumMap.values());
};

export const getFullCurriculum = (id: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM `curriculum_chapters` WHERE `curriculum_id` = ?;";
        const params = [id];
        db.query(sql, params)
            .then((results) => {
                let curriculum = extractCurriculumFromRows(results)[0];
                resolve(curriculum);
            })
            .catch((error) => reject(error));
    });
};