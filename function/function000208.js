"use strict"
let logger = require('../logger/log.js').logger("function000208");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
let signature = require('wx_jsapi_sign');
//let wx_config = require('../config/wx_config');
let redisUtils = require('../utils/redisUtils');
/*
 **获得调用微信jssdk签名参数
 **/
class function000208 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;		
		/*redisUtils.get(wx_config.access_token,function(err,body){
				if (err){
					return callback(err);
				}else
				{
					var tockens = JSON.parse(body);
					
				     var config = {
							appId: 'wxf5b3c80720abf3f1',
							appSecret: '7d04e4e5eb6fcbf22baec5ebecf80ae5',
							appToken: tockens.accessToken,
							cache_json_file:'/root/www/nodejs/trunk/config'
					 };				
					 var url = This.param.url;
					 signature.getSignature(config)(url, function(error, result) {
					    if(error)
						{
							This.resultVo.error_no = "-00020501"
							This.resultVo.error_info = error;
						}else
						{
							This.resultVo.error_no = '0';
							This.resultVo.results = result;					 	  	
						}
						
						This.response();	
					});					
				}	  
			});*/
			/*var param = {
				 debug: true,
				 jsApiList: ['checkJsApi','onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ', 'onMenuShareWeibo','onMenuShareQZone', 'hideMenuItems', 'showMenuItems','hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem'],
				 url: this.param.url
			};*/

			
			wxApi.getJsConfig(this.param,function(error, result) {
					if(error)
					{
						This.resultVo.error_no = "-00020501"
						This.resultVo.error_info = error;
					}else
					{
						This.resultVo.error_no = '0';
						This.resultVo.results = result;					 	  	
					}
					
					This.response();	
			});
		}


	}




module.exports = {
	"execute" : function(req,res,param){
		new function000208(req,res,param).execute();
	}
};