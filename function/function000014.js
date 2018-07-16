"use strict"
let logger = require('../logger/log.js').logger("function000014");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let redisUtils = require('../utils/redisUtils');
let sqlclient = require('../config/sqlclient');
let nodemailer = require("../utils/nodemailer");
let redisCli = sqlclient.redisCli(0);
/**
 * 发送邮件
 **/
class function000014 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		this.sendMall();
		this.resultVo.error_no = '0';
		this.resultVo.error_info = "邮件发送成功!"	
		//返回数据
		this.response();
	}
	sendMall(){
		nodemailer.sendResumeMail(this.param);	
	}
} 




module.exports = {
	"execute" : function(req,res,param){
		new function000014(req,res,param).execute();
	}
};