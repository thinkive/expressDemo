"use strict"
let logger = require('../logger/log.js').logger("function000006");
let baseFunction = require("./baseFunction");
let resultVo = require("../function/baseFunction").getResultVO();
let errno = require('../function/funcNoConfig');
let redisUtils = require('../utils/redisUtils');
let xlsx = require('node-xlsx');
let fs = require('fs');
let moment = require('moment');     
let textData = {};
/*
支持读写Excel的node.js模块

上npm搜索过，发现支持读写excel文件的模块有很多，但是都各有缺陷，有些仅支持xls/xlsx的一种格式，有些仅支持读取数据，有些仅支持导出文件。例如：

node-xlsx: 基于Node.js解析excel文件数据及生成excel文件，仅支持xlsx格式文件；
excel-parser: 基于Node.js解析excel文件数据，支持xls及xlsx格式文件；
excel-export : 基于Node.js将数据生成导出excel文件，生成文件格式为xlsx；
node-xlrd: 基于node.js从excel文件中提取数据，仅支持xls格式文件。
xlsx：//http://mystorp.com/2015/11/07/nodejs-process-excel/
execl转换给html

/**
 * 转换 excel 为 HTML 文件
 *
 * @file xlsx2json.js
 * @author mystorp@gmail.com
 *


let fs = require('fs'),  
    xlsx = require('xlsx');

/**
 * 解析 excel 为 JSON 对象，每个 excel 有多个 sheet 页，
 * 每个 sheet 页里面有多行数据，每行数据有多列，最终 sheet
 * 的数据存储为二维数组。
 * 返回格式：
 * {
 *     "Sheet 1": [
 *          [col1, col2, col3, ...],//第一行数据
 *          [col1, col2, col3, ...],//第二行数据
 *          ...
 *     ],
 *     "Sheet 2": []
 * }
 *
 * @param {String} input - 要处理的 excel 源文件
 * @return {Object} 返回
 
function parse(input) {  
    let book = xlsx.readFileSync(input), result = {};
    //循环工作表中的每个 sheet 页
    book.SheetNames.forEach(function(name){
        //拿到当前 sheet 页对象
        let sheet = book.Sheets[name],
            //得到当前页内数据范围
            range = xlsx.utils.decode_range(sheet['!ref']),
            //保存数据范围数据
            row_start = range.s.r, row_end = range.e.r,
            col_start = range.s.c, col_end = range.e.c,
            rows = [], row_data, i, addr, cell;
        //按行对 sheet 内的数据循环
        for(;row_start<=row_end;row_start++) {
            row_data = [];
            //读取当前行里面各个列的数据
            for(i=col_start;i<=col_end;i++) {
                addr = xlsx.utils.encode_col(i) + xlsx.utils.encode_row(row_start);
                cell = sheet[addr];
                //如果是链接，保存为对象，其它格式直接保存原始值
                if(cell.l) {
                    row_data.push({text: cell.v, link: cell.l.Target});
                } else {
                    row_data.push(cell.v);
                }
            }
            rows.push(row_data);
        }
        //保存当前页内的数据
        result[name] = rows;
    });
    return result;
}

/**
 * 根据模板页生成最终的页面
 *
 * @param file 要生成文件的路径

function createPage(file, head, catalogs) {  
    let src = fs.readFileSync('template.html', {encoding: 'utf-8'}), o;
    o = {head:head, catalogs: catalogs};
    src = src.replace(/\{(.*?)\}/g, function(_, key){
        return (key in o) ? JSON.stringify(o[key]) : _;
    });
    fs.writeFileSync(file, src);
}

if(module === require.main) {  
    let files = [
        {filename: '1.xls', text: 'jhs', html: 'index_jhs.html'},
        {filename: '2.xls', text: 'tm', html: 'index.html'}
    ];
    let prefix = "./";
    files.forEach(function(c){
        let result = parse(c.filename), dir = prefix + c.text, k, catalogs = [], i;
        fs.existsSync(dir) || fs.mkdirSync(dir);
        i = 1;
        for(k in result) {
            fs.writeFileSync(dir + '/' + i + '.json', JSON.stringify(result[k]));
            catalogs.push([k, i]);
            i++;
        }
        createPage(prefix + c.html, c, catalogs);
    });
}
*/
/*
 * 读excel-统计，欧晓霞专用处理
 **/
