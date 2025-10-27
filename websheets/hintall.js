import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js"
import { getDatabase, onValue, ref, child, get, set, update, remove, push, increment } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js"
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
const dbRef = ref(db)

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
const lightMoodImg = ['./images/LightImg1.jpg', './images/Lightimg2.jpg', './images/Lightimg3.jpg'];
const darkMoodImg = ['./images/DarkImg1.jpg', './images/Darkimg2.jpg', './images/Darkimg3.jpg'];
let currentIndex = 0;
var displayBd = document.getElementById('displayBd')
var taskBtn = document.querySelectorAll('.taskBtn')
var startMiningGint = document.getElementById('startMining')
var closeFinancePageBtn = document.querySelector('.closeFinancePageBtn')
var financePage = document.getElementById('financePage')
var profileBtn = document.querySelectorAll('.transBtn')
var swapGintToNgnBtn = document.getElementById('swapGintToNgnBtn')
var widthrawNgnBtn = document.getElementById('widthrawNgn')
var tranferGintBtn = document.getElementById('tranferGintBtn')
var userIdSlice = ''

//on window load check if user is signed in
window.onload = function() {
  var userTheme = localStorage.getItem('userTheme')
  autoFillReferralFromURL();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userIdSlice = user.uid.slice(18)
      getAllUserCredential(user)
      displayBd.style.display = 'block'
      logPage.style.display = 'none'
      checkUserTaskList(user)
      if (userTheme == 'DarkMood') {
        setDarkMoodOnLoad()
      } else if (userTheme == 'LightMood') {
        setLightMood()
      } else {
        changebodyBg(false)
      }

    } else {
      displayBd.style.display = 'none'
      logPage.style.display = 'block'
    }
  })
  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  // Request notification permission when page loads
  requestNotificationPermission();

  // Set initial display
  timerDisplay.textContent = formatTime(remainingSeconds);

  // Add click event listener to button
  startBtn.addEventListener('click', handleStartClick);



}


//Boolean variables 
var onDarkMood = false
var navIsOpen = false
var onloginPage = true
var isMining = false

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
closeFinancePageBtn.addEventListener("click", closeFinancePage)
swapGintToNgnBtn.addEventListener('click', swapGintToNgn)
document.querySelector('.downloadApkBtn').addEventListener('click', () => {

  if (isMining == true) {
    alert('Mining in progress wait till mining session is over')
  } else {
    alert('Please hold while you are being redirected ApkPure')
    window.location.href = 'https://apkpure.net/hintall/maxon.emmanuel.hintall/download'
  }
})
widthrawNgnBtn.addEventListener('click', sendUserDetailsForTransaction)
tranferGintBtn.addEventListener('click', tranferGintToUser)

