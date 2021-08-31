import { state } from "./../state";
interface currentToken {
    tagName?: string;
    text?: string;
    children?: currentToken[];
    attr?: {
        [key: string]: string;
    };
}
declare class token {
    private html;
    private curPos;
    private setState;
    private state;
    private curToken;
    private tokenQueue;
    private openTagNum;
    private openTagLeftNum;
    private parentToken;
    private bStartClose;
    private attrName;
    constructor(htmlString: string, state: state, setState: (state: state) => void);
    getNextToken(): currentToken | undefined;
    private consume;
    private execute;
    private DATA_STATE;
    private TAG_END_STATE;
    private TAG_START_STATE;
    private TAG_NAME_STATE;
    private SELF_CLOSING_START_TAG_STATE;
    END_TAG_OPEN_STATE(cNum: number): void;
    private TAG_ATTR_START;
    private ATTR_NAME_VALUE;
    private ATTR_NAME_VALUE_START;
    private ATTR_NAME_VALUE_END;
    private genertToken;
    private createObj;
    private getChildren;
    private checkTagString;
    private checkCloseTagString;
    private updateState;
    private isAsciiLetter;
    private emitCurrentToken;
    private isAsciiUpper;
    private isAsciiLower;
    private toChar;
}
export default token;
