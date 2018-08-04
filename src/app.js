/**
 * Module dependencies.
 */
import express from "express";
import compression from "compression";
import session from "express-session";
import bodyParser from "body-parser";
import logger from "morgan";
import chalk from "chalk";
import lusca from "lusca";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import passport from "passport";
import multer from "multer";

import routes from "./routes";

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */

if (process.env.NODE_ENV === "development") {
  console.log(
    chalk.blue(`NODE_ENV: ${process.env.NODE_ENV} | Setting path: .env.local`)
  );
  dotenv.load({
    path: ".env.dev"
  });
} else {
  console.warn(
    chalk.red("Starting production with .env.deploy")
  );
  dotenv.load({
    path: ".env.deploy"
  });
}

// Clear console on reboot
console.clear();
const app = express();


if (process.env.NODE_ENV === "development") {
  app.use(logger("dev"));
} else {
  app.use(
    logger("common", {
      stream: fs.createWriteStream("./access.log", {
        flags: "a"
      })
    })
  );
}
// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(compression());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.set('trust proxy', 1);

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  })
);
app.use(lusca({
  csrf: true,
  xframe: 'SAMEORIGIN',
  p3p: 'ABCDEF',
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xssProtection: true,
  nosniff: true,
  referrerPolicy: 'same-origin'
}));

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/', routes);

// l

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    });
});

export default app;
