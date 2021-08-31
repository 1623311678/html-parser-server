import parser from './index'
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
const data = htmlParser.getHtmlJson()
const css = htmlParser.getClassStyleJson()
console.log('data',data)