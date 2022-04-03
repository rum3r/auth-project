require("dotenv").config()
const express = require("express")
const app = express()
const PORT = 3000
const jwt = require("jsonwebtoken")

app.use(express.json())
const posts = [
  {
    username: 'kuljeet',
    title: 'Post 1'
  },
  {
    username: 'kevin',
    title: 'Post 2'
  }
]
let authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if(!token) return res.sendStatus(401)

  //callback will return error or user object that we passed in the payload while signing
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //this token is no longer valid
    if(err) return res.sendStatus(403)

    req.user = user
    next()
  })
}

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name))
})

app.listen(PORT, ()=> {
  console.log(`Listening on Port ${PORT}`)
})