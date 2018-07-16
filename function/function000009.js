"use strict"
let logger = require('../logger/log.js').logger("function000009");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let app = require('../config/app');;
/**
前端异常收集
*/

class function000009 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		this.resultVo.error_no = "0"
		this.resultVo.error_info = '返回信息成功';
		this.resultVo.results = 121;
		//返回数据
		this.response();
	}
}


module.exports = {
	"execute" : function(req,res,param){
		new function000009(req,res,param).execute();
	}
};
