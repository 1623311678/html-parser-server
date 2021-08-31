import NAME_SPACE from "../nameSpace";
import { state } from "./../state";
import { CODE_POINTS } from "./../unicode";
interface currentToken {
  tagName?: string;
  text?: string;
  children?: currentToken[];
  attr?: { [key: string]: string };
}
class token {
  private html: string = "";
  private curPos: number = 0;
  private setState: any;
  private state: state;
  private curToken: currentToken = {};
  private tokenQueue: currentToken[] = [];
  private openTagNum: number = 0;
  private openTagLeftNum: number = 0;
  private parentToken: currentToken = {};
  private bStartClose: boolean = false;
  private attrName: string = "";
  constructor(
    htmlString: string,
    state: state,
    setState: (state: state) => void,
  ) {
    this.html = htmlString;
    this.setState = setState;
    this.state = state;
  }
  public getNextToken() {
    while (!this.tokenQueue.length && this.curPos < this.html.length) {
      const consumeStr = this.consume();
      this.execute(this.state, consumeStr);
    }
    if (this.curPos === this.html.length) {
      this.updateState(state.EOF);
      return;
    }
    return this.tokenQueue.shift();
  }
  private consume() {
    const str = this.html[this.curPos];
    this.curPos += 1;
    return str.charCodeAt(0);
  }
  private execute(type: state, cNum: number) {
    switch (type) {
      case state.DATA_STATE: {
        this.DATA_STATE(cNum);
        break;
      }
      case state.TAG_END_STATE: {
        this.TAG_END_STATE(cNum);
        break;
      }
      case state.TAG_START_STATE: {
        this.TAG_START_STATE(cNum);
        break;
      }
      case state.SELF_CLOSING_START_TAG_STATE: {
        this.SELF_CLOSING_START_TAG_STATE(cNum);
        break;
      }
      case state.TAG_NAME_STATE: {
        this.TAG_NAME_STATE(cNum);
        break;
      }
      case state.END_TAG_OPEN_STATE: {
        this.END_TAG_OPEN_STATE(cNum);
        break;
      }
      case state.TAG_ATTR_START: {
        this.TAG_ATTR_START(cNum);
        break;
      }
      case state.ATTR_NAME_VALUE: {
        this.ATTR_NAME_VALUE(cNum);
        break;
      }
      case state.ATTR_NAME_VALUE_START: {
        this.ATTR_NAME_VALUE_START(cNum);
        break;
      }
      case state.ATTR_NAME_VALUE_END: {
        this.ATTR_NAME_VALUE_END(cNum);
        break;
      }
    }
  }
  private DATA_STATE(cNum: number) {
    switch (cNum) {
      case CODE_POINTS.LESS_THAN_SIGN: {
        this.updateState(state.TAG_START_STATE);
        this.openTagNum += 1;
        break;
      }
      case CODE_POINTS.GREATER_THAN_SIGN: {
        if(!this.checkCloseTagString()){
          this.updateState(state.DATA_STATE);
          this.curToken.text += `${this.toChar(cNum)}`;
        }else{
          this.curToken.text = ''
        }
        break;
      }
      default: {
        this.curToken.text += this.toChar(cNum);
      }
    }
  }

