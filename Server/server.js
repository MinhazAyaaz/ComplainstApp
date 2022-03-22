require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const mysql = require('mysql')


//Database connection credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nsucomplaints'
})
db.connect()

app.use(express.json());

app.get("/api", (req,res)=>{
  res.json({"users": ["userOne", "userTwo", "userThree"]})
})

app.listen(5000, ()=>{console.log("Server started on port 5000")})

// //Use this for every endpoint to validate api calls

app.post('/signup', async (req, res) => {

  if(req.body.role == '') res.sendStatus(410)
  if(req.body.name == '') res.sendStatus(411)
  if(req.body.nsuid == '') res.sendStatus(412)
  if(isNaN(req.body.nsuid)) res.status(601).send("Illegal ID wee woo")
  if(req.body.email == '') res.sendStatus(413)
  if(req.body.password == '') res.sendStatus(414)
  
  
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { 
      name: req.body.name,
      nsuid: req.body.nsuid,
      email: req.body.email,
      password: hashedPassword,
     };
    
    let role = req.body.role
    let name= req.body.name;
    let nsuid= req.body.nsuid;
    let email= req.body.email;
    let password= hashedPassword;
    let idscan = "n/a"
    let photo = "n/a"
    let status = "n/a"
    let sql = 'INSERT INTO user(nsuid, name, email, password, idscan, photo, status, role) VALUES ('
    sql = sql + mysql.escape(nsuid) +', '+ mysql.escape(name) +', '+ mysql.escape(email) +', '+ mysql.escape(password) +', '+ mysql.escape(idscan) +', '+ mysql.escape(photo) +', '+ mysql.escape(status) +', '+ mysql.escape(role) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/Gsignup', async (req, res) => {

  
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { 
      name: req.body.name,
      nsuid: req.body.nsuid,
      email: req.body.email,
      password: hashedPassword,
     };
    
    let role = "n/a"
    let name= req.body.name;
    let nsuid= req.body.nsuid;
    let email= req.body.email;
    let password= hashedPassword;
    let idscan = "n/a"
    let photo = "n/a"
    let status = "n/a"
    let sql = 'INSERT INTO user(nsuid, name, email, password, idscan, photo, status, role) VALUES ('
    sql = sql + mysql.escape(nsuid) +', '+ mysql.escape(name) +', '+ mysql.escape(email) +', '+ mysql.escape(password) +', '+ mysql.escape(idscan) +', '+ mysql.escape(photo) +', '+ mysql.escape(status) +', '+ mysql.escape(role) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/login', async (req, res) => {

  
  try{
    
    let id  = await req.body.nsuid
    let password = await req.body.password
    var fetchedData = null

    // let sql = 'SELECT * FROM user WHERE nsuid=\'54321\';'
    let sql = 'SELECT * FROM user WHERE nsuid=\'' + id + '\';'
    db.query(sql, async function (err, results, fields){
      console.log(results);
      fetchedData = results[0];
      // res.json(fetchedData).status(201)

      try {
        if(await bcrypt.compare(password, fetchedData.password)) {
          
          const accessToken = await jwt.sign({user: id}, process.env.ACCESS_TOKEN_SECRET)
          // console.log(accessToken)
          const at = {accessToken: accessToken}
          res.json(at.accessToken)

          // res.json(accessToken)
        } else {
          res.send('Failed')
        }
      } catch {
        res.status(502)
      }

    })
    
    
    
  }catch {
    res.status(501).send()
  }
  
})

function authenticateToken(req, res, next){
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
    if(err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.get('/getcomplaint/filed', authenticateToken, async (req, res) => {
  
  try {
    let id     = req.body.id
    let createdby = req.user.user
    
    let sql = 'SELECT * FROM complaint WHERE createdby = \''+ createdby+'\'ORDER BY complaintid DESC'

    db.query(sql, function (err, results, fields){
      console.log(results);
      res.json(results).status(201)
    })
    
  } catch {
    res.status(500).send()
  }
})

app.get('/getcomplaint/received', authenticateToken, async (req, res) => {
  
  try {
    let id     = req.body.id
    let createdby = req.user.user
    
    let sql = 'SELECT * FROM complaint WHERE createdby = \''+ createdby+'\'ORDER BY complaintid DESC'

    db.query(sql, function (err, results, fields){
      console.log(results);
      res.json(results).status(201)
    })
    
  } catch {
    res.status(500).send()
  }
})

app.post('/createcomplaint', authenticateToken, async (req, res) => {
  // res.json(req.user)
  try {
    let title     = req.body.title
    let against   = req.body.against
    let category  = req.body.category
    let body      = req.body.body
    let reviewer  = req.body.reviewer
    let createdby = req.user.user

    let sql = 'INSERT INTO complaint(title, against, category, body, reviewer, createdby) VALUES ('
    sql = sql + mysql.escape(title) +', '+ mysql.escape(against) +', '+ mysql.escape(category) +', '+ mysql.escape(body) +', '+ mysql.escape(reviewer) +', '+ mysql.escape(createdby) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

// Added on 12/03/2022
//Comment out if it doesn't work

app.post('/deletecomplaint', async (req, res) => {
  try {
    let id     = req.body.id
    
    // let sql = 'DELETE * FROM complaint WHERE'
    let sql = 'DELETE FROM complaint WHERE complaintid=\'' + id + '\';'
    

    db.query(sql, function (err, results, fields){
      console.log(results);
      res.status(201).send("Deleted successfully")
    })
    
  } catch {
    res.status(500).send()
  }
})

app.put('/updatecomplaint', async (req, res) => {
  try {
    let id     = req.body.id
    
    // let sql = 'UPDATE * FROM complaint WHERE'
    // sql = sql + mysql.escape(id)

    db.query(sql, function (err, results, fields){
      console.log(results);
      res.status(201).send("Deleted successfully")
    })
    
  } catch {
    res.status(500).send()
  }
})

//JWT test code

// app.post('/token', (req, res) => {
//   const refreshToken = req.body.token
//   if (refreshToken == null) return res.sendStatus(401)
//   if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     const accessToken = generateAccessToken({ name: user.name })
//     res.json({ accessToken: accessToken })
//   })
// })

// function generateAccessToken(user) {
//   return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
// }

// app.post('/testlogin', (req, res) => {
//   // Authenticate User

//   const username = req.body.username
//   const user = { name: username }

//   const accessToken = generateAccessToken(user)
//   const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
//   refreshTokens.push(refreshToken)
//   res.json({ accessToken: accessToken, refreshToken: refreshToken })
// })

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }
