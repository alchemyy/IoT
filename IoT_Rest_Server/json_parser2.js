/**
 * Created by HOTDOG on 21/4/16.
 */

'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var log = require('log');
var app = express();
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
// var server = require('http').createServer(app);
var fs = require("fs");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/db');
// var express = require('express');
// var app = express();
//
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Mongodb opened!");
});
var Schema = mongoose.Schema;

//声明Schema
var rtd_Schema = new Schema({
    dev_type : String,
    id: Number,
    location : String,
    temp : Number,
    humid: Number,
    time: {
        year: Number,
        month: Number,
        day: Number,
        hour: Number,
        minute: Number,
        second: Number
    }
},{versionKey:false});
//构建model

//简单的数据交互
//创建两个实例
app.post('/post', function (req, res) {
    if (req.body) {
        //能正确解析 json 格式的post参数
        var rtd = mongoose.model('rtd',rtd_Schema); //'rtd'是collection
        var json_data = req.body;//=JSON.parse(req.body);
        var RT_Data = new rtd(json_data);
        RT_Data.save(function(err){
            if(err){
                console.log(err);
            }else{
                console.log('Saved as JSON');
            }
        });

    } else {
        //不能正确解析json 格式的post参数
        var body = '', jsonStr;
        req.on('data', function (chunk) {
            body += chunk; //读取参数流转化为字符串
        });
        req.on('end', function () {
            //读取参数流结束后将转化的body字符串解析成 JSON 格式
            try {
                jsonStr = JSON.parse(body);
            } catch (err) {
                jsonStr = null;
            }
            jsonStr ? res.send('JSON RECEIVED AS Stream') : res.send({"status": "error"});
            //console.log('JSON RECEIVED AS Stream');
            //console.log(jsonStr);
            var rtd = mongoose.model('rtd',rtd_Schema);//
            var RT_Data = new rtd(jsonStr);
            RT_Data.save(function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log('The new RT_Data was saved');
                }
            });
        });
    }
});

var server = app.listen(8081, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log("应用实例，访问地址为 http://%s:%s", host, port);

});
