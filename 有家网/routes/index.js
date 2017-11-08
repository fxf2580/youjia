var express = require('express');
var router = express.Router();
var mysql=require("mysql");
var fs=require('fs');
var formidable=require('formidable');
var con=mysql.createPool({
	host:'localhost',
	user:'root',
	password:'root',
	database:'bao'
})
router.get('/list',function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	con.query('SELECT * FROM xin',function(err,rows,fields){
		res.send(rows);
		console.log(rows);
	})
})
router.post('/list1',function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	var cc=req.body.cc;
	con.query('SELECT * FROM xin WHERE id='+cc,function(err,rows,fields){
		res.send(rows);
		console.log(rows);
	})
})
router.post('/insert',function(req,res,next){
	var title=req.body.tit;
	var zza=req.body.zz;
	var aa=req.body.a;
	var sels=req.body.sel;
	res.header('Access-Control-Allow-Origin','*');
	con.query(`INSERT INTO xin (uid,name,title,time,detail) VALUES ('${sels}','${title}','${zza}',now(),'${aa}')`,function(err,rows,fields){
		res.send(rows);
	})
})
router.post('/del',function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	var uid=req.body.id;
	con.query('DELETE FROM xin WHERE id='+uid,function(err,rows,fields){
		res.send(rows);
	})
})
router.post('/update',function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	var bb=req.body.b;
	var xxtit=req.body.xtit;
	var xxzz=req.body.xzz;
	var yyy=req.body.yy;
	con.query(`UPDATE xin SET name='${xxzz}',title='${xxtit}',detail='${bb}',time=now() WHERE id=${yyy}`,function(err,rows,fields){
		res.send(rows);
	})
})
// 新闻
router.post('/img',function(req,res){
	res.header('Access-Control-Allow-Origin','*');
	var form = new formidable.IncomingForm();
	form.uploadDir = 'public/upload';
	form.parse(req,function(err,fields,files){
		console.log(fields,files);
		for(i in files){
			var file = files[i];
			var fName = (new Date()).getTime();
			switch(file.type){
				case 'image/jpeg':
				fName = fName+'.jpg';
				break;
				case 'image/png':
				fName = fName + '.png';
				break;
				case 'image/gif':
				fName = fName + '.gif';
				break;
			}
			var newPath = 'public/upload/' + fName
			fs.renameSync(file.path,newPath);
		}
		con.query(`INSERT INTO img (img) VALUES ('http://localhost:3000/upload/${fName}')`,function(err,rows){
	    	if(err) throw err;
	    	if(rows){
	    		con.query('SELECT img FROM img',function(err,rows){
	    			res.send(rows);
	    		})
	    	}
    	})

	})
})
router.get('/img1',function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	con.query('SELECT img FROM img',function(err,rows){
		res.send(rows);
	})
})
module.exports = router;
