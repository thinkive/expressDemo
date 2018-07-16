"use strict"
let logger = require('../logger/log.js').logger("function000209");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
let wxApi = require('../wechat/wechat');
let signature = require('wx_jsapi_sign');
let wx_config = require('../config/wx_config');


/*
 **微信支付(扫码支付，生成二维码有失效时间2小时，用户主动下单，单人支付，线上支付)
 
 查询订单

// 通过微信订单号查
wxpay.queryOrder({ transaction_id:"xxxxxx" }, function(err, order){
    console.log(order);
});

// 通过商户订单号查
wxpay.queryOrder({ out_trade_no:"xxxxxx" }, function(err, order){
    console.log(order);
});
关闭订单

wxpay.closeOrder({ out_trade_no:"xxxxxx"}, function(err, result){
    console.log(result);
});
var params = {
    appid: 'xxxxxxxx',
    mch_id: '1234567890',
    op_user_id: '商户号即可',
    out_refund_no: '20140703'+Math.random().toString().substr(2, 10),
    total_fee: '1', //原支付金额
    refund_fee: '1', //退款金额
    transaction_id: '微信订单号'
};

wxpay.refund(params, function(err, result){
    console.log('refund', arguments);
});
 **/
class function000209 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;		
	    let mch_id = wx_config.mch_id;//商户号
		let payMoney = this.param.payMoney;
		let headers = this.req.headers;
		let ipAddress = headers['x-real-ip'];
		wxApi.wxpay.createUnifiedOrder({
			body: '扫码支付测试',
			out_trade_no: '20160721'+Math.random().toString().substr(2, 10),
			total_fee: payMoney,
			spbill_create_ip: ipAddress,
			notify_url: 'http://www.wecloud.net.cn/wechatPayNotify',
			trade_type: 'NATIVE',
			product_id: '1234567890'
		}, function(error, result){
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
		new function000209(req,res,param).execute();
	}
};