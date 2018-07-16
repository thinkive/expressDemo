"use strict"
let logger = require('../logger/log.js').logger("function000116");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
let xlsx = require('node-xlsx');
let fs = require('fs');
/*
 * 诺明系统生成出差审批流(根据时间段)
 http://115.29.145.75/servlet/json?funcNo=000116&start_date=2015-08-01&end_date=2015-08-31
**/
class function000116 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let start_date = this.param.start_date;//开始日期
		let end_date = this.param.end_date;//结束日期
		if(!start_date)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写查下费用表审批流的开始日期";
			this.response();	
			return;
		}
		if(!end_date)
		{
			this.resultVo.error_no = errno.errno0006;
			this.resultVo.error_info = "请填写查下费用表审批流的结束日期!";
			this.response();	
			return;
		}		
		let param = [];
		param.push(start_date);
		param.push(end_date);
		this.getRqAswfSteplByDate(param);
	}
	getRqAswfSteplByDate(param){
		let callback = (result) => {
			let objNewData = [['单据号','员工编号','员工姓名','审批人','审批时间']];
			if(result){
				let curDoc = '';//当前单据号
				let curEmpid = '';//当前员工编号
				let curName = '';//当前员工姓名
				var curData = [];
				var step = 1;
				for(let i = 0;i<result.length;i++)
				{
					let obj = result[i];
					
					let docId = obj['OACC_DOCNO'];//单据号
					let subBy = obj['ASWFSTEP_SUBMITBY'];//员工编号
					let name  = obj['HREMP_NAME'];//员工姓名
					let subDate  = obj['ASWFSTEP_DATE'];//审批日期
					console.log(obj)
					curData = [];
					if(curDoc != docId)//说明是新的一个审批流程
					{
						step = 1;
						curDoc = docId;
						curEmpid = subBy;
						curName = name;
						curData.push(docId);
						curData.push(subBy);
						curData.push(name);
						curData.push(name);
						curData.push(subDate);
						objNewData.push(curData);						
					}else{//同一个审批流
					    curData.push(docId);
						curData.push(subBy);
					    if(curName == name)//当前员工姓名和开始员工姓名一样
						{
							curData.push(curName);
							curData.push(curName);	
							step++;							
						}else	
						{
							curData.push(curName);
							curData.push(name);
							step++;	
						}
						curData.push(subDate);
						objNewData.push(curData);							
					}			
                   				
					curData.push("第"+step+"审批人")
				}	
			}
			
			let buffer = xlsx.build([{name: "一段时间的审批流", data: objNewData}]);
			fs.writeFile("public/www/execl/huyang/102.xlsx", buffer, 'binary')
			if(result)
			{
				this.resultVo.error_info = "审批流处理成功!";	
				this.resultVo.error_no = "-1000";	
				this.resultVo.results = {url:'http://wecloud.net.cn/execl/huyang/102.xlsx?r='+(Math.random()+'').substring(0,7)}; 
				
			}else
			{
				this.resultVo.error_info = "审批流处理失败!";
			}
			this.response();	
		}
		oaservice.getRqAswfSteplByDate(param,callback);
    }
}

module.exports = {
	"execute" : function(req,res,param){
		new function000116(req,res,param).execute();
	}
};