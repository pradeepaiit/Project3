const express = require('express')
const { restart } = require('nodemon')
const bcrypt = require('bcryptjs')
const data = require('./data')
//console.log(data.users)
const app = express()

//app.listen(3000)

const PORT = 3000

//declaring new posts
/*const posts = [
    {firstname:"Donald",
    lastname:"Duck",
    email:"coincoin@gmail.com",
    password:"QgKe8hUlb4+p/ttTVC7mVT7vdgJ7EW+PrFNGIRseRzw=Mezards-MacBook-Pro:dmaiga laurie$"}
] */

//body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//Routes

app.get('/', (req, res)=>
{
    res.send("Welcome to our schedule website")
})

//calling values from users
app.get('/users',(req, res)=>
{
res.send(data.users)
})

//calling values from schedules
app.get('/schedules', (req, res)=>
{
    res.send(data.schedules)
})

//calling values with id
app.get('/users/:id', (req, res)=>
{
console.log(data.users[req.params.id])
res.send(data.users[req.params.id])
})

//calling values with Id from schedules
app.get('/users/:id/schedules', (req, res) =>
{
const id = req.params.id
let arr =[]
        for(let i = 0; i < data.schedules.length; i++)
        {
        if (id == data.schedules[i].user_id)
        {
        arr.push(data.schedules[i])
}}
             res.send(arr)
}
)

//create new user
app.post('/users/', (req,res) =>
{
console.log(req.body.password)
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
res.send(newUser)

})


//create new schedule
app.post('/schedules', (req,res) =>
{
    console.log(req.body)
    
//declaring newSchedule
const newSchedule = {
    'user_id' : 1,
    'day' : 2,
    'start_at' : "9AM",
    'end_at' : "2PM"
}

//pushing newSchedule to data.schedules
data.schedules.push(newSchedule)
res.send(newSchedule)

})

//add new post
app.post('/posts', (req, res) => {
    console.log(req.body)
    posts.push(req.body)
    res.send(req.body)
})

//display all posts
app.get('/posts', (req,res) =>
{
    res.send(posts)
})


//opens web page
app.listen(PORT, ()=>
{
    console.log(`App is listening at http://localhost:${PORT}`)
})

//const newArray = new const[id]