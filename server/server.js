
import express from 'express'
import * as url from 'url';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const staticPath = url.fileURLToPath(new URL('../client', import.meta.url))
const app = express();

app.use(express.static(staticPath))
app.use(express.json());

//Database
const adapter = new JSONFile('db.json')
const db = new Low(adapter)
await db.read()
db.data = db.data || {
  users: [], messages:
    [],
}

function authenticateUser(username, password) {
  // Tips: Array.some

  let match = db.data.users.find(user => user.username == username)

  console.log(match)
  if (!match) {
    console.log('> Wrong username\n')
    return false
  } else {
    let correctPassword = bcrypt.compareSync(password, match.password)
    if (correctPassword) {
      return true
      console.log('> Welcome user!')
    } else {
      return false
      console.log('> Password does not match.')
    }
  }
}


function userIsAuthorized(req) {
  // JWT kan skickas antingen i request body, med querystring, eller i header: Authorization
  let token = req.body.token || req.query.token
  if (!token) {
    let x = req.headers['authorization']
    if (x === undefined) {
      // Vi hittade ingen token, authorization fail
      return false
    }
    token = x.substring(7)
    // Authorization: Bearer JWT......
    // substring(7) för att hoppa över "Bearer " och plocka ut JWT-strängen
  }

  console.log('Token: ', token)
  if (token) {
    let decoded
    try {
      decoded = jwt.verify(token, process.env.SECRET)
    } catch (error) {
      console.log('Catch! Felaktig token!!', error.message)
      return false
    }
    const decodedToken = jwt.decode(token, process.env.SECRET)
    console.log('decoded: ', decodedToken)
    return decodedToken

  } else {
    console.log('Ingen token')
    return false
  }
}



app.get('/messages', (req, resp) => {
  const { messages } = db.data
  resp.send(messages)
});


//Server endpoint to create a message
app.post('/messages', async (req, resp) => {
  //Här har jag lagt till currentUsername för att testa om det syns på tipsen

  const user = userIsAuthorized(req)

  console.log(user)


  const message = req.body
  const { messages } = db.data

  message.date_created = new Date()

  if (user) {
    message.user = user
  } else {
    message.user = { username: 'anonymous' }
  }

  const savedMessage = messages.push(message)

  await db.write()

  resp.status = 201

  resp.send(`${savedMessage}`)
});


app.post('/users', async (req, resp) => {
  const user = req.body
  const { users } = db.data

  console.log('User:')

  console.log(user)

  const salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(user.password, salt)

  user.password = hashedPassword

  const savedUser = users.push(user)

  await db.write()

  resp.status = 201

  resp.send(`${savedUser}`)






})


dotenv.config()
const PORT = process.env.PORT
const SECRET = process.env.SECRET
console.log('port secret is:', PORT, SECRET)


// Middleware
app.use(express.json())
app.use((req, res, next) => {
  console.log(`${req.method}  ${req.url} `, req.body)
  next()
})



// Routes
// POST /login
app.post('/login', (req, res) => {

  const { username, password } = req.body

  // Finns användaren i databasen?
  if (authenticateUser(username, password)) {
    const userToken = createToken(username)
    res.status(200).send(userToken)

  } else {
    res.sendStatus(401)  // Unauthorized
    return
  }
  let match = db.data.users.find(user => user.username == username)
  if (!match) {
    console.log('> Wrong username\n')
  } else {
    let correctPassword = bcrypt.compareSync(password, match.password)
    if (correctPassword) {
      console.log('> Welcome user!')
    } else {
      console.log('> Password does not match.')
    }
  }


})

function createToken(username) {
  const user = { username: username }
  console.log('createToken: ', user, process.env.SECRET)
  const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
  user.token = token
  console.log('createToken', user)
  return user
}



export default app;