let execute = function(app,param,req,res){
	let path = param.path;	  
	if(!path)//用户直接访问地址param,res,req
	{
		resultVo.error_info = "请先上传需要处理的xlxs文件!";
	    resultVo.error_no = errno.errno0004;
	    param.send(resultVo);
		return;
	}
	  //__dirname当前目录
	let obj = xlsx.parse(process.cwd()+"/"+path); 
	let download = "";
	  
	  
	if(req.body.operate == "type1")
	{
	 	for(let i=0;i<obj.length;i++)
		{
		   	createExecl(obj[i]);
		   	download +="<a href='http://115.29.145.75/execl/"+obj[i].name+".xlsx' >"+obj[i].name+"</a><br>";
		}
		res.send('点击下载整理好的execl文件:<br>'+download);
	 }else if(req.body.operate == "type2")
	 {
	 	for(let i=0;i<obj.length;i++)
		{
		   	createExecl1(obj[i]);
		   	download +="<a href='http://115.29.145.75/execl/beili/"+obj[i].name+".xlsx' >"+obj[i].name+"</a><br>";
		}
		res.send('点击下载整理好的execl文件:<br>'+download);
	 }
	 else if(req.body.operate == "typecompare")//比较差异
	 {
	 	if(obj.length%2 != 0)
	    {
		    res.send('请上传正确的文件格式，需要对比请上传偶数位sheel页');	 	    	
	    }
	    for(let i=0;i<(obj.length/2);i++)
	    {
		    let diff = createExeclCompare(obj,i*2,req.body.prodType);
		    download +="发现"+obj[i*2].name+"有差异:<br>"+diff+"<br>";
	    }
	    res.send('差异如下:<br>'+download);
	 }
	 else if(req.body.operate == "last")//统计文件
	 {	 	  
	    //统计		  
	    for(let i=0;i<obj.length;i++)
	    {
		   let temp = obj[i];
		   if(temp.name == "Sheet1")
		   {
			   textData = getAllData(temp);
			   break;
		   }    
	    }   
		for(let i=0;i<obj.length;i++)
		{
			 let temp = obj[i];
			 if(temp.name != "Sheet1")
			 {
				  createExeclCompare2(obj[i]);	
			 }	 				   	 
		}	   
	    doData(textData)
	    download +="<a href='http://115.29.145.75/execl/tongji/项目工时和进度表.xlsx'>项目工时和进度表点击下载</a>";
	    res.send(download);
	}  
	else if(req.body.operate == "typecomparehuy")//比较差异
	{		 	   
		if(obj.length <= 0)
	 	{
	 	    res.send('您上传的execl文件里面sheel为空,请重新上传');	 	    	
	 	}
		let diff = createExecl5(obj[0]);
		download +="<a href='http://115.29.145.75/execl/huyang/"+obj[0].name+".xlsx'>统计后的项目表格</a>";
	    res.send('统计如下:<br>'+download);
	}else if(req.body.operate == "works")//比较差异,晓霞工时分摊
	{
	 	
	    createExeclCompare3(obj[0],obj[1]);
		download +="<a href='http://115.29.145.75/execl/huyang/13.xlsx'>工时计算分摊</a>";
	    res.send('差异如下:<br>'+download);
	}else if(req.body.operate == "typecomparehuy1")//2016-8-25 16:21:27计算某个日期是否在某一个区间内，得出对应地区
	{	 	
		createExeclCompare4(obj[0],obj[1]);
	    download +="<a href='http://115.29.145.75/execl/huyang/14.xlsx'>地区查询</a>";
	    res.send('差异如下:<br>'+download);
	}	
	else
	{
	 	res.send('处理失败，请联系QQ600329');
	}	

}; 

