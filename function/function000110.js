"use strict"
let logger = require('../logger/log.js').logger("function000110");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
/*
 * 项目部人员需要对员工离职和在职状态调整(支持单个用户和所有用户)
 http://115.29.145.75/servlet/json?funcNo=000110&empId=sdxx00056&status=3
**/
class function000110 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let empId = this.param.empId;//需要调整的员工编号
		let status = this.param.status;//3为离职，1为在职
		let isAll = this.param.isAll;//是否全部用户
		let tempParam = [];
		if(!status)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请输入需要调整的员工状态";
			this.response();
			return;
		}
		if(!isAll)
		{	
			if(!empId)
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "请输入需要调整的员工编号";
				this.response();
				return;
			}
			tempParam = [status,empId];
		}else
		{
			tempParam = [status];
		} 		
		
		this.userPositionStatusUpdate(tempParam);
	}
	userPositionStatusUpdate(param){
		let callback = (result) => {
			if(result)
			{
				this.resultVo.error_info = "调整员工在职状态成功!";
			}else
			{
				this.resultVo.error_info = "调整员工在职状态失败!";		 	
			}
			this.response();
		}
		oaservice.userPositionStatusUpdate(param,callback);
    }
}


module.exports = {
	"execute" : function(req,res,param){
		new function000110(req,res,param).execute();
	}
};