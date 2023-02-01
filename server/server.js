
import express from 'express'
import * as url from 'url';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import * as dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
// import { authenticateUser } from './databas.js'
// import { get } from 'http';
//Den här importen behövder jag om currentUsername fungerar
// import {currentUsername} from '../client/script.js'
//  import { question } from 'readline-sync'
import bcrypt from 'bcrypt'



const staticPath = url.fileURLToPath(new URL('../client', import.meta.url))
const app = express();

app.use(express.static(staticPath))
app.use(express.json());

//Database
const adapter = new JSONFile('db.json')
const db = new Low(adapter)
await db.read()
db.data = {
  users: [], messages:
    [
      // { id: 1, text: "Use a good primer(anastasia)", date_created: new Date(), channel: "makeupTips" },
      // { id: 2, text: "Use concealer under the eyebrows and around the lips", date_created: new Date(), channel: "makeupTips" },
      // { id: 3, text: "Apply your foundation with a brush instead of a sponge or hands", date_created: new Date(), channel: "makeupTips" },
      // { id: 4, text: "Accentuate eyelashes with an eyelash curler", date_created: new Date(), channel: "makeupTips" },
      // { id: 5, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "makeupTips" },
      // { id: 6, text: "Accentuate eyelashes with an eyelash curler", date_created: new Date(), channel: "skin" },
      // { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "skin" },
      // { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "tutorial" },
      // { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "tutorial" },
      // { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "tutorial" }
    ],
  channels: []

}

// db.data = {
//   users: [],  messages: [
//     { id: 1, text: "Use a good primer(anastasia)", date_created: new Date(),channel: "makeupTips" },
//     { id: 2, text: "Use concealer under the eyebrows and around the lips", date_created: new Date(), channel: "makeupTips" },
//     { id: 3, text: "Apply your foundation with a brush instead of a sponge or hands", date_created: new Date(), channel: "makeupTips" },
//     { id: 4, text: "Accentuate eyelashes with an eyelash curler", date_created: new Date(), channel: "makeupTips" },
//     { id: 5, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "makeupTips" },
//     { id: 6, text: "Accentuate eyelashes with an eyelash curler", date_created: new Date(), channel: "skin" },
//     { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "skin" },
//     { id: 7, text: "Ta löst puder på ögonfransarna för att få mer volym", date_created: new Date(), channel: "tutorial" }
//   ], channels: []
// }

// db.data = {
//   users: [], messages: [
//     { id: 6, text: "this is how you use", date_created: new Date(), channels: "tutorial" },
//     { id: 7, text: "this is how you use", date_created: new Date(), channels: "tutorial" },
//     { id: 8, text: "this is how you use", date_created: new Date(), channels: "tutorial" },
//   ], channels: []
// }


let count = 5;

const todo = [
  { id: 1, text: "Use a good primer(anastasia)" },
  { id: 2, text: "Use concealer under the eyebrows and around the lips" },
  { id: 3, text: "Apply your foundation with a brush instead of a sponge or hands" },
  { id: 4, text: "Accentuate eyelashes with an eyelash curler" },
  { id: 5, text: "Ta löst puder på ögonfransarna för att få mer volym" }
];

function authenticateUser(username, password) {
  // Tips: Array.some
  const users = db.data.users
  console.log('users:', users)
  const found = users.find(user => user.username === username && user.password === password)

  return Boolean(found)
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

// This allows server to serve static files

app.get('/todo', (req, resp) => {
  resp.send(todo);
})



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

  const savedUser = users.push(user)

  await db.write()

  resp.status = 201

  resp.send(`${savedUser}`)
  const salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(user.password, salt)
  console.log(salt)


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


})

function createToken(username) {
  const user = { username: username }
  console.log('createToken: ', user, process.env.SECRET)
  const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
  user.token = token
  console.log('createToken', user)
  return user
}

// GET /secret
// app.get('/secret', (req, res) => {
//   // JWT kan skickas antingen i request body, med querystring, eller i header: Authorization
//   let token = req.body.token || req.query.token
//   if (!token) {
//     let x = req.headers['authorization']
//     if (x === undefined) {
//       // Vi hittade ingen token, authorization fail
//       res.sendStatus(401)
//       return
//     }
//     token = x.substring(7)
//     // Authorization: Bearer JWT......
//     // substring(7) för att hoppa över "Bearer " och plocka ut JWT-strängen
//   }

//   console.log('Token: ', token)
//   if (token) {
//     let decoded
//     try {
//       decoded = jwt.verify(token, process.env.SECRET)
//     } catch (error) {
//       console.log('Catch! Felaktig token!!')
//       res.sendStatus(401)
//       return
//     }
//     console.log('decoded: ', decoded)
//     res.send('You have access to the secret stuff.')

//   } else {
//     console.log('Ingen token')
//     res.sendStatus(401)
//   }
// })


//REGISTER
// const salt = bcrypt.genSaltSync(10);
//     let hashedPassword = bcrypt.hashSync(password, salt)
//     let user = { username, password: hashedPassword }


//LOGIN
//     let match = users.find(user => user.username == username)
//     if (!match) {
//       console.log('> Wrong username\n')
//     } else {
//       let correctPassword = bcrypt.compareSync(password, match.password)
//       if (correctPassword) {
//         console.log('> Welcome user!')
//       } else {
//         console.log('> Password does not match.')
//       }
//     }






// const users = []
// const salt = bcrypt.genSaltSync(10);
// console.log('Starting service... salt is ', salt)


// let input = ''

// while (input != 'q') {
//   input = question('Choose an option: ')
//   // console.log('You chose: ', input)

//   if (input == '1') {
//     let username = question('> Please enter username: ')
//     let password = question('> Please enter password: ')

//     let hashedPassword = bcrypt.hashSync(password, salt)
//     let user = { username, password: hashedPassword }

//     users.push(user)
//     console.log('')


//   } else if (input == '3') {
//     let username = question('> Please enter username: ')
//     let password = question('> Please enter password: ')


//     let match = users.find(user => user.username == username)
//     if (!match) {
//       console.log('> Wrong username\n')
//     } else {
//       let correctPassword = bcrypt.compareSync(password, match.password)
//       if (correctPassword) {
//         console.log('> Welcome user!')
//       } else {
//         console.log('> Password does not match.')
//       }
//     }
//   }
// }


export default app;




