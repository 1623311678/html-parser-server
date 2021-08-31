"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var token_1 = __importDefault(require("./token"));
var state_1 = require("./state");
var htmlParser = /** @class */ (function () {
    function htmlParser(html) {
        this.htmlString = "";
        this.outputJosn = [];
        this.state = state_1.state.DATA_STATE;
        this.classStyleMap = {};
        this.htmlString = html;
    }
    htmlParser.prototype.setState = function (state) {
        this.state = state;
    };
    htmlParser.prototype.getStyleStr = function (htmlStr) {
        var styleStr = null;
        var startStyleIndex = htmlStr.indexOf("<style>");
        var endStyleIndex = htmlStr.indexOf("</style>");
        if (startStyleIndex !== -1 && endStyleIndex !== -1) {
            styleStr = htmlStr.slice(startStyleIndex + 7, endStyleIndex);
            styleStr = styleStr
                .replace(/\n/g, "")
                .replace(/' '/g, "")
                .replace(/\./g, "")
                .replace(/\s+/g, "");
        }
        return styleStr;
    };
    htmlParser.prototype.getClassStyleObj = function (styleStr, styleObj) {
        var startIndex = styleStr.indexOf("{");
        var endIndex = styleStr.indexOf("}");
        styleObj[styleStr.slice(0, startIndex)] = styleStr.slice(startIndex + 1, endIndex);
        var restStr = styleStr.slice(endIndex + 1);
        if (restStr.indexOf("{") !== -1 && restStr.indexOf("}") !== -1) {
            this.getClassStyleObj(restStr, styleObj);
        }
    };
    htmlParser.prototype.getBody = function () {
        var startBodyIndex = this.htmlString.indexOf("<body>");
        var endBodyIndex = this.htmlString.indexOf("</body>");
        if (startBodyIndex !== -1 && endBodyIndex !== -1) {
            return this.htmlString.slice(startBodyIndex + 6, endBodyIndex);
        }
        return this.htmlString;
    };
    htmlParser.prototype.getClassStyleJson = function () {
        //get class style
        var styleStr = this.getStyleStr(this.htmlString);
        if (styleStr) {
            this.getClassStyleObj(styleStr, this.classStyleMap);
        }
        return this.classStyleMap;
    };
    htmlParser.prototype.getHtmlJson = function () {
        var body = "<body>" + this.getBody() + "</body>";
        var tokenInstance = new token_1.default(body, this.state, this.setState);
        while (this.state !== state_1.state.EOF) {
            var singleJson = tokenInstance.getNextToken();
            if (!singleJson) {
                break;
            }
            this.outputJosn.push(singleJson);
        }
        return this.outputJosn;
    };
    return htmlParser;
}());
exports.default = htmlParser;
