"use strict"
let logger = require('../logger/log.js').logger("function000002");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let crytoUtils = require("../utils/cryptoUtils");
let config = require("../config/config");
/*
 * 用户登陆
 **/
class function000002 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){	
		logger.info("进入登陆接口");
		let userName = param.userName;
		let userPwd = param.userPwd;//密码这里需要解密，暂时不做解密处理
		if(!userName)//未输入用户名信息
		{
			this.resultVo.error_no = errno.errno0004;
			this.resultVo.error_info = '用户名不能为空!';
			this.resultVo.results = {};
			this.response();	
			return;
		}
		if(!userPwd)//未输入密码信息
		{
			this.resultVo.error_no = errno.errno0004;
			this.resultVo.error_info = '密码不能为空!';
			this.resultVo.results = {};
			this.response();	
			return;
		}
		
		
		//AES加加密(对称加密)
		
		let userPwdSecret = crytoUtils.encrypt(userPwd,config.aesSecret);
		
		//AES加解密(对称加密)
		let userPwd = crytoUtils.decrypt(userPwdSecret,config.aesSecret);
		
		//使用RSA加密(非对称加密)
		let userPwd = crytoUtils.encryptRsa(userPwd);
		 
		 //使用RSA解密(非对称加密)   
		let  userPwd = crytoUtils.decryptRsa(userPwd);
		 

		let callback = (result) => {
			if(results.length > 0)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "用户登陆成功!";
				this.resultVo.results = results[0];
				req.session.userinfo = results[0];
			}else
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "登陆失败,用户名或者密码错误";		 	
			}
			this.response();	
		}
		let param = [userName,userPwd];
		//http://115.29.145.75/?funcNo=000002&userName=mayc&userPwd=1 or 1=1//SQL注入
		console.log("SELECT * FROM  employee where emp_loginname = '"+userName+"'&& emp_loginpwd="+userPwd);//错误写法
		console.log("SELECT * FROM  employee where emp_loginname = '"+userName+"'&& emp_loginpwd="+mysqlCli.escape(userPwd));//正确或者采用问号方式
		//这里调用服务层
		//baseFunction.query("SELECT * FROM  employee where emp_loginname = '"+userName+"'&& emp_loginpwd="+userPwd,null,res,callback);
		//baseFunction.query('SELECT * FROM  employee where emp_loginname = ? && emp_loginpwd = ?' ,param,res,callback);
		
	}
}
module.exports = {
	"execute" : function(req,res,param){
		new function000002(req,res,param).execute();
	}
};