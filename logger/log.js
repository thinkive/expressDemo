var log4js = require('log4js');
var app = require('express')();
//log the cheese logger messages to a file, and the console ones as well.
log4js.configure({
    appenders: [
        {
	        type: "dateFile",
	        pattern: "_yyyy-MM-dd",  
	        filename: "logs/cheese.log",//注意logs目录需要先手动建好
	        maxLogSize: 1024,//大于1024M会重新建一个文件
	        category: [ 'normal' ],
	        alwaysIncludePattern: true
        },
        {
            type: "console"
        }
    ],
    replaceConsole: true
});
var logger = log4js.getLogger('normal');
logger.setLevel('info');//trace,debug，info,warn,error,fatal,只答应比设置级别高的日志
//修改输入格式
//app.use(log4js.connectLogger(logger, {level:'info', format:':method :url'}));
exports.logger=function(name){
    return logger;
}
