"use strict"
let logger = require('../logger/log.js').logger("function000201");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat').wxApi;
let weMenu = require('../wechat/weMenu');
/*
 **设置微信自定义菜单
 **/
class function000201 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let version  = this.req.version || 'v.1000';
		var This = this;
		wxApi.createMenu(weMenu[version],function(error,  body){
			if(error)
			{
				This.resultVo.error_no = "-00020101"
				This.resultVo.error_info = error;
				This.response();
			}else
			{
				if(body.errcode == "0")
				{			
					This.resultVo.error_no = "0"
					This.resultVo.error_info = "版本【"+version+"】创建自定义菜单成功!";
					logger.info("版本【"+version+"】创建自定义菜单成功!");
				}else
				{
					This.resultVo.error_no = "-00020102"
					This.resultVo.error_info = JSON.stringify(body);
				}			 	  	
			}
			This.resultVo.results = [];
			This.response();
		});
	}
} 

module.exports = {
	"execute" : function(req,res,param){
		new function000201(req,res,param).execute();
	}
};