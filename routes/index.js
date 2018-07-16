"use strict"
let express = require('express');
let router = express.Router();    //获取路由对象。
let logger = require('../logger/log').logger("index");
let config = require("../config/config");
let errno = require('../function/funcNoConfig');
let app = require('../config/app');
let response = require("../utils/response");//包装的response
//let React = require('react/addons');
//let ReactApp = React.createFactory(require('../components/ReactApp'));
/**
MVC层次-----------C层
*/
//首页-使用后台ejs模板
router.get('/', function(req, res) {
	 let drinks = [
        { name: '测试1', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    let tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";        
    res.render('index',{
        drinks: drinks,
        tagline: tagline
    });
    
    
 });
 //首页-使用后台ejs和react模板
 router.get('/react', function(req, res){
	// React.renderToString takes your component
	// and generates the markup
	//let reactHtml = React.renderToString(ReactApp({}));
	// Output html rendered by react
	// console.log(myAppHtml);
	//res.render('react.ejs', {reactOutput: reactHtml});
	//res.render('react', {reactOutput: reactHtml});
	});
 //页面跳转
 router.get('/redirect', function(req, res) {
	   res.redirect("http://www.baidu.com");
 });
 //接口调用方式
 router.get('/servlet/json', function(req, res) {
	let param = req.query;//get方式获取
	let url = req.url;//请求的URL地			
	try{				
		if(config.isGetData == "1" && param.funcNo)
		{
			require(config.functionPath(app,param.funcNo)).execute(req,res,param);
		}else
		{
			res.send("404,请检查你的请求地址");
		}	
		
	}catch(e){
        let resultVo = {};		
	    if(e && e.code == 'MODULE_NOT_FOUND')
		{
			resultVo.error_info = '你请求的功能号未定义!';		
			
		}else if(e && e.message)//业务模块抛出异常
        {
			resultVo.error_info = e.message;
			
		}else{
			resultVo.error_info = '未知异常';
		}			
		resultVo.error_no = errno.errno0007;		
		logger.error(e.message);
		res.send(JSON.stringify(resultVo));	  	
   }
 });
 router.post('/servlet/json', function(req, res) {
	let param = req.body;//post方式获取	
	try{				
		if(config.isGetData == "1" && param.funcNo)
		{
			require(config.functionPath(app,param.funcNo)).execute(req,res,param);
		}else
		{
			res.send("404,请检查你的请求地址");
		}	
	}catch(e){	
		let resultVo = {};			
		resultVo.error_no = errno.errno0007;
		resultVo.error_info = "你请求的功能号未定义!";
		logger.error(e.message);
		res.send(JSON.stringify(resultVo));	  	
   }
 });
 //直接访问静态页面
 //let urls = (app.get("public")+"/www"+url);
 //response.executeHtml(res,req,urls);	
 
 /*  普通接口和静态页面方式
 router.get("*",function(req,res){//普通html,js,css等请求
		let param = req.query;//get方式获取
		let url = req.url;//请求的URL地		
		
		try{
			if(param.funcNo)//数据接口
			{					
				if(config.isGetData == "1")
				{
					require(config.functionPath(app,param.funcNo)).execute(param,res,req);
				}else
				{
					res.send("hello,无法获得数据,联系我们管理员吧!");
				}	
				
			}else//非数据接口
			{
				//屏蔽非数据接口请求
				//res.send("error");
				//注意通过nginx转发获得req.ip是本机IP
				let urls = (app.get("public")+"/HTML5"+url);
        response.executeHtml(res,req,urls);	
				
			}
		}catch(e){
		  	logger.info("~~~~GET请求异常~~~~~"+e.message);
		  	if(param.funcNo)
		  	{
  			  resutlVo.results = {};
					resutlVo.error_no = errno.errno0007;
					resutlVo.error_info = "功能号未定义!";
					res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
					res.end(JSON.stringify(resutlVo));
		  	}else
	  		{
	  			res.send("error 404");
	  		}
		  	
	   }
		
	 });*/
module.exports = router;    //设置为模块。