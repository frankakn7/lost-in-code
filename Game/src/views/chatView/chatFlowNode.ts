/**
 * A simple interface representing a singular ChatFlowNode
 */
export interface ChatFlowNode {
    /**
     * The text displayed in the chat
     */
    text: string
    /**
     * The option text "answer" that results in the "response" saved in the {@link text} variable
     */
    optionText: string
    /**
     * All choices that can be made as a response to the {@link text} variable
     */
    choices: Map<string, ChatFlowNode>
}
