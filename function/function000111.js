"use strict"
let logger = require('../logger/log.js').logger("function000111");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
let xlsx = require('node-xlsx');
let fs = require('fs');
let objNewData = null;
let async = require("async");  
let title = "" ;
let count = null;
let cur = null;
/*
 * 计算各阶段并统计各人员工时统计
 **/
class function000111 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		count = 0;
		cur = 0;
		objNewData = [];
		title = this.param.time;
		let path = '/uploads/images/'+title+'.xlsx';
		let obj = xlsx.parse(process.cwd()+path); 
		let data = obj[0].data;
		count = data.length;
		console.log('文档行数' + count);
		var callback = (item,cb) => {
			this.parseEquipmentList(item,title,cb);
		}
		async.eachSeries(data, callback);
	}
	parseEquipmentList(param,title,cb){
		let callback = (result) => {
			if(result)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "统计工时信息成功(项目分摊人员)!";
				this.resultVo.results = result;
			}else
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "统计工时清单信息(项目分摊人员)!";		 	
			}
			for(let i=0;i<result.length;i++)
			{
				var obj = result[i]
				objNewData.push(obj);		
			}	
			++cur;
			if(cur == count)
			{
				let buffer = xlsx.build([{name: "sheel", data: objNewData}]);
				fs.writeFileSync("public/www/execl/huyang/"+title+".xlsx", buffer, 'binary');
				objNewData = null;
				count = null;
				cur = null;
			}
			cb();
		}
		oaservice.getProjectByEndComDateByEmpid(param,title,callback);
    }
}


module.exports = {
	"execute" : function(req,res,param){
		new function000111(req,res,param).execute();
	}
};