"use strict"
let logger = require('../logger/log.js').logger("paramsInterceptor");
let os = require('../utils/os');
/**
 * 参数拦截器
 */
let execute = (app,req,res,param,next) => {
	logger.info("进入参数拦截器");
	let flag = false;
	try{
		param.ip = os.getClientIp(req);
		flag = true;
	}catch(e){
		flag = false;
		let resultVo = {};
		resultVO.error_info = e.message;
		resultVO.error_no = "";
		res.send(JSON.stringify(resultVO));
		logger.error(e.message);
	}
	logger.info("离开参数拦截器");
	return flag;
}

let intercept = {
	"execute" : execute
};
module.exports = intercept