function doData(textData){	
    let dataResult = [["项目编号","客户名称","项目名称","合同日期","合同总金额","收入确认基数","预计工时","2013年实际工时","2013年工时进度","2014年实际工时","2014年工时进度","2013年收入进度","2013确认收入金额","2014年收入进度","2014确认收入金额","2013-2014年项目合计进度"]];
	for(let key in textData)
	{
		if(textData[key])
		{
			textData[key][7]?textData[key][7]=(textData[key][7]*8):textData[key][7];
			textData[key][9]?textData[key][9]=(textData[key][9]*8):textData[key][9];
		}
		dataResult.push(textData[key]);
	}	
	let buffer = xlsx.build([{name: "Sheet1", data: dataResult}]);
	fs.writeFileSync("public/HTML5/execl/tongji/项目工时和进度表.xlsx", buffer, 'binary');
}

function getAllData(obj){
	//
	let data = obj.data;
	let objTemp = {};
	for(let i=1 ;i<data.length-1;i++)//第一行是标题，最后一行是合计
	{
		let row = data[i];
		let date = new Date(1900, 0, row[3] - 1);
		row[3] = moment(date).format('YYYY/MM/DD');		
		objTemp[trim(row[0])] = row;
	}
	return objTemp;
}

/**
统计写入到文件
*/
function createExeclCompare3(obj1,obj2){
	let objData1 = obj1.data;
	let objData2 = obj2.data;
	let objNewData = [["员工编号","员工名称","项目编码","项目名称","工时","天数"]];
	let count = 0;
	let lastDay = 0;
	let rowa = null;

	
	//统计总工时
	let obj = {};
	for(let a=1;a<objData2.length;a++)
	{
		let temp = objData2[a];
	    obj[temp[0]+temp[5]] = obj[temp[0]+temp[5]]?(obj[temp[0]+temp[5]]+temp[4]):temp[4];
	}	
	
	
	//统计
	for(let i=1 ;i<objData1.length;i++)//第一行是大标题，第二行是小标题，行
	{
		let row = objData1[i];
		count = 0;
		lastDay = 0;
		rowa = row;
	    for(let j=1;j<objData2.length;j++)
		{
			let row2 = objData2[j]
			
			if(row[1] == row2[0] && row[3] == row2[5])//同一个人且日期相同
			{			
				if(i<objData2.length-1)//不是最后一条数据
				{				    
					
					let nextData = objData2[j+1];//取后面一条数据
					if(!nextData){						
						row2[7] = (row[5]- count);						
					}else
					{	
						if(row[1] != nextData[0] || (row[1] == nextData[0] &&row[3] != nextData[5]))//下一条数据如果不等，那么这条就表示结束
						{
							console.log("总："+row[5]+"前面统计"+count)
							row2[7] = (row[5]- count);
						}else
						{
							lastDay = Math.ceil((row2[4]/obj[row[1]+row2[5]])*row[5]);					
							row2[7] = lastDay;
							count = (count + lastDay);	
						}
					}	
                    console.log(row2);					
					
				}else
				{
					row2[7] = Math.floor(row2[4]/8);					
					lastDay = row2[7];
					count = (count + row2[7]);	
					
				}	
				objNewData.push(row2);
				
			}				
		}	
	
	}	
	
   	let buffer = xlsx.build([{name: "sheel", data: objNewData}]);
	fs.writeFileSync("public/HTML5/execl/huyang/13.xlsx", buffer, 'binary');
	
}