  private TAG_END_STATE(cNum: number) {}
  private TAG_START_STATE(cNum: number) {
    if (this.isAsciiLetter(cNum)) {
      if (this.checkTagString()) {
        this.createObj(cNum);
        this.updateState(state.TAG_NAME_STATE);
      }else{
        this.openTagNum -= 1;
        this.updateState(state.DATA_STATE);
        this.curToken.text += `<${this.toChar(cNum)}`;
      }
    } else if (cNum === CODE_POINTS.SOLIDUS) {
      this.updateState(state.END_TAG_OPEN_STATE);
      this.curPos -= 1;
    } else {
      this.openTagNum -= 1;
      this.updateState(state.DATA_STATE);
      this.curToken.text += `<${this.toChar(cNum)}`;
    }
  }
  private TAG_NAME_STATE(cNum: number) {
    if (cNum === CODE_POINTS.SOLIDUS) {
      this.openTagNum += 1
      this.curPos -= 1;
      this.updateState(state.END_TAG_OPEN_STATE);
    } else if (cNum === CODE_POINTS.GREATER_THAN_SIGN) {
      this.updateState(state.DATA_STATE);
      this.openTagLeftNum += 1;
      // this.emitCurrentToken();
    } else if (cNum === CODE_POINTS.SPACE) {
      this.updateState(state.TAG_ATTR_START);
    } else {
      this.curToken.tagName += this.toChar(cNum);
    }
  }
  private SELF_CLOSING_START_TAG_STATE(cNum: number) {
    if (cNum === CODE_POINTS.GREATER_THAN_SIGN) {
      // this.curToken.selfClosing = true;
      this.updateState(state.DATA_STATE);
      // this._emitCurrentToken();
    } else if (cNum === CODE_POINTS.EOF) {
      // this._err(ERR.eofInTag);
      // this._emitEOFToken();
    } else {
      // this._err(ERR.unexpectedSolidusInTag);
      // this._reconsumeInState(BEFORE_ATTRIBUTE_NAME_STATE);
    }
  }
  END_TAG_OPEN_STATE(cNum: number) {
    if (cNum === CODE_POINTS.GREATER_THAN_SIGN) {
      this.updateState(state.DATA_STATE);
    } else if (cNum === CODE_POINTS.SOLIDUS) {
      this.bStartClose = true;
      this.openTagNum -= 1;
      if (this.openTagNum === 1) {
        this.emitCurrentToken();
      }
      this.openTagNum -= 1;
    }
  }
  private TAG_ATTR_START(cNum: number) {
    if (cNum === CODE_POINTS.EQUALS_SIGN) {
      if (this.curToken.attr) {
        this.curToken.attr[this.attrName] = ''
      }
      this.updateState(state.ATTR_NAME_VALUE);
    } else if (cNum === CODE_POINTS.GREATER_THAN_SIGN) {
      this.updateState(state.DATA_STATE);
    } else if(cNum===CODE_POINTS.SPACE){
    }else if (cNum ===CODE_POINTS.SOLIDUS){
      this.openTagNum += 1
      this.curPos -= 1;
      this.updateState(state.END_TAG_OPEN_STATE);

    }else{
      if (!this.curToken.attr) {
        this.curToken.attr = {};
      }
      this.attrName += this.toChar(cNum);
    }
  }
  private ATTR_NAME_VALUE(cNum: number) {
    if (cNum === CODE_POINTS.QUOTATION_MARK||cNum === CODE_POINTS.APOSTROPHE) {
      this.updateState(state.ATTR_NAME_VALUE_START);
    }
  }
  private ATTR_NAME_VALUE_START(cNum: number) {
    if (cNum === CODE_POINTS.QUOTATION_MARK ||cNum === CODE_POINTS.APOSTROPHE) {
      this.updateState(state.ATTR_NAME_VALUE_END);
      this.attrName = "";
    } else {
      if (this.curToken.attr) {
        this.curToken.attr[this.attrName] += this.toChar(cNum);
      }
    }
  }
  private ATTR_NAME_VALUE_END(cNum: number) {
    if (cNum === CODE_POINTS.SPACE) {
      this.updateState(state.TAG_ATTR_START);
    } else if (cNum === CODE_POINTS.GREATER_THAN_SIGN) {
      this.updateState(state.DATA_STATE);
    }else if (cNum === CODE_POINTS.SOLIDUS) {
      this.openTagNum += 1
      this.curPos -= 1;
      this.updateState(state.END_TAG_OPEN_STATE);
    }
  }
  private genertToken(cNum: number) {
    return {
      tagName: this.toChar(cNum),
      text: "",
      children: [],
    };
  }
  private createObj(cNum: number) {
    if (this.openTagNum > 1) {
      // this.parentToken.children.push(this.genertToken(cNum))
      this.curToken = this.genertToken(cNum);
      this.getChildren().push(this.curToken);
    } else {
      this.curToken = {
        tagName: this.toChar(cNum),
        text: "",
        children: [],
      };
      this.parentToken = this.curToken;
    }
  }
  private getChildren() {
    let children;
    let num = this.openTagNum;
    let obj: any = this.parentToken;
    while (num - 1 >= 1) {
      children = obj.children;
      let len = obj.children.length;
      if (len) {
        len -= 1;
      } else {
        len = 0;
      }
      obj = obj && obj.children[len];
      num -= 1;
    }
    return children;
  }
  private checkTagString() {
    const curPos = this.curPos - 1;
    const stringBak = this.html.slice(curPos);
    const closeTagIndex = stringBak.indexOf(">");
    const nextOpenTagIndex = stringBak.indexOf("<");
    if(this.openTagNum>1){
    if (nextOpenTagIndex < closeTagIndex) {
      return false;
    }
  }
    return true;
  }
  private checkCloseTagString() {
    const curPos = this.curPos-1;
    const stringBak = this.html.slice(0, curPos);
    const closeTagIndex = stringBak.lastIndexOf(">");
    if(closeTagIndex!==-1){
      return false
    }


    return true;
  }
  private updateState(state: state) {
    this.state = state;
    this.setState(this.state);
  }
  private isAsciiLetter(cp: number) {
    return this.isAsciiLower(cp) || this.isAsciiUpper(cp);
  }
  private emitCurrentToken() {
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
  }
  private isAsciiUpper(cp: number) {
    return (
      cp >= CODE_POINTS.LATIN_CAPITAL_A && cp <= CODE_POINTS.LATIN_CAPITAL_Z
    );
  }

  private isAsciiLower(cp: number) {
    return cp >= CODE_POINTS.LATIN_SMALL_A && cp <= CODE_POINTS.LATIN_SMALL_Z;
  }
  private toChar(cNum: number) {
    if (cNum <= 0xffff) {
      return String.fromCharCode(cNum);
    }

    cNum -= 0x10000;
    return (
      String.fromCharCode(((cNum >>> 10) & 0x3ff) | 0xd800) +
      String.fromCharCode(0xdc00 | (cNum & 0x3ff))
    );
  }
}
export default token;
