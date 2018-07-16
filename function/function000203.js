"use strict"
let logger = require('../logger/log.js').logger("function000203");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let moment = require('moment');  
let wx_config = require('../config/wx_config'); 
let wxApi = require('../wechat/wechat').wxApi; 
/*
 **群发信息(文字,语音，视频，图片)
 **/
class function000203 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let param = {};
			//回调函数
		let callback = function(error, body) {
			
			if(error) 
			{
				this.resultVo.error_no = "-0002031"
				this.resultVo.error_info = "群发信息:" + "["+body.errcode+"]"+body.errmsg;
			   
			}else
			{
				if(body.errcode == "0")
				{
					this.resultVo.error_no = "0"
					this.resultVo.error_info = "群发信息成功";
				}else
				{
					this.resultVo.error_no = "-0002032"
					this.resultVo.error_info = "群发信息:" + "["+body.errcode+"]"+body.errmsg;
				}	
				
			}	 
			resultVo.results = [];
			this.response();				
		};
		if(_param.type == 0)//文字
		{
			let content = _param.content || '系统测试群发功能';
			let receivers = _param.receivers || wx_config.testOpenidArray;
			wxApi.massSendText(content, receivers, callback);
		}else if(_param.type == 1)//语音
		{
			wxApi.massSendVoice(content, receivers, callback);
		}else if(_param.type == 2)//图片
		{
			wxApi.massSendImage(content, receivers, callback);
		}else if(_param.type == 3)//视频
		{
			wxApi.massSendVideo(content, receivers, callback);
		}else if(_param.type == 4)//图文
		{
			wxApi.massSendNews(content, receivers, callback);
		}else
		{
			this.resultVo.error_no = "-0002033"
			this.resultVo.error_info = "接口入参有误!";
			this.resultVo.results = [];
			this.response();
		}		
	}
} 



module.exports = {
	"execute" : function(req,res,param){
		new function000203(req,res,param).execute();
	}
};