"use strict"
let logger = require('../logger/log.js').logger("function000003");
let errno = require('../function/funcNoConfig');
let baseFunction = require('./baseFunction');
/*
 * 用户退出
 **/
class function000003 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let session = this.req.session;
		session.destroy(function(err){
			this.res.clearCookie("express.sid", { path: '/' });//清理前端缓存
			this.resultVo.error_no = "0"
			this.resultVo.error_info = "用户退出登录成功!";
			this.resultVo.results = {};
			this.response();	
		});
	}
}


module.exports = {
	"execute" : function(req,res,param){
		new function000003(req,res,param).execute();
	}
};