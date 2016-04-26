/**
 * Created by woo on 2016. 4. 25..
 */

//   MySQL 로드
var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    database: 'nodeTest',
    password: 'root'
});

