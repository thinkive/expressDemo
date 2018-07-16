"use strict"
let logger = require('../logger/log.js').logger('oaservice');
let sqlclient = require('../config/sqlclient');//mysql
let baseFunction = require('../function/baseFunction');
let moment = require('moment');  
let uuid = require('node-uuid'); //uuid.v1() v1 是基于时间戳生成uuid v4是随机生成uuid
let baseService = require('./baseService');
 class oaservice extends baseService{
	constructor() {
    	//直接调用父类构造器进行初始化
        super();
    }
	equipmentList(param,callback){
		let sql = "select e.EQUIPMENT_DESC ,e.EQUIPMENT_UNITCOST ,e.EQUIPMENT_STOCKQTY ,h.HREMP_NAME from EQUIPMENT e , hremp h where h.HREMP_EMPID = e.EQUIPMENT_RESPONSIBILITY ";
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
			   if(param.equipmentType == '0')//测试手机
			   {
				   sql +=  "  and e.EQUIPMENT_CATEGORY  in ('FMOU1','FMOU2')";
			   }else if(param.equipmentType == '1')//笔记本
			   {
				   sql +=  "  and e.EQUIPMENT_CATEGORY  in ('CNB')";
			   }else if(param.equipmentType == '2')//显示器,内存条
			   {
				   sql +=  "  and e.EQUIPMENT_CATEGORY  in ('FMOU')";
			   }
			   
			   if(param.type == '0' && param.content)//按照名字
			   {
				 sql +=  "and h.HREMP_NAME="+connection.escape(param.content);
			   }else if(param.type == '1' && param.content)//按照描述
			   {
				 sql +=  "and e.EQUIPMENT_DESC like "+connection.escape('%'+param.content+'%');
			   }else if(param.type == '2' && param.content)//按照名字和描述
			   {
				 sql +=  "and (e.EQUIPMENT_DESC like "+connection.escape('%'+param.content+'%') + ' || h.HREMP_NAME like '+connection.escape('%'+param.content+'%')+')';
			   }
			  
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					
					//打包出参数
					let results = [];
					for(let i=0;i<result.length;i++)
					{
						let obj = {};
						obj.equipmentDesc = result[i]['EQUIPMENT_DESC'];//描述
						obj.name = result[i]['HREMP_NAME'];//设备持有人
						obj.price = result[i]['EQUIPMENT_UNITCOST'];//设备实际价格
						obj.mounts = result[i]['EQUIPMENT_STOCKQTY'];//设备数量
						results.push(obj);
					}						
					connection.release(); //一定要释放
					callback(results);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
	}
	getProjectComDate(param,title,callback){
		let sql = 'select t.tswsd_worktime,t.tswsd_workdate,p.pmproject_code from tswsd t,pmproject p where p.pmproject_prjid=t.tswsd_prjid and ';  
			try{
				let getMysql = null;
				if(title == '2015')
				{
					getMysql =this.getMysqlClient(1);//生产环境
				}else
				{
					getMysql = this.getMysqlClient(2);//测试环境已过账
					sql = 'select t.tswsd2_worktime,t.tswsd2_workdate,p.pmproject_code from tswsd2 t,pmproject p where p.pmproject_prjid=t.tswsd2_prjid and ';  
				}			
				getMysql.getConnection(function(err, connection) {
					if(!connection)
					{
						logger.error('数据库连接失败');
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}	   
					if(title == '2015') {
					   sql += 'p.pmproject_code='+connection.escape(param[0])+ ' and t.tswsd_workdate >= '+connection.escape(moment(param[2]).format('YYYY-MM-DD')+' 00:00:00')+ 'and t.tswsd_workdate <= '+connection.escape(moment(param[11]).format('YYYY-MM-DD')+' 00:00:00')+ ' and t.tswsd_worktime >0'  +'  order by t.TSWSD_WORKDATE';
					} else {
					   sql += 'p.pmproject_code='+connection.escape(param[0])+ ' and t.tswsd2_workdate >= '+connection.escape(moment(param[2]).format('YYYY-MM-DD')+' 00:00:00')+ 'and t.tswsd2_workdate <= '+connection.escape(moment(param[11]).format('YYYY-MM-DD')+' 00:00:00')+ ' and t.tswsd2_worktime >0'  +'  order by t.TSWSD2_WORKDATE';	
					}
					console.log(sql)
					connection.query(sql,param,function(err,result){
						if(err) {
							connection.destroy();
							logger.error('query Error: '+ sql +err.message);
							throw this.exception('00001','数据库连接失败'+err);
							return;
						}		
						let temp = [];	//param[3],5,7,9
						let workTime = 0;	
						let flag0= false;				
						let flag= false;
						let flag1 = false;
						let flag2 = false;
						let flag3 = false;
						if(param[0] == 'WZ-WHZC-GC-HN2-2015228')
						{
							console.log('长度:'+result.length);
						}	
						temp[0] = param[0];
						for(let i=0;i<result.length;i++)
						{	
							let obj = result[i];		
							if(title == '2015') {
							   workTime += obj.tswsd_worktime;
							}else {
								 workTime += obj.tswsd2_worktime;
							}
							if(i == 0) {
									if(title == '2015') {
										temp[1] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[1] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
							}

							if(workTime<param[3]) //开始日期
							{
								if(!flag0)
								{ 
							        if(title == '2015') {
										temp[1] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[1] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
								}	
								flag0 = true
							}	
							else if(workTime>=param[3] && (param[5]?workTime<param[5]:true))//30%
							{
								if(!flag)
								{
								    if(title == '2015') {
										temp[2] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[2] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
								}	
								flag = true
								
							}else if(workTime>=param[5] && (param[7]?workTime<param[7]:true))
							{				
								if(!flag1)
								{
								    if(title == '2015') {
										temp[3] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[3] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}				
								}			
                                  flag1 = true								
							}else if(workTime>=param[7] && (param[9]?workTime<param[9]:true))
							{
								if(!flag2)
								{
								    if(title == '2015') {
										temp[4] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[4] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
								}	
								                                  flag2 = true		
							}else if(workTime>=param[9])
							{
								if(!flag3)
								{
									if(title == '2015') {
										temp[5] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[5] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
								}	
								flag3 = true		
								
							}	
							
							if(i == (result.length-1)) {
									if(title == '2015') {
										temp[7] =(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
									} else {
										temp[7] =(moment(obj.tswsd2_workdate).format('YYYY-MM-DD HH:mm:ss'));
									}
							}
							
						}	
						if(temp.length < 2)
						{
							temp.push('系统所有工时都小于30%')
						}	
						connection.release(); //一定要释放
						callback(temp);
					}); 
				});
			}catch(e){
				logger.error(e.message);
				throw this.exception('00001','数据库连接失败'+err);
			}


	}
	getProjectStartComDate(param,title,callback){
		let sql = 'select t.tswsd_worktime,t.tswsd_workdate,p.pmproject_code from tswsd t,pmproject p where p.pmproject_prjid=t.tswsd_prjid and ';  
		try{
			let getMysql = null;
			if(title == '2015')
			{
				getMysql = this.getMysqlClient(1);//生产环境
			}else
			{
				getMysql = this.getMysqlClient(2);//测试环境
			}			
			getMysql.getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}	   
				sql += 'p.pmproject_code='+connection.escape(param[0])+ '  order by t.TSWSD_WORKDATE';
				   
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}		
					let temp = [];	
					let workTime = 0;	
					let flag1 = false;
					let flag2 = false;
					for(let i=0;i<result.length;i++)
					{	
						let obj = result[i];		
						workTime += obj.tswsd_worktime;
						if(i==0)
						{
							temp.push(obj.pmproject_code);
						}	
						if(!flag1 && param[1] && workTime>=param[1])
						{
							
							temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));	
							flag1 = true;						
						}
						if(!flag2 && param[2] && workTime>=param[2])
						{
							temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));	
							flag2 = true;	
							break;						
						}   
						if(i == result.length-1)//最后一条数据
						{
							if(temp.length == 1)
							{	
								temp.push('');
								temp.push('');
								temp.push('所有工时总和小于待比较上线工时')
							}	
							if(temp.length == 2)
							{	
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD HH:mm:ss'));
								temp.push('所有工时总和未等于(不会超过)待比较验收工时')
							}						
						}
						
						
					}	
					connection.release(); //一定要释放
					callback(temp);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
	}
	getProjectByEndComDate(param,title,callback){
		let sql = 'select t.tswsd_worktime,t.tswsd_workdate,p.pmproject_code from tswsd t,pmproject p where p.pmproject_prjid=t.tswsd_prjid and ';  
		try{
			let getMysql = null;
			if(title == '2015')
			{
				getMysql = this.getMysqlClient(1);//生产环境
			}else
			{
				getMysql = this.getMysqlClient(2);//测试环境
			}			
			getMysql.getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('000001','数据库连接失败'+err)
					return;
				}	   
				sql += 'p.pmproject_code='+connection.escape(param[0])+ '  order by t.TSWSD_WORKDATE';
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}		
					let temp = [];	
					let workTime = 0;	
					let	dates = 0;			
					for(let i=0;i<result.length;i++)
					{	
						let obj = result[i];		
						workTime = moment(obj.tswsd_workdate).format('YYYY-MM-DD');
						if(i==0)
						{
							temp.push(obj.pmproject_code);
						}	
						if(workTime.indexOf(title)>=0)//同年
						{
							dates = workTime;					
						} 					
						
					}	
					temp.push(dates);
					connection.release(); //一定要释放
					callback(temp);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('000001','数据库连接失败'+err)
		}
}
	getProjectByEndComDateAll(param,title,rank,callback){
		let sql = 'select t.tswsd_worktime,p.pmproject_code ,t.tswsd_workdate from tswsd t,pmproject p where p.pmproject_prjid=t.tswsd_prjid and  p.TSWSD_WORKtime >0 and ';  
		try{
			let getMysql = null;
			if(title.indexOf('2015')==0)
			{
				getMysql = this.getMysqlClient(1);//生产环境
			}else
			{
				getMysql = this.getMysqlClient(2);//测试环境
			}			
			getMysql.getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}	   
				sql += '  p.pmproject_code='+connection.escape(param[0])+ '  order by t.TSWSD_WORKDATE ';		
				
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}		
					let temp = [];	
					let workTime = 0;	
					let flag1 = false;
					let flag2 = false;
					let flag3 = false;
					let flag4 = false;
					if(!result || result.length == 0 )
					{
						temp.push(param[0]);//项目代码
						temp.push(param[1]);//项目名称
						temp.push('');//总工时
						temp.push('');//需求
						temp.push('');//需求总工时
						temp.push('');//开发
						temp.push('');//开发总工时
						temp.push('');//测试
						temp.push('');//测试总工时
						temp.push('');//上线
						temp.push('');//上线总工时
						temp.push('');//验收
						temp.push('');//验收总工时
					}else	
					{
						for(let i=0;i<result.length;i++)
						{	
							let obj = result[i];		
							workTime += obj.tswsd_worktime;
							if(i==0)//开始填写日期
							{
								temp.push(obj.pmproject_code);
								temp.push(param[1]);
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));
								temp.push(param[2]);
							}	
							if(!flag1 && param[4] && workTime>=param[4])//需求
							{
								
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));
								temp.push(param[4]);							
								flag1 = true;						
							}
							if(!flag2 && param[6] && workTime>=param[6])//开发
							{
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));	
								temp.push(param[6]);
								flag2 = true;										
							} 
							if(!flag3 && param[8] && workTime>=param[8])//测试
							{
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));
								temp.push(param[8]);							
								flag3 = true;										
							}   
							if(!flag4 && param[10] && workTime>=param[10])//上线
							{
								temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));
								temp.push(param[10]);							
								flag4 = true;	
							}   						
							if(i == result.length-1)//最后填写日期
							{				
								if(temp.length == 4)
								{	
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));
									temp.push(param[2]);	
								}	
								if(temp.length == 6)
								{	
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');		
									temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));	
									temp.push(param[2]);								
								}	
								if(temp.length == 8)
								{	
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push('');
									temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));								
									temp.push(param[2]);
								}
								if(temp.length == 10)
								{	
									temp.push('');
									temp.push('');
									temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));								
									temp.push(param[2]);
								}
								if(temp.length == 12)
								{	
									temp.push(moment(obj.tswsd_workdate).format('YYYY-MM-DD'));								
									temp.push(param[2]);
								}								
							}					
							
						}
					}							
					connection.release(); //一定要释放
					callback(temp);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}


	}
	getProjectByEndComDateByEmpid(param,title,callback){
		let arr = [param[0]];
		let sql = "SELECT TSWSD_EMPID,HREMP_NAME,TSWSD_WORKDATE,TSWSD_WORKTIME from tswsd left join hremp on HREMP_EMPID =TSWSD_EMPID where TSWSD_PRJID = (select PMPROJECT_PRJID from pmproject where PMPROJECT_CODE=?) and TSWSD_WORKDATE<='2017-12-31' order by TSWSD_WORKDATE";  
		try{
			let getMysql = null;
			if(title == '2015')
			{
				getMysql = this.getMysqlClient(1);//生产环境
			}else
			{
				getMysql = this.getMysqlClient(2);//测试环境
				sql = "SELECT TSWSD2_EMPID,HREMP_NAME,TSWSD2_WORKDATE,TSWSD2_WORKTIME from tswsd2 left join hremp on HREMP_EMPID =TSWSD2_EMPID where TSWSD2_PRJID = (select PMPROJECT_PRJID from pmproject where PMPROJECT_CODE=?) and TSWSD2_WORKDATE<='2016-12-31' and TSWSD2_WORKTIME>0 order by TSWSD2_WORKDATE";  
			}			
			
			getMysql.getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}	   
				console.log(sql)
				connection.query(sql,arr,function(err,result){
					console.log(result)
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}		
					
					let temp = [];	
					let datas = {};	//5个阶段
					let cur = {};//某一个阶段人员统计
					let flag = false;
					let flag1 = false;
					let flag2 = false;
					let flag3 = false;
					let flag4 = false;
					let stepAll = 0;
					//整理统计数据				
					
					for(let i=0;i<result.length;i++){	
						let obj = result[i];
						let workDate = ''
						
						if(title == '2015') {		
							workDate = moment(obj['TSWSD_WORKDATE']).format('YYYY-MM-DD');		
						} else {
							workDate = moment(obj['TSWSD2_WORKDATE']).format('YYYY-MM-DD');		
						}							
						//计算阶段
						if(workDate>=param[2] && workDate<=param[4])//需求阶段
						{		
							if(!flag)
							{
								cur = {};
								flag = true;
								stepAll = 0;
							}					
							if(title == '2015') {							
							    cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD_WORKTIME']):(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD_WORKTIME']);
							    stepAll += obj['TSWSD_WORKTIME'];
							} else {
							    cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD2_WORKTIME']):(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD2_WORKTIME']);
							    stepAll += obj['TSWSD2_WORKTIME'];								
							}
						}else if(workDate>param[4] && workDate<=param[6])//开发阶段
						{					
							if(!flag1)
							{
								cur.total = stepAll;
								datas['step1'] = cur;
								flag1 = true;
								cur = {};
								stepAll = 0;
							} 
							if(title == '2015') {									
									cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD_WORKTIME']):(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD_WORKTIME']);
									stepAll += obj['TSWSD_WORKTIME'];
							} else {
									cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD2_WORKTIME']):(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD2_WORKTIME']);
									stepAll += obj['TSWSD2_WORKTIME'];								
							}
						}else if(workDate>param[6] && workDate<=param[8])//测试阶段
						{		
							if(!flag2)
							{
								cur.total = stepAll;
								datas['step2'] = cur;
								flag2 = true;
								cur = {};
								stepAll = 0;
							}			
                            if(title == '2015') {								
							   cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD_WORKTIME']):(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD_WORKTIME']);
							   stepAll += obj['TSWSD_WORKTIME'];
							}else {
							   cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD2_WORKTIME']):(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD2_WORKTIME']);
							   stepAll += obj['TSWSD2_WORKTIME'];								
							}
						}else if(workDate>param[8] && workDate<=param[10])//上线阶段
						{						
							if(!flag3)
							{
								cur.total = stepAll;
								datas['step3'] = cur;
								flag3 = true;
								cur = {};
								stepAll = 0;
							}
							if(title == '2015') {	
							   cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD_WORKTIME']):(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD_WORKTIME']);
							   stepAll += obj['TSWSD_WORKTIME'];
							} else {
							   cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD2_WORKTIME']):(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD2_WORKTIME']);
							   stepAll += obj['TSWSD2_WORKTIME'];								
							}
						}else if(workDate>param[10] && workDate<=param[12])//验收阶段
						{
							if(!flag4)
							{
								cur.total = stepAll;
								datas['step4'] = cur;							
								flag4 = true;
								cur = {};
								stepAll = 0;
							}			
                           if(title == '2015') {								
							cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD_WORKTIME']):(cur[obj['TSWSD_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD_WORKTIME']);
							stepAll += obj['TSWSD_WORKTIME'];
						   }else {
							cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]?(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']] = cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]+obj['TSWSD2_WORKTIME']):(cur[obj['TSWSD2_EMPID']+':'+obj['HREMP_NAME']]=obj['TSWSD2_WORKTIME']);
							stepAll += obj['TSWSD2_WORKTIME'];							   
						   }
						}				
						
					}	
					cur.total = stepAll;
					datas['step5'] = cur;
					cur = null;
					//处理打包数据
					for (let key1 in datas){
						for(let key in datas[key1])
						{
							if(key == 'total'){
								continue;
							}
							let test = [];
							test.push(param[0]);
							test.push(param[1]);
							test.push(param[3]);
							if(key1 == 'step1')//需求阶段
							{
								test.push("需求阶段");
								test.push(param[2]);
								test.push(param[4]);
								test.push(param[5]);								
								
							}else if(key1 == 'step2')//开发阶段
							{
								test.push("开发阶段");
								test.push(param[4]);
								test.push(param[6]);
								test.push(param[7]);	
							}else if(key1 == 'step3')//测试阶段
							{
								test.push("测试阶段");
								test.push(param[6]);
								test.push(param[8]);
								test.push(param[9]);	
							   
							}else if(key1 == 'step4')//上线阶段
							{
								test.push("上线阶段");
								test.push(param[8]);
								test.push(param[10]);
								test.push(param[11]);	
							   
							}else if(key1 == 'step5')//验收阶段
							{
								test.push("验收阶段")
								test.push(param[10]);
								test.push(param[12]);
								test.push(param[13]);								
								
							}						
							test.push(datas[key1].total);
							let arrs = key.split(":");						
							test.push(arrs[0]);
							test.push(arrs[1]);
							test.push(datas[key1][key]);
							temp.push(test);
						}					
					}
					connection.release(); //一定要释放
					callback(temp);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
    }
	userAuth(param,callback){
		let sql = "insert into SSUSERSUB VALUES('"+uuid.v1()+"',"+"'1900-01-01 00:00:00'"+",'',?,?,"+"'2015-11-04 14:20:24'"+","+"'2017-12-30 00:00:00'"+",1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,?,?,0,0,"+"'1900-01-01 00:00:00'"+",?)";	     
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					connection.release(); //一定要释放
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
		
    }
	userDelAuth(param,callback){
		let sql = 'DELETE from SSUSERSUB where  SSUSERSUB_SUBEMPID=?';
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}	
					connection.release(); //一定要释放
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
			
	}
	userWorkTimeUpdate(param,callback){
		let sql = 'update hremp set hremp_normtime=?';
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					connection.release(); 
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
		
    }
	userPositionStatusUpdate(param,callback){
		let sql = '';
		if(param.length == 1)//全部处理
		{
			sql = 'update HREMP set HREMP_STATUS = ?';
		}else{
			sql = 'update HREMP set HREMP_STATUS = ? where HREMP_EMPID = ?';
		}
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);						
						return;
					}
					connection.release(); //一定要释放
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
		
    }	
	getAswfSteplByDate(param,callback){
		let sql = "SELECT ASWFSTEP_DOCID ,ASWFSTEP_SUBMITBY ,HREMP_NAME, ASWFSTEP_STEP ,DATE_FORMAT(ASWFSTEP_DATE,'%Y-%m-%d') as 'ASWFSTEP_DATE'   from ASWFSTEP,hremp ,erexph where EREXPH_EXPID = ASWFSTEP_DOCID and  ASWFSTEP_SUBMITBY=HREMP_EMPID  and EREXPH_DATE >=? and EREXPH_DATE<=?  order by ASWFSTEP_DOCID,DATE_FORMAT(ASWFSTEP_DATE,'%Y-%m-%d'),ASWFSTEP_TIME,ASWFSTEP_ACTION";
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);						
						return;
					}
					connection.release(); //一定要释放
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
		
    }	
	getRqAswfSteplByDate(param,callback){
		let sql = "SELECT OACC_DOCNO,DATE_FORMAT(OACC_REQDATE,'%Y-%m-%d') as 'OACC_REQDATE',ASWFSTEP_SUBMITBY,HREMP_NAME ,aswfstep_action,DATE_FORMAT(ASWFSTEP_DATE,'%Y-%m-%d') as 'ASWFSTEP_DATE' FROM aswfstep,oacc,hremp WHERE ASWFSTEP_DOCID = oacc_uuid and  OACC_REQDATE>=? and OACC_REQDATE<=?  and hremp_empid=ASWFSTEP_SUBMITBY  and ASWFSTEP_BUSID='OAAPP' order by ASWFSTEP_DOCID,ASWFSTEP_DATE,aswfstep_time,ASWFSTEP_ACTION,ASWFSTEP_SUBMITBY";
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败');
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error('query Error: '+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);						
						return;
					}
					connection.release(); //一定要释放
					callback(result);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}
		
    }	
}

let oaservices = new oaservice();
module.exports = oaservices;