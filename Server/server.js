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

//Use this for every endpoint to validate api calls
function checkAuthority(){

}

app.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const user = { 
      name: req.body.name,
      nsuid: req.body.nsuid,
      email: req.body.email,
      password: hashedPassword,
     };
    users.push(user); //just for testing
    let name= req.body.name;
    let nsuid= req.body.nsuid;
    let email= req.body.email;
    let password= hashedPassword;
    let sql = 'INSERT INTO user(nsuid, name, email, password) VALUES ('
    sql = sql + mysql.escape(nsuid) +', '+ mysql.escape(name) +', '+ mysql.escape(email) +', '+ mysql.escape(password) +');'
    db.query(sql)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Not Allowed')
    }
  } catch {
    res.status(500).send()
  }
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