export default class Element{
    content: string | null;
    element_identifier: string | null;
    correct_order_position: number | null;
    is_correct: boolean | null;
    correct_answers: string[] | null;


    constructor(content: string | null, element_identifier: string | null, correct_order_position: number | null, is_correct: boolean | null, correct_answers: string[] | null) {
        this.content = content;
        this.element_identifier = element_identifier;
        this.correct_order_position = correct_order_position;
        this.is_correct = is_correct;
        this.correct_answers = correct_answers;
    }
}