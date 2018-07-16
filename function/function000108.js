"use strict"
let logger = require('../logger/log.js').logger("function000108");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
/*
 * 诺明系统前台ess服务授权(删除某个财务人员所有授权)
 http://115.29.145.75/servlet/json?funcNo=000108&userMangerId=SDXX00096
**/
class function000108 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let userMangerId = this.param.userMangerId;//授权员工编号
		if(!userMangerId)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写需要删除授权用户的员工编号!";
			this.response();	
			return;
		}		
		let tempParam = [userMangerId];
		this.userDelAuth(tempParam);
	}
	userDelAuth(param){
		let callback = (result) => {
			if(result)
			{
				this.resultVo.error_info = "用户解除所有用户授权成功!";
			}else
			{
				this.resultVo.error_info = "用户解除所有用户授权失败!";	
				this.resultVo.error_no = "-1000";				
			}
			this.response();	
		}
		oaservice.userDelAuth(param,callback);
    }
}

module.exports = {
	"execute" : function(req,res,param){
		new function000108(req,res,param).execute();
	}
};