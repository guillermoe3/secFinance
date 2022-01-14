const express = require('express');
const app = express();
const path = require('path');

//server init
app.set("port", process.env.PORT || 3004);
app.listen(app.get("port"), () => console.log("Server start http://localhost:"+app.get("port")));

//app access public
app.use(express.static(path.resolve(__dirname, "../public")));

//uso JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//app view
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"))

//routes main
const main = require("./routes/main");
app.use(main);

//routes analysis
const investigations = require("./routes/investigations");
app.use(investigations);

//routes analysis
const analysis = require("./routes/analysis");
app.use(analysis);

//routes alerts
const alerts= require("./routes/alerts");
app.use(alerts);