"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("./../state");
var unicode_1 = require("./../unicode");
var token = /** @class */ (function () {
    function token(htmlString, state, setState) {
        this.html = "";
        this.curPos = 0;
        this.curToken = {};
        this.tokenQueue = [];
        this.openTagNum = 0;
        this.openTagLeftNum = 0;
        this.parentToken = {};
        this.bStartClose = false;
        this.attrName = "";
        this.html = htmlString;
        this.setState = setState;
        this.state = state;
    }
    token.prototype.getNextToken = function () {
        while (!this.tokenQueue.length && this.curPos < this.html.length) {
            var consumeStr = this.consume();
            this.execute(this.state, consumeStr);
        }
        if (this.curPos === this.html.length) {
            this.updateState(state_1.state.EOF);
            return;
        }
        return this.tokenQueue.shift();
    };
    token.prototype.consume = function () {
        var str = this.html[this.curPos];
        this.curPos += 1;
        return str.charCodeAt(0);
    };
    token.prototype.execute = function (type, cNum) {
        switch (type) {
            case state_1.state.DATA_STATE: {
                this.DATA_STATE(cNum);
                break;
            }
            case state_1.state.TAG_END_STATE: {
                this.TAG_END_STATE(cNum);
                break;
            }
            case state_1.state.TAG_START_STATE: {
                this.TAG_START_STATE(cNum);
                break;
            }
            case state_1.state.SELF_CLOSING_START_TAG_STATE: {
                this.SELF_CLOSING_START_TAG_STATE(cNum);
                break;
            }
            case state_1.state.TAG_NAME_STATE: {
                this.TAG_NAME_STATE(cNum);
                break;
            }
            case state_1.state.END_TAG_OPEN_STATE: {
                this.END_TAG_OPEN_STATE(cNum);
                break;
            }
            case state_1.state.TAG_ATTR_START: {
                this.TAG_ATTR_START(cNum);
                break;
            }
            case state_1.state.ATTR_NAME_VALUE: {
                this.ATTR_NAME_VALUE(cNum);
                break;
            }
            case state_1.state.ATTR_NAME_VALUE_START: {
                this.ATTR_NAME_VALUE_START(cNum);
                break;
            }
            case state_1.state.ATTR_NAME_VALUE_END: {
                this.ATTR_NAME_VALUE_END(cNum);
                break;
            }
        }
    };
    token.prototype.DATA_STATE = function (cNum) {
        switch (cNum) {
            case unicode_1.CODE_POINTS.LESS_THAN_SIGN: {
                this.updateState(state_1.state.TAG_START_STATE);
                this.openTagNum += 1;
                break;
            }
            case unicode_1.CODE_POINTS.GREATER_THAN_SIGN: {
                if (!this.checkCloseTagString()) {
                    this.updateState(state_1.state.DATA_STATE);
                    this.curToken.text += "".concat(this.toChar(cNum));
                }
                else {
                    this.curToken.text = '';
                }
                break;
            }
            default: {
                this.curToken.text += this.toChar(cNum);
            }
        }
    };
    token.prototype.TAG_END_STATE = function (cNum) { };
    token.prototype.TAG_START_STATE = function (cNum) {
        if (this.isAsciiLetter(cNum)) {
            if (this.checkTagString()) {
                this.createObj(cNum);
                this.updateState(state_1.state.TAG_NAME_STATE);
            }
            else {
                this.openTagNum -= 1;
                this.updateState(state_1.state.DATA_STATE);
                this.curToken.text += "<".concat(this.toChar(cNum));
            }
        }
        else if (cNum === unicode_1.CODE_POINTS.SOLIDUS) {
            this.updateState(state_1.state.END_TAG_OPEN_STATE);
            this.curPos -= 1;
        }
        else {
            this.openTagNum -= 1;
            this.updateState(state_1.state.DATA_STATE);
            this.curToken.text += "<".concat(this.toChar(cNum));
        }
    };
    token.prototype.TAG_NAME_STATE = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.SOLIDUS) {
            this.openTagNum += 1;
            this.curPos -= 1;
            this.updateState(state_1.state.END_TAG_OPEN_STATE);
        }
        else if (cNum === unicode_1.CODE_POINTS.GREATER_THAN_SIGN) {
            this.updateState(state_1.state.DATA_STATE);
            this.openTagLeftNum += 1;
            // this.emitCurrentToken();
        }
        else if (cNum === unicode_1.CODE_POINTS.SPACE) {
            this.updateState(state_1.state.TAG_ATTR_START);
        }
        else {
            this.curToken.tagName += this.toChar(cNum);
        }
    };
    token.prototype.SELF_CLOSING_START_TAG_STATE = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.GREATER_THAN_SIGN) {
            // this.curToken.selfClosing = true;
            this.updateState(state_1.state.DATA_STATE);
            // this._emitCurrentToken();
        }
        else if (cNum === unicode_1.CODE_POINTS.EOF) {
            // this._err(ERR.eofInTag);
            // this._emitEOFToken();
        }
        else {
            // this._err(ERR.unexpectedSolidusInTag);
            // this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
        }
    };
    token.prototype.END_TAG_OPEN_STATE = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.GREATER_THAN_SIGN) {
            this.updateState(state_1.state.DATA_STATE);
        }
        else if (cNum === unicode_1.CODE_POINTS.SOLIDUS) {
            this.bStartClose = true;
            this.openTagNum -= 1;
            if (this.openTagNum === 1) {
                this.emitCurrentToken();
            }
            this.openTagNum -= 1;
        }
    };
    token.prototype.TAG_ATTR_START = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.EQUALS_SIGN) {
            if (this.curToken.attr) {
                this.curToken.attr[this.attrName] = '';
            }
            this.updateState(state_1.state.ATTR_NAME_VALUE);
        }
        else if (cNum === unicode_1.CODE_POINTS.GREATER_THAN_SIGN) {
            this.updateState(state_1.state.DATA_STATE);
        }
        else if (cNum === unicode_1.CODE_POINTS.SPACE) {
        }
        else if (cNum === unicode_1.CODE_POINTS.SOLIDUS) {
            this.openTagNum += 1;
            this.curPos -= 1;
            this.updateState(state_1.state.END_TAG_OPEN_STATE);
        }
        else {
            if (!this.curToken.attr) {
                this.curToken.attr = {};
            }
            this.attrName += this.toChar(cNum);
        }
    };
    token.prototype.ATTR_NAME_VALUE = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.QUOTATION_MARK || cNum === unicode_1.CODE_POINTS.APOSTROPHE) {
            this.updateState(state_1.state.ATTR_NAME_VALUE_START);
        }
    };
    token.prototype.ATTR_NAME_VALUE_START = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.QUOTATION_MARK || cNum === unicode_1.CODE_POINTS.APOSTROPHE) {
            this.updateState(state_1.state.ATTR_NAME_VALUE_END);
            this.attrName = "";
        }
        else {
            if (this.curToken.attr) {
                this.curToken.attr[this.attrName] += this.toChar(cNum);
            }
        }
    };
    token.prototype.ATTR_NAME_VALUE_END = function (cNum) {
        if (cNum === unicode_1.CODE_POINTS.SPACE) {
            this.updateState(state_1.state.TAG_ATTR_START);
        }
        else if (cNum === unicode_1.CODE_POINTS.GREATER_THAN_SIGN) {
            this.updateState(state_1.state.DATA_STATE);
        }
        else if (cNum === unicode_1.CODE_POINTS.SOLIDUS) {
            this.openTagNum += 1;
            this.curPos -= 1;
            this.updateState(state_1.state.END_TAG_OPEN_STATE);
        }
    };
    token.prototype.genertToken = function (cNum) {
        return {
            tagName: this.toChar(cNum),
            text: "",
            children: [],
        };
    };
    token.prototype.createObj = function (cNum) {
        if (this.openTagNum > 1) {
            // this.parentToken.children.push(this.genertToken(cNum))
            this.curToken = this.genertToken(cNum);
            this.getChildren().push(this.curToken);
        }
        else {
            this.curToken = {
                tagName: this.toChar(cNum),
                text: "",
                children: [],
            };
            this.parentToken = this.curToken;
        }
    };
    token.prototype.getChildren = function () {
        var children;
        var num = this.openTagNum;
        var obj = this.parentToken;
        while (num - 1 >= 1) {
            children = obj.children;
            var len = obj.children.length;
            if (len) {
                len -= 1;
            }
            else {
                len = 0;
            }
            obj = obj && obj.children[len];
            num -= 1;
        }
        return children;
    };
    token.prototype.checkTagString = function () {
        var curPos = this.curPos - 1;
        var stringBak = this.html.slice(curPos);
        var closeTagIndex = stringBak.indexOf(">");
        var nextOpenTagIndex = stringBak.indexOf("<");
        if (this.openTagNum > 1) {
            if (nextOpenTagIndex < closeTagIndex) {
                return false;
            }
        }
        return true;
    };
    token.prototype.checkCloseTagString = function () {
        var curPos = this.curPos - 1;
        var stringBak = this.html.slice(0, curPos);
        var closeTagIndex = stringBak.lastIndexOf(">");
        if (closeTagIndex !== -1) {
            return false;
        }
        return true;
    };
    token.prototype.updateState = function (state) {
        this.state = state;
        this.setState(this.state);
    };
    token.prototype.isAsciiLetter = function (cp) {
        return this.isAsciiLower(cp) || this.isAsciiUpper(cp);
    };
    token.prototype.emitCurrentToken = function () {
        // if (this.openTagNum === 0) {
        //   this.tokenQueue.push(this.curToken);
        //   this.curToken = {};
        // }
        this.tokenQueue.push(this.parentToken);
        this.curToken = {};
        this.openTagNum = 0;
        this.openTagLeftNum = 0;
        this.bStartClose = false;
        this.parentToken = this.curToken;
    };
    token.prototype.isAsciiUpper = function (cp) {
        return (cp >= unicode_1.CODE_POINTS.LATIN_CAPITAL_A && cp <= unicode_1.CODE_POINTS.LATIN_CAPITAL_Z);
    };
    token.prototype.isAsciiLower = function (cp) {
        return cp >= unicode_1.CODE_POINTS.LATIN_SMALL_A && cp <= unicode_1.CODE_POINTS.LATIN_SMALL_Z;
    };
    token.prototype.toChar = function (cNum) {
        if (cNum <= 0xffff) {
            return String.fromCharCode(cNum);
        }
        cNum -= 0x10000;
        return (String.fromCharCode(((cNum >>> 10) & 0x3ff) | 0xd800) +
            String.fromCharCode(0xdc00 | (cNum & 0x3ff)));
    };
    return token;
}());
exports.default = token;
