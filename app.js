var express = require('express');
var httpProxy = require('http-proxy');

var app = express();

app.use(express.static(__dirname + '/www'));

var BASE_URL = '/ionic';
var REAL_URL = 'http://192.168.0.53:8800';

var WS_BASE_URL = '/ws';
var WS_REAL_URL = 'http://192.168.0.53:8900';

// 设置反向代理实现跨域访问
var apiProxy = httpProxy.createProxyServer();
app.all(BASE_URL+'/*',function (req, res) {
    var url =  req.url.replace(BASE_URL ,"");
    req.url = url;
    console.log("go api path:" + REAL_URL + req.url);
    apiProxy.web(req, res, {target: REAL_URL});
});
app.all(WS_BASE_URL+'/*',function (req, res) {
  var url =  req.url.replace(WS_BASE_URL ,"");
  req.url = url;
  console.log("go api path:" + WS_REAL_URL + req.url);
  apiProxy.web(req, res, {target: WS_REAL_URL});
});
apiProxy.on('error', function(err, req, res){
    console.log("go error path:"+ req.url);
    // res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("500 error!\n");
});

// 服务默认路径
app.get('/', function(req, res) {
    res.sendfile('./www/index.html');
});

// 无效路径访问异常提示
app.use(function(req, res) {
    console.log("go error path:"+ req.url);
    // res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 error!\n");
});

// 设置端口启动监听
var port = 8100;
app.listen(port, '0.0.0.0');
console.log("Server running at port："+port+".");
