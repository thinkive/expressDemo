"use strict"
let logger = require('../logger/log').logger('wechat');
let config = require('../config/config');
let wx_config = require('../config/wx_config');
let redisUtils = require('../utils/redisUtils');
let dateUtils = require('../utils/dateUtils');
let request = require('request');
let async = require('async');
let fs = require('fs');
let API = require('wechat-api');
let moment = require('moment');  
let weMenu = require('./weMenu');
let wxConfig = require('../config/wx_config');
console.log(1)
//API/主动调用API
let api = new API(wx_config.mp.appid, wx_config.mp.appsecret,function (callback) {
	// 传入一个获取全局token的方法
 console.log(1221) 
	redisUtils.get(wx_config.access_token,function(err,body){
			if (err){
				return callback(err);
			}else
			{
				callback(null, JSON.parse(body));		
			}	  
		});
			
	}, function (token, callback) {
    console.log(2222) 
		// 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
		  redisUtils.set(wx_config.access_token,JSON.stringify(token),function(){
		  callback();
		});//存储在redis数据库
	}
);
//微信登录用户oauth2.0授权
var OAuth = require('wechat-oauth');
var client = new OAuth(wxConfig.wecloudmp.appid,wxConfig.wecloudmp.appsecret);

var WXPay = require('weixin-pay');
//var QRCode = require('qrcode');
//var qr = require('qr-image');
var wxpay = WXPay({
    appid: wx_config.mp.appid,
    mch_id: wx_config.mch_id,
    partner_key: wx_config.partner_key, //微信商户平台API密钥
    pfx: fs.readFileSync(process.cwd()+'/config/apiclient_cert.p12'), //微信商户平台证书
});

