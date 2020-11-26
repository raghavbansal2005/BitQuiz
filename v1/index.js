const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Question = require('./models/question')
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const session = require('express-session');
const User = require("./models/user");
const bodyParser = require("body-parser");



mongoose.connect('mongodb+srv://owner-raghav:password123456@cluster0.gc8q9.mongodb.net/fbla?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => { 
  console.log('Connected to the DB Successfuly!');
}).catch(err => {
  console.log('ERROR: ', err.message);
});
mongoose.set('useCreateIndex', true);


app.set("view engine", "ejs");



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionConfig = {
  secret: "password",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24
  } 
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash('error');
  next();
});

app.get("/", async (req, res) => {
  if(!req.isAuthenticated()){
    res.redirect("/register");
  } else {
    res.redirect("/quiz");
  }
});


app.get("/register", async (req, res) => {
    res.render("home");
});


app.post("/register", async(req, res)=> {
  const {username, email, password} = req.body;
  const user = new User({email, username});
  const registeredUser = await User.register(user, password);
  req.flash('success', 'Successfully signed up for BQuiz!');
  console.log(registeredUser);
  req.flash("Welcome to Bquiz!");
  res.redirect("/login");
});


app.get("/login", async (req, res) => {
  if(req.isAuthenticated()){
    res.redirect("/quiz");
  } else {
    res.render("./users/login");
  };
});

app.post("/login", passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), async (req, res) => {
  res.redirect('/quiz');
  console.log("A user has logged in");
})


app.get("/quiz", async (req, res) => {
  if(!req.isAuthenticated()){
    res.redirect("/register");
  } else{
    res.render("quiz");
  }
});













const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
  if (err) throw err
  console.log('Listening on port 3000...')
})