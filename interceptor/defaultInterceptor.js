"use strict"
let logger = require('../logger/log.js').logger("defaultInterceptor");
let errno = require('../function/funcNoConfig.js');
let config = require('../config/config');
/**
 * 参数拦截器
 */
let execute = (app,req,res,param,next) => {
	logger.info("进入默认拦截器");
	if(config.isShowServletJson == "1")
	{
		logger.info("接口请求参数:"+JSON.stringify(param));
	}	
	logger.info("离开默认拦截器");
	return true;
}

let intercept = {
	"execute" : execute
};
module.exports = intercept