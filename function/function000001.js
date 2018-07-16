"use strict"
let logger = require('../logger/log.js').logger("function000001");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
/*
 * 查询联系人资料
 **/
class function000001 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let callback = function(result){
			if(result)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "查询联系人信息成功!";
				this.resultVo.results = resultVo.results;
			}else
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "暂无联系人信息!";		 	
			}		 
			this.response();	
		};
		//baseFunction.query('SELECT * FROM  employee',param,res,callback);			
		
	}
}  


module.exports = {
	"execute" : function(req,res,param){
		new function000001(req,res,param).execute();
	}
};