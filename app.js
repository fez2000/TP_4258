require("dotenv").config(); // eslint-disable-line

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const csrf = require("csurf");
const session = require("cookie-session");
const mongoose = require("mongoose");
const TokenGenerator = require("uuid-token-generator");
const favicon = require("serve-favicon");
const multer = require("multer");
const compression = require("compression");
const minify = require("express-minify");
const fs = require("fs");
const i18n = require("i18n");
const config = require("./config/serverLang");
const detector = require("spider-detector");

config.directory = `${__dirname}/locales`;
i18n.configure(config);

const app = express();
const indexRouter = require("./routes/index");

let mongoUri = process.env.DB_URL;
const token = new TokenGenerator(256);

if (process.env.NODE_ENV === "test") {
    mongoUri = process.env.DB_TEST_URL;
}
mongoose.connect(mongoUri, { autoIndex: false, useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", err => {
    // eslint-disable-next-line no-console
    console.log(err);
    throw new Error(`unable to connect to database at ${mongoUri}`);
});
require("./models/index");

// supprimer la db
/*db.dropDatabase("voteapp", err => {
    // eslint-disable-next-line no-console
    console.log(err);
});*/

const { init } = require("./util/dbInit");

init();

const { corsOptions } = require("./config/cors");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
if (process.env.NODE_ENV !== "test") {
  //  app.use(cors(corsOptions));
}

app.use(helmet());

app.use(
    logger("dev", {
        skip(req, res) {
            return res.statusCode < 400;
        }
    })
);

if (process.env.NODE_ENV === "production") {
    app.use(
        logger("common", {
            stream: fs.createWriteStream(path.join(__dirname, "access.log"), {
                flags: "a"
            })
        })
    );
} else {
    app.use(logger("combined"));
}
app.use(detector.middleware());
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: "20mb" }));
app.use(cookieParser(token.generate()));
app.use(session({ secret: "gkfgo,fkg,fklgflkg,lkf,gklf@fdfndjkfndk133" }));
app.use(i18n.init);

if (process.env.NODE_ENV !== "test") {
    app.use(csrf({ cookie: true }));
}

if (process.env.NODE_ENV === "production") {
    app.use(compression({ threshold: 1 }));
    app.use(minify());
    app.use(favicon(path.join(__dirname, "public/favicon.ico")));

}
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "uploads")));

app.locals = {
    publicDir: path.resolve(__dirname, "public")
};
// eslint-disable-next-line consistent-return

require("./routes/routes")(app);

app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
