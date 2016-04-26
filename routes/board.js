var express = require('express');
var router = express.Router();

//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    database: 'nodeTest',
    password: 'root'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    // 그냥 board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
    res.redirect('/board/list/1');
});
router.get('/write',function (req,res,next) {
    res.render('write',{title:'게시판 글 쓰기'})

})
router.post('/write', function(req,res,next){

    var name = req.body.name;
    var text = req.body.content;
    var pw = req.body.password;

    var datas = [name,text,pw];

    pool.getConnection(function (err, connection)
    {
        // Use the connection
        var sqlForInsertBoard = "insert into board(name, text, pw) values(?,?,?)";
        connection.query(sqlForInsertBoard,datas, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.redirect('/board');
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });

});
router.get('/list/:page', function(req,res,next){

    pool.getConnection(function (err, connection) {
        // Use the connection
        var sqlForSelectList = "SELECT idx, name, text, date_format(date,'%Y-%m-%d %H:%i:%s') date FROM board";
        connection.query(sqlForSelectList, function (err, rows) {
            if (err) console.error("err : " + err);
            console.log("rows : " + JSON.stringify(rows));

            res.render('list', {title: ' 게시판 전체 글 조회', rows: rows});
            connection.release();

            // Don't use the connection here, it has been returned to the pool.
        });
    });
});

router.get('/read/:idx',function(req,res,next){
    var idx=req.params.idx;

    pool.getConnection(function(err,connection)
    {
        var sql = "select idx, text, date_format(date,'%Y-%m-%d %H:%i:%s') date from board where idx=?";

        connection.query(sql,[idx], function(err,row)
        {
            if(err) console.error(err);
            console.log("1개 글 조회 결과 확인 : ",JSON.stringify(row));
            res.render('read', {title:"글 조회", row:row[0]});
            connection.release();
        });
    });
});

router.post('/update',function(req,res,next) {
    var text = req.body.title;
    var idx = req.body.idx;


    var datas = [text,idx];

    pool.getConnection(function (err, connection) {
        var sql = "update board set text=? where idx=? ";
        connection.query(sql, [ text,idx], function (err, result) {
            console.log(result);
            if (err) console.error("글 수정 중 에러 발생 err : ", err);

            if (result.affectedRows == 0) {
                res.send("<script>alert('잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
            }
            else {
                res.redirect('/board');
            }
            connection.release();
        });
    });
});
module.exports = router;