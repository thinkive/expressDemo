"use strict"
let logger = require('../logger/log.js').logger("function000015");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let oaservice = require('../services/oaservice');
let xlsx = require('node-xlsx');
let fs = require('fs');
let async = require("async");  
let moment = require('moment');     
let title = "" ;
/*
 * 欧晓霞，计算某个地区区间
 **/
class function000015 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		title = this.param.time;
		let data = [];//待对比数据(区间值)
		let data2 = [];//对比数据
		try{
			let path = '/uploads/images/test.xlsx';
			let obj = xlsx.parse(process.cwd()+path); 
			data = obj[0].data;
			data2 = obj[1].data;
			data.shift();
			data2.shift();
		    this.parseEquipmentList(data,data2);
			//async.eachSeries(data, (item,cb){	
				//This.parseEquipmentList(item,title,cb);
			//});	
		}catch(e){
			logger.error("读取文件错误"+e.message);
			this.resultVo.error_no = '-0001031';
			this.resultVo.error_info = "读取文件错误"
			this.response();	
			return;
		}
	}
	checkIsExist(data,data2)
	{
		data2[1] = moment(data2[1]).format('YYYY-MM-DD')//转换日期
		for(var i=0;i<data.length;i++)
		{
		   var arrs = data[i];
		   if(arrs[1] == data2[2])//员工编号匹配相同
		   {
			   arrs[3] = moment(arrs[3]).format('YYYY-MM-DD')//转换日期
			   arrs[4] = moment(arrs[4]).format('YYYY-MM-DD')//转换日期
			   if(data2[1]>=arrs[3] && data2[1]<=arrs[4])//匹配成功
			   {
				   
				   if(data2.length == 6)//本身
				   {
					   data2.push('');
					   data2.push('');
				   }else if(data2.length == 7)//本身
				   {
					   data2.push('');
				   }					   
				   data2.push('是');
				   data2.push(arrs[5]);
				   break;
			   }
		   }
		}
		return data2;
	}
	parseEquipmentList(data,data2){
		let dataResult = [["单据编号","日期","员工编号","员工名称","费用描述","金额","发票出发地（发票地点）","车票目的地","是否存在区间内部","的确"]];
		for(var i=0;i<data2.length;i++)
		{			
			dataResult.push(this.checkIsExist(data,data2[i]));
		}
		let buffer = xlsx.build([{name: "费用的匹配区间", data: dataResult}]);
		console.log(dataResult);
	    fs.writeFileSync("public/www/execl/huyang/testCity.xlsx", buffer, 'binary');
    }
}

module.exports = {
	"execute" : function(req,res,param){
		new function000015(req,res,param).execute();
	}
};