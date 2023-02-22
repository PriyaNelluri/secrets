require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require ("mongoose");
const encrypt = require ("mongoose-encryption");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/userDB");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));




const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {
    encryptedFields: ["password"],
    secret: process.env.SECRET
  });

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res)
{
    res.render("home")
});

app.get("/login", function(req, res)
{
    res.render("login")
});

app.get("/register", function(req, res)
{
    res.render("register")
});

// to register a user to DB//

app.post("/register", function(req, res)
{
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err)
  {
    if (err){console.log(err);}
    else{res.render("secrets");}
  });
});

// To log in//

app.post("/login", function(req, res)
{
    const userName = req.body.username;
    const password = req.body.password;

    User.findOne({email: userName}, function(err, foundUser)
    {
        if (err) {console.log(err);}
        else
        {
            if (foundUser) 
            {
                if(foundUser.password === password) { res.render("secrets");}
            }
        }
    });
});



app.listen(3000, function(req, res)
{
    console.log("succesfully working on port 3000!");
});