//for each
links.forEach(smoothScroll)
pageLink.forEach(smoothScroll)
taskBtn.forEach((eachBtn, index) => {
  eachBtn.addEventListener('click', () => {

    if (isMining == true) {
      alert('Mining in progress wait till mining session is over')
    } else {
      if (eachBtn.textContent == 'Gint Claimed') {
        alert('Thank you for your participation. A new task will soon be available')
      } else {
        addTaskGintsToBalance(index)
      }
    }
  }, { once: true })

})
profileBtn.forEach((profileBtn, index) => {
  profileBtn.addEventListener("click", () => {

    if (isMining == true) {
      alert('Mining in progress wait till mining session is over')
    } else {
      if (profileBtn.textContent == 'Widthrawal') {
        closeFinancePage()
        openWidthdrawalPage()

      } else if (profileBtn.textContent == 'SwapGint') {
        closeFinancePage()
        openSwapGintPage()
      } else if (profileBtn.textContent == 'TransferGint') {
        closeFinancePage()
        openTransferGintPage()

      } else if (profileBtn.textContent == 'Mining') {
        closeFinancePage()
        openMiningPage()
      }
    }
  })

})

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
    setDarkMoodOnLoad()
    localStorage.setItem('userTheme', 'DarkMood')
  }
  else {
    setLightMood()
    localStorage.setItem('userTheme', 'LightMood')

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
  var referralUserId = document.getElementById('referralUserId').value

  if (fullName.value === '', userName.value === '', email.value === '', password.value === '') {
    alert('All input should be filled to proceed')
  } else {
    alert("Uploading your details please wait a moment")
    createUserWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
      var userIdValue = userCredential.user.uid.slice(18)

      // Generate referral code for new user
      const userReferralCode = generateReferralCode();

      set(ref(db, "Web Users/" + userIdValue), {
        fullName: fullName.value,
        userName: userName.value,
        emailAcc: email.value,
        passWord: password.value,
        accountBalance: 0,
        userLevel: 'Novice', // Set initial level as Novice
        gintBalance: 0,
        referralNumber: 0,
        userId: userIdValue,
        referralCode: userReferralCode,
        joinedAt: new Date().toISOString()
      }).then(async () => {
        // Process referral if provided
        if (referralUserId && referralUserId.trim() !== '') {
          await processReferral(userIdValue, referralUserId);
        } else {
          // Check localStorage for referral code
          const storedReferral = localStorage.getItem('referralCode');
          if (storedReferral) {
            await processReferral(userIdValue, storedReferral);
            localStorage.removeItem('referralCode');
          }
        }

        signPage.style.display = 'none'
        alert('Sign up successful! 🎉')
        displayBd.style.display = 'block'
        getAllUserCredential(userCredential.user)
      }).catch((error) => {
        alert('Sign up failed: ' + error.message)
      })
    }).catch((error) => {
      alert('Sign up failed: ' + error.message)
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
    signInWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
      alert('Sign in successfull')
      signPage.style.display = 'none'
      logPage.style.display = 'none'
      displayBd.style.display = 'block'
      getAllUserCredential(userCredential.user)
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
    currentIndex = (currentIndex - 1 + lightMoodImg.length) % lightMoodImg.length;
    appImg.src = lightMoodImg[currentIndex];
  }
}

function setDarkMoodOnLoad() {
  moodButton.innerHTML = `<i class="fa-solid fa-cloud-sun" style= "color :var(--color2 );"></i>`
  document.getElementById('navMood').style.background = 'var(--color3)'
  onDarkMood = true
  changebodyBg(onDarkMood)
  appImg.src = './images/DarkImg1.jpg'
}

function setLightMood() {
  moodButton.innerHTML = `<i class="fa-solid fa-cloud-moon"></i>`
  document.getElementById('navMood').style.background = 'var(--color1)'
  onDarkMood = false
  changebodyBg(onDarkMood)
  appImg.src = './images/LightImg1.jpg'
}

