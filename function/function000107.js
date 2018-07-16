"use strict"
let logger = require('../logger/log.js').logger("function000107");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
/*
 * 诺明系统前台ess服务授权(单个用户授权)
 http://115.29.145.75/servlet/json?funcNo=000107&userId=SDXX00056&userEmail=mayc@thinkive.com&userMangerId=SDXX00096&userManagerEmail=zhangll@thinkive.com
**/
class function000107 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let userId = this.param.userId;//被授权员工编号
		let userEmail = this.param.userEmail;//被授权用户登录编号(邮箱)
		let userMangerId = this.param.userMangerId;//授权员工编号
		let userManagerEmail = this.param.userManagerEmail;//授权用户登录编号(邮箱)    
		if(!userId)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写被授权用户的员工编号!";
			this.response();
			return;
		}	
		if(!userEmail)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写被授权用户的登录编号(登录邮箱)!";
			this.response();
			return;
		}		
		if(!userMangerId)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写授权用户的员工编号!";
			this.response();
			return;
		}	
		if(!userManagerEmail)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写授权用户的登录编号(登录邮箱)!";
			this.response();
			return;
		}		
		let tempParam= [userEmail,userManagerEmail,userId,userMangerId,userManagerEmail];
		this.userAuth(tempParam);
	}
	userAuth(param){
		let callback = (result) => {
			if(result)
			{
				this.resultVo.error_info = "用户授权成功!";
			}else
			{
				this.resultVo.error_info = "用户授权失败!";
				this.resultVo.error_no = "-111";				
			}
			this.response();
		}
		oaservice.userAuth(param,callback);
    }
}

module.exports = {
	"execute" : function(req,res,param){
		new function000107(req,res,param).execute();
	}
};