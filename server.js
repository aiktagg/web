const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./routes/userRoute.js');
const weatherRouter = require('./routes/weatherRoute.js');
const adminRouter = require('./routes/adminRoute.js');
const logoutRoute = require("./routes/logoutRoute.js");
const archiveRouter = require('./routes/archiveRoute.js');
const countryRouter = require("./routes/countryRoute.js")
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: "aaa",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.dbURL
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 48, 
    },
}));

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '/views'));
app.use(flash());

app.use('/admin', adminRouter);
app.use('/country', countryRouter);
app.use("/archive", archiveRouter);
app.use('/', logoutRoute);
app.use("/", userRouter);
app.use("/weather", weatherRouter);

app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
});
app.use((req, res, next) => {
  if (req.session.user) {
      res.locals.user = req.session.user;
  }
  next();
});


mongoose.connect(process.env.dbURL).then(async () => {
  app.listen(3000, () => {
    console.log("Connected to database and listening on port 3000");
  });
}).catch((err) => console.error('Error connecting to database:', err));


