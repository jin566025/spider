
const cheerio = require('cheerio');
const async = require('async');
const fs = require('fs');
const url = require('url');
const request =require('request');
const http = require('https');
const hupuurl = 'https://bbs.hupu.com/4846-';
const _hupuurl = 'https://bbs.hupu.com/';

let number = 0;

requestUrl();
function requestUrl(){
	request('https://bbs.hupu.com/4846-3',(err,res,body)=>{
		if(res){
			let $ = cheerio.load(body);
			let truetit = $(".truetit");
			detail(truetit)
		}
	})
}
function detail(datas){
	//datas.length
	if(number<datas.length){
		let article_url = _hupuurl+datas[number].attribs.href;
		http.get(article_url,(res)=>{
			let html = "";
			res.on("data",(chunk)=>{
				html+=chunk
			})
			res.on("end",()=>{
				getDetail(html,article_url).then((res)=>{
					
				})
			})
		})
		number++
		detail(datas)
		
	}
}

function getDetail(detail,url){
	return new Promise((resolve,reject)=>{
		let $ = cheerio.load(detail);
		let title = $('#j_data').attr('data-title');
		
		let _imgArray = $("#tpc .quote-content").find("img");
		let array = [];
		_imgArray.each((i,ele)=>{
			let _imgSrc = _imgArray[i].attribs.src;
			let original =  _imgArray[i].attribs["data-original"];
			if(original){
				_imgSrc = original;
			}
			_imgSrc = _imgSrc.split("?x-oss-process=image")[0];
			let _imgSrc2 = _imgSrc.split("hoopchina.com.cn")[1];
			console.log(_imgSrc)
			if(_imgSrc2){
				let type = _imgSrc2.split(".")[1];
				array.push(_imgSrc);
				request(_imgSrc).pipe(fs.createWriteStream('images/'+((new Date).getTime())+'.'+type ));
			}
// 			
		})
		let json = {
			"title":title,
			"url":url,
			"img":array
		}
		fs.appendFile('E:\\web\\spider\\result.json', JSON.stringify(json) ,'utf-8', function (err) {})
		resolve(json)
	})
}