function getAllUserCredential(user) {
  const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
  get(userData)
    .then((snapshot) => {
      if (snapshot.exists()) {
        var data = snapshot.val();

        // Calculate user level based on referrals
        const referralNumber = data.referralNumber || 0;
        const userLevel = calculateUserLevel(referralNumber);

        // Update user level in database if it changed
        if (data.userLevel !== userLevel) {
          update(userData, {
            userLevel: userLevel
          });
        }

        // Update UI with user data
        document.querySelector('.accountBalance').textContent = data.accountBalance;
        document.querySelector('.gintBalance').textContent = data.gintBalance;
        document.querySelector('.fullName').textContent = data.fullName;
        document.querySelector('.userLevel').textContent = userLevel; // Use calculated level
        document.querySelector('.Username').textContent = data.userName;

        // Display referral stats
        displayReferralStats(data);

        console.log(data.emailAcc);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function addTaskGintsToBalance(param) {
  if (param == '0') {
    var alertMessage = 'Please hold while you are being redirected to our WhatsApp Channel '
    var taskHref = "https://whatsapp.com/channel/0029VbBNhGoL2ATsajP7nG0v"
    const gintReward = 40
    proceedToTaskPage(taskNum = 'taskOne', alertMessage, taskHref, gintReward)
  } else if (param == '1') {
    var taskNum = 'taskTwo'
    var alertMessage = 'Please hold while you are being redirected to our YouTube Channel '
    var taskHref = "https://www.youtube.com/@theM672"
    const gintReward = 40
    proceedToTaskPage(taskNum, alertMessage, taskHref, gintReward)
  } else if (param == '2') {
    var taskNum = 'taskThree'
    var alertMessage = 'Please hold while you are being redirected to our X page'
    var taskHref = "https://x.com/maxonemman38801?t=x8J9pO6y8T3-sIvfunlNaQ&s=09"
    const gintReward = 40
    proceedToTaskPage(taskNum, alertMessage, taskHref, gintReward)
  } else if (param == '3') {
    var taskNum = 'taskFour'
    var alertMessage = 'Please hold while you are being redirected to our Apk download page'
    var taskHref = "https://apkpure.net/hintall/maxon.emmanuel.hintall/download "
    const gintReward = 166
    proceedToTaskPage(taskNum, alertMessage, taskHref, gintReward)
  }
}

function proceedToTaskPage(taskNum, alertMessage, taskHerf, gintReward) {
  alert(alertMessage)
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid.slice(18)
      const taskRef = ref(db, `Web Users/${userId}/` + 'Task List/')
      const gintBalanceRef = ref(db, `Web Users/${userId}`)
      if (taskNum == 'taskOne') {
        update(taskRef, {
          taskOne: true
        }).then(() => {
          update(gintBalanceRef, {
            gintBalance: increment(gintReward)
          }).then(() => {
            window.location.href = taskHerf
          })

        })
      }
      else if (taskNum == 'taskTwo') {
        update(taskRef, {
          taskTwo: true
        }).then(() => {
          update(gintBalanceRef, {
            gintBalance: increment(gintReward)
          }).then(() => {
            window.location.href = taskHerf
          })
        })
      }
      else if (taskNum == 'taskThree') {
        update(taskRef, {
          taskThree: true
        }).then(() => {
          update(gintBalanceRef, {
            gintBalance: increment(gintReward)
          }).then(() => {
            window.location.href = taskHerf
          })
        })
      }
      else if (taskNum == 'taskFour') {
        update(taskRef, {
          taskFour: true
        }).then(() => {
          update(gintBalanceRef, {
            gintBalance: increment(gintReward)
          }).then(() => {
            window.location.href = taskHerf
          })
        })
      }


    }
  })
}

function checkUserTaskList(user) {
  const taskData = child(dbRef, 'Web Users/' + `${user.uid.slice(18)}/` + 'Task List')
  get(taskData).then((snapshot) => {
    if (snapshot.exists()) {
      var taskBoolean = snapshot.val()
      taskBtn.forEach((eachBtn, index) => {
        if (index == '0' && taskBoolean.taskOne == true) {
          eachBtn.textContent = 'Gint Claimed'
        }
        else if (index == '1' && taskBoolean.taskTwo == true) {
          eachBtn.textContent = 'Gint Claimed'
        }
        else if (index == '2' && taskBoolean.taskThree == true) {
          eachBtn.textContent = 'Gint Claimed'
        }
        else if (index == '3' && taskBoolean.taskFour == true) {
          eachBtn.textContent = 'Gint Claimed'
        }

      })
    }
  })

}

function closeFinancePage() {
  financePage.style.display = 'none'
  document.querySelector('.displaySwapInput').style.display = 'none'
  document.querySelector('.displaySwapEligility').style.display = 'none'
  document.querySelector('.displayWidthrawEligility').style.display = 'none'
  document.querySelector('.displayWidthrawInput').style.display = 'none'
  document.getElementById('displayTransferInput').style.display = 'none'
}

function openSwapGintPage() {
  financePage.style.display = 'block'
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
      get(userData).then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val()
          var referralNumber = data.referralNumber
          var gintBalance = data.gintBalance

          if (referralNumber >= 5 && gintBalance >= 1000) {
            // Both criteria are met - show swap input
            document.querySelector('.displaySwapEligility').style.display = 'none'
            document.querySelector('.displaySwapInput').style.display = 'block'
          } else {
            // One or both criteria not met - show eligibility message
            document.querySelector('.displaySwapEligility').style.display = 'block'
            document.querySelector('.displaySwapInput').style.display = 'none'
          }
        }
      })
    }
  })
}

