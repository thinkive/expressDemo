"use strict"
let logger = require('../logger/log').logger('redisUtils');
let sqlClient = require('../config/sqlclient');
let getRedisClient = (sourceId) => {
	return sqlClient.redisCli(sourceId);
};	

/**会覆盖更新key*/
let set = (key,value,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).set(key,value, function(err, reply){
			if(callback)
			    {
			        callback();
			    }
			});
    }
  });
};

/**
不会覆盖，如果存在不设置，并且返回0
*/
let setnx = (key,value,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).setnx(key,value, function(err, reply){
			if(callback)
			{
			    callback();
			}
		});
    }
  });
};

/**
和set类似，可以指定有效期，单位秒
*/
let setex = (key,value,limit,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).setex(key,limit, value,function(err, reply){
		    if(callback)
			{
			    callback(err, reply);
		    }
		});
    }
  });
};


/**
hash表操作，
*/
let hset = (hash,field,value,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).hset(hash,field,value,function(err, reply){
			if(callback)
				{
					callback();
				}
			});
    }
  });
};

/**
hash表长度
*/
let hlen = (hash,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).hlen(hash,function(err, reply){
			if(callback)
			{
				callback();
			}
		});
    }
  });
};

/**
hash所有的keys
*/
let hkeys = (hash,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).hkeys(hash,function(err, reply){
			if(callback)
			{
				callback();
			}
		});
    }
  });
};

/**
rpush在key对应list的尾部添加字符串元素：
*/
let rpush = (key,value,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).rpush(key,value,function(err, reply){
			if(callback)
			{
				callback();
			}
		});
    }
  });
};


/**
lrem从key对应list中删除count个和value相同的元素。
count=0时，删除全部count>0时，按从头到尾的顺序删除　count<0时，按从尾到头的顺序删除
*/
let lrem = (key,count,value,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).lrem(key,count,value,function(err, reply){
			if(callback)
			{
				callback();
			}
		});
    }
  });
};

/**
ltrim删除数据
*/
let ltrim = (key,from,to,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).ltrim(key,from,to,function(err, reply){
			if(callback)
			{
				callback();
			}
		});
    }
  });
}
/**
返回List里面数据的长度
*/
let llen = (key,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).llen(key,function(err, reply){
		   if(callback)
			{
				callback(reply);
			}
		});
    }
  });
};

/**
根据索引返回List里面数据
*/
let lindex = (key,index,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error(error);
    } else {
		getRedisClient(0).lindex(key,index,function(err, reply){
			  if(callback)
			{
				callback();
			}
		});
    }
  });
};

let get = (key,callback,datasource) => {
	/*getRedisClient(0).on('connect', function(){
    client.get(key, function(err, reply){
        return reply.toString();
    });
	})*/
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error('[redis]获取数据异常：'+error);
    } else {
		getRedisClient(0).get(key, function(err, reply){
			if(callback)
			{
				callback(err,reply);
			}
		});
    }
  });
};

let lrange = (key,from,to,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error('[redis]获取数据异常：'+error);
    } else {
		getRedisClient(0).lrange(key, from,to,function(err, reply){
			if(callback)
			{
				callback(reply);
			}
		});
    }
  });
};
/**
获得key的过期时间
*/
let ttl = (key,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error('[redis]获取数据异常：'+error);
    } else {
		getRedisClient(0).ttl(key,function(err, reply){
			if(callback)
			{
				callback(reply);
			}
		});
    }
  });
};
let zadd = (key,score, member,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
		if(error) {
			logger.error('[redis zadd]获取数据异常：'+error);
		} else {
			getRedisClient(0).zadd(key,score,member,function(err, reply){
				if(callback)
				{
					callback();
				}
			});
		}
  });
};

let zscore = (key,score,callback,datasource) => {
	getRedisClient(0).select(datasource?datasource:'0', function(error){
    if(error) {
        logger.error('[redis zscore]获取数据异常：'+error);
    } else {
		getRedisClient(0).zscore(key,score,function(err, reply){
			if(callback)
			{
				callback(reply);
			}
		});
    }
  });
};

let redisUtils = {
	set:set,
	setnx:setnx,
	setex:setex,
	get:get,
	hset:hset,
	hlen:hlen,
	hkeys:hkeys,
	rpush:rpush,
	lrem:lrem,
	llen:llen,
	lindex:lindex,
	lrange:lrange,
	ltrim:ltrim,
	ttl:ttl,
	zadd:zadd,
	zscore:zscore
	
};
module.exports = redisUtils;
 
