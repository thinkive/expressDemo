"use strict"
let logger = require('../logger/log.js').logger("function000007");
let baseFunction = require('./baseFunction');
let errno = require('../function/funcNoConfig');
let app = require('../config/app');
let path = require('path');
let mime = require('mime');
let fileSystem = require('fs');

/**
文件下载
*/
class function000007 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let filePath = app.get("uploads_path")+"/images/思迪通讯录_2015新架构20150413.xlsx";		
		let stat = null;
		try{
			stat = fileSystem.statSync(filePath);
		}catch(err)
		{
			throw this.exception('异常代码','文件下载不存在');
		}
		
		let filename = path.basename(filePath);
		let mimetype = mime.lookup(filePath);
		let userAgent = (this.req.headers['user-agent']||'').toLowerCase();      
		if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			filename = 'attachment; filename=' + encodeURIComponent(filename);
		} else if(userAgent.indexOf('firefox') >= 0) {			    
			filename = 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename)+'"';
		} else {
			 filename =  'attachment; filename=' + new Buffer(filename).toString('binary');
		}
		this.res.writeHead(200, {
			'Content-Type': mimetype,
			'Content-Length': stat.size,
			'Content-disposition':filename 
		});

		let readStream = fileSystem.createReadStream(filePath);
		readStream.pipe(this.res);
	}
}



module.exports = {
	"execute" : function(req,res,param){
		new function000007(req,res,param).execute();
	}
};