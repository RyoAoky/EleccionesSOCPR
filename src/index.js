const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });
const express = require('express');
const morgan = require('morgan');
const { create } = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const { dbSettings } = require('./database/keys');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const Sequelize = require('sequelize');
const MSSQLStore = require('express-session-sequelize')(session.Store);
const fs = require('fs');
const util = require('util');

const requerirAuth = function (req, res, next) {
  if (req.path.startsWith('/img/paciente')) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Acceso no autorizado');
  } else if (req.path.startsWith('/documentos')) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Acceso no autorizado');
  } else if (req.path.startsWith('/templates')) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Acceso no autorizado');
  } else if (req.path.startsWith('/img/medicos')) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).send('Acceso no autorizado');
  }
  else {
    return next();
  }
};

const app = express();
/*const accessLogStream = fs.createWriteStream(path.join(__dirname, 'logfile.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));*/

require('./lib/passport');

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

app.set('port', process.env.PORT);
app.set('views', path.join(__dirname, 'views'));
const exphbs = create({
  extname: '.hbs',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  defaultLayout: 'main',
});
app.engine('.hbs', exphbs.engine);
app.set('view engine', '.hbs');

app.use(cookieParser('secret'));

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 43200000 // 12 horas en milisegundos
    },
    store: new MSSQLStore({
      db: new Sequelize(dbSettings.database, dbSettings.user, dbSettings.password, {
        host: dbSettings.server,
        dialect: 'mssql',
        port: 10200,
        dialectOptions: {
          options: {
            encrypt: dbSettings.options.encrypt,
            trustServerCertificate: dbSettings.options.trustServerCertificate
          }
        },
        logging: false
      }),
      checkExpirationInterval: 15 * 60 * 1000,
      expiration: 24 * 60 * 60 * 1000
    })
  })
);

app.use(flash());
app.use(morgan('dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.message = req.flash('message');
  res.locals.user = req.user;
  next();
});

app.use(require('./routes/'));
app.use(require('./routes/configuracion'));
app.use(require('./routes/historiaclinica'));
app.use(require('./routes/entidades'));
app.use(require('./routes/descargas'));

app.use(requerirAuth, express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('Server on port', process.env.PORT);
});