function swapGintToNgn() {
  var amount = document.getElementById('amountOfGintToSwap').value
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
      const storeSwapGint = child(dbRef, 'Web Users/' + 'CadhhPDMQ2')
      get(userData).then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val()
          var gintBalance = data.gintBalance
          var ngnBalace = data.accountBalance
          if (amount > gintBalance) {
            alert('Insufficient Gints')
          } else if (amount == 0) {
            alert('Enter The amount of Gints to Swap')
          } else {
            var newGintBalance = gintBalance - amount
            var newNgnBalance = Math.round(amount / 83 * 250)
            alert('Transaction In progress')
            update(storeSwapGint, {
              gintBalance: increment(Number(amount))
            })
            update(userData, {
              gintBalance: newGintBalance,
              accountBalance: increment(newNgnBalance)
            }).then(() => {
              alert('Transaction complete')
              getAllUserCredential(user)
              closeFinancePage()
            })

          }

        }
      })
    }
  })
}

function openWidthdrawalPage() {
  financePage.style.display = 'block'
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
      get(userData).then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val()
          if (data.accountBalance <= 1000) {
            document.querySelector('.displayWidthrawEligility').style.display = 'block'

          } else {
            document.querySelector('.displayWidthrawInput').style.display = 'block'
          }
        }
      })
    }
  })
}

function sendUserDetailsForTransaction() {
  // Your pre-filled message
  var ngnAmount = document.getElementById('amountOfNgnToWidthraw').value
  var accounName = document.getElementById('bankAccountName').value
  var accountNumber = document.getElementById('bankAccountNumber').value
  var bankName = document.getElementById('bankName').value
  if (accounName == '' || accountNumber == 0 || ngnAmount == 0 || bankName == '') {
    alert('Please Fill all required inputs')
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
        const pendingWidthdraw = child(dbRef, 'Pending Widthrawal/' + user.uid.slice(18))
        get(pendingWidthdraw).then((snapshot) => {
          if (snapshot.exists()) {
            var pendingData = snapshot.val()
            if (pendingData.stillPending == true) {
              alert('📝 A withdrawal is already in progress. For the security of your account, please wait for it to finalize before initiating a new one. Thank you for your patience! 🙂')
              closeFinancePage()
            }
            else {
              get(userData).then((snapshot) => {
                if (snapshot.exists()) {
                  var data = snapshot.val()
                  if (ngnAmount < 1000) {
                    alert('Widthrawal threshold should be above 1000Ngn')
                  } else if (data.accountBalance < ngnAmount) {
                    alert('Insufficient Funds')
                  } else {
                    addPendingWidthdrawal(user, ngnAmount, accounName, accountNumber, bankName)
                  }
                }
              })
            }
          }
        })

      }
    })
  }
}

function addPendingWidthdrawal(user, ngnAmount, accounName, accountNumber, bankName) {
  alert('Transaction In progress')
  const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
  set(ref(db, "Pending Widthrawal/" + user.uid.slice(18)), {
    bankAccountName: accounName,
    bankAccountNumber: accountNumber,
    userBankName: bankName,
    amoutToWidthdraw: ngnAmount,
    stillPending: true
  }).then(() => {
    update(userData, {
      accountBalance: increment(-ngnAmount)
    }).then(() => {
      alert('Transaction Complete ')
      getAllUserCredential(user)
      closeFinancePage()
    })
  })
}

