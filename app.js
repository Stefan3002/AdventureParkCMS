const express = require("express")
const bParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportMongoose = require("passport-local-mongoose")
const {plugin} = require("mongoose");
const Process = require("process");
require("dotenv").config()
const app = express()
const port = 3000
app.use(express.static("public"))
app.use(bParser.urlencoded({extended: true}))
app.set("view engine", "ejs")


app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

//MONGOOSE SCHEMAS
// mongoose.connect("mongodb://localhost/AdventureParkDB")
mongoose.connect(`mongodb+srv://Visitor:${process.env.DBPASS}@adventureparkdb.nuyljha.mongodb.net/?retryWrites=true&w=majority`)

//LOGIN
const userSchema = new mongoose.Schema({
    username: String,
    password: String
})
userSchema.plugin(passportMongoose)
const userModel = new mongoose.model("User", userSchema)
app.get("/login", (req,res) => {
    if(req.isAuthenticated())
        res.redirect("/dashboard")
    else
        res.render("loginForm")
})
passport.use(userModel.createStrategy())
passport.serializeUser(userModel.serializeUser())
passport.deserializeUser(userModel.deserializeUser())

app.post("/login", (req,res) => {
    passport.authenticate("local")(req, res, () => {
        res.redirect("/dashboard")
    })
})
// app.get("/register", (req,res) => {
//     res.render("registerForm")
// })
// app.post("/register", (req,res) => {
//     userModel.register({username: req.body.username}, req.body.password, (err, user) => {
//         if (err)
//             res.render("error", {err: err})
//         else
//             res.redirect("/login")
//     })
//
// })


//MORE INFO
app.get("/moreInfo/:type/:id", (req,res) => {
        servicesModel.findById(req.params.id, {}, {}, (err, item) => {
            if(err)
                res.render("error", {error: err})
            else
                res.render("moreinfo", {item: item})
        })
})

//TARIFFS
app.get("/tariffs", (req,res) => {
    servicesModel.find({},{},{}, (err, services) => {
        if(err)
            res.render("error", {error: err})
        else
            res.render("tariffs", {info: services})
    })

})

//LATEST

app.get("/latest", (req,res) => {
    res.render("latest")
})

//DASHBOARD
app.get("/dashboard", (req,res) => {
    if(req.isAuthenticated())
        res.render("dashboard")
    else
        res.redirect("/login")
})

//ACCOMMODATION
const servicesSchema = new mongoose.Schema({
    type: String,
    name: String,
    price: String,
    description: String,
    img: String
})
const servicesModel = new mongoose.model("Service", servicesSchema)
app.get("/filterServices/:type", (req,res) => {
    servicesModel.find({type: req.params.type}, {}, {}, (err, services) => {
        if(err)
            res.render("error", {error: err})
        else
            res.send(services)
    })
})
app.post("/servicesModify/:id/:type", (req,res) => {
    if(req.isAuthenticated()) {
        servicesModel.findByIdAndUpdate(req.params.id, req.body, {}, (err, service) => {
            if (err)
                res.render("error", {error: err})
            else
                res.redirect(`/servicesForm/${req.params.type}`)
        })
    }
    else
        res.redirect("/login")

})

app.get("/servicesForm/:type", (req,res) => {
    if(req.isAuthenticated()) {
        servicesModel.find({}, {}, {}, (err, services) => {
            if (err)
                res.render("error", {error: err})
            else
                res.render("servicesForm", {services: services, type: req.params.type})
        })
    }
    else
        res.redirect("/login")
})

app.get("/servicesDelete/:id/:type", (req,res) => {
    if(req.isAuthenticated()) {
        servicesModel.findByIdAndDelete(req.params.id, {}, (err, price) => {
            if (err)
                res.render("error", {error: err})
            else
                res.redirect(`/servicesForm/${req.params.type}`)
        })
    }
    else
        res.redirect("/login")
})

app.post("/services/:type", (req,res) => {
    const newService = new servicesModel({
        name: req.body.name,
        type: req.body.type,
        price: req.body.price,
        description: req.body.description,
        img: req.body.img
    })
    newService.save(err => {
        if(err)
            res.render("error", {error: err})
        else
            res.redirect(`/servicesForm/${req.params.type}`)
    })
})

app.get("/accommodation", (req,res) => {
    servicesModel.find({}, {}, {}, (err, services) => {
        if(err)
            res.render("error", {error: err})
        else
            res.render("accommodation", {services: services})
    })
})


//CONTACT
app.get("/contact", (req,res) => {
    servicesModel.find({}, {}, {}, (err, services) => {
        if(err)
            res.render("error", {error: err})
        else
            res.render("contact", {services: services})
    })

})

//GALLERY
const gallerySchema = new mongoose.Schema({
    img: String
})
const galleryModel = new mongoose.model("Gallery", gallerySchema)
app.get("/galleryDelete/:id", (req,res) => {
    if(req.isAuthenticated()) {
        galleryModel.findByIdAndDelete(req.params.id, {}, (err, img) => {
            if (err)
                res.render("error", {error: err})
            else
                res.redirect("gallery")
        })
    }
    else
        res.redirect("/login")
})
app.post("/gallery", (req,res) => {
    if(req.isAuthenticated()) {
        const newImg = new galleryModel({
            img: req.body.img
        })
        newImg.save(err => {
            if (err)
                res.render("error", {error: err})
            else
                res.redirect("gallery")
        })
    }
    else
        res.redirect("/login")
})
app.get("/imagesForm", (req,res) => {
    if(req.isAuthenticated()) {
        galleryModel.find({}, {}, {}, (err, imgs) => {
            if (err)
                res.render("error", {error: err})
            else
                res.render("imagesForm", {imgs: imgs})
        })
    }
    else
        res.redirect("/login")

})
app.get("/gallery", (req,res) => {
    galleryModel.find({}, {}, {}, (err,gallery) => {
        if(err)
            res.render('error', {err: err})
        else
            res.render("gallery", {imgs: gallery})
    })
})


//ATTRACTIONS
app.get("/attractions", (req,res) => {
    servicesModel.find({}, {}, {}, (err, services) => {
        if(err)
            res.render("error", {error: err})
        else
            res.render("attractions", {services: services})

    })

})

app.get("/", (req,res) => {
    res.render("index")
})

app.listen(Process.env.PORT || port, () => {
    console.log("App started on: " + port)
})