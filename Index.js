const express = require('express')
const { restart } = require('nodemon')
const bcrypt = require('bcryptjs')
const data = require('./data')
//console.log(data.users)
const app = express()
//app.listen(3000)
const PORT = 3000
//declaring new posts
const posts = [
    {
        Title: "Flowers in the attic",
        Description: "Non-fiction"
    },
    {
        Title: "The umbrella lady",
        Description: "Fiction"
    },
    {
        Title: "Sage’s eyes",
        Description: "Fiction"
    }]
//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
//declaring ejs and folders
app.set('view engine', 'ejs')
app.set('views', './views')
//Routes
app.get('/', (req, res) => {
    //res.send(“Welcome to our schedule website”)
    res.render('pages/home', {
        content: 'Welcome to our schedule website'
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
        /*console.log(data.users[req.params.id])
        res.render('pages/eachuser',{
            users: data.users[req.params.id]
        }) */
        const id = data.users[req.params.id]
        // const isNumber = /^[0-9]+$/.test(req.params.id)
        //const isAlphabet = /^[a-z A-Z]+$/
        // let isUser = false
        if (req.params.id < data.users.length)
            // {
            //     isUser = true
            // }
            // if(isNumber && isUser)
            // {
            //console.log(id)
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

    //create new schedule
    app.post('/Addschedule', (req, res) => {
        console.log(req.body)
        //declaring newSchedule
        const newSchedule = {
            'user_id': req.body.user_id,
            'day': req.body.day,
            'start_at': req.body.start_at,
            'end_at': req.body.end_at
        }
        //pushing newSchedule to data.schedules
        data.schedules.push(newSchedule)
        res.redirect('/schedules')
    })
    //add new post
    app.post('/posts', (req, res) => {
        console.log(req.body)
        posts.push(req.body)
        res.send(req.body)
    })
    //display all posts
    app.get('/posts', (req, res) => {
        res.send(posts)
    })
    //display specific posts
    app.get('/posts/:anything', (req, res) => {
        const id = req.params.anything
        const isNumber = /^[0-9]+$/.test(id)
        let isPost = false
        if (id < posts.length) {
            isPost = true
        }
        if (isNumber && isPost) {
            res.render('pages/eachpost', {
                post: posts[id]
            })
        }
        else {
            res.send("Not a valid number")
        }
    })
    //opens web page
    app.listen(PORT, () => {
        console.log(`App is listening at http://localhost:${PORT}`)
    })
//const newArray = new const[id]
