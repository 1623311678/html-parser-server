# parser-html-json
## one powerful lib to parser html(dom css) to json
  If you want to convert html strings into json, this library will provide you with great help. It can run in both the node environment and the browser environment at the same time, and it can convert the html dom structure into json, and convert the css string into json.
  
  The plug-in provides two methods: getHtmlJson and getClassStyleJson, where getClassStyleJson is used to obtain the corresponding json object after the css string conversion, and getHtmlJson can obtain the converted dom structure, label name, attributes, introverted style and so on.
### How to use？
#### 1. install：
    npm i parser-html-json
#### 2. Demo:
```javascript
import parser from 'parser-html-json'
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    .tagh1{
        background-color: aquamarine;
        color:'blue';
    }
    .one-div{
        line-height: 30px;
    }
</style>
<body>
    <h1 class="tagh1">
        kkkk
        <p>hhhhh</p>
    </h1>
    <div style="color:red; height:100px;" class="one-div">cshi</div>
    <img src="https:baidu.com" alt="wwww"/>
    <p>wjdwekfe>>>>></p>
    <em>dsjfw<<<<<p
    <div>dksfmjk</div>
    owqkdo</em>
</body>
</html>
`
const htmlParser = new parser(html)
const dom = htmlParser.getHtmlJson():

const css = htmlParser.getClassStyleJson()
console.log(dom,css)
```
### 3 result:
<1> , css json will be the same as the following, the attribute is the key and the style is the value:

![image](https://user-images.githubusercontent.com/41052302/131562670-4357dfd1-8bc0-4bcd-8b31-9070d654beee.png)

<2> ,dom json will contain several attributes like the following: tagName, text, attr, children. Among them, tagName represents the tag name, text represents the text content, children contains the child nodes of the current node, and attr is the corresponding attribute, such as the introverted style attribute, the name attribute of the image's src tag, id, class, and so on.

![image](https://user-images.githubusercontent.com/41052302/131563103-37a6fdd1-e22d-46f9-88d5-7a47f296bb89.png)


