const express = require("express");
const path = require("path");
//const cookieParser = require("cookie-parser");

const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const compression = require("compression");

const routes = require("./app_server/routes");
const routesAPI = require("./app_api/routes");

const { PORT, MONGO_URL, SESSION_SECRET } = require("./config");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

mongoose.Promise = global.Promise;

mongoose.connection
  .on("error", (error) => console.log(error))
  .on("close", () => console.log("Database connection closed."))
  .once("open", () => {
    const info = mongoose.connections[0];
    console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
  });
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const app = express();

app.use(
  session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(compression());

app.disable("x-powered-by");

app.set("views", path.join(__dirname, "app_server", "views"));
app.set("view engine", "ejs");

app.use(favicon(path.join(__dirname, "public", "media", "favicon.ico")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);
app.use("/api", routesAPI);
app.get("*", (req, res) => {
  res.redirect("/");
});
app.post("/", (req, res) => {
  res.end();
});
app.post("*", (req, res) => {
  res.redirect(307, "/");
});

app.listen(PORT, () => {
  console.log(`Express server listening on port: ${PORT}`);
});