/**
对比差异(项目和财务统计)20150721
*/
function createExeclCompare(obj,index){
	let projArray = statCustMounts(obj[index].data);
	let tip = "共对比项目人员"+(projArray.length?projArray.length:0)+"名<br>";
	let newIndex = ++index;
	let temp0 = obj[newIndex].data;
	for(let i=0;i<projArray.length;i++)
	{
		let temp = projArray[i];		
		for(let j=1;j<(temp0.length-1);j++)//第一行和最后一行不计算
		{
			let temp1 = temp0[j];
			if(temp.name == temp1[0])//判断姓名如果一样，则开始匹配
			{
				for(let m=1;m<temp1.length;m++)
				{
					if((m+1)%2 ==0)//双列
					{
						if(trim(temp1[m]) == "")
						{
							continue;
						}	
						if(temp[trim(temp1[m])])//当前项目编号在项目那边存在
						{
							if(temp[trim(temp1[m])] > temp1[(m+1)])
							{
								tip += temp.name+"的项目编号：【"+trim(temp1[m])+"】与财务统计不一致(比财务统计多了)<br>";
							}else if(temp[trim(temp1[m])] < temp1[(m+1)])
							{
								tip += temp.name+"的项目编号：【"+trim(temp1[m])+"】与财务统计不一致(比财务统计少了)<br>";
							}	
						}else
						{
							
							tip += temp.name+"的项目编号【"+trim(temp1[m])+"】的在项目统计里面不存在<br>";
						}	
					}	

				}
			}
		}	
	}	
	
	return tip;
	
	
}


/**
统计写入到文件
*/
function createExeclCompare3(obj1,obj2){
	let objData1 = obj1.data;
	let objData2 = obj2.data;
	let objNewData = [["员工编号","员工名称","项目编码","项目名称","工时","天数"]];
	let count = 0;
	let lastDay = 0;
	let rowa = null;

	
	//统计总工时
	let obj = {};
	for(let a=1;a<objData2.length;a++)
	{
		let temp = objData2[a];
	    obj[temp[0]+temp[5]] = obj[temp[0]+temp[5]]?(obj[temp[0]+temp[5]]+temp[4]):temp[4];
	}	
	
	
	//统计
	for(let i=1 ;i<objData1.length;i++)//第一行是大标题，第二行是小标题，行
	{
		let row = objData1[i];
		count = 0;
		lastDay = 0;
		rowa = row;
	    for(let j=1;j<objData2.length;j++)
		{
			let row2 = objData2[j]
			
			if(row[1] == row2[0] && row[3] == row2[5])//同一个人且日期相同
			{			
				if(i<objData2.length-1)//不是最后一条数据
				{				    
					
					let nextData = objData2[j+1];//取后面一条数据
					if(!nextData){						
						row2[7] = (row[5]- count);						
					}else
					{	
						if(row[1] != nextData[0] || (row[1] == nextData[0] &&row[3] != nextData[5]))//下一条数据如果不等，那么这条就表示结束
						{
							console.log("总："+row[5]+"前面统计"+count)
							row2[7] = (row[5]- count);
						}else
						{
							lastDay = Math.ceil((row2[4]/obj[row[1]+row2[5]])*row[5]);					
							row2[7] = lastDay;
							count = (count + lastDay);	
						}
					}	
                    console.log(row2);					
					
				}else
				{
					row2[7] = Math.floor(row2[4]/8);					
					lastDay = row2[7];
					count = (count + row2[7]);	
					
				}	
				objNewData.push(row2);
				
			}				
		}	
	
	}	
	
   	let buffer = xlsx.build([{name: "sheel", data: objNewData}]);
	fs.writeFileSync("public/HTML5/execl/huyang/13.xlsx", buffer, 'binary');
	
}

/**
获得区间对应的地区
@data1,要对比的区间数据
@data2,对比数据
*/
function createExeclCompare4(data1,data2){
	console.log(data1);
	console.log('~~~~~~~~~~~~~~~~~~~~~~~~');
	console.log(data2);
	
}

//统计项目那边人员对应项目的数量
function statCustMounts(obj){
	let projArray = [];
	let projStat = {};
	for(let i=1;i<obj.length;i++)//第一行不解释
	{
		let temp = obj[i];
	   if(i==1 || trim(temp[0]) !=projArray[projArray.length-1].name)//判断是不是新的一个人员,和前一个比较
	   {
			let projStat = {};
			projStat.name = temp[0];//姓名
			if(trim(temp[2]))//存在项目
			{
			   projStat[temp[2]]?projStat[temp[2]]++:projStat[temp[2]]=1;//项目名称
			}
			
			projArray.push(projStat);
	   }else	   
	   {
		   if(trim(temp[2]))//存在项目
			{
				projArray[projArray.length-1][temp[2]]?projArray[projArray.length-1][temp[2]]++:projArray[projArray.length-1][temp[2]]=1;//项目名称
			}
		       
	   }

	  
	}
	return projArray;
}


