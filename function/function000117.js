"use strict"
let logger = require('../logger/log.js').logger("function000117");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaserviceInner.js');
let config = require('../config/config.js');
let cryptoUtils = require('../utils/cryptoUtils');  
let fs = require('fs');
/*
 * 诺明系统登录
 115.29.145.75/servlet/json?funcNo=000117&userId=mayc@thinkive.com&userPsw=217891qqqq
**/
class function000117 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let userId = this.param.userId;//开始日期
		let userPsw = this.param.userPsw;//结束日期
		if(!userId)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请输入用户邮箱";
			this.response();	
			return;
		}
		if(!userPsw)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请输入用户密码";
			this.response();	
			return;
		}		
		
		let param = [];
		param.push(userId);
		param.push(cryptoUtils.encrypt3Des(userPsw,config.normingKey));
		var callback = (resultVo) => {
			if(resultVo) {				
				if(resultVo.length === 1) {
					this.resultVo.error_no = '0';
					this.resultVo.error_info = "登录成功";
					this.resultVo.results = JSON.stringify(resultVo[0]);
				}else {
					this.resultVo.error_no = errno.errno0006;
					this.resultVo.error_info = "用户名密码错误";
					
				}
				this.response();
			}
			
		}
		
		oaservice.norUserLogin(param,callback);
	}
}

module.exports = {
	"execute" : function(req,res,param){
		new function000117(req,res,param).execute();
	}
};