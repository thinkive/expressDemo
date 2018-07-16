"use strict"
/**
微信菜单
**/
let menu = {
	'v.1000':
	{
		"button": [
		{

			"name":"产品体验",
			"sub_button":[
			{
				"type":"view",
				"name":"OA系统",
				"url":"http://218.17.161.51:32821/psa/oacc/index.html"
			},
			{
				"type":"view",
				"name":"测试信息学院",
				"url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa66cf99553a529f7&redirect_uri=http%3a%2f%2fwww.wecloud.net.cn%2flight7%2fm%2fcollege%2fviews%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
			},
			{
				"type":"view",
				"name":"前端交互框架2.0",
				"url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf5b3c80720abf3f1&redirect_uri=http%3a%2f%2fwww.wecloud.net.cn%2flight7%2fm%2fdemo%2fviews%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
			}]
		},
		{
			"name": "员工驿站",
			"sub_button": [
				{
					"type": "scancode_waitmsg",
					"name": "意见反馈",
					"key": "rselfmenu_0_0",
					"sub_button": [ ]
				},
				{
					"type": "scancode_push",
					"name": "积分查看",
					"key": "rselfmenu_0_1",
					"sub_button": [ ]
				},
				{
					"type": "scancode_push",
					"name": "关于我们",
					"key": "rselfmenu_0_1",
					"sub_button": [ ]
				},
				{
					"type": "scancode_push",
					"name": "账户绑定",
					"key": "rselfmenu_0_1",
					"sub_button": [ ]
				},
				{
					"type": "scancode_push",
					"name": "微招聘",
					"key": "rselfmenu_0_1",
					"sub_button": [ ]
				}
			]
		},
		{
			"name": "精彩活动",
			"sub_button": [
				{
					"type": "pic_sysphoto",
					"name": "每日一篇",
					"key": "rselfmenu_1_0",
				   "sub_button": [ ]
				 },
				{
					"type": "pic_photo_or_album",
					"name": "每天签到",
					"key": "rselfmenu_1_1",
					"sub_button": [ ]
				},
				{
					"type": "pic_weixin",
					"name": "大转盘",
					"key": "rselfmenu_1_2",
					"sub_button": [ ]
				}
			]
		}]
	},
	'v.1001':
	{
		"button": [
		{

			"name":"场馆中心",
			"sub_button":[
			{
				"type":"view",
				"name":"场馆中心",
				"url": "http://uu.sziit.edu.cn/"
			}]
		},
		{
			"name":"场馆健身",
			"sub_button":[
			{
				"type":"view",
				"name":"场馆预定",
				"url": "http://uu.sziit.edu.cn/"
			},
			{
				"type":"view",
				"name":"查看门票",
				"url": "http://uu.sziit.edu.cn/"
			},
			]
		},
		{

			"name":"体质测试",
			"sub_button":[
			{
				"type":"view",
				"name":"预约",
				"url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa66cf99553a529f7&redirect_uri=http%3a%2f%2fwww.wecloud.net.cn%2flight7%2fm%2fcollege%2fviews%2findex.html&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect"
			},
			{
				"type":"view",
				"name":"结果查询",
				"url": "http://uu.sziit.edu.cn/"
			},
			]
		}

		]
	}
};

module.exports = menu;