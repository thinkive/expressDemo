"use strict"
let logger = require('../logger/log.js').logger("function000013");
let baseFunction = require("./baseFunction");
let errno = require('../function/funcNoConfig');
let app = require('../config/app');
let validator = require('validator');  //validator.isEmail('foo@bar.com'); //=> true  
let Canvas = require("canvas");
/**
验证码
*/
class function000013 extends baseFunction
{
	constructor(req,res,param) {
    	//直接调用父类构造器进行初始化
        super(req,res,param);
    }
	execute(){		
		let getRandom = (start,end) => {  
			return start+Math.random()*(end-start);  
		};  
		let canvas = new Canvas(50,20);  
		let ctx = canvas.getContext('2d');  
		let s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';  
		let code = '';  
		for(let i=0;i<4;i++){  
			code+= s.substr(parseInt(Math.random()*36),1);  
		}  
		let font= 'bold {FONTSIZE}px Impact';//"Bold Italic {FONTSIZE}px arial,sans-serif";//"13px sans-serif";  
		let start = 3;  
		let colors = ["rgb(255,165,0)","rgb(16,78,139)","rgb(0,139,0)","rgb(255,0,0)"];  
		let trans = {c:[-0.108,0.108],b:[-0.05,0.05]};  
		let fontsizes = [11,12,13,14,15,16];  
		for(let i in code){  
			ctx.font = font.replace('{FONTSIZE}',fontsizes[Math.round(Math.random()*10)%6]);  
			ctx.fillStyle = colors[Math.round(Math.random()*10)%4];//"rgba(0, 0, 200, 0.5)";  
			ctx.fillText(code[i], start, 15,50);  
			ctx.fillRect();  
			//con.translate(start,15);  
			//ctx.transform(a,b, c, d, e, f);  
			//参考：  
			//a:水平缩放，default：1 ,取值：0.89,1.32,-0.56等,  
			//b:y轴斜切，default：0 ,取值：-0.89,1.32等,  
			//c:x轴斜切，default：0 ,取值：-0.89,1.32等,  
			//d:垂直缩放，default：1 ,取值：-0.89，0.88,1.32等,  
			//e:平移，default：0 ,取值：-53,52等,  
			//f:纵称，default：0 ,取值：-53,52等,  
			let c = getRandom(trans['c'][0],trans['c'][1]);  
			let b = getRandom(trans['b'][0],trans['b'][1]);  
			//alert(c+','+b);  
			//ctx.transform(1,b, c, 1, 0, 0);  
			start+=11;  
		}  
		//参考下面链接；可发送给客户端  

		//输出文件到out.png.可方便使用  
		let buf = canvas.toDataURL();  
		let base64Data = buf.replace(/^data:image\/\w+;base64,/, "");  
		let dataBuffer = new Buffer(base64Data, 'base64');  

		/*let fs = require("fs");  
		fs.writeFile("out.png", dataBuffer, function(err) {  
			if(err){  
				console.log("errro！");  
			}else{  
			   console.log("保存成功！");  
			}  
		}); 
		 */
		this.res.send(buf); 
		//this.response();
	}
}



module.exports = {
	"execute" : function(req,res,param){
		new function000013(req,res,param).execute();
	}
};