/** sessioncu存储在文件里面
let api = new API('appid', 'secret', function (callback) {
  // 传入一个获取全局token的方法
  fs.readFile('access_token.txt', 'utf8', function (err, txt) {
    if (err) {return callback(err);}
    callback(null, JSON.parse(txt));
  });
}, function (token, callback) {
  // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
  // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
  fs.writeFile('access_token.txt', JSON.stringify(token), callback);
});
*/
let list = require('wechat').List;
list.add('mobile', [
  ['回复{0}适合微信版本的UI', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/weui/dist/example/index.html'>微信UI</a>");
  }],
  ['回复{a}查看appframework', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/appframework/index.html'>appframework</a>");
  }],
  ['回复{a0}查看appframework-3.0beta', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/appframework-3.0beta/index.html'>appframework</a>");
  }],
  ['回复{b}查看Framework7', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/Framework7/index.html'>Framework7</a>");
  }],
  ['回复{c}查看Framework7-Plus-dev', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/Framework7-Plus-dev/index.html'>Framework7-Plus-dev</a>");
  }],
  ['回复{d}查看onsenUI', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/onsenUI/demo/index.html'>onsenUI</a>");
  }],
  ['回复{e}查看Jingle', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/Jingle/index.html'>Jingle</a>");
  }],
  ['回复{f}查看GMU', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/GMU-master/examples/index.html'>GMU</a>");
  }],
  ['回复{g}查看agile_lite', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/nandy007-agile-lite/agile-lite/examples/for-browser/agile_lite/index.html'>agile_lite</a>");
  }],
  ['回复{h}查看SUI Mobile', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/SUI-Mobile-dev/index.html'>SUI Mobile</a>");
  }],  
  ['回复{j}查看webank', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/webank/index.html'>webank</a>");
  }],
  ['回复{k}查看Pro-master', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/Pro-master/demo/index.html'>Pro-master</a>");
  }],
  ['回复{l}查看微站-回家', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/slideshow/index.html'>微站-回家</a>");
  }],
  ['回复{m}查看微站-kobe', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/kobe/index.html'>微站-科比</a>");
  }],  
  ['回复{n}查看微站-家和万事兴', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/slide/index.html'>微站-家和万事兴</a>");
  }],
  ['回复{o}查看微站-UEhtml', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/UEhtml/index.html'>微站-UEhtml</a>");
  }],
  ['回复{p}查看微站-UEhtml2', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/UEhtml/zhengwen.html'>微站-UEhtml2</a>");
  }],
  ['回复{q}查看微站-普通网站', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/mobilesite/index.html'>微站-网站2</a>");
  }],     
  ['回复{r}查看微站-酷狗', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/kugou/index.html'>微站-酷狗</a>");
  }],     
  ['回复{s}查看微站-酷站', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/wapsite/index.html'>微站-酷站</a>");
  }],   
  ['回复{t}查看微站-酷站2', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/vivo/index.html'>微站-酷站2</a>");
  }],   
  ['回复{u}查看微站-招聘', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/zhaopin/index.html'>微站-招聘</a>");
  }],   
  ['回复{v}查看微站-商城', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/mall/default.htm'>微站-商城</a>");
  }],  
  ['回复{w}查看微站-车子', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/chezi/index.html'>微站-车子</a>");
  }],    
  ['回复{x}查看91助手H5版本', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/91html5/index.html'>查看91助手H5版本</a>");
  }],         
  ['回复{y}查看国外wap网站', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/guowaiWap/index.html'>国外wap网站</a>");
  }],       
  ['回复{z}查看惠普手机H5介绍', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/hp-h5/index.html'>惠普手机H5介绍</a>");
  }],       
  ['回复{a1}查看android手势解密', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/android-shoushi/index.html'>android手势解密</a>");
  }],       
  ['回复{a2}查看>html5网站', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/html5mobile/index.html'>html5网站</a>");
  }],             
  ['回复{a3}查看>拉勾网旅游', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/lagoulvyou/index.html'>拉勾网旅游</a>");
  }],  
  ['回复{a4}查看>蓝色手机微网站', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/mobileweiwangzhan/index.html'>蓝色手机微网站</a>");
  }],
  ['回复{a5}查看华润万家招聘模板', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/huarunwanjiazhaopin/index.html'>华润万家招聘模板</a>");
  }], 
  ['回复{a6}QQ空间一生有你', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/150325_skinact/index.html'>QQ空间一生有你</a>");
  }],       
  ['回复{a7}拉钩日报', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/overtime/index.html'>拉钩日报</a>");
  }],     
  ['回复{a8}580鞋子', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/trendmap/mobile/index.html'>580鞋子</a>");
  }],
  ['回复{a9}拯救H5页面', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/a20150428report/index.html'>拯救H5页面</a>");
  }],    
  ['回复{b1}应是H5模板', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/xiangyingsmob/index.html'>响应是H5模板</a>");
  }],   
  ['回复{b2}国外黑色H5框架', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/guoaiheiseh5kuagnj/index.html'>国外黑色H5框架</a>");
  }],   
  ['回复{b3}flavr-超级漂亮的jQuery弹出对话框', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/flavr/index.html'>flavr-超级漂亮的jQuery弹出对话框</a>");
  }],    
  ['回复{b4}医院', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/hostday/index.html'>医院</a>");
  }],  
  ['回复{b5}抽奖', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/choujiang/index.html'>抽奖</a>");
  }],    
  ['回复{b6}易达客', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/手机端页面case/index.html'>易达客</a>");
  }],  
  ['回复{b7}IP归属地查询', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/ip查询/index.html'>ip/手机查询</a>");
  }],
  ['回复{b8}渤海银行', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/渤海银行/index.html'>渤海银行</a>");
  }],    
  ['回复{b9}超炫手机webapp', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/secret-project/index.html'>超炫手机webapp</a>");
  }],  
  ['回复{b10}Alert IOS6弹出提示', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/iOS6Alert/index.html'>Alert ios6 弹出提示</a>");
  }],
  ['回复{b11}mobilescoll日期控件', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/mobilescoll/index.html'>mobilescoll</a>");
  }],    
   ['回复{b12} refresher v2.0', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/refresherv2.0/index.html'> refresher v2.0上下拉刷新</a>");
  }],  
    ['回复{b13} 仿ios顶部通知栏', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/仿ios顶部通知栏/banneralert/index.html'>仿ios顶部通知栏</a>");
  }],  
    ['回复{b14} 手机模板', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/手机模板/index.html'>手机模板</a>");
  }],  
    ['回复{b15} 仿鞋派网', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/lightApp/mall/default.htm'>仿鞋派网</a>");
  }],  
    ['回复{exit}退出', function (info,req,res,next) {
		res.nowait('您已经退出了');
  }]
]);
  
list.add('cms', [
  ['回复{a}查看manager管理端', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/manager/index.html'>管理端</a>");
  }],
  ['回复{b}查看音乐模板manager管理端', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/music-manager/index.html'>音乐模板</a>");
  }],
  ['回复{c}查看Amaze', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/Amaze/admin-index.html'>Amaze</a>");
  }],
  ['回复{d}查看ftpm_46', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/ftpm_46/index.html'>ftpm_46</a>");
  }],
  ['回复{e}查看jump', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/jump/index.html'>jump</a>");
  }],
  ['回复{f}查看AmaAdmin', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/AmaAdmin/dashboard.html'>AmaAdmin</a>");
  }],
  ['回复{g}查看ftpm_4', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/ftpm_4/index.html'>ftpm_4</a>");
  }], 
  ['回复{h}查看科技博客', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/kejiboke/index.html'>科技博客</a>");
  }], 
  ['回复{i}查看响应模板', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/Retina_Dashboard/index.html'>响应模板</a>");
  }],     
  ['回复{j}查看angulr', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/angulr/index.html'>angulr</a>");
  }],       
  ['回复{k}查看Apricot', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/Apricot/index.html'>Apricot</a>");
  }],    
  ['回复{l}查看Uimaker_admin', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/cms/Uimaker_admin/index.html'>Uimaker_admin</a>");
  }],   
  ['回复{m}KODExplorer-master', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn:3333/index.php'>KODExplorer-master</a>");
  }],   
  ['回复{exit}退出', function (info,req,res,next) {
		res.nowait('您已经退出了');
  }]
]);  

