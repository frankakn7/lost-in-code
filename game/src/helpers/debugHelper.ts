class DebugHelper {
    private _debugging = false;

    /**
     * Console logs the identifyingMessage in all caps with prefaced ### and the value seperately
     * @param identifyingMessage - message to be printed before the value
     * @param value - value to be printed
     */
    public logValue(identifyingMessage: string, value: any) {
        if (this._debugging) {
            this.logString(identifyingMessage);
            console.log(value);
        }
    }

    /**
     * logs the given text all caps and prefaced ###
     * @param txt
     */
    public logString(txt: string) {
        if (this._debugging) {
            const transformedString = "### " + txt.toUpperCase();
            console.log(transformedString);
        }
    }
}

export const debugHelper = new DebugHelper();
