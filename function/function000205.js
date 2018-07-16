"use strict"
let logger = require('../logger/log.js').logger("function000205");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat').wxApi;
/*
 **删除微信自定义菜单
 **/
class function000205 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		wxApi.removeMenu(function(error,body){
			if(error)
			{
				this.resultVo.error_no = "-00020501"
				this.resultVo.error_info = error;
			}else
			{
				if(body.errcode == "0")
				{			
					this.resultVo.error_no = "0"
					this.resultVo.error_info = "删除自定义菜单成功!";
				}else
				{
					this.resultVo.error_no = "-00020502"
					this.resultVo.error_info = "删除自定义菜单失败!";
				}			 	  	
			}
			this.resultVo.results = [];
			this.response();			
		});
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000205(req,res,param).execute();
	}
};