list.add('qq', [
  ['回复{a}账号资料卡特权PK', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/pk/pk.html'>账号资料卡特权PK</a>");
  }], 
  ['回复{b}圆环百分比动画', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/growup/html/growup.html'>圆环百分比动画</a>");
  }], 
  ['回复{c}游戏宝箱开启动画', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/chest-open-ani/html/chest-open-ani.html'>游戏宝箱开启动画</a>");
  }], 
  ['回复{d}QQWiFi液面滚动', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/wifi/v2/index.html'>QQWiFi液面滚动</a>");
  }],  
  ['回复{e} 游戏成就PK动画(1)', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/gain-pk/html/gain-pk.html'> 游戏成就PK动画(1)</a>");
  }],  
  ['回复{f}曲线轨迹动画', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/profile/v2/html/index.html'> 曲线轨迹动画</a>");
  }],  
  ['回复{g}3D分牌进场效果', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/gift/v1/html/index.html'> 3D分牌进场效果</a>");
  }],  
  ['回复{h}游戏成就PK动画(2)', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/demo/html/gain-pk2.html'> 游戏成就PK动画(2)</a>");
  }],   
  ['回复{i}QQ钱包首页', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/wallet/v2/html/index2.html'>QQ钱包首页</a>");
  }], 
  ['回复{j}QQ会员中心', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/mqqh5/index_gua_aio.html'>QQ会员中心</a>");
  }],  
  ['回复{k}QQ会员中心2', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/getvoices/getvoices.html'>QQ会员中心2</a>");
  }],  
  ['回复{l}QQ会员中心3', function (info,req,res,next) {
		res.reply("<a href='http://www.wecloud.net.cn/qq/gravity/gravity.html'>QQ会员中心3</a>");
  }],  
  ['回复{exit}退出', function (info,req,res,next) {
		res.nowait('您已经退出了');
  }]
]);

