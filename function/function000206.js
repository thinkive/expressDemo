"use strict"
let logger = require('../logger/log.js').logger("function000206");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
/*
 **获得临时tocken
 **/
class function000206 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
	   let code = this.param.code;//用户授权登陆后从浏览器获取的code
	    var This = this;
	   if(code)
	   {  
		  
			wxApi.wxGetAccessTokenAuthor(code,function(error,body){
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
	   }else
	   {
		   		This.resultVo.error_no = "-00020501"
				This.resultVo.error_info = 'code参数不能为空';
	   }
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000206(req,res,param).execute();
	}
};