"use strict"
let logger = require('../logger/log.js').logger("oaserviceTest");
let moment = require('moment');  
let baseService = require('./baseService');
class oaserviceTest extends baseService{
	constructor() {
    	//直接调用父类构造器进行初始化
        super();
    }
	equipmentList(param,callback){
		let sql = "select sum(tswsd_worktime) as sum from TSWSD where  tswsd_prjid = ("+
				  "SELECT pmproject_prjid from pmproject where pmproject_code in("+
				  "'"+param[0]+"')"+
				")";		  
		try{			
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败'+err);
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				sql += " and  (tswsd_workdate >= '"+moment(param[1]).format('YYYY-MM-DD HH:mm:ss')+"' and tswsd_workdate <= '"+moment(param[2]).format('YYYY-MM-DD HH:mm:ss')+"')";
				connection.query(sql,param,function(err,result){
					if(err) {
						connection.destroy();
						logger.error("query Error: "+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					
					//打包出参数
					let results = [];
					for(let i=0;i<result.length;i++)
					{
						results.push(result[i]['sum']);
					}	
					connection.release(); //一定要释放
					callback(results);
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00002','数据库连接失败'+err);
		}
   }
}	
let oaservice = new oaserviceTest();
module.exports = oaservice;