import db from "../db";

export const createCorrectAnswer = (requestBody: any): Promise<any> => {
    const sql = "INSERT INTO `correct_answer` (`answer`, `question_element_id`) VALUES (?, ?);";
    const params = [requestBody.answer, requestBody.question_element_id];
    return db.query(sql, params)
}

export const deleteCorrectAnswersByElementId = (questionElementId: number): Promise<any> => {
    const sql = "DELETE FROM `correct_answer` WHERE `question_element_id` = ?;";
    const params = [questionElementId];
    return db.query(sql, params);
};