let execute = (info,req, res, next) => {
	let message = req.weixin;	
    if(message.MsgType == 'text')
	{
		if(message.Content == '音乐')
		{
			res.reply({
				type: 'music',
					content: {        
					title: '相亲相爱一家人',
					description: '测试回复音乐',
					musicUrl: 'http://qzone.haoduoge.com/music3/2015-02-25/1424837136.mp3',
					hqMusicUrl: 'http://mp3.com/xx.mp3',
					thumbMediaId: 'fG07lyYkL3awJzL6gYWoteChtURMP9RCIS7kSi2XjxIrB-df4vBQ_8EW7EGB8hVe'
				}
			});
		}else if(message.Content == '图文')
		{
			res.reply([
				{
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
				}
			]);
		}else if(message.Content == '多图文')
		{
			res.reply([
				{
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
				}, {
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
				}, {
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
				}, {
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
				}, {
					title: '你来我家接我吧',
					description: '这是女神与高富帅之间的对话',
					picurl: 'http://cms.csdnimg.cn/articlev1/uploads/allimg/120125/79_120125235214_1.png',
					url: 'http://wecloud.net.cn/light7/m/demo/views/index_combo.html'
			   }
			]);
		}else if(message.Content == 'cms1'){
			res.wait('cms');
		}else if(message.Content == 'cms'){
			res.wait('cms');
		}else if(message.Content == 'game'){
			res.wait('game');
		}else if(message.Content == 'qq'){
			res.wait('qq');
		}else if(message.Content == 'html5'){
			res.wait('mobile');
		}else
		{
			res.reply({
				content: '谢谢您的留言,如您方便，可以电话联系13926530028 或者官方QQ6685246',
				type: 'text'
			});	
		}		
  }else if(message.MsgType == 'event')//事件类型
  {
  	if(message.Event == 'subscribe')//订阅
  	{
  		res.reply({
		    content: '欢迎关注微云信息微信服务公众账号!',
		    type: 'text'
		});	
		//写入到redis数据库		  
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'openid',message.FromUserName);//用户唯一ID
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'wxpk',message.ToUserName);//微信唯一ID 
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'subscribe_time',dateUtils.timestaml(message.CreateTime,'YYYY-MM-DD hh-mm-ss'));//用户关注时间，为时间戳。如果用户曾多次关注，则取最后关注时间
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'cancelTime','');//上次取消关注时间
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'subscribe','1');//用户是否订阅公众账号
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'nickname','');//用户昵称	  
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'sex','');//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'city','');//用户所在城市
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'country','');//用户所在国家
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'province','');//用户所在省份
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'language','');//用户的语言，简体中文为zh_CN
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'headimgurl','');//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'unionid','');//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Latitude','');//地址位置纬度
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Longitude','');//地理位置经度
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Precision','');//地理位置精度	  
	    //其实这里腾讯已经提供了接口，获取所有用户列表的接口，不需要手动做
	    redisUtils.rpush('wxUsersCount',message.FromUserName,function(){
		updateUserInfo(message.FromUserName);		  	
	   });//增加统计表
	  //同步个人信息数据				  
  	}else if(message.Event == 'unsubscribe')//订阅,很奇怪，取消关注会调用3次(增加了测试微信账号？)
  	{
	    redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'cancelTime',dateUtils.timestaml(message.CreateTime,'YYYY-MM-DD hh-mm-ss'));//最新关注时间
	    //为了防止错误(数据库数据关注的信息被删了)，加上下面2句
	    redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'openid',message.FromUserName);//用户唯一ID
	    redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'wxpk',message.ToUserName);//微信唯一ID 
	    redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'subscribe','0');//用户是否订阅公众账号
	    redisUtils.lrem('wxUsersCount',0, message.FromUserName);//移除统计表
  	}else if(message.Event == 'LOCATION')//关注微信账号的时候，如果用户选择了允许获得地址位置，则发送地址位置信息给服务器(1每次发信息发送，每隔5秒发送)
  	{
  		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Latitude',message.Latitude);//地址位置纬度
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Longitude',message.Longitude);//地理位置经度
		redisUtils.hset('wxUsers:wx_user_'+message.FromUserName,'Precision',message.Precision);//地理位置精度
  	}else if(message.Event == 'CLICK')//菜单点击事件
  	{
  		if(message.EventKey == 'V1001_GOOD')//赞我们一下
  		{
  			res.reply({
		        content: '谢谢你的赞，我们会更加努力做好',
		        type: 'text'
		    });	
  		}else if(message.EventKey == 'V1001_TODAY_MUSIC')//今日菜单
  		{
  			res.reply({
		        content: '今日菜单红烧牛肉面，酸菜肉丝面，炸酱面',
		        type: 'text'
		    });	
  		}
  	}else if(message.Event == 'VIEW')
  	{
  		//用户打开了URL站点		
  		if(message.EventKey == 'www.115.29.145.75')//URL地址
  		{
  			//可以用于统计
  		}
  	}else if(message.Event == 'scancode_push')//扫码推事件的事件推送，直接打开URL地址
  	{
  		if(message.EventKey == 'rselfmenu_0_1')//扫码推事件的事件
  		{
  			res.reply({
		        content: '扫描结果:'+message.ScanCodeInfo.ScanResult,
		        type: 'text'
		    });		
  		}	
  	}else if(message.Event == 'scancode_waitmsg')//扫码推事件且弹出“消息接收中”提示框的事件推送
  	{
  		if(message.EventKey == 'rselfmenu_0_0')//扫码带提示
  		{
  			res.reply({
		        content: '扫描结果:'+message.ScanCodeInfo.ScanResult,
		        type: 'text'
		    });		
  		}	
  	}else if(message.Event == 'pic_sysphoto')//弹出系统拍照发图的事件推送
  	{
  		if(message.EventKey == 'rselfmenu_1_0')
  		{
  			res.reply({
		        content: '谢谢你发的图，我已经保留了，嘿嘿:',
		        type: 'text'
		    });		
  			console.log('发送图片信息'+message.SendPicsInfo+'|发送图片数量'+message.SendPicsInfo.Count+'|图片列表:'+message.SendPicsInfo.PicList+'|图片MD5值'+message.SendPicsInfo.PicMd5Sum);
  		}	
  	}else if(message.Event == 'pic_photo_or_album')//弹出拍照或者相册发图的事件推送
  	{
  		if(message.EventKey == 'rselfmenu_1_1')
  		{
  			res.reply({
		        content: '谢谢你发的图，我已经保留了，嘿嘿:',
		        type: 'text'
		    });	
  			console.log('发送图片信息'+message.SendPicsInfo+'|发送图片数量'+message.SendPicsInfo.Count+'|图片列表:'+message.SendPicsInfo.PicList+'|图片MD5值'+message.SendPicsInfo.PicMd5Sum);
  		}	
  	}else if(message.Event == 'pic_weixin')//弹出微信相册发图器的事件推送
  	{
  		if(message.EventKey == 'rselfmenu_1_2')
  		{
  		    res.reply({
		        content: '谢谢你发的图，我已经保留了，嘿嘿:',
		        type: 'text'
		    });	
  			console.log('发送图片信息'+message.SendPicsInfo+'|发送图片数量'+message.SendPicsInfo.Count+'|图片列表:'+message.SendPicsInfo.PicList+'|图片MD5值'+message.SendPicsInfo.PicMd5Sum);
  		}	
  	}else if(message.Event == 'location_select')//弹出地理位置选择器的事件推送
  	{
  		if(message.EventKey == 'rselfmenu_2_0')
  		{
  			console.log('发送地理位置信息'+message.SendLocationInfo+'|X：'+message.Location_X+'|Y：'+message.Location_Y+'|地理位置字符串信息'+message.Label);
  		}	
  	}
  }else if(message.MsgType == 'image')
  {
	res.reply({
		type: 'image',
		content:{
			mediaId: message.MediaId
		}
	});	
  }else if(message.MsgType == 'voice')
  {
  	res.reply({
  	    type: 'voice',
		    content:{
				mediaId: message.MediaId
		    }
	});	
  }else if(message.MsgType == 'video')
  {
  	res.reply({
	    type: 'video',
	    content: {
			title: '来段视频吧',
			description: '女神与高富帅',
			mediaId: message.MediaId
	    }
    });
  }else if(message.MsgType == 'location')
  {
    res.reply({
        content: '你发的地理位置:'+message.Label,
        type: 'text'
    });		
  }else
  {
  	res.reply({
		content: '无法识别你发的信息:'+message.Content,
		type: 'text'
    });	
  }
}

