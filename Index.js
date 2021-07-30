const express = require('express')
const { restart } = require('nodemon')
const bcrypt = require('bcryptjs')
const db = require('./database')
const data = require('./data')
const app = express()
//app.listen(3000)
const PORT = 3000

//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//declaring ejs and folders
app.set('view engine', 'ejs')
app.set('views', './views')

//Routes for home to display schedules
app.get('/', (req, res) => {

    db.any("SELECT * FROM schedules;")
    .then((schedules) => {
        console.log(schedules)
        res.render('pages/home', {
            schedule: schedules
        })
        })

    .catch((error) =>
    {
console.log(error)
res.send(error)
    })
})

//Route to display AddSchedule form
app.get('/new', (req,res) => {
    res.render('pages/AddSchedule')
})

 //create new schedule
 app.post('/new', (req, res) => {
    // console.log(req.body)
    
    //pushing created schedules to database
    db.none("INSERT INTO schedules(id, username, dayoftheweek, starttime, endtime) VALUES ($1, $2, $3, $4, $5);", [req.body.id,  req.body.username, req.body.dayoftheweek, req.body.starttime, req.body.endtime])
    .then(() => {
 res.redirect("/")
    })
    .catch((error) => {
        console.log(error)
      res.send(error.message)
    })
})

//calling values from users
app.get('/users', (req, res) => {
    console.log(data.users)
    res.render('pages/users', {
        data: data.users
      })
})
    //calling values from schedules
    app.get('/schedules', (req, res) => {
        res.render('pages/schedules',{
          schedule: data.schedules  
        })
    })

    //create AddUser
    app.get('/users/new', (req, res) => {
        res.render('pages/AddUser')
    })

    //create AddSchedule
    app.get('/schedules/new', (req, res) => {
        res.render('pages/AddSchedule')
    })

    //calling user values with id
    app.get('/users/:id', (req, res) => {
        const id = data.users[req.params.id]
        if (req.params.id < data.users.length)
            res.render('pages/eachuser',
                {
                    users: id
                }
            )
        else if (req.params.id >= data.users.length) {
            res.render('pages/error',
                { message: 'The input is invalid!' })
        }
    })

    //calling values with Id from schedules
    app.get('/users/:id/schedules', (req, res) => {
        const id = req.params.id
        const isNumber = /^[0-9]+$/.test(req.params.id)
        let isUser = false
        let arr = []
        for (let i = 0; i < data.schedules.length; i++) {
            if (id == data.schedules[i].user_id) {
                arr.push(data.schedules[i])
            }
        }
        if (req.params.id < data.schedules.length) {
            isUser = true
        }
        if (isNumber && isUser && arr.length !== 0) {
            res.render('pages/eachschedule',
                {
                    schedule: arr

                })
        }
        else {
            res.render('pages/error',
                { message: 'The input is invalid!' })
        }
    })

    //create new user using post function
    app.post('/AddUser', (req, res) => {
        console.log(req.body)
        const password = req.body.password
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        //declaring newUser
        const newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash
        }
        // pushing new user to data.users
        data.users.push(newUser)
        res.redirect('/users')
    })

    //opens web page
    app.listen(PORT, () => {
        console.log(`App is listening at http://localhost:${PORT}`)
    })
//const newArray = new const[id]
