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
// function checkAuthority(){

// }

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { 
      name: req.body.name,
      nsuid: req.body.nsuid,
      email: req.body.email,
      password: hashedPassword,
     };
    
    
    let name= req.body.name;
    let nsuid= req.body.nsuid;
    let email= req.body.email;
    let password= hashedPassword;
    let idscan = "n/a"
    let photo = "n/a"
    let status = "n/a"
    let sql = 'INSERT INTO user(nsuid, name, email, password, idscan, photo, status) VALUES ('
    sql = sql + mysql.escape(nsuid) +', '+ mysql.escape(name) +', '+ mysql.escape(email) +', '+ mysql.escape(password) +', '+ mysql.escape(idscan) +', '+ mysql.escape(photo) +', '+ mysql.escape(status) +');'
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
          res.send('Success')
          
        } else {
          res.send('Failed')
        }
      } catch {
        res.status(502).send()
      }

    })
    
    
    
  }catch {
    res.status(501).send()
  }
  
  // if (user == null) {
  //   return res.status(400).send('Cannot find user')
  // }
  // try {
  //   if(await bcrypt.compare(req.body.password, user.password)) {
  //     res.send('Success')
  //   } else {
  //     res.send('Not Allowed')
  //   }
  // } catch {
  //   res.status(500).send()
  // }
})


app.get('/getcomplaint', async (req, res) => {
  try {
    let id     = req.body.id
    
    let sql = 'SELECT * FROM complaint ORDER BY complaintid DESC'

    db.query(sql, function (err, results, fields){
      console.log(results);
      res.json(results).status(201)
    })
    
  } catch {
    res.status(500).send()
  }
})

app.post('/createcomplaint', async (req, res) => {
  try {
    let title     = req.body.title
    let against   = req.body.against
    let category  = req.body.category
    let body      = req.body.body
    let reviewer  = req.body.reviewer
    

    let sql = 'INSERT INTO complaint(title, against, category, body, reviewer) VALUES ('
    sql = sql + mysql.escape(title) +', '+ mysql.escape(against) +', '+ mysql.escape(category) +', '+ mysql.escape(body) +', '+ mysql.escape(reviewer) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

// Added on 12/03/2022
//Comment out if it doesn't work

app.delete('/deletecomplaint', async (req, res) => {
  try {
    let id     = req.body.id
    
    let sql = 'DELETE * FROM complaint WHERE'
    sql = sql + mysql.escape(id)

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

app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

app.post('/testlogin', (req, res) => {
  // Authenticate User

  const username = req.body.username
  const user = { name: username }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)
  res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
