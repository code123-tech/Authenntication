//////////////////////////Importing Modules PART and SEt Necessary Part////////////////////////
//Configuration for devnot
require('devnot').config();
const express = require('express');
const ejs = require('ejs');
const bodyparser = require("body-parser");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: true }));

//////////////////////////Mongoose Part//////////////////////////////////////

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true, useUnifiedTopology: true });
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);
/////////////////////////Main PArt//////////////////////
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});



app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                }
            } else {
                res.wrtie("Doesn't exist. Please first Register Yourself");
            }
        }
    });
});


app.listen(8080, (err) => {
    if (!err)
        console.log("Connected Successfully");
    else
        console.log(err);
});