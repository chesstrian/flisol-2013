var asterisk = require('asterisk-ami')
  , express = require('express')
  , routes = require('./routes')
  , nowjs = require('now')
  , http = require('http')
  , path = require('path');

var app = express();

var ami = new asterisk({
  host: '10.3.247.64',
  username: 'flisolmed',
  password: '2013'
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var httpServer = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var everyone = nowjs.initialize(httpServer);

ami.connect(function (response) {
  console.log('Conectado a Asterisk Manager Interface');
});

//** **//

// Creamos una función everyone.now.nombre = function (data) {}
everyone.now.data2Asterisk = function (data) {
  console.dir(data);
  ami.send(data);
}

ami.on('ami_data', function (data) {
  console.dir(data);
  if(everyone.now.echoAsteriskData instanceof Function){
    everyone.now.echoAsteriskData(data);
  }
});

//** **//

process.on('SIGINT', function () {
  ami.disconnect();
  process.exit(0);
});
