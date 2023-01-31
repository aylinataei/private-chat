



// import express from 'express'
// import * as dotenv from 'dotenv'
// import jwt from 'jsonwebtoken'
// import { authenticateUser  } from './database.js'


// const app = express()
// dotenv.config()
// const PORT = process.env.PORT
// const SECRET = process.env.SECRET
// console.log('port secret is:', PORT, SECRET)


// // Middleware
// app.use(express.json())
// app.use((req, res, next) => {
//   console.log(`${req.method}  ${req.url} `, req.body)
//   next()
// })


// // Routes
// // POST /login
// app.post('/login', (req, res) => {
//   // const name = req.body.name
//   // const password = req.body.password
//   const { name, password } = req.body

//   // Finns användaren i databasen?
//   if (authenticateUser(name, password)) {
//     const userToken = createToken(name)
//     res.status(200).send(userToken)

//   } else {
//     res.sendStatus(401)  // Unauthorized
//     return
//   }
// })

// function createToken(name) {
//  const user = { name: name }
//  const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
//  user.token = token
//  console.log('createToken', user)
//  return user
//  }


// // GET /secret
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
//     res.sendStatus(401)  // Unauthorized
//   }
// })





