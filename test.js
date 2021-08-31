"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __importDefault(require("./index"));
var html = "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Document</title>\n</head>\n<style>\n    .tagh1{\n        background-color: aquamarine;\n        color:'blue';\n    }\n    .one-div{\n        line-height: 30px;\n    }\n</style>\n<body>\n    <h1 class=\"tagh1\">\n        kkkk\n        <p>hhhhh</p>\n    </h1>\n    <div style=\"color:red; height:100px;\" class=\"one-div\">cshi</div>\n    <img src=\"https:baidu.com\" alt=\"wwww\"/>\n    <p>wjdwekfe>>>>></p>\n    <em>dsjfw<<<<<p\n    <div>dksfmjk</div>\n    owqkdo</em>\n</body>\n</html>\n";
var htmlParser = new index_1.default(html);
var data = htmlParser.getHtmlJson();
var css = htmlParser.getClassStyleJson();
console.log('data', data);
