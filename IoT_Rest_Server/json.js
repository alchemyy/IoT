/**
 * Created by HOTDOG on 21/4/16.
 */
'use strict'

// demo-json.js
var obj = {
    "name": "LiLi",
    "age": 22,
    "sex": "F"
};

var str = JSON.stringify(obj);
console.log(str);

var obj2 = JSON.parse(str);
console.log(obj2);