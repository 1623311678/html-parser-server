interface classStyle {
    [key: string]: string;
}
declare class htmlParser {
    private htmlString;
    private outputJosn;
    private state;
    private classStyleMap;
    constructor(html: string);
    private setState;
    private getStyleStr;
    private getClassStyleObj;
    private getBody;
    getClassStyleJson(): classStyle;
    getHtmlJson(): any[];
}
export default htmlParser;
