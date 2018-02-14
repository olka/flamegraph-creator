var express     = require('express');
var compression = require('compression')
var fs          = require('fs');
var stack       = require('./stackParser')
var http        = require('http');
var app         = express();
var zlib        = require('zlib');
var url         = require('url');
var path        = require('path');
const crypto    = require('crypto');

const PORT = process.env.PORT || 8080
const storage = new Map();

const template = fs.readFileSync('dist/template.html', 'utf8');
const constructPage = data => template+data + "  }</script> </body></html>";
const sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
const encodeUrl = req => url.format({protocol: req.protocol,
    host: req.get('host'), pathname: "api/generate" })+ "/"+ req.uid;

app.use('/dist', express.static(path.join(__dirname,'dist')));
app.use(compression());

app.use(function(req, res, next) {
    var data = [];
    req.addListener("data", chunk => data.push(new Buffer(chunk)));
     
    req.addListener("end", function() {
        buffer = Buffer.concat(data);
        req.uid = sha256(buffer.length+req.ip+req.header("user-agent"));
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

router.get('/download/:hash', function(req, res) {
    res.send(storage.get(req.params.hash));
});

router.post('/push', function(req, res) {
    storeGraphData(req.uid, req.body)
    res.send(encodeUrl(req));
});

router.post('/generate', function(req, res) {
    storeGraphData(req.uid, stack.folded(req.body))
    res.send(encodeUrl(req));
});

function storeGraphData(uid, data){
    if(!storage.has(uid)) 
        storage.set(uid, data);
}

// all of our routes will be prefixed with /api
app.use('/api', router);

var server = app.listen(PORT);
console.log('Listening on port: ' + server.address().port);