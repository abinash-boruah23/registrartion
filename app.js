const express = require("express");
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const User = require('./models/users');
const { render } = require('ejs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

//swagger

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Register API',
      version: '1.0.0',
    },
  },
  apis: ['app.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//config


app.set("view engine", 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({
    extended: true
}));
mongoose.connect("mongodb+srv://firstuser:12345@cluster0.vqwvf.mongodb.net/register?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true  });


// passportConfig
app.use(require('express-session')({
    secret:  'Jesus is the way',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Register

/**
 * @swagger
 * /:
 *   get:
 *     description: Get registration form.
 *     responses:
 *       200:
 *         description: Success.
 */

app.get('/',(req,res)=>{
    res.render("index")
})

app.post('/', (req,res)=>{
    req.body.firstname;
    req.body.lastname;
    req.body.username;
    req.body.password;
    User.register(new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username}), req.body.password, (err,user)=>{
        if(err){
            console.log(err);
            res.render("/");
        }
        passport.authenticate("local")(req, res, ()=>{
            res.redirect("/secret");
        });
    });
});

//Login

/**
 * @swagger
 * /login:
 *   get:
 *     description: Get login form.
 *     responses:
 *       200:
 *         description: Success.
 */
app.get('/login', (req,res)=>{
    res.render('login');
})

app.post('/login', passport.authenticate('local',{
    successRedirect: '/secret',
    failureRedirect: '/login'
}),(req,res)=>{
});

// 
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
};

/**
 * @swagger
 * /logout:
 *   get:
 *     description: Logout route.
 *     responses:
 *       200:
 *         description: Success.
 */
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
});

//Secret

/**
 * @swagger
 * /secret:
 *   get:
 *     description: Enter Secret Page.
 *     responses:
 *       200:
 *         description: Success.
 */
app.get('/secret', isLoggedIn, (req,res)=>{
    res.render('secret');
})

app.listen(3000,()=>{
    console.log("server is running at 3000");
})