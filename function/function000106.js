"use strict"
let logger = require('../logger/log.js').logger("function000106");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
let xlsx = require('node-xlsx');
let fs = require('fs');
let objNewData = null;
let count = null;
let cur = null;
let async = require("async");  
let title = "" ;
let rank = "asc" ;
/*
 * 统计某个项目在系统里面开始和结束填写日期
 **/ 
class function000106 extends baseFunction
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
		rank = this.param.rank;
		let path = '/uploads/images/'+title+'.xlsx';
		let obj = xlsx.parse(process.cwd()+path); 
		let data = obj[0].data;
		count = data.length;
		var callback = (item,cb) => {
			this.parseEquipmentList(item,title,rank,cb);
		}
		async.eachSeries(data, callback);	

	}
	parseEquipmentList(param,title,rank,cb){
		//回调方法
		let callback = (result) => {
			if(result.length > 0)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "统计工时信息成功!";
				this.resultVo.results = [];
			}else
			{
				resultVo.error_no = errno.errno0006;
				resultVo.error_info = "统计工时清单信息!";		 	
			}
			if(objNewData)
			{	
				objNewData.push(result);	
			}			
			++cur;
			console.log(cur+"****"+count)
			if(cur == count)
			{
				let buffer = xlsx.build([{name: "sheel", data: objNewData}]);
				console.log("写入文件："+title)
			    fs.writeFileSync("public/www/execl/huyang/"+title+".xlsx", buffer, 'binary')
				objNewData = null;
				count = null;
				cur = null;
				return ;
			}else
			{
				cb();
			}	
			
		}
		oaservice.getProjectByEndComDateAll(param,title,rank,callback);
    }
} 


module.exports = {
	"execute" : function(req,res,param){
		new function000106(req,res,param).execute();
	}
};