function openTransferGintPage() {
  financePage.style.display = 'block'
  document.getElementById('displayTransferInput').style.display = 'block'
  /* onAuthStateChanged(auth, (user)=>{
     if (user) {
       var userId = user.uid
       console.log(userId.slice(18))
     }
   })*/
}

function tranferGintToUser() {
  var amountToTransfer = document.getElementById('gintToTranfer').value
  var receiverId = document.getElementById('receiverId').value
  if (amountToTransfer == 0 || receiverId == '') {
    alert('Please fill required inputs')

  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = child(dbRef, 'Web Users/' + user.uid.slice(18))
        get(userData).then((snapshot) => {
          if (snapshot.exists()) {
            var data = snapshot.val()
            if (amountToTransfer > data.gintBalance) {
              alert('Insufficient Gints ')
            } else {
              tranferGint(user, amountToTransfer, receiverId)
            }
          }
        })
      }
    })
  }
}

function tranferGint(user, amountToTransfer, receiverId) {
  const receiverIdRef = child(dbRef, 'Web Users/' + receiverId)
  var senderUserIdRef = child(dbRef, 'Web Users/' + userIdSlice)
  get(receiverIdRef).then((snapshot) => {
    if (snapshot.exists()) {
      alert('Transaction In progress')
      update(senderUserIdRef, {
        gintBalance: increment(Number(-amountToTransfer))
      }).then(() => {
        update(receiverIdRef, {
          gintBalance: increment(Number(amountToTransfer))
        }).then(() => {
          getAllUserCredential(user)
          closeFinancePage()
          alert('Transaction Complete')
        })
      })


    } else {
      alert('Invalid Receiver UserId')
    }
  })
}

// Mining separate functionTimer
let countdown;
const totalSeconds = 6 * 60 * 60; // 6 hours
let remainingSeconds = totalSeconds;
let minedGints = 0;



// Request notification permission
function requestNotificationPermission() {
  isMining = false
  if ("Notification" in window) {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("Notification permission granted");
      }
    });
  }
}

// Show push notification
function showNotification(title, message) {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(title, {
      body: message,
      icon: "/icon.png", // Add your app icon path
      badge: "/badge.png", // Add your badge icon path
      tag: "mining-notification"
    });

    // Close notification after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Focus window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

// Show browser tab notification (falls back to this if push notifications are blocked)
function showTabNotification(message) {
  if (document.hidden) {
    document.title = "⏰ " + message;

    // Restore original title when user comes back to tab
    const originalTitle = document.title;
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        document.title = originalTitle;
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }
}

// Format time as HH:MM:SS
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Start the countdown
function startTimer() {
  isMining = true
  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  startBtn.disabled = true;
  startBtn.textContent = "Mining in Progress...";

  countdown = setInterval(() => {
    remainingSeconds--;

    // Update display
    timerDisplay.textContent = formatTime(remainingSeconds);

    // Check if timer has finished
    if (remainingSeconds <= 0) {
      clearInterval(countdown);
      minedGints = 83; // Set mined Gints to 83
      timerDisplay.textContent = `${minedGints} Gints Mined!`;
      startBtn.disabled = false;
      startBtn.textContent = "Add Gints to Balance";

      // Show notification that mining is complete
      showNotification("Mining Complete! 🎉", "You've mined 83 Gints! Click to add them to your balance.");
      showTabNotification("Mining Complete - 83 Gints Mined!");
    }
  }, 1000);
}

// Add mined Gints to user balance in Firebase Realtime Database
async function addGintsToBalance() {
  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  try {
    startBtn.disabled = true;
    startBtn.textContent = "Adding Gints...";

    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid.slice(18);
        const gintBalanceRef = ref(db, `Web Users/${userId}`);

        update(gintBalanceRef, {
          gintBalance: increment(minedGints)
        }).then(() => {
          // Notify user Gints have been added to database
          timerDisplay.textContent = "Success! +83 Gints";
          showNotification("Gints Added! 💰", "83 Gints have been added to your balance!");

          // Restore the timer
          setTimeout(() => {
            resetTimer();
          }, 2000);
        }).catch((error) => {
          console.error("Error updating database:", error);
          timerDisplay.textContent = "Error adding Gints";
          startBtn.disabled = false;
          startBtn.textContent = "Try Again";
        });
      } else {
        throw new Error("User not authenticated");
      }
    });

  } catch (error) {
    console.error("Error in addGintsToBalance:", error);
    timerDisplay.textContent = "Authentication error";
    startBtn.disabled = false;
    startBtn.textContent = "Try Again";
  }
}
// Reset the timer
function resetTimer() {
  isMining = false
  clearInterval(countdown);
  remainingSeconds = totalSeconds;
  minedGints = 0;

  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  timerDisplay.textContent = formatTime(remainingSeconds);
  startBtn.textContent = "Start Mining Gint";
  startBtn.disabled = false;
}

