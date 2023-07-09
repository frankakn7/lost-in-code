/**
 * Defines the different question types
 */
export enum QuestionType {
    /**
     * A single / multiple choice question (Recognize code / find error)
     */
    CHOICE,
    /**
     * A question with a single input (give program output )
     */
    SINGLE_INPUT,
    /**
     * Code block with input fields
     */
    CLOZE,
    /**
     * Code blocks that have to be arranged correctly
     */
    DRAG_DROP,
    /**
     * Select a code block of 2 per asked question
     */
    SELECT_ONE,
    /**
     * Create whole code block out of snippets
     */
    SNIPPET
} 