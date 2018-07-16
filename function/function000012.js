"use strict"
let logger = require('../logger/log.js').logger("function000012");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let app = require('../config/app');
//let QRCode = require('qrcode');
let validator = require('validator');  //validator.isEmail('foo@bar.com'); //=> true  
//let ping = require ("net-ping");
/**

生成二维码
*/

class function000012 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		this.resultVo.error_no = "0"
		this.resultVo.error_info = '验证6000329@@qq.com是否邮箱'+validator.isEmail('foo@bar.com');
		this.resultVo.results = 121;
		//返回数据
		this.response();
	}
}

module.exports = {
	"execute" : function(req,res,param){
		new function000012(req,res,param).execute();
	}
};