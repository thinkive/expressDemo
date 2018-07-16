"use strict"
let logger = require('../logger/log.js').logger("function000212");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
let signature = require('wx_jsapi_sign');
let wx_config = require('../config/wx_config');
/*
 **微信支付，公众号号支付
 **/
class function000212 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;		
		var openid = this.param.openid;
		var body = '扫码支付测试';
		let headers = this.req.headers;
		let ipAddress = headers['x-real-ip'];
		
		wxApi.wxpay.getBrandWCPayRequestParams({
			openid: openid,
			body: body,
			detail: '公众号支付测试',
			out_trade_no: '20160721'+Math.random().toString().substr(2, 10),
			total_fee: 1,
			spbill_create_ip: ipAddress,
			notify_url: 'http://www.wecloud.net.cn/wechatPayNotify',
		}, function(error, result){
			
			// in express
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
		new function000212(req,res,param).execute();
	}
};