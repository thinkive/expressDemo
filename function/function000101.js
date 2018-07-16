"use strict"
let logger = require('../logger/log.js').logger("function000101");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
/*
 * 查询设备情况
 **/
class function000101 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		//回调方法
		let callback = (result) => {
			if(result.length > 0)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "查询设备清单信息成功!";
				this.resultVo.results = result;
			}else
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "暂无设备清单信息!";		 	
			}
			this.response();
		}
		oaservice.equipmentList(this.param,callback);
	}
}
module.exports = {
	"execute" : function(req,res,param){
		new function000101(req,res,param).execute();
	}
};