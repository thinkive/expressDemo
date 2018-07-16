"use strict"
let logger = require('../logger/log.js').logger("function000011");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let app = require('../config/app');
/**
判断用户设备信息
*/
class function000011 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let ua = this.req.headers['user-agent'];
		let deviceAgent = {};  
		if (/mobile/i.test(ua))  
			deviceAgent.Mobile = true;  
		  
		if (/like Mac OS X/.test(ua)) {  
			deviceAgent.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');  
			deviceAgent.iPhone = /iPhone/.test(ua);  
			deviceAgent.iPad = /iPad/.test(ua);  
		}  
		  
		if (/Android/.test(ua))  
			deviceAgent.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];  
		  
		if (/webOS\//.test(ua))  
			deviceAgent.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];  
		  
		if (/(Intel|PPC) Mac OS X/.test(ua))  
			deviceAgent.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;  
		  
		if (/Windows NT/.test(ua))  
		deviceAgent.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];  
		this.resultVo.error_info = "您访问的设备是："+JSON.stringify(deviceAgent);
		this.resultVo.results = 121;
		//返回数据
		this.response();
	}
}


module.exports = {
	"execute" : function(req,res,param){
		new function000011(req,res,param).execute();
	}
};