/**
获取AccessToken
*/
let wxGetAccessToken = () => {
  	/**原始方式
  	let options = {
		    url: wx_config.urlWechatToken,
		    headers: {
		        'User-Agent': 'request'
		    }
		};		  
		let callback = function(error, response, body) {
		    if (!error && response.statusCode == 200) {
		        let info = JSON.parse(body);
		        if(info.access_token)
		        {
		        		logger.info('获得微信AccessToken成功:'+info.access_token);
		            redisUtils.setex(wx_config.access_token,info.access_token,wx_config.accessTokenTimeOut*60*60);//存储在redis数据库
		        }else
		        {
		        	  logger.error('调用微信获取AccessToken接口错误：'+ '['+info.errcode+']'+info.errmsg);
		        }			        
		    }
		}		
	//request(options, callback);*/
	//方式二，调用wechat-api,会存储到api全局方法里
	let callback = (error, body)  => {
		if (!error) {
			if(body.accessToken)
			{
					logger.info('获得微信AccessToken成功:'+body.accessToken);
				redisUtils.setex(wx_config.access_token,body.accessToken,wx_config.accessTokenTimeOut*60*60);//存储在redis数据库
			}		        
		}else
		{
			  logger.error('调用微信获取AccessToken接口错误：'+ error);
		}	
	}	
	api.getLatestToken(callback);
}

/**
定时同步所有微信用户的个人信息
*/
let wxSynchUserInfo = () => {
  //先获取所有的id
	redisUtils.lrange('wxUsersCount',0,-1,function(ids){
  	if(!ids || ids == '')
  	{
  		logger.info('微信用户不存在,未同步微信用户数据');	 
  		return true;
  	}
    logger.info('同步微信用户个人信息数据开始,用户：'+ids.length+'位');
  	async.eachSeries(ids, function(item,cb){
  		/*	
			redisUtils.get(wx_config.access_token,function(access_token){
				if(access_token)
        {
			      let url = wx_config.urlWechatUserInfo+'&access_token='+access_token+'&openid='+item;
					  	let options = {
							    url: url,
							    headers: {
							        'User-Agent': 'request'
							    }
							};		
							let callback = function(error, response, body) {
							    if (!error && response.statusCode == 200) {
							        let info = JSON.parse(body);
							        if(info.errcode)
							        {
							        	logger.info('同步微信数据失败:'+ '['+info.errcode+']'+info.errmsg);	
							        }else//同步成功，写入数据库
							        {
					        				redisUtils.hset('wxUsers:wx_user_'+item,'subscribe',info.subscribe?info.subscribe:'');//用户是否订阅公众账号
													redisUtils.hset('wxUsers:wx_user_'+item,'nickname',info.nickname?info.nickname:'');//用户昵称	  
													redisUtils.hset('wxUsers:wx_user_'+item,'sex',info.sex?info.sex:'');//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
													redisUtils.hset('wxUsers:wx_user_'+item,'city',info.city?info.city:'');//用户所在城市
													redisUtils.hset('wxUsers:wx_user_'+item,'country',info.country?info.country:'');//用户所在国家
													redisUtils.hset('wxUsers:wx_user_'+item,'province',info.province?info.province:'');//用户所在省份
													redisUtils.hset('wxUsers:wx_user_'+item,'language',info.language?info.language:'');//用户的语言，简体中文为zh_CN
													redisUtils.hset('wxUsers:wx_user_'+item,'headimgurl',info.headimgurl?info.headimgurl:'');//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
													redisUtils.hset('wxUsers:wx_user_'+item,'unionid',info.unionid?info.unionid:'');//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
							        }	
							        cb();       
							    }
							}		
							request(options, callback);
        }else
        {
        	logger.info('同步微信用户数据失败,未获取到AccessToken信息');
        }	
			});
*/
    //新版本api
	let callback = (error, body)  => {
		if(error) 
		{
		   logger.info('同步个人信息失败:' + '['+body.errcode+']'+body.errmsg);
		}else
		{              	
			redisUtils.hset('wxUsers:wx_user_'+item,'subscribe',body.subscribe?body.subscribe:'');//用户是否订阅公众账号
			redisUtils.hset('wxUsers:wx_user_'+item,'nickname',body.nickname?body.nickname:'');//用户昵称	  
			redisUtils.hset('wxUsers:wx_user_'+item,'sex',body.sex?body.sex:'');//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
			redisUtils.hset('wxUsers:wx_user_'+item,'city',body.city?body.city:'');//用户所在城市
			redisUtils.hset('wxUsers:wx_user_'+item,'country',body.country?body.country:'');//用户所在国家
			redisUtils.hset('wxUsers:wx_user_'+item,'province',body.province?body.province:'');//用户所在省份
			redisUtils.hset('wxUsers:wx_user_'+item,'language',body.language?body.language:'');//用户的语言，简体中文为zh_CN
			redisUtils.hset('wxUsers:wx_user_'+item,'headimgurl',body.headimgurl?body.headimgurl:'');//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
			redisUtils.hset('wxUsers:wx_user_'+item,'unionid',body.unionid?body.unionid:'');//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
			cb();       
		}		              	
	}	 	
	api.getUser(item, callback);
    }, function (err) {
	    if(err)
	    {
	    	console.log('同步微信用户数据队列有错误');
	    }
	    
}
);
  //为了保证服务器效率，这里采用async 的series方法，串行执行

  	/* logger.info('当前用户数:'+len);
		  for(let i=0;i<len;i++)
		  {
		  	let key = redisUtils.lindex('wxUsersCount',i);
		  	logger.info('~~~~~~~用户的openid~~~~~'+key);
		  	updateUserInfo(key);
		  }
    */
 
});
}

