"use strict"
let logger = require('../logger/log.js').logger("function000210");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
let signature = require('wx_jsapi_sign');
let wx_config = require('../config/wx_config');
let redisUtils = require('../utils/redisUtils');
var WXPay = require('weixin-pay');
var fs = require('fs');

var wxpay = WXPay({
    appid: wx_config.mp.appid,
    mch_id: wx_config.mch_id,
    partner_key: wx_config.partner_key, //微信商户平台API密钥
    pfx: fs.readFileSync(process.cwd()+'/config/apiclient_cert.p12'), //微信商户平台证书
});
/*
 **微信支付(扫码支付（官方模式一返回回调地址）) 
 
 **/
class function000210 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;		
	    //接受用户支付后的回调函数
		let productid = this.param.productid;
	    let openid = this.param.openid;
		
	}


}




module.exports = {
	"execute" : function(req,res,param){
		new function000210(req,res,param).execute();
	}
};