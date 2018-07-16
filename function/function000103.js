"use strict"
let logger = require('../logger/log.js').logger("function000103");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaserviceTest = require('../services/oaserviceTest');
let xlsx = require('node-xlsx');
let fs = require('fs');
let objNewData = [["项目编号","开始时间","结束时间","系统工时"]];
let async = require("async");  

/*
 * 统计一段时间内工时超过一定百分比时对应的日期
 **/
class function000103 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		//业务处理开始(异步了)
		//定义回调(必须使用箭头函数才能获取到resultVo)
		let title = this.param.time;
			let data = [];
			try{
				let path = '/uploads/images/'+title+'.xlsx';
				let obj = xlsx.parse(process.cwd()+path); 
				data = obj[0].data;
				data.shift();//第一个sheet//目前还未找到原因，只能批量处理94条数据
				var This = this;
				async.eachSeries(data, function(item,cb){	
					This.parseEquipmentList(item,title,cb);
				});	
			}catch(e){
				logger.error("读取文件错误"+e.message);
				this.resultVo.error_no = '-0001031';
				this.resultVo.error_info = "读取文件错误"
				this.response();	
				return;
			}


	}
	parseEquipmentList(param,title,cb){
		//回调方法
		let callback = (result) => {
			if(result.length > 0)
			{
				this.resultVo.error_no = "0"
				this.resultVo.error_info = "统计工时信息成功!";
				this.resultVo.results = result;
			}else
			{
				this.resultVo.error_no = errno.errno0006;
				this.resultVo.error_info = "统计工时清单信息!";		 	
			}
			objNewData.push(result);		
			let buffer = xlsx.build([{name: "sheel", data: objNewData}]);
			fs.writeFileSync("public/www/execl/huyang/"+title+".xlsx", buffer, 'binary');
			cb();
		}
		oaserviceTest.equipmentList(param,callback);
    }
}





module.exports = {
	"execute" : function(req,res,param){
		new function000103(req,res,param).execute();
	}
};