/**
同步单个用户的个人信息数据
*/
let updateUserInfo = (openid) => {	
	//老版本获取用户基本信息
	/*
	redisUtils.get(wx_config.access_token,function(access_token){
	if(access_token)
        {
			let url = wx_config.urlWechatUserInfo+'&access_token='+access_token+'&openid='+openid;
			let options = {
					url: url,
					headers: {
						'User-Agent': 'request'
					}
				};		
			let callback = function(error, response, body) {
				if (!error && response.statusCode == 200) {
					let info = JSON.parse(body);
					if(info.errcode)
					{
						logger.info('同步微信数据失败:'+ '['+info.errcode+']'+info.errmsg);	
					}else//同步成功，写入数据库
					{
							redisUtils.hset('wxUsers:wx_user_'+openid,'subscribe',info.subscribe?info.subscribe:'');//用户是否订阅公众账号
									redisUtils.hset('wxUsers:wx_user_'+openid,'nickname',info.nickname?info.nickname:'');//用户昵称	  
									redisUtils.hset('wxUsers:wx_user_'+openid,'sex',info.sex?info.sex:'');//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
									redisUtils.hset('wxUsers:wx_user_'+openid,'city',info.city?info.city:'');//用户所在城市
									redisUtils.hset('wxUsers:wx_user_'+openid,'country',info.country?info.country:'');//用户所在国家
									redisUtils.hset('wxUsers:wx_user_'+openid,'province',info.province?info.province:'');//用户所在省份
									redisUtils.hset('wxUsers:wx_user_'+openid,'language',info.language?info.language:'');//用户的语言，简体中文为zh_CN
									redisUtils.hset('wxUsers:wx_user_'+openid,'headimgurl',info.headimgurl?info.headimgurl:'');//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
									redisUtils.hset('wxUsers:wx_user_'+openid,'unionid',info.unionid?info.unionid:'');//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
					}	
				}
			}		
			request(options, callback);
        }else
        {
        	logger.info('同步微信用户数据失败,未获取到AccessToken信息');
        }	
	});*/
			//新版本
	logger.info('同步开始:'+openid);
	let callback = (error, body) =>  {
		if(error) 
	    {
		   logger.info('同步个人信息失败:' + '['+body.errcode+']'+body.errmsg);
	    }else
		{              	
			logger.info('模同步个人信息成功');
			redisUtils.hset('wxUsers:wx_user_'+openid,'subscribe',body.subscribe?body.subscribe:'');//用户是否订阅公众账号
			redisUtils.hset('wxUsers:wx_user_'+openid,'nickname',body.nickname?body.nickname:'');//用户昵称	  
			redisUtils.hset('wxUsers:wx_user_'+openid,'sex',body.sex?body.sex:'');//用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
			redisUtils.hset('wxUsers:wx_user_'+openid,'city',body.city?body.city:'');//用户所在城市
			redisUtils.hset('wxUsers:wx_user_'+openid,'country',body.country?body.country:'');//用户所在国家
			redisUtils.hset('wxUsers:wx_user_'+openid,'province',body.province?body.province:'');//用户所在省份
			redisUtils.hset('wxUsers:wx_user_'+openid,'language',body.language?body.language:'');//用户的语言，简体中文为zh_CN
			redisUtils.hset('wxUsers:wx_user_'+openid,'headimgurl',body.headimgurl?body.headimgurl:'');//用户头像，最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像URL将失效。
			redisUtils.hset('wxUsers:wx_user_'+openid,'unionid',body.unionid?body.unionid:'');//只有在用户将公众号绑定到微信开放平台帐号后，才会出现该字段
			}		              	
	   }	 	
	api.getUser(openid, callback);
};