// Button click event handler
function handleStartClick() {
  const startBtn = document.getElementById('startMining');

  if (startBtn.textContent === "Start Mining Gint") {
    startTimer();
  } else if (startBtn.textContent === "Add Gints to Balance") {
    addGintsToBalance();
  } else if (startBtn.textContent === "Try Again") {
    addGintsToBalance();
  }
}

//adding referral seperate function
// Enhanced shareReferralLink function with multiple platforms
function createReferralLink() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const userId = currentUser.uid.slice(18);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?ref=${userId}`;
  }
  return '';
}

function shareReferralLink() {
  console.log('click')
  if (isMining == true) {
    alert('Mining in progress wait till mining section is over')
  } else {
    const referralLink = createReferralLink();
    if (!referralLink) {
      alert('Please log in to get your referral link');
      return;
    }

    // Create sharing options modal
    const shareModal = document.createElement('div');
    shareModal.id = 'shareModal';
    shareModal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

    shareModal.innerHTML = `
    <div style="
      background: white;
      padding: 20px;
      border-radius: 15px;
      width: 90%;
      max-width: 400px;
      text-align: center;
    ">
      <h3 style="color: var(--color1); margin-bottom: 20px;">📤 Share Referral Link</h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
        <button class="whatsapp-share-btn" style="
          background: #25D366;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          📱 WhatsApp
        </button>
        
        <button class="telegram-share-btn" style="
          background: #0088cc;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          ✈️ Telegram
        </button>
        
        <button class="twitter-share-btn" style="
          background: #000000;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          𝕏 Twitter
        </button>
        
        <button class="facebook-share-btn" style="
          background: #1877F2;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          📘 Facebook
        </button>
        
        <button class="reddit-share-btn" style="
          background: #FF5700;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          🤖 Reddit
        </button>
        
        <button class="copy-share-btn" style="
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
        ">
          📋 Copy Link
        </button>
      </div>
      
      <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
        <p style="margin: 0; font-size: 12px; color: #666; word-break: break-all;">
          ${referralLink}
        </p>
      </div>
      
      <button class="close-share-modal" style="
        background: var(--color1);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
      ">
        Close
      </button>
    </div>
  `;

    // Remove existing modal if any
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Add modal to page
    document.body.appendChild(shareModal);

    // Add event listeners to modal buttons
    // Add event listeners to modal buttons
    setTimeout(() => {
      // WhatsApp
      // WhatsApp
      document.querySelector('.whatsapp-share-btn').addEventListener('click', function() {
        const message = `Join HintAll! Earn rewards with my referral link:

${referralLink}

🎉 Sign up now!`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        closeShareModal();
      });

      // Telegram
      document.querySelector('.telegram-share-btn').addEventListener('click', function() {
        const message = `Join HintAll! Earn rewards with my referral link:

${referralLink}

