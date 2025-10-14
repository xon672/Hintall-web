import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
import { getDatabase, ref, child, get, set, update, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"
const firebaseConfig = {
  apiKey: "AIzaSyCnCiDCRqoHtMrEPdwyOYppcxPf1QUdt1E",
  authDomain: "hintall.firebaseapp.com",
  databaseURL: "https://hintall-default-rtdb.firebaseio.com",
  projectId: "hintall",
  storageBucket: "hintall.appspot.com",
  messagingSenderId: "869161438156",
  appId: "1:869161438156:web:65195d9e5c1b6b2c3bab69",
  measurementId: "G-PJFX79LC8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Importing authentication 
//import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(app);
const db = getDatabase();

const analytics = getAnalytics(app);
//variables 
var navContainer = document.querySelector(".navContainer")
var openNavContainer = document.querySelector(".openNavContainer");
var hintAllName = document.querySelector(".hintAllName")
var logoNameHolder = document.querySelector(".logoNameHolder")
var navUnderling = document.querySelector('.underling')
var pageLink = document.querySelectorAll(".pageLinkHolder a")
var moodButton = document.querySelector(".moodButton")
var mainPage = document.getElementById('main')
var links = document.querySelectorAll('.pageLinkHolder i')
var body = document.querySelector('.html')
var loginSignBtn = document.querySelector('.loginSignBtn')
var signLoginBtn = document.querySelector('.signLoginBtn')
var signPage = document.getElementById('SignPage')
var logPage = document.getElementById('loginPage')
var signupBtn = document.getElementById('signupBtn')
var loginBtn = document.getElementById('loginBtn')
var profileMineBtn = document.getElementById('mineGint')
var nextAppImgBtn = document.getElementById('nextImg')
var prevAppImgBtn = document.getElementById('prevImg')
var appImg = document.getElementById('appImg')
const lightMoodImg= ['/images/LightImg1.jpg', '/images/Lightimg2.jpg', '/images/Lightimg3.jpg'];
const darkMoodImg= ['/images/DarkImg1.jpg', '/images/Darkimg2.jpg', '/images/Darkimg3.jpg']; 
let currentIndex = 0;


//Boolean variables 
var onDarkMood = false
var navIsOpen = false
var onloginPage = true

//eventListeners
openNavContainer.addEventListener("click", openNavigation);
moodButton.addEventListener("click", changeMood)
mainPage.onscroll = function() {
  if (navIsOpen) {
    removeWidthAndDesing()
  }
}
loginSignBtn.addEventListener("click", openSigninPage)
signLoginBtn.addEventListener("click", openSigninPage)
signupBtn.addEventListener("click", signUserToFirebase)
loginBtn.addEventListener("click", loginUserToFirebase)
profileMineBtn.addEventListener("click", openMiningPage)
nextAppImgBtn.addEventListener("click", displayNextImages)
prevAppImgBtn.addEventListener("click", displayPrevImages)

//for each
links.forEach(smoothScroll)
pageLink.forEach(smoothScroll)
notAvailableOnDt()

//functions

function openNavigation() {
  var navContainerWidth = navContainer.getBoundingClientRect().width;
  //console.log(navContainerWidth)
  if (navContainerWidth == 72) {

    addWidthAndDesing()
  } else {
    removeWidthAndDesing()
  }
}

function addWidthAndDesing() {
  navContainer.classList.add('newNavWidth')
  openNavContainer.innerHTML = `<i class="fa-solid fa-xmark"></i>`
  hintAllName.classList.remove('fadeOutText')
  hintAllName.classList.add('hintAllNameDesign')
  hintAllName.classList.remove('hintAllName')
  navUnderling.classList.add('newUnderlingDesing')
  pageLink.forEach(addDesingToNavLinks)
  navIsOpen = true
}

function removeWidthAndDesing() {
  navContainer.classList.remove('newNavWidth')
  openNavContainer.innerHTML = `<i class="fa-solid fa-bars"></i>`
  hintAllName.classList.add('fadeOutText')
  hintAllName.classList.remove('hintAllNameDesign')
  hintAllName.classList.add('hintAllName')
  navUnderling.classList.remove('newUnderlingDesing')
  pageLink.forEach(removeNavDesings)
  navIsOpen = false

}

function addDesingToNavLinks(links) {
  links.classList.add('fadeInAnchorLinks')
  links.classList.remove('navLinks')
  links.classList.remove('fadeOutAnchorLinks')
}

function removeNavDesings(links) {
  links.classList.add('fadeOutAnchorLinks')
  links.classList.add('navLinks')
  links.classList.remove('fadeinAnchorLinks')
}

function changeMood() {
  if (navIsOpen) {
    removeWidthAndDesing()
  }
  if (!onDarkMood) {
    moodButton.innerHTML = `<i class="fa-solid fa-cloud-sun" style= "color :var(--color2 );"></i>`
    document.getElementById('navMood').style.background = 'var(--color3)'
    onDarkMood = true
    changebodyBg(onDarkMood)
    appImg.src ='/images/DarkImg1.jpg'
  }
  else {
    moodButton.innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`
    document.getElementById('navMood').style.background = 'var(--color1)'
    onDarkMood = false
    changebodyBg(onDarkMood)
    appImg.src ='/images/LightImg1.jpg' 

  }
}

function changebodyBg(param) {
  var body = document.getElementById('body')
  if (param) {
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color3)38%, var(--color3) 68%, var(--color3) 98%)'
    body.style.animation = 'gradient 15s ease infinite'
    body.style.backgroundSize = '400% 400%'
    body.style.backgroundAttachment = 'fixed'
  } else {
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color1)38%, var(--color1) 68%, var(--color1) 98%)'
    body.style.animation = 'gradient 15s ease infinite'
    body.style.backgroundSize = '400% 400%'
    body.style.backgroundAttachment = 'fixed'
  }
}

function smoothScroll(link) {
  link.addEventListener('click', eachAnchor)
};

function eachAnchor(e) {
  e.preventDefault()
  var target = e.currentTarget.getAttribute('href').slice(1);
  var element = document.getElementById(target);
  var position = element.offsetTop;

  mainPage.scrollTo(
  {
    right: 0,
    top: position
  });


};

function notAvailableOnDt() {
  var bodyWidth = body.getBoundingClientRect().width
  var notAvailDis = document.querySelector('.notAvailable')
  var displayBd = document.querySelector('.displayBd')
  var displaylogPages = document.querySelector('.loginAndSignupPage ')
  if (bodyWidth > 900) {
    notAvailDis.classList.add('addtext')
    displayBd.classList.add('removeBdDesign')
    displaylogPages.classList.add('removeBdDesign')

  } else {
    notAvailDis.classList.remove('addtext')
    displayBd.classList.remove('removeBdDesign')
    displaylogPages.classList.remove('removeBdDesign')

  }
}

function openSigninPage() {
  if (onloginPage) {
    signPage.style.display = 'block'
    logPage.style.display = 'none'
    onloginPage = false
  } else {
    signPage.style.display = 'none'
    logPage.style.display = 'block'
    onloginPage = true
  }

}

function signUserToFirebase() {
  var fullName = document.getElementById('fullName')
  var userName = document.getElementById('Username')
  var email = document.getElementById('email')
  var password = document.getElementById('password')
  if (fullName.value === '', userName.value === '', email.value === '', password.value === '') {
    alert('All input should be filled to proceed')
  } else {
    alert("Uploading your details please wait a moment")
    createUserWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
      set(ref(db, "Web Users/" + userCredential.user.uid), {
        fullname: fullName.value,
        username: userName.value,
        emailAcc: email.value,
        passWord: password.value
      }).then(() => {
        signPage.style.display = 'none'
        alert('Sign up successfull')
      }).catch(() => {
        alert('not successfull')
      })
    })

  }

}

function loginUserToFirebase() {
  var email = document.getElementById('loginEmail')
  var password = document.getElementById('loginPassword')
  if (email.value === '', password.value == '') {
    alert('All input should be filled to proceed')
  } else {
    alert('Please wait a moment')
    const auth = getAuth()
    signInWithEmailAndPassword(auth, email.value, password.value).then(() => {
      alert('Sign in successfull')
      signPage.style.display = 'none'
      logPage.style.display = 'none'
    })
  }
}

function openMiningPage() {
  var element = document.getElementById('Mining');
  var position = element.offsetTop;

  mainPage.scrollTo(
  {
    right: 0,
    top: position
  });
}
function displayNextImages() {
  if (onDarkMood) {
  currentIndex = (currentIndex + 1) % darkMoodImg.length;
  appImg.src = darkMoodImg[currentIndex];
} else {
  currentIndex = (currentIndex + 1) % lightMoodImg.length;
  appImg.src = lightMoodImg[currentIndex];
}
}
function displayPrevImages() {
   if (onDarkMood) {
      currentIndex = (currentIndex - 1 + darkMoodImg.length) % darkMoodImg.length;
      appImg.src = darkMoodImg[currentIndex];
    } else {
      currentIndex = (currentIndex - 1+ lightMoodImg.length) % lightMoodImg.length;
      appImg.src = lightMoodImg[currentIndex];
    }
}
/* 
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })
  
  
}*/