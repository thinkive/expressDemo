"use strict"
let logger = require('../logger/log.js').logger("function000213");
let wechatHelper = require("../wechat/wechat");//微信实现类
let baseFunction = require("./baseFunction");
var alipay = require('../wechat/alipay');//alipay支付宝支付
/*
 **支付宝支付，即时到账(非JSON返回数据格式,通过重定向方式跳转页面)
 **/
class function000213 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){
        var This = this;		
		alipay.alipayto(this.req,this.res);		
	}


}




module.exports = {
	"execute" : function(req,res,param){
		new function000213(req,res,param).execute();
	}
};