🎉 Sign up now!`;
        const url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join HintAll - Earn Rewards!')}`;
        window.open(url, '_blank');
        closeShareModal();
      });

      // Twitter
      document.querySelector('.twitter-share-btn').addEventListener('click', function() {
        const message = `Join HintAll and earn rewards! Use my referral link: ${referralLink} 🎉`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        closeShareModal();
      });


      // Facebook
      document.querySelector('.facebook-share-btn').addEventListener('click', function() {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent('Join HintAll and earn rewards! Use my referral link.')}`;
        window.open(url, '_blank');
        closeShareModal();
      });

      // Reddit
      document.querySelector('.reddit-share-btn').addEventListener('click', function() {
        const message = `Join HintAll using my referral link and earn rewards! ${referralLink}`;
        const url = `https://reddit.com/submit?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent('Join HintAll - Earn Rewards!')}`;
        window.open(url, '_blank');
        closeShareModal();
      });
      // Close modal
      document.querySelector('.close-share-modal').addEventListener('click', function() {
        closeShareModal();
      });
      // Copy Link
      document.querySelector('.copy-share-btn').addEventListener('click', function() {
        copyToClipboard(referralLink);
        closeShareModal();
      });

      // Close modal when clicking outside
      shareModal.addEventListener('click', function(e) {
        if (e.target === shareModal) {
          closeShareModal();
        }
      });


    })
  }
}

// Close modal function
function closeShareModal() {
  const modal = document.getElementById('shareModal');
  if (modal) {
    modal.remove();
  }
}
// Function to auto-fill referral from URL
function autoFillReferralFromURL() {
  const referralCode = getReferralFromURL();
  if (referralCode) {
    const referralInput = document.getElementById('referralUserId');
    if (referralInput) {
      referralInput.value = referralCode;
      // Store in localStorage as backup
      localStorage.setItem('referralCode', referralCode);
    }
  }
}

// Function to check for referral in URL parameters
function getReferralFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('ref');
}
// Function to display referral stats
function displayReferralStats(userData) {
  const referralStats = `
    <div class="referral-stats">
      <h3>📊 Referral Stats</h3>
      <p>Total Referrals: <strong>${userData.referralNumber || 0}</strong></p>
      <p style="margin-top: 10px;">Your Referral ID: <strong>${auth.currentUser.uid.slice(18)}</strong></p>
      <button class="transBtn" style="width: 100%; margin-top: 15px;">
        📤 Share Referral Link
      </button>
    </div>
  `;

  // Add to profile section
  const profileSection = document.querySelector('.accountValueation');
  const existingStats = profileSection.querySelector('.referral-stats');
  if (existingStats) {
    existingStats.remove();
  }
  profileSection.insertAdjacentHTML('beforeend', referralStats);
}
// Add event delegation for dynamically created share button
document.addEventListener('click', function(e) {
  // Check if the clicked element is the share referral link button
  if (e.target.textContent.includes('Share Referral Link') ||
    e.target.closest('button')?.textContent.includes('Share Referral Link')) {
    shareReferralLink();
  }

});
// Function to copy referral link to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('Referral link copied to clipboard! 📋\nShare it with your friends!');
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Referral link copied to clipboard! 📋');
    });
}

// updating and getting user level seperate function
// Function to calculate user level based on referrals
function calculateUserLevel(referralNumber) {
  if (referralNumber < 20) {
    return 'Novice';
  } else if (referralNumber < 30) {
    return 'Intermediate';
  } else if (referralNumber < 60) {
    return 'Advanced';
  } else if (referralNumber < 500) {
    return 'Expert';
  } else {
    return 'Legendary';
  }
}


// Initialize the timer display
/*document.addEventListener('DOMContentLoaded', function() {
  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  // Request notification permission when page loads
  requestNotificationPermission();

  // Set initial display
  timerDisplay.textContent = formatTime(remainingSeconds);

  // Add click event listener to button
  startBtn.addEventListener('click', handleStartClick);

  // Check if user is logged in
  auth.onAuthStateChanged((user) => {
    if (user) {
      startBtn.disabled = false;
      startBtn.textContent = "Start Mining Gint";
    } else {
      startBtn.disabled = true;
      startBtn.textContent = "Please Login to Mine";
    }
  });
});*/
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