function createExecl(obj){
	  //文档sheetName
	let  sheetname = obj.name;
	  
	  //列数据（人员，项目名称，合计天数）
	let column = [];
    //先统计项目总数
    let data = (obj.data);
    //只取前多少列数据
    let beforeFlag = 0;//每个月工作的时间不是一样的
    let titleRow = data[0];//标题行(第一行)
    beforeFlag = titleRow.length; 
 
 
    let sheetArray = [];
	//第一行是标题去掉
    for(let i=1;i<data.length;i++){
   	    let item = data[i];
   	    let itemObj = {};
   	    itemObj["name"] = item[1];
   	    itemObj["card"] = item[2];
   	    itemObj["depet"] = item[3];
   	 	for(let j =4;j<beforeFlag;j++)
   	 	{   	 		
   	 		
   	 		let itemStr =trim(item[j]);
   	 		//统计项目标题
   	 		if(itemStr!=null && itemStr!="" && itemStr.length>0)
   	 		{   	 		
   	 			if(column.length == 0 || !contains(column,item[j]))
   	 			{
   	 					column.push(item[j])
   	 					itemObj[item[j]] = 1;
   	 			}else
   	 			{   	 				  
   	 			    itemObj[item[j]]?itemObj[item[j]]++:itemObj[item[j]]=1;
   	 			}	
   	 				
   	 		}
   	 	}
   	 	sheetArray.push(itemObj);
   	} 
   
   	let dataResult = [["人员","身份证号码","部门","合计","","小计","","小计","","小计","","小计","","小计","","小计"]];
   	if(sheetArray.length>0)	{
   	 	for(let i=0;i<sheetArray.length;i++)
   	 	{
   	 	 	
   	 	    let obj = sheetArray[i];
   	 	 	let sum = 0;
   	 	 	let temp = [];
   	 	 	for(let key in obj)
   	 	 	{
   	 	 		if(key == "name")
   	 	 		{
   	 	 			temp.push(obj[key]);
   	 	 		}else if(key == "card")
   	 	 		{
   	 	 			temp.push(obj[key]);
   	 	 		}else if(key == "depet")
   	 	 		{
   	 	 			temp.push(obj[key]);
   	 	 		}   	 	 		
   	 	 		else
   	 	 		{
   	 	 			temp.push(key);
   	 	 			temp.push(obj[key]);
   	 	 			sum += obj[key];
   	 	 		}	
   	 	 		
   	 	 	}
   	 	 	temp.splice(3, 0, sum)
   	 	 	dataResult.push(temp);
   	 	 }
   	}
   	 
	let buffer = xlsx.build([{name: sheetname, data: dataResult}]);
	fs.writeFileSync("public/HTML5/execl/"+sheetname+'.xlsx', buffer, 'binary');
}



function createExecl1(obj){
	//文档sheetName
	let  sheetname = obj.name;	  
	//列数据（人员，项目名称，合计天数）
	let column = [];
    //先统计项目总数
    let data = (obj.data);
    //只取前多少列数据
    let beforeFlag = 0;//每个月工作的时间不是一样的
    let titleRow = data[0];//标题行(第一行)
    if(titleRow)
    {
   	    beforeFlag = titleRow.length -2;//当前月份自然月
    }else
    {
   		beforeFlag = 35;//最大31天+前4个
    }	
     
    let dataResult = [["日期（月初到月末每一天一行）","员工编号*","项目代码*"]];

    for(let i=1;i<data.length;i++)//第一行是标题去掉
    {           
   	    let obj = data[i];
		for(let j=2;j<titleRow.length;j++)
		{
			let temp = [];       
			let date = new Date(1900, 0, titleRow[j] - 1);
			 temp.push(moment(date).format('YYYY/MM/DD'));//日期
			 temp.push(obj[0]);//姓名
			 temp.push(obj[j]);//项目编号
			 dataResult.push(temp);
			 
		} 
 
    };
   
	let buffer = xlsx.build([{name: sheetname, data: dataResult}]);
	fs.writeFileSync("public/HTML5/execl/beili/"+sheetname+'.xlsx', buffer, 'binary');
}

