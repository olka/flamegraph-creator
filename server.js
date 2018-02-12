var express     = require('express');
var compression = require('compression')
var fs          = require('fs');
var stack       = require('./stackParser')
var http        = require('http');
var app         = express();
var zlib        = require('zlib');
var url         = require('url');
const crypto = require('crypto');

const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
const constructPage = data => template+data + "  }</script> </body></html>";
const encodeUrl = req => url.format({protocol: req.protocol,
                         host: req.get('host'), pathname: req.originalUrl })+ "/"+ req.cookie;

var serviceName = "flamegraph-generator";
const template = fs.readFileSync('template.html', 'utf8');
var storage = new Map();

app.use(compression());

app.use(function(req, res, next) {
    var data = [];
    req.addListener("data", chunk => data.push(new Buffer(chunk)));
     
    req.addListener("end", function() {
        buffer = Buffer.concat(data);
        req.cookie = sha256(buffer.length+req.ip+req.header("user-agent"));
        //unzip request body
        if("gzip" === req.header("Content-Type")){
            zlib.gunzip(buffer, function(err, result) {
                if (!err) {
                    req.body = result.toString();
                    next();
                } else {
                    next(err);
                }
            });
        }
        else{
            req.body = buffer.toString();
            next();
        }
    });
});

var router = express.Router();

router.get('/generate/:hash', function(req, res) {
    res.send(constructPage(storage.get(req.params.hash)));
});

router.post('/generate', function(req, res) {
    if(!storage.has(req.cookie))
        storage.set(req.cookie, stack.folded(req.body)); 
    res.send(encodeUrl(req));
});

// all of our routes will be prefixed with /api
app.use('/api', router);

var server = app.listen(8080);
console.log('Listening on port: ' + server.address().port);