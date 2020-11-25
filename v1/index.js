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
  console.log('Connected to DB!');
}).catch(err => {
  console.log('ERROR:', err.message);
});
mongoose.set('useCreateIndex', true);


app.set("view engine", "ejs");



app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }))
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
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  next();
})



//  await Question.find({}).then(q => res.send(q));


app.get("/register", async (req, res) => {
    res.render("home");
});

app.get("/quiz", async (req, res) => {
  res.render("quiz");
});

app.get("/login", async (req, res) => {
  res.render("./users/login");
})

app.post("/register", async(req, res)=> {
  const {username, email, password} = req.body;
  const user = new User({email, username});
  const registeredUser = await User.register(user, password);
  req.flash('success', 'Successfully signed up for BQuiz!');
  console.log(registeredUser);
  req.flash("Welcome to Bquiz!");
  res.redirect("/login");
})





















const PORT = process.env.PORT || 3000

app.listen(PORT, err => {
  if (err) throw err
  console.log('Listening on port 3000...')
})