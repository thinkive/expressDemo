"use strict"
let config = {}
//所有返回的错误功能号需要在此配置
config.errno0000 = "-0000";//请求数据接口servlet/json，没有带funcNo参数
config.errno0001 = "-0001";//ajax请求超时
config.errno0002 = "-0002";//用户未登录
config.errno0003 = "-0003";//当拦截不通过，返回的默认功能号
config.errno0004 = "-0004";//入参字段不允许为空
config.errno0006 = "-0006";//查询失败
config.errno0007 = "-0007";//功能号未定义
config.errno0008 = "-0008";//授权失败
config.errno0009 = "-0009";//未注册平台信息appid
module.exports = config;
