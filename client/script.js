// Html elements used
const sendButton = document.querySelector('#sendButton')
const makeupTips = document.querySelector('#makeupTips')
const registerBtn = document.querySelector('#register')
const loginBnt = document.querySelector('#Login')
const logoutBnt = document.querySelector('#Logout')
const tutorialBtn = document.querySelector('#tutorialBtn')
const makeUpTipsBtn = document.querySelector('#makeUpTipsBtn')
const welcomeTag = document.getElementById('welcomeTag')
const title = document.querySelector('#title')

let currentUsername = 'guest'

let activeChannel = 'makeupTips'
let messages = []

const channels = [
  { id: '' }
]

// --- FUNCTIONS  START ---

//Function to get all messages from server
const getAllMessages = async () => {

  // Object that holds settings for request to server
  const options = {
    method: 'GET',
    headers: {
      // MIME type: application/json
      "Content-Type": "application/json"
    }
  }

  // Request to server
  const response = await fetch('/messages', options)

  // Handle if the request to  server was not successful
  if (response.status !== 200) {
    console.log('Could not contact server. Status: ' + response.status)
    // Just out of function if response was not successful 
    return
  }


  // If request is successful clear all li child elements
  while (makeupTips.firstChild) {
    makeupTips.removeChild(makeupTips.firstChild);
  }

  // Add returned list to html
  list = await response.json()
  console.log('Data from server: ', list)

  messages = list

  list.filter(message => message.channel === activeChannel).forEach(message => {
    let li = document.createElement('li')
    li.innerText = `${message.user ? message.user.username : ''} | ${message.date_created} | ${message.text}.`
    makeupTips.appendChild(li)
  })
}


// --- FUNCTIONS  END ---

// --- EVENT LISTENERS START ---

// Listen to button click 
sendButton.addEventListener('click', async () => {
  // Retrieve value from input element
  const value = document.querySelector('#newMessage').value
  console.log(value)


  const newMessage = { id: 123, text: value, channel: activeChannel }

  // Object that holds settings for request to server
  const jwt = localStorage.getItem(JWT_KEY)
  const options = {
    method: 'POST',
    body: JSON.stringify(newMessage),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwt
    }
  }


  // Call to server
  const response = await fetch('/messages', options)

  // Handle request not successful 
  if (response.status !== 200) {
    console.log('Could not contact server. Status: ' + response.status)
    return
  }

  // If successful retrieve all messages again
  getAllMessages()

})

registerBtn.addEventListener('click', async () => {
  const usernameValue = document.querySelector('#username').value
  const passwordValue = document.querySelector('#password').value


  const user = {
    username: usernameValue,
    password: passwordValue
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  }
  const response = await fetch('/users', options)
  console.log('Creating...')

  if (response.status !== 201) {
    console.log('Could not contact server. Status: ' + response.status)
    return
  }

  console.log('Success!')

})
const JWT_KEY = 'securChatJWT';
const USER = 'secureCharUser'
let isLoggedIn = false

function updateLoginStatus() {
  loginBnt.disabled = isLoggedIn
  logoutBnt.disabled = !isLoggedIn
}


loginBnt.addEventListener('click', async () => {
  const usernameValue = document.querySelector('#username').value
  const passwordValue = document.querySelector('#password').value

  const user = {
    username: usernameValue,
    password: passwordValue
  }

  const options = {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json"
    }
  }
  const response = await fetch('/login', options)
  if (response.status === 200) {
    console.log('Login successful')
    const user = await response.json()
    console.log('User token: ', user)
    // Spara user.token
    localStorage.setItem(JWT_KEY, user.token)
    localStorage.setItem(USER, JSON.stringify(user))
    isLoggedIn = true
    //när man loggar ut msåte jag sätta dehär till true istället för false det gör att knappen kommer bli disabled
    tutorialBtn.disabled = false;
    currentUsername = usernameValue;
    welcomeTag.innerHTML = "Welcome " + usernameValue

  } else {  // status 401 unauthorized
    console.log('Login failed, status: ' + response.status)
  }
  updateLoginStatus()

})


// logoutBnt.addEventListener('click', async () => {
//   const usernameValue = document.querySelector('#username').value
//   const passwordValue = document.querySelector('#password').value

//   const user = {
//     username: usernameValue,
//     password: passwordValue
//   }

//   const options = {
//     method: 'POST',
//     body: JSON.stringify(user),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   }
// })

