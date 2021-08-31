import token from "./token";
import { state } from "./state";
interface classStyle {
  [key: string]: string;
}
class htmlParser {
  private htmlString: string = "";
  private outputJosn: any[] = [];
  private state = state.DATA_STATE;
  private classStyleMap: classStyle = {};
  constructor(html: string) {
    this.htmlString = html;
  }
  private setState(state: state) {
    this.state = state;
  }
  private getStyleStr(htmlStr: string) {
    let styleStr = null;
    const startStyleIndex = htmlStr.indexOf("<style>");
    const endStyleIndex = htmlStr.indexOf("</style>");
    if (startStyleIndex !== -1 && endStyleIndex !== -1) {
      styleStr = htmlStr.slice(startStyleIndex + 7, endStyleIndex);
      styleStr = styleStr
        .replace(/\n/g, "")
        .replace(/' '/g, "")
        .replace(/\./g, "")
        .replace(/\s+/g, "");
    }
    return styleStr;
  }
  private getClassStyleObj(styleStr: string, styleObj: classStyle) {
    const startIndex = styleStr.indexOf("{");
    const endIndex = styleStr.indexOf("}");
    styleObj[styleStr.slice(0, startIndex)] = styleStr.slice(
      startIndex + 1,
      endIndex
    );
    const restStr = styleStr.slice(endIndex + 1);
    if (restStr.indexOf("{") !== -1 && restStr.indexOf("}") !== -1) {
      this.getClassStyleObj(restStr, styleObj);
    }
  }
  private getBody() {
    const startBodyIndex = this.htmlString.indexOf("<body>");
    const endBodyIndex = this.htmlString.indexOf("</body>");
    if (startBodyIndex !== -1 && endBodyIndex !== -1) {
      return this.htmlString.slice(startBodyIndex + 6, endBodyIndex);
    }
    return this.htmlString;
  }
  public getClassStyleJson() {
    //get class style
    const styleStr = this.getStyleStr(this.htmlString);
    if (styleStr) {
      this.getClassStyleObj(styleStr, this.classStyleMap);
    }
    return this.classStyleMap;
  }
  public getHtmlJson() {
    const body = "<body>" + this.getBody() + "</body>";
    const tokenInstance = new token(body, this.state, this.setState);
    while (this.state !== state.EOF) {
      const singleJson = tokenInstance.getNextToken();
      if (!singleJson) {
        break;
      }
      this.outputJosn.push(singleJson);
    }
    return this.outputJosn;
  }
}
export default htmlParser;
