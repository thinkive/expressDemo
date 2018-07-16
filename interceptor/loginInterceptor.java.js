"use strict"
/**
 * 登陆拦截器
 */
let execute = (app,req,res,param,next) => {
	try{
	}catch(e){
		logger.error(e.message);
	}
	return param;
}

let intercept = {
	"execute" : execute
};


module.exports = execute