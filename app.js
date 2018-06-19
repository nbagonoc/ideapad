// bring in express
const express = require("express");
// bring in path
const path = require("path");
// bring in handlebars-express frontend engine
const exphbs = require("express-handlebars");
// bring in mongoose
const mongoose = require("mongoose");
// bring in body-parser
const bodyParser = require("body-parser");
// bring in method-override
const methodOverride = require("method-override");
// bring in connect-flash
const flash = require("connect-flash");
// bring in express-session
const session = require("express-session");
// bring in passport
const passport = require("passport");

// bring in routes
const ideasRoute = require("./routes/ideas");
const usersRoute = require("./routes/users");

// bring in passport config
require("./config/passport")(passport);
// bring in DB config
const db = require("./config/db_secret_key");

// place express in a variable
const app = express();

// connect to mongoose
mongoose
  .connect(db.mongoURI)
  .then(() => {
    console.log("we are connected");
  })
  .catch(err => console.log(err));

// static directory
app.use(express.static(path.join(__dirname, "public")));

// handlebars middleware
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// method override middleware
app.use(methodOverride("_method"));

// express-session middleware
app.use(
  session({
    secret: "super duper secret",
    resave: true,
    saveUninitialized: true
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// express-flash middleware
app.use(flash());

// Global middleware, error and success message/notification
app.use((req, res, next) => {
  res.locals.success_message = req.flash("success_message");
  res.locals.error_message = req.flash("error_message");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// index route
app.get("/", (req, res) => {
  const title = "Welcome";
  res.render("index", {
    title: title
  });
});

// use ideas route
app.use("/ideas", ideasRoute);
// use ideas route
app.use("/users", usersRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`we are live at ${port}`);
  // console.log('we are live at' + port);
});
