import type {QuestionType} from "$lib/types/QuestionType";
import type Element from "$lib/classes/Element";

export default class Question {
    question_text: string;
    code_text: string;
    hint: string;
    type: QuestionType;
    difficulty: number;
    elements: Element[];
    chapter_id: number;

    constructor(question_text: string, code_text: string, hint: string, type: QuestionType, difficulty: number, elements: Element[], chapter_id: number) {
        this.question_text = question_text;
        this.code_text = code_text;
        this.hint = hint;
        this.type = type;
        this.difficulty = difficulty;
        this.elements = elements;
        this.chapter_id = chapter_id;
    }
}