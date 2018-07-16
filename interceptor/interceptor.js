"use strict"
/**
 * 拦截器
 */
let logger = require('../logger/log.js').logger("interceptor");
let config = require("../config/config");
let fileUtils = require('../utils/fileUtils');
let xml2js = require('xml2js');
let errno = require('../function/funcNoConfig');
let init = (app) => {
	try{
		//读取拦截器配置文件
		returnJSONResults(config.interceptorPath(app));
		
	}catch(e){
		logger.error(e.message);
	}
};

let returnJSONResults = (XMLPath) =>  {
     let rawJSON = loadXMLDoc(XMLPath);
     return rawJSON;
};

let loadXMLDoc = (filePath) =>  {
        let json;
        try {
            let parser = new xml2js.Parser();
			fileUtils.readFile(filePath, function(err, data) {
			    parser.parseString(data, function (err, result) {
			        if(result && result.interceptors)
			        {
			        	for(let i = 0;i<result.interceptors.interceptor.length;i++)
			        	{
			        		let curInterceptor = (result.interceptors.interceptor)[i];
			        		if(!curInterceptor["_"])//缺省拦截器
			        		{
			        			config.interceptorMap["default"] = [curInterceptor["$"].src]
			        		}else{
			        			if(curInterceptor["_"])
			        			{
			        				let interArr = curInterceptor["_"].split("|");
			        				for(let j = 0;j<interArr.length;j++)
			        				{
			        					if(!config.interceptorMap[interArr[j]])
			        					{
			        						config.interceptorMap[interArr[j]] = [];
			        					}
			        					config.interceptorMap[interArr[j]].push(curInterceptor["$"].src);
			        				}
			        			}else
			        			{
			        				logger.error("功能号配置项存在空的功能号拦截器!");
			        			}
			        			
			        		}
			        		
			        	}
			        	logger.info("功能号拦截器配置文件读取完成!");
			        }
			    });
			});

        	return json;
        	
        } catch (ex) {
    		logger.error(ex.message)
    	}
 };
 
 //过滤htmltag
 let fitlerHTMLTag = (str)  => {
	str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag
	str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白
	//str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行
	str = str.replace(/<script.*?>.*?<\/script>/ig, ''); //去除script
	str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;
	return str;
 }

 
 
let execute = function(app,req,res,next){
	let param = (req.method == "post" || req.method == "POST")?req.body:req.query;
	if(!param["funcNo"])
	{
		let resultVo = {};
		resultVo.error_info = "请求被拒绝,请求入参至少包含funcNo";
		resultVo.error_no = errno.errno0000;
		res.send(JSON.stringify(resultVo));
		return false;
	}
	//过滤html标签, 过滤script脚本,过滤sql转换函数,过滤sql关键字
	for(let key in param)
	{
		if(typeof(param[key]) != 'object')
		{
			param[key] = decodeURIComponent(param[key]);
			param[key] = fitlerHTMLTag(param[key]);
		}			
		
	}	
	
	
	//执行默认的拦截器
	require(app.get('interceptorPath')+"/defaultInterceptor").execute(app,req,res,param,next);
	//执行其他拦截器
	if(config.interceptorMap[param.funcNo])
	{
		let interArr = config.interceptorMap[param.funcNo];
		let flag = false;
		for(let i = 0;i<interArr.length;i++)
		{
			if(require(app.get('interceptorPath')+"/"+interArr[i]).execute(req,res,param,next))
			{
				if(i == (interArr.length - 1))
				{
					next();
				}
			}else
			{
				break;
			}
		}
	}else
	{
		next();
	}
 	
};
 
let interceptor = {
	"execute" : execute,
	"init" : init
};

module.exports = interceptor;