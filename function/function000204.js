"use strict"
let logger = require('../logger/log.js').logger("function000204");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat').wxApi;
/*
 **获得微信自定义菜单
 **/
class function000204 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		wxApi.getMenu(function(error,body){
			if(error)
			{
				this.resultVo.results = [];
				this.resultVo.error_no = "-00020401"
				this.resultVo.error_info = error;
			}else
			{		
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "获得自定义菜单成功!";
				this.resultVo.results = body;
			}
			
			this.response();	
		});
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000204(req,res,param).execute();
	}
};