/**
获取用户列表
*/
let wxGetUsersList = () => {
	/***
	redisUtils.get(wx_config.access_token, function(access_token) {
	if (access_token) {
		let url = wx_config.urlWechatUserList + 'access_token=' + access_token+'&next_openid=';
	    let options = {
		url: url,
		headers: {
			'User-Agent': 'request'
		}
	};		
	let callback = function(error, response, body) {
		if (!error && response.statusCode == 200) {
			let info = JSON.parse(body);
			logger.info('全部用户数据'+body);
			if(info.errcode)
			{
				  logger.error('调用微信获取用户列表数据接口错误：'+ '['+info.errcode+']'+info.errmsg);       		

			}else
			{		       	
				
				//先清理原来的历史数据
				redisUtils.ltrim('wxUsersCount_new',1000000,-1);
				  let arr = info.data.openid;
				  //写入数据到数据库 
				  if(arr && arr.length >0)
				  {
					for(let i = 0;i<arr.length;i++)
					{
							redisUtils.rpush('wxUsersCount_new',arr[i],function(){
									
									});
					}
				  }

			 
				if(info.count>0 && info.count<info.total)//还有用户,用户大于10000，未测试
				{
					let arrLeng = Math.round(info.total/info.count);				
			for(let i =0;i<arrLeng;i++)
					{
						let func = function(a,cb)
						{
									let callback = function(error, response, body) {
										if (!error && response.statusCode == 200) {
											let info = JSON.parse(body);
											if(info.errcode)
											{
												  logger.error('调用微信获取用户列表数据接口错误：'+ '['+info.errcode+']'+info.errmsg);       		
							
											}else
											{			
												//写入数据到数据库 														        	
											  let arr = info.data.openid;
											  if(arr && arr.length >0)
											  {
												for(let i = 0;i<arr.length;i++)
												{
														redisUtils.rpush('wxUsersCount_new',arr[i],function(){
																
																});
												}
											  }		
											  if(info.count>0 && info.count<info.total)
											{
												cb('',info.next_openid);//继续下一个循环
											}							        	  
															
										}
									}		
									request(options, callback);   
						};	        			
						 
						arrLeng.push(func);
					}    	
					async.waterfall(arrLeng,
								function(err, result) {
						  });
				}
				} 
			}			        
		}
	}		
	request(options, callback); 
	}
	else {
		logger.info('获取用户列表信息失败,未获取到AccessToken信息');
	}
});
*/
//新版本api  
let callback = (error, info) =>  {
   	logger.info('获取用户列表数据了'+error+JSON.stringify(info));
    if(error) 
	{
	   logger.info('获取用户列表数据失败:' + '['+info.errcode+']'+info.errmsg);
	}else
	{
		//先清理原来的历史数据
		redisUtils.ltrim('wxUsersCount_new',1000000,-1,function(){
			let arr = info.data.openid;
			//写入数据到数据库(前1000000条) 
			if(arr && arr.length >0)
			{
				for(let i = 0;i<arr.length;i++)
				{
					redisUtils.rpush('wxUsersCount_new',arr[i],function(){});
				}
			}
			 //还有用户,用户大于10000，未测试
			if(info.count>0 && info.count<info.total)
			{
				let tempLeng = [];
				let arrLeng = Math.round(info.total/info.count);				
				for(let i =0;i<arrLeng;i++)
				{
					let func = (a,cb) => 
					{
						let callback = (error, info) =>  {
							if(error) 
							{
							   logger.info('获取用户列表数据失败:' + '['+info.errcode+']'+info.errmsg);
							}else
							{
								//写入数据到数据库 														        	
								let arr = info.data.openid;
								if(arr && arr.length >0)
								{
									for(let i = 0;i<arr.length;i++)
									{
										redisUtils.rpush('wxUsersCount_new',arr[i],function(){
												
										});
									}
								}		
								if(info.count>0 && info.count<info.total)
								{
									cb(info.next_openid);//继续下一个循环
								}		
							}	
								
						};
					
						api.getFollowers(info.next_openid,callback);				        			
					}    	
					tempLeng.push(func);
				}			        
				async.waterfall(tempLeng,function(err, result) {});
			} 

		});     	  
   }	 
                    
};
api.getFollowers(callback);
};


