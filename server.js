var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var appRoutes = require('./server/routes/app');
var userRoutes = require('./server/routes/user');
var messageRoutes = require('./server/routes/message');

var app = express();
var server = require('http').Server(app);

// Socket.io - real time comm ====================================
var io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('User Connected');

  socket.on('disconnected', () => {
    console.log('User diconnected!');
  })
});

// config paths ==================================================
// Bring environment vars from the '.env' file
require('dotenv').config({
  path: path.join(__dirname, '.env')
});

const pathDatabaseConfig = './server/config/database';
const pathPassportConfig = './server/config/passport';

// database ======================================================
mongoose.Promise = global.Promise;

var configDatabase = require(pathDatabaseConfig);
mongoose.connect(configDatabase.url);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected: ' + configDatabase.url);
});

// security ======================================================
// see https://strongloop.com/strongblog/best-practices-for-express-in-production-part-one-security/
app.disable('x-powered-by'); // for better security look into 'helmet' middleware

// ** If using seperate domain or port use Cross-Origin Resource Sharing
// ** in production look into a more granular configuration
// const cors = require('cors');
// app.use(cors());

// configuration =================================================
// passport configuration
require(pathPassportConfig)(passport);

// socket.io =====================================================
// add socket.io to the router res
app.use(function (req, res, next) {
  res.io = io;
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'dist')));

// session configuration =========================================
// NOTE: Avoid sessions before setting the static directory or Express will generate
// session requests for static files like images, style sheets, and JS files.
const mongooseConnection = mongoose.createConnection(configDatabase.url);
const sessionMongoStore = require('connect-mongo')(session);
var sessionConfig = {
  secret: process.env.SESSION_SECRET || 'development secret key',
  cookie: {
    secure: process.env.SESSION_SECURE || false
  },
  rolling: true, // Force session cookie to be set on every response. The expiration is reset to the original maxAge.
  resave: true, // Forces the session to be saved back to the session store, even if the session was never modified. 
  store: new sessionMongoStore({
    mongooseConnection: mongooseConnection,
    autoRemove: process.env.SESSION_TTL || 'disabled'
  })
}
if (process.env.SESSION_SECURE) app.set('trust proxy', 1) // trust first proxy
app.use(session(sessionConfig));

// passport init
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes ========================================================
app.use('/api/message', messageRoutes);
app.use('/api/user', userRoutes);
app.use('/', appRoutes);

// catch 404 and forward to index
app.use(function (req, res, next) {
    res.redirect(req.protocol + '://' + req.headers.host);
});

// HTTP Server ===================================================
const port = process.env.PORT || '3000';
app.set('port', port);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// HTTP Server Events ============================================
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
}
