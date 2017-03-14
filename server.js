var express = require('express');
var bodyParser = require('body-parser');
var dbModel = require('./app/models/db-model');
var app = express();
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/buffer')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({storage: storage});


app.use(session({
  secret: require('./app/config.js').secret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ 
    url: require('./app/models/db-model').url
  })
}));
app.use(bodyParser());
app.use(express.static('./src/buffer'));                                                                
app.use(bodyParser.json());
app.use(express.static(__dirname + '/src'));                                                                                                    
app.set('views', './app/views');
app.set('view engine', 'jade');


app.get('/', function(req, res){ res.redirect('/main')});// сделать редирект на авторизацию

app.get('/main', require('./app/controllers/main').mainPage);
app.get('/logout', require('./app/controllers/auth').logout);//выйти
app.get('/login', require('./app/controllers/auth').loginPage);//войти
app.get('/create', require('./app/controllers/auth').createPage);//создать новго пользователя
app.get('/add_edit', require('./app/controllers/add_edit').editPage);//создание новой задачи
app.get('/edit/:_id', require('./app/controllers/edit').editRender);//просмотр правки
app.get('/imgundefined', function(req,res){res.send('Изображение не найдено')})

app.post('/create/user', require('./app/controllers/auth').createUser);//
app.post('/create/admin', require('./app/controllers/auth').createAdmin);//
app.post('/user/login', require('./app/controllers/auth').login);//логинимся
app.post('/edit/add', upload.single('screen'), require('./app/controllers/add_edit').editAdd)
app.post('/chat/add/:id', upload.single('screen2'), require('./app/controllers/edit').editChat);//отправить сообщение в чат

app.post('/edit/recipient/:id', require('./app/controllers/edit').editRecipient);
app.post('/edit/source_company/:id', require('./app/controllers/edit').editSourceCompany);
app.post('/edit/page/:id', require('./app/controllers/edit').editPage);
app.post('/edit/comment/:id', require('./app/controllers/edit').editComment);
app.post('/edit/screen/:id', upload.single('screen'), require('./app/controllers/edit').editScreen);
app.post('/edit/status/:id', require('./app/controllers/edit').editStatus);

app.get('/img/:filename', require('./app/controllers/db-files').getFile)
app.get('/edit/:id/:subid', require('./app/controllers/db-files').getComment)

//--------------------

app.get('/search/:status/:source/:page/:sort/:amount', require('./app/controllers/rest').getSearch);

app.listen(require('./app/config.js').port);
console.log('Server started!');                                                                                                                                                              