/**
上传多媒体文件，图片，视频和语音(永久有效)
type是媒体文件类型，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
url是媒体URL地址
*/
let wxUploadMedia = (type,mediaUrl) => {
	let callback = (error,  body)  => {
		if(!error){
			if(body.media_id)			        
			{
				logger.info('微信素材上传成功,media_id:'+body.media_id);     		

			}		        
		}else
		{
			logger.error('调用微信上传多媒体文件接口错误：'+ error); 				  
		}	
	}		
  	api.uploadMedia(mediaUrl, type, callback);
   
}

/**
获得微信上传的素材,临时
body, 调用正常时得到的文件Buffer对象
*/
let wxGetUploadMedia = (media_id,result) => {
	let callback = (error, body,response) =>  {
		if(!error){
			if(body)			        
			{
				try{
					let errorResult = JSON.parse(body);
					logger.error('调用微信下载多媒体流文件接口错误：'+ '['+errorResult.errcode+']'+errorResult.errmsg);
				}
				catch(e){
					
				}       	
				logger.info('微信素材下载成功!');  
				if(result)
				{	        		 
					result(body);
				}            
			}		        
		}
	}		
  	api.getMedia(media_id,callback);
};


/**
标准群发信息接口\
群发消息，分别有图文（news）、文本(text)、语音（voice）、图片（image）和视频（video）
*/
let wxMassSend = (opts, receivers, callback) => {
let opts1 = {
	    'image':{
	    'media_id':'w_H54TvnGpbSZueZK9LYoIFV-jTtK6SaB_FQyUaayDxLCjYPT2TBhE1rF86pq6F-'
    },
    'msgtype':'image'
}
let opts2 = {
		'filter':{
		'is_to_all':true
    },
		'text':{
		'content':'测试群发2122'
    },
    'msgtype':'text'
}
api.massSend(opts2, ['oOygkswrPh_uIi9w1ZZJwEjwl54o'],function(error,  body){
	if(error)
	{
		logger.info(error);
	}else
	{
		if(body.errcode == '0')
		{
			logger.info('群发数据成功!');
		}else
		{
			logger.info(JSON.stringify(body));
		}	
	} 	
});
}

/**
上传图文素材
*/
let wxUploadNews = (news, callback) => {
	api.uploadNews(news, callback);
};



/**
预览接口
*/
let wxPreviewText = (openid, content, callback) => {
	api.previewText(openid, content, callback);
}
/**
创建分组，其实微信默认有未分组，星标组和黑名单三组
*/
let wxCreateGroup = (groupname,callback) => {
	api.createGroup(groupname, callback);
};
/**
查询所有用户分组列
*/
let wxGetGroups = (callback) => {
	api.getGroups(callback);
};
/**
移动用户进组
*/
let wxMoveUserToGroup = (openid, groupId, callback) => {
	api.moveUserToGroup(openid, groupId, callback);
};

/**
获得用户登录授权信息的临时tocken
*/
let wxGetAccessTokenAuthor = (code,callback) => {
	client.getAccessToken(code, function (err, result) {
		if(err)
		{
			logger.info(err);
		}else
		{
			  var accessToken = result.data.access_token;
			  var openid = result.data.openid;

			  var param = {};
			  param.accessToken = accessToken;
			  param.openid = openid;
			  callback(err,param);
		} 	

	});
};

/**
获得用户登录信息
*/
let wxAuthUserInfo = (openid,callback) => {
	client.getUser(openid, function (err, result) {
	  var userInfo = result;
	  callback(err,userInfo);
	});
};

/**
获取微信JS SDK Config的所需参数
var param = {
 debug: false,
 jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
 url: 'http://www.xxx.com'
};
*/
let getJsConfig = (param,callback) => {
	api.getJsConfig(param, function (err, result) {
		if(err)
		{
			logger.info(err);
		}else
		{
		   callback(err,result);
		}
	});
};


let res = { 	
	execute:execute,	
	wxApi:api,
	wxGetAccessToken:wxGetAccessToken,
	wxSynchUserInfo:wxSynchUserInfo,
	wxGetUsersList:wxGetUsersList,
	wxUploadMedia:wxUploadMedia,
	wxGetUploadMedia:wxGetUploadMedia,
	wxMassSend:wxMassSend,
	wxPreviewText:wxPreviewText,
	wxUploadNews:wxUploadNews,
	wxCreateGroup:wxCreateGroup,
	wxGetGroups:wxGetGroups,
	wxMoveUserToGroup:wxMoveUserToGroup,
	wxGetAccessTokenAuthor:wxGetAccessTokenAuthor,
	wxAuthUserInfo:wxAuthUserInfo,
	getJsConfig:getJsConfig,
	wxpay:wxpay
};
module.exports = res;
