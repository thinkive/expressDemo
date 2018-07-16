"use strict"
let logger = require('../logger/log.js').logger("function000211");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
let signature = require('wx_jsapi_sign');
let wx_config = require('../config/wx_config');
/*
 **微信支,模式一(扫码支付，后台生成固定二维码，固定商品价格，多人支付，线下支付)
 生成二维码

 **/
class function000211 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;
		var code_url = wxApi.wxpay.createMerchantPrepayUrl({ product_id: '1234567890' });
		This.resultVo.error_no = "0"
		This.resultVo.error_info = '订单二维码生成成功';
		This.resultVo.results = {code_url:code_url};
		This.response();

	}


}




module.exports = {
	"execute" : function(req,res,param){
		new function000211(req,res,param).execute();
	}
};