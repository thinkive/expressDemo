"use strict"
let logger = require('../logger/log.js').logger("function000202");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let moment = require('moment');  
let wx_config = require('../config/wx_config');  
let config = require('../config/config');  
let wxApi = require('../wechat/wechat').wxApi;
/*
 **发送模板消息(支持单一用户和对用户)
 **/
class function000202 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let openid  = this.param.openid || wx_config.testOpenid;
		let templateId = this.param.templateId || wx_config.testTemplateId;//功能开通通知	金融业
		let url = this.param.url || config.domin;
		let topcolor = this.param.topcolor || '#FF0000'; // 顶部颜色
		let data = this.param.data || {
			"first": {
				"value": "您好，恭喜您已成功开通微信交易！",
				"color": "2013年9月10日"		
			},
			"name": {
				"value": "微信基金交易",
				"color": "#173177"
			},
			"time": {
				"value": moment(new Date()).format('YYYY-MM-DD'),
				"color": "#173177"
			},
			"remark": {
				"value": "您可以使用下方微信菜单进行更多体验。",
				"color": "#173177"
			}
		};
		//回调函数
		let callback = (error, body) => {
			if(error) 
			{
				this.resultVo.error_no = "-0002021"
				this.resultVo.error_info = "模板消息推送失败:" + "["+body.errcode+"]"+body.errmsg;
			   
			}else
			{
				if(body.errcode == "0")
				{
					this.resultVo.error_no = "0"
					this.resultVo.error_info = "模板消息推送成功";
				}else
				{
					this.resultVo.error_no = "-0002022"
					this.resultVo.error_info = "模板消息推送失败:" + "["+body.errcode+"]"+body.errmsg;
				}	
				
			}	 
			resultVo.results = [];
			this.response();					
		};
		wxApi.sendTemplate(openid, templateId, url, topcolor, data, callback);
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000202(req,res,param).execute();
	}
};