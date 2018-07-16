"use strict"
let logger = require('../logger/log.js').logger("function000207");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
/*
 **根据openid获得用户基本信息
 **/
class function000207 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
	   let openid = this.param.openid;//用户授权登陆后获得用户openid
	   var This = this;
		wxApi.wxAuthUserInfo(openid,function(error,body){
			if(error)
			{
				This.resultVo.error_no = "-00020501"
				This.resultVo.error_info = error;
			}else
			{
				This.resultVo.results = body;					 	  	
			}
			
			This.response();			
		});
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000207(req,res,param).execute();
	}
};