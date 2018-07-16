"use strict"
let logger = require('../logger/log.js').logger("function000109");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
/*
 * 项目部人员需要修改每个员工每天工时市场
**/
class function000109 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){	
		let workDate = this.param.workDate;//授权员工编号
		if(!workDate)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请输入需要修改的工时时常";
			this.response();	
			return;
		}		
		let tempParam = [workDate];
		this.userWorkTimeUpdate(tempParam);
	}
	userWorkTimeUpdate(param){
		//回调方法
		let callback = (result) => {
			if(result)
			{
				this.resultVo.error_info = "所有用户工作时长修改成功!";
			}else
			{
				this.resultVo.error_info = "所有用户工作时长修改失败!";		 	
			}
			this.response();	
		}
		oaservice.userWorkTimeUpdate(param,callback);
    }

}



module.exports = {
	"execute" : function(req,res,param){
		new function000109(req,res,param).execute();
	}
};