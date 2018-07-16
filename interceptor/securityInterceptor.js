"use strict"
let logger = require('../logger/log.js').logger("securityInterceptor");
let errno = require('../function/funcNoConfig.js');
/**
 * 权限拦截器，判断用户是否登陆
 */
let execute = (app,req,res,param,next) => {
	logger.info("进入权限拦截器");
	let flag = false;
	if(req.session.userinfo)//用户已经登陆
	{
		flag = true;
	}else
	{
		let resultVo = {};
		resultVo.error_info = "请先登录后再查询!";
		resultVo.error_no = errno.errno0002;
		res.send(JSON.stringify(resultVo));
	}
	logger.info("离开权限拦截器");
	return flag;
}

let intercept = {
	"execute" : execute
};



module.exports = intercept