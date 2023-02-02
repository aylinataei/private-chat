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
const hiddenTextBox = document.querySelector('.hiddenTextBox')


let currentUsername = 'guest'
let activeChannel = 'makeupTips'
let messages = []
let isLoggedIn = false

const JWT_KEY = 'securChatJWT';
const USER = 'secureCharUser'

// --- FUNCTIONS  START ---

function calculateTime(date) {
  const now = new Date();
  const timeDifference = now - date;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60
  };
}

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
    const timeSince = calculateTime(new Date(message.date_created))
    const dayString = `${timeSince.days} days ago , `
    const hourString = `${timeSince.hours} hours ago , `
    const minutesString = `${timeSince.minutes} minutes ago , `
    const secondsString = `${timeSince.seconds} seconds ago  `
    const dateString = `${timeSince.days > 0 ? dayString : ''} ${timeSince.hours > 0 ? hourString : ''} ${timeSince.minutes > 0 ? minutesString : ''} ${timeSince.seconds > 0 ? secondsString: ''}`

    li.innerText = `${message.user ? message.user.username : ''} | ${dateString} | ${message.text}.`
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

function updateLoginStatus() {
  loginBnt.disabled = isLoggedIn
  logoutBnt.disabled = !isLoggedIn
  tutorialBtn.disabled = !isLoggedIn;

  if (isLoggedIn) {
    hiddenTextBox.classList.add('hidden')
    tutorialBtn.innerHtml = 'Tutorial (open)';
  } else {
    hiddenTextBox.classList.remove('hidden')
    tutorialBtn.innerHtml = 'Tutorial (locked) ';
  }
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
  // 
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
    hiddenTextBox.classList.add('hidden')
    welcomeTag.innerHTML = "Hello " + usernameValue

  } else {  // status 401 unauthorized
    console.log('Login failed, status: ' + response.status)
  }
  updateLoginStatus()

})



logoutBnt.addEventListener('click', async () => {
  localStorage.removeItem(JWT_KEY);
  localStorage.removeItem(USER);
  isLoggedIn = false;
  hiddenTextBox.classList.remove('hidden')
  tutorialBtn.disabled = true;
  console.log('logout succited')
  welcomeTag.innerHTML = "Welcome User"

  updateLoginStatus()
})

// 

makeUpTipsBtn.addEventListener('click', () => {
  // If request is successful clear all li child elements
  while (makeupTips.firstChild) {
    makeupTips.removeChild(makeupTips.firstChild);
  }

  activeChannel = 'makeupTips'
  title.innerHTML = activeChannel

  const list = messages.filter(message => message.channel === 'makeupTips')

  list.filter(message => message.channel === activeChannel).forEach(message => {
    let li = document.createElement('li')
    const timeSince = calculateTime(new Date(message.date_created))
    const dayString = `${timeSince.days} days ago , `
    const hourString = `${timeSince.hours} hours ago , `
    const minutesString = `${timeSince.minutes} minutes ago , `
    const secondsString = `${timeSince.seconds} seconds ago  `
    const dateString = `${timeSince.days > 0 ? dayString : ''} ${timeSince.hours > 0 ? hourString : ''} ${timeSince.minutes > 0 ? minutesString : ''} ${timeSince.seconds > 0 ? secondsString: ''}`
    console.log(dateString)

    console.log(calculateTime(message.date_created))
    li.innerText = `${message.user ? message.user.username : ''} | ${dateString} | ${message.text}.`
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

  list.filter(message => message.channel === activeChannel).forEach(message => {
    let li = document.createElement('li')
    const timeSince = calculateTime(new Date(message.date_created))
    const dayString = `${timeSince.days} days ago , `
    const hourString = `${timeSince.hours} hours ago , `
    const minutesString = `${timeSince.minutes} minutes ago , `
    const secondsString = `${timeSince.seconds} seconds ago  `
    const dateString = `${timeSince.days > 0 ? dayString : ''} ${timeSince.hours > 0 ? hourString : ''} ${timeSince.minutes > 0 ? minutesString : ''} ${timeSince.seconds > 0 ? secondsString: ''}`
    li.innerText = `${message.user ? message.user.username : ''} | ${dateString} | ${message.text}.`
    makeupTips.appendChild(li)
  })
})

// --- EVENT LISTENERS END ---


// Function to start application
const startApplication = async () => {
  getAllMessages()

  const user = JSON.parse(localStorage.getItem(USER))

  console.log(user)
  if (user) {
    welcomeTag.innerHTML = "Welcome " + user.username
    isLoggedIn = true
  } else {
    isLoggedIn = false
  }

  updateLoginStatus()

}

// Listen to the dom being finished loading so we can use document
document.addEventListener('DOMContentLoaded', startApplication);