function createExecl(obj){
	   
	//文档sheetName
	let  sheetname = obj.name;
	  
    //列数据（人员，项目名称，合计天数）
	let column = [];
    //先统计项目总数
    let data = (obj.data);
    //只取前多少列数据
    let beforeFlag = 0;//每个月工作的时间不是一样的
    let titleRow = data[0];//标题行(第一行)
    beforeFlag = titleRow.length;
     
    let sheetArray = [];
	//第一行是标题去掉
    for(let i=1;i<data.length;i++){
   	    let item = data[i];
   	    let itemObj = {};
		itemObj["name"] = item[1];
		itemObj["card"] = item[2];
		itemObj["depet"] = item[3];
   	 	for(let j =4;j<beforeFlag;j++)
   	 	{   	 		
   	 		
   	 		let itemStr =trim(item[j]);
   	 		//统计项目标题
   	 		if(itemStr!=null && itemStr!="" && itemStr.length>0)
   	 		{   	 		
   	 			if(column.length == 0 || !contains(column,item[j]))
   	 			{
   	 					column.push(item[j])
   	 					itemObj[item[j]] = 1;
   	 			}else
   	 			{   	 				  
   	 			    itemObj[item[j]]?itemObj[item[j]]++:itemObj[item[j]]=1;
   	 			}	
   	 				
   	 		}
   	 	}
   	 	sheetArray.push(itemObj);
   	}   
   	 
   	//生成execl需要的数据
   	let dataResult = [["人员","身份证号码","部门","合计","","小计","","小计","","小计","","小计","","小计","","小计"]];
   	if(sheetArray.length>0){
		for(let i=0;i<sheetArray.length;i++)
		{
			
			let obj = sheetArray[i];
			let sum = 0;
			let temp = [];
			for(let key in obj)
			{
				if(key == "name")
				{
					temp.push(obj[key]);
				}else if(key == "card")
				{
					temp.push(obj[key]);
				}else if(key == "depet")
				{
					temp.push(obj[key]);
				}   	 	 		
				else
				{
					temp.push(key);
					temp.push(obj[key]);
					sum += obj[key];
				}	
				
			}
			temp.splice(3, 0, sum)
			dataResult.push(temp);
		}
   	}
}


function createExecl5(obj){
	//文档sheetName
    let  sheetname = obj.name;  
    //先统计项目总数
    let data = (obj.data);  
 
    let dataResult = [["项目代码*","天数"]];
    let result = {};//结果集
    for(let i=2;i<data.length;i++)//前2行不要
    {           
		let obj = data[i];//每一行数据
		let code = obj[3];
		if(code)//项目代码*
		{		
			result[code]?result[code]++:result[code]=1;
		} 
    }
   
    for(let key in result)
    {
	    let temp = [];
	    temp.push(key);
	    temp.push(result[key]);
	    dataResult.push(temp);
    }	   
      
	let buffer = xlsx.build([{name: sheetname, data: dataResult}]);
	fs.writeFileSync("public/HTML5/execl/huyang/"+sheetname+'.xlsx', buffer, 'binary');
}



//判断数组里面是否包含
function contains(a, obj) { 
    let i = a.length; 
    while (i--) { 
		if (a[i] === obj) { 
		  return true; 
		} 
    } 
    return false; 
}

//去左右空格;
function trim(s){
	if(s!=null && s!="" && s != undefined)
	{
		return s.replace(/(^\s*)|(\s*$)/g, "");
		 	 
	}else
	{
	  	return "";
	}	
    
}


let function000006 = {
	"execute":execute	
};

module.exports = function000006;