/**
思迪内部系统数据库服务层
*/
"use strict"
let logger = require('../logger/log.js').logger("oaserviceInner");
let sqlClient = require('../config/sqlclient');//mysql
let moment = require('moment');  
let baseService = require('./baseService');

class oaserviceInner extends baseService{
	constructor() {
    	//直接调用父类构造器进行初始化
        super();
    }
	getUserPsw(callback){
		let sql = "select SSUSER_USERID,SSUSER_EMPID,SSUSER_PWD from SSUSER";	  
		try{			
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败'+err);
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,function(err,result){
					if(err) {
						connection.destroy();
						logger.error("query Error: "+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					this.insertUserPsw(result,callback);
					connection.release(); //一定要释放
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败');
		}

	}

	insertUserPsw(results,callback){
		if(results && results.length >0 ){
			let sql = 'INSERT INTO HREMP(HREMP_USERID,HREMP_EMPID,HREMP_PWD) VALUES';	  
			
			for(let i = 0;i < results.length;i++)
			{
				sql += "('"+results[i]['SSUSER_USERID']+"','"+results[i]['SSUSER_EMPID']+"','"+results[i]['SSUSER_PWD']+"'),"
			}	
			sql = sql.substring(0,sql.length-1);
			sql += ' ON DUPLICATE KEY UPDATE HREMP_PWD=VALUES(HREMP_PWD);';			
			try{			
				this.getMysqlClient(0).getConnection(function(err, connection) {
					if(!connection)
					{
						logger.error('数据库连接失败'+err);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					connection.query(sql,function(err,result){
						if(err) {
							connection.destroy();
							logger.error("query Error: "+ sql +err.message);
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

	getUserInfo(callback){		
		let sql = "select HREMP_EMPID,HREMP_NAME,HREMP_GENDER,HREMP_IDCARD,HREMP_STATUS,HREMP_EMAIL,HREMP_ADDRH1,HREMP_ORG,HREMP_FAXNOC from HREMP";	  
		try{			
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败'+err);
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,function(err,result){
					if(err) {
						connection.destroy();
						logger.error("query Error: "+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					this.insertUserInfo(result,callback);
					connection.release(); //一定要释放
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败'+err);
		}

	}

	insertUserInfo(results,callback){
		if(results && results.length >0 ){
			let sql = 'INSERT INTO HREMP(HREMP_EMPID,HREMP_NAME,HREMP_GENDER,HREMP_IDCARD,HREMP_STATUS,HREMP_EMAIL,HREMP_ADDRH1,HREMP_ORG,HREMP_FAXNOC) VALUES';	  
			
			for(let i = 0;i < results.length;i++)
			{
				sql += "('"+results[i]['HREMP_EMPID']+"','"+results[i]['HREMP_NAME']+"','"+results[i]['HREMP_GENDER']+"','"+
				results[i]['HREMP_IDCARD']+"','"+results[i]['HREMP_STATUS']+"','"+results[i]['HREMP_EMAIL']+"','"+
				results[i]['HREMP_ADDRH1']+"','"+results[i]['HREMP_ORG']+"','"+results[i]['HREMP_FAXNOC']+"'),"
			}	
			sql = sql.substring(0,sql.length-1);
			sql += ' ON DUPLICATE KEY UPDATE HREMP_NAME=VALUES(HREMP_NAME),HREMP_GENDER=VALUES(HREMP_GENDER),HREMP_IDCARD=VALUES(HREMP_IDCARD),HREMP_STATUS=VALUES(HREMP_STATUS),HREMP_EMAIL=VALUES(HREMP_EMAIL),HREMP_ADDRH1=VALUES(HREMP_ADDRH1),HREMP_ORG=VALUES(HREMP_ORG),HREMP_FAXNOC=VALUES(HREMP_FAXNOC)';
			try{			
				this.getMysqlClient(0).getConnection(function(err, connection) {
					if(!connection)
					{
						logger.error('数据库连接失败'+err);
                        //抛出异常
						throw this.exception('000001','数据库连接失败'+err)
						return;
					}
					connection.query(sql,function(err,result){
						if(err) {
							connection.destroy();
							logger.error("query Error: "+ sql +err.message);
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

	test(callback){
		let sql = "select HREMP_EMPID,HREMP_NAME,HREMP_GENDER,HREMP_IDCARD,HREMP_STATUS,HREMP_EMAIL,HREMP_ADDRH1,HREMP_ORG,HREMP_FAXNOC from HREMP";	  
		try{
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败'+err);
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,function(err,result){
					if(err) {
						connection.destroy();
						logger.error("query Error: "+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					callback(result);
					connection.release(); //一定要释放
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00002','数据库连接失败');
		}

	}
	//  诺明系统ESS 用户校验
	norUserLogin(params,callback){
		let sql = "select a.asorg_orgname,h.hremp_empid,hremp_name,hremp_gender,hremp_faxnoc	from hremp h ,asorg  a where HREMP_EMPID  in (select SSUSER_EMPID from SSUSER where SSUSER_USERID=? and SSUSER_PWD= ?) and HREMP_ORG = ASORG_ORGID";	  
		try{			
			this.getMysqlClient(1).getConnection(function(err, connection) {
				if(!connection)
				{
					logger.error('数据库连接失败'+err);
					throw this.exception('00001','数据库连接失败'+err);
					return;
				}
				connection.query(sql,params,function(err,result){
					if(err) {
						connection.destroy();
						logger.error("query Error: "+ sql +err.message);
						throw this.exception('00001','数据库连接失败'+err);
						return;
					}
					callback(result);
					connection.release(); //一定要释放
				}); 
			});
		}catch(e){
			logger.error(e.message);
			throw this.exception('00001','数据库连接失败');
		}

	}
}

let oaservice = new oaserviceInner();
module.exports = oaservice;