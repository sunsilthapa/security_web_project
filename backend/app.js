const express = require("express")
const app = express()
const errorMiddleware = require("./middleware/error")
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const path =require("path")
const csrf = require('csurf')


//config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").config({path:"backend/config/config.env"});
 }

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

var cors = require('cors');
app.use(cors());


//Route import

const product = require("./routes/productRoute")
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")

app.use(bodyParser.urlencoded({
    extended: false
 }));


 // setup route middlewares
var csrfProtection = csrf({ cookie: true })
// Apply CSRF protection to all POST, PUT, and DELETE routes
// app.use(csrfProtection);

app.use("/api/v1",product)
app.use("/api/v1",user)
app.use("/api/v1",order)
app.use("/api/v1",payment)

// CSRF token route
app.get('/api/v1/csrf-token', csrfProtection,(req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

app.use(express.static(path.join(__dirname,"../frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})
//middleware  for errors
app.use(errorMiddleware)

module.exports = app