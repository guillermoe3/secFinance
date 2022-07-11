const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const dotenv = require("dotenv")

//server init
app.set("port", process.env.PORT || 3004);
app.listen(app.get("port"), () => console.log("Server start http://localhost:"+app.get("port")));

//app access public
app.use(express.static(path.resolve(__dirname, "../public")));

//CORS
app.use(cors());

//dotenv

dotenv.config();


//uso JSON
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//app view
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"))

//routes main
const main = require("./routes/main");
app.use(main);

//routes investigations
const investigations = require("./routes/investigations");
app.use(investigations);

//routes analysis
const analysis = require("./routes/analysis");
app.use(analysis);

//routes alerts
const alerts= require("./routes/alerts");
app.use(alerts);

//routes users
const users= require("./routes/users");
app.use(users);

//routes bitacora
const bitacora= require("./routes/bitacora");
app.use(bitacora);


//routes business
const business= require("./routes/business");
app.use(business);