makeUpTipsBtn.addEventListener('click', () => {
  // If request is successful clear all li child elements
  while (makeupTips.firstChild) {
    makeupTips.removeChild(makeupTips.firstChild);
  }

  activeChannel = 'makeupTips'
  title.innerHTML = activeChannel

  const list = messages.filter(message => message.channel === 'makeupTips')

  list.forEach(tip => {
    let li = document.createElement('li')
    li.innerText = `${tip.date_created} | ${tip.text}.`
    makeupTips.appendChild(li)
  })
})

tutorialBtn.addEventListener('click', () => {
  // If request is successful clear all li child elements

  activeChannel = 'tutorial'
  title.innerHTML = activeChannel

  while (makeupTips.firstChild) {
    makeupTips.removeChild(makeupTips.firstChild);
  }

  const list = messages.filter(message => message.channel === 'tutorial')

  list.forEach(tip => {
    let li = document.createElement('li')
    li.innerText = `${tip.date_created} | ${tip.text}.`
    makeupTips.appendChild(li)
  })
})

// --- EVENT LISTENERS END ---


// Function to start application
const startApplication = async () => {
  getAllMessages()

  const user = JSON.parse(localStorage.getItem(USER))

  console.log(user)
  if(user) {
    welcomeTag.innerHTML = "Welcome " + user.username
  }

}

// Listen to the dom being finished loading so we can use document
document.addEventListener('DOMContentLoaded', startApplication);


// // Används med localStorage
// const JWT_KEY = 'bookapi-jwt'
// let isLoggedIn = false

// function updateLoginStatus() {
//   btnLogin.disabled = isLoggedIn
//   btnLogout.disabled = !isLoggedIn
// }

// btnLogin.addEventListener('click', async () => {
//   // hämta username och password
//   // skicka med POST request till servern
//   // när servern svarar:
//   // - updatera gränssnittet
//   // - spara JWT i localStorage

//   const user = {
//     name: inputUsername.value,
//     password: inputPassword.value
//   }
//   // "Optimistisk" kod
//   const options = {
//     method: 'POST',
//     body: JSON.stringify(user),
//     headers: {
//       // MIME type: application/json
//       "Content-Type": "application/json"
//     }
//   }
//   const response = await fetch('/login', options)
//   if (response.status === 200) {
//     console.log('Login successful')
//     const userToken = await response.json()
//     console.log('User token: ', userToken)
//     // Spara userToken.token
//     localStorage.setItem(JWT_KEY, userToken.token)
//     isLoggedIn = true

//   } else {  // status 401 unauthorized
//     console.log('Login failed, status: ' + response.status)
//   }
//   updateLoginStatus()
// })



// async function getBooks() {
//   // 1. skicka ett request till backend: GET /api/books
//   // 2. backend skickar tillbaka lista med böcker (förhoppningsvis)
//   // 3. spara datan i en variabel
//   // 4. rendera DOM-element som visar datan == skapa DOM-element som innehåller titel och författare som text

//   // Skicka request med AJAX. Ett enkelt GET-request behöver inga inställningar
//   let bookData = null
//   try {
//     const response = await fetch('/api/books')
//     if (response.status !== 200) {
//       console.log('Could not contact server. Status: ' + response.status)
//       return
//     }
//     bookData = await response.json()
//     console.log('Data from server: ', bookData)

//   } catch (error) {
//     console.log('Something went wrong when fetching data from server. (GET) \n' + error.message)
//     return
//   }

//   booksList.innerHTML = ''

//   bookData.forEach(book => {
//     // Bok-objekt har egenskaperna: title, authorName, id
//     // skapa ett <li> element
//     // fyll elementet med bokdata (titel osv.)
//     // lägg till sist i <ul>

//     let li = document.createElement('li')
//     li.innerText = `${book.title} by ${book.authorName}.`
//     booksList.appendChild(li)
//   })
// }
// btnGetBooks.addEventListener('click', getBooks)


// btnPostBook.addEventListener('click', async () => {
//   // 0. skicka med JWT om vi är inloggade
//   // 1. skicka ett POST /api/books request med data i request body
//   // 2. Vad skickar servern för svar?
//   // 3. uppdatera gränssnittet

//   const newBook = {
//     title: 'Liftarens guide till galaxen',
//     authorName: 'Douglas Adams',
//     id: 42
//   }

//   const jwt = localStorage.getItem(JWT_KEY)
//   const options = {
//     method: 'POST',
//     body: JSON.stringify(newBook),
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + jwt
//     }
//   }
//   // TODO: lägg till try/catch eftersom fetch är en osäker operation
//   const response = await fetch('/api/books', options)

//   if (response.status === 200) {
//     // Allt gick bra
//     // Skicka ett nytt GET request och uppdatera gränssnittet
//     getBooks()

//   } else {
//     // Något gick fel
//     console.log('Något gick fel vid POST request! status=', response.status)
//   }
// })