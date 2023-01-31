//Backend ska ha en databas som sparar användare och meddelanden

// const low = require('lowdb');
// const FileSync = require('lowdb/adapters/FileSync');
// const bcrypt = require('bcrypt');

// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'

// Skapa en lowdb med en JSON-fil som lagring(storage)

// File path
const __dirname = dirname(fileURLToPath( import.meta.url));
const file = join(__dirname, '../db.json')

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file)
const db = new Low(adapter)

await db.read()

// Create the users and messages tables if they don't exist
// db.defaults({ users: [], messages: [], channels: [] }).write();


// If db.json doesn't exist, db.data will be null
// Use the code below to set default data
// db.data = db.data || { posts: [] } // For Node < v15.x
db.data = db.data || { users: [], messages: [{id: 1, text: 'test'}], channels: [] }

// Finally write db.data content to file
await db.write()// For Node >= 15.x

// // Add a new user to the users table
// db.get('users')
//   .push({ id: 1, username: 'johndoe', password: 'password' })
//   .write();

// // Add a new message to the messages table
// db.get('messages')
//   .push({ id: 1, sender: 'johndoe', recipient: 'janedoe', text: 'Hello, Jane!' })
//   .write();

// // Get all the users from the users table
// const users = db.get('users').value();
// console.log(users);

// // Get all the messages from the messages table
// const messages = db.get('messages').value();
// console.log(messages);



const createUser = (username, password) => {
  // db.get('users')
  // .push({ id: 1, username: 'johndoe', password: 'password' })
  // .write();
};

const getMessages = () =>{
  db.read()
  const messages = db.data.messages
  console.log(messages)
  return messages
  
}

function authenticateUser(userName, password) {
  // Tips: Array.some
  const users = db.data.users
  console.log('users:', users)
  const found = users.find(user => user.name === userName && user.password === password)

  return Boolean(found)
}


export { createUser, getMessages, authenticateUser};

 //Inloggning med användarnamn och lösenord, samt registrera ny användare.
 
// const bcrypt = require('bcrypt');


// db.defaults({ users: [] }).write();

// // Register a new user
// const register = (username, password) => {
//   const salt = bcrypt.genSaltSync();
//   const hashedPassword = bcrypt.hashSync(password, salt);

//   db.get('users')
//     .push({ username: username, password: hashedPassword })
//     .write();
// };


// // Login a user
// const login = (username, password) => {
//   const user = db.get('users').find({ username: username }).value();
//   if (user) {
//     return bcrypt.compareSync(password, user.password);
//   } else {
//     return false;
//   }
// };

// // example usage
// register("JohnDoe", "password123");
// console.log(login("JohnDoe", "password123")); // true
// console.log(login("JohnDoe", "wrongpassword")); // false





// const fakeDb = [
//   { name: 'Lovisa', password: 'hej123' }
// ]

// // function userExist(userName) {}

// function authenticateUser(userName, password) {
//   // Tips: Array.some
//   const found = fakeDb.find(user => user.name === userName && user.password === password)

//   return Boolean(found)
// }

// // function createToken(name) {
// //   const user = { name: name }
// //   console.log('createToken: ', user, process.env.SECRET)
// //   const token = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' })
// //   user.token = token
// //   console.log('createToken', user)
// //   return user
// // }

// export { authenticateUser }



