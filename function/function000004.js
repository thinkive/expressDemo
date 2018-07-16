"use strict"
let logger = require('../logger/log.js').logger("function000004");
let errno = require('../function/funcNoConfig');
let baseFunction = require('./baseFunction');
/*
 * 统计当前在线人数
 **/
/*
 * 用户退出
 **/
class function000114 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		logger.info("进入统计在线人数接口");
		this.res.clearCookie("express.sid", { path: '/' });//清理前端缓存
		this.resultVo.error_no = "0"
		this.resultVo.error_info = "用户退出登录成功!";
		this.resultVo.results = {};
		this.response();	
		logger.info("进入统计在线人数接口");
	}
}

module.exports = {
	"execute" : function(req,res,param){
		new function000004(req,res,param).execute();
	}
};