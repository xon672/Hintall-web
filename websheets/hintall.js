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
var mhintBtnScroll = document.getElementById('mhintBtn')

//on window load check if user is signed in
window.onload = function() {
  var userTheme = localStorage.getItem('userTheme');
  autoFillReferralFromURL();

  // Show loading immediately
  showLoadingState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userIdSlice = user.uid.slice(18);

      getAllUserCredential(user).then(() => {
        // Hide loading when data is ready
        hideLoadingState();

        displayBd.style.display = 'block';
        logPage.style.display = 'none';
        checkUserTaskList(user);
        initMining();

        if (userTheme == 'DarkMood') {
          setDarkMoodOnLoad();
        } else if (userTheme == 'LightMood') {
          setLightMood();
        } else {
          changebodyBg(false);
        }
      }).catch(error => {
        hideLoadingState();
        console.error('Error loading user data:', error);
      });

    } else {
      hideLoadingState();
      displayBd.style.display = 'none';
      logPage.style.display = 'block';
    }
  });

  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  requestNotificationPermission();
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(remainingSeconds);
  }
  if (startBtn) {
    startBtn.addEventListener('click', handleStartClick);
  }

  // Safety timeout - hide loading after 3 seconds
  setTimeout(hideLoadingState, 3000);
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
mhintBtnScroll.addEventListener('click',scrollToSubServicePage)

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
  return new Promise((resolve, reject) => {
    const userData = child(dbRef, 'Web Users/' + user.uid.slice(18));
    get(userData)
      .then((snapshot) => {
        if (snapshot.exists()) {
          var data = snapshot.val();
          const referralNumber = data.referralNumber || 0;
          const userLevel = calculateUserLevel(referralNumber);

          // Update UI elements - wait for DOM to be ready
          setTimeout(() => {
            const balanceElement = document.querySelector('.accountBalance');
            const gintElement = document.querySelector('.gintBalance');
            const nameElement = document.querySelector('.fullName');
            const levelElement = document.querySelector('.userLevel');
            const usernameElement = document.querySelector('.Username');

            if (balanceElement) balanceElement.textContent = data.accountBalance || 0;
            if (gintElement) gintElement.textContent = data.gintBalance || 0;
            if (nameElement) nameElement.textContent = data.fullName || 'User';
            if (levelElement) levelElement.textContent = userLevel;
            if (usernameElement) usernameElement.textContent = data.userName || 'Username';

            displayReferralStats(data);
            resolve();
          }, 50);

        } else {
          reject(new Error('User data not found'));
        }
      })
      .catch((error) => {
        reject(error);
      });
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
  if (accounName == '' || accountNumber == '' || ngnAmount == '' || bankName == '') {
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
                  if (parseFloat(ngnAmount) < 1000) {
                    alert('Widthrawal threshold should be above 1000Ngn')
                  } else if (data.accountBalance < parseFloat(ngnAmount)) {
                    alert('Insufficient Funds')
                  } else {
                    addPendingWidthdrawal(user, parseFloat(ngnAmount), accounName, parseFloat(accountNumber), bankName)
                  }
                }
              })
            }
          }
          else {
              get(userData).then((snapshot) => {
                if (snapshot.exists()) {
                  var data = snapshot.val()
                  if (parseFloat(ngnAmount) < 1000) {
                    alert('Widthrawal threshold should be above 1000Ngn')
                  } else if (data.accountBalance < parseFloat(ngnAmount)) {
                    alert('Insufficient Funds')
                  } else {
                    addPendingWidthdrawal(user, parseFloat(ngnAmount), accounName, parseFloat(accountNumber), bankName)
                  }
                }
              })
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
function scrollToSubServicePage(){
  var serviceContainer= document.getElementById('Service')
  var mhintService = document.querySelector('.mhintService')
  var position = mhintService.offsetTop 
  console.log(position)
  
  serviceContainer.scrollTo({
    right:0,
    top:position
    
  })
  
}


// Mining separate functionTimer
// Mining variables
let countdown;
const totalSeconds = 6 * 60 * 60; // 6 hours
let remainingSeconds = totalSeconds;
let minedGints = 0;
let miningStartTime = null;
const miningDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
let miningWorker;

// Web Worker function
function createMiningWorker(remainingSecs = totalSeconds) {
  const workerCode = `
    let countdown;
    let remainingSeconds = ${remainingSecs};
    
    self.onmessage = function(e) {
      if (e.data === 'start') {
        countdown = setInterval(() => {
          remainingSeconds--;
          self.postMessage(remainingSeconds);
          
          if (remainingSeconds <= 0) {
            clearInterval(countdown);
            self.postMessage('completed');
          }
        }, 1000);
      }
      else if (e.data === 'stop') {
        clearInterval(countdown);
      }
    };
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}
// Request notification permission
function requestNotificationPermission() {
  isMining = false;
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
      icon: "/icon.png"
    });

    setTimeout(() => {
      notification.close();
    }, 5000);

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

// Show browser tab notification
function showTabNotification(message) {
  if (document.hidden) {
    document.title = "⏰ " + message;

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

// Check for completed mining sessions
function checkCompletedMining() {
  const savedStartTime = localStorage.getItem('miningStartTime');

  if (savedStartTime) {
    const miningStartTime = parseInt(savedStartTime);
    const elapsed = Date.now() - miningStartTime;

    // If mining completed while browser was closed
    if (elapsed >= miningDuration) {
      minedGints = 83;

      // Send completion notification
      showNotification("⛏️ Mining Complete!", "You've mined 83 Gints! Open the app to claim your reward.");

      // Also show tab notification for better visibility
      showTabNotification("Mining Complete! Claim 83 Gints");

      // Update UI if user is on the page
      const timerDisplay = document.querySelector('.countTime');
      const startBtn = document.getElementById('startMining');

      if (timerDisplay && startBtn) {
        timerDisplay.textContent = `${minedGints} Gints Mined!`;
        startBtn.disabled = false;
        startBtn.textContent = "Add Gints to Balance";
      }
    }
  }
}

// Handle mining completion
function handleMiningCompletion() {
  minedGints = 83;
  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  timerDisplay.textContent = `${minedGints} Gints Mined!`;
  startBtn.disabled = false;
  startBtn.textContent = "Add Gints to Balance";

  // Send notification
  showNotification("⛏️ Mining Complete!", "You've mined 83 Gints! Click to claim your reward.");
  showTabNotification("Mining Complete! Claim 83 Gints");

  // Clear the saved start time
  localStorage.removeItem('miningStartTime');
}

// Check mining status on page load
function checkMiningStatus() {
  const savedStartTime = localStorage.getItem('miningStartTime');

  if (savedStartTime) {
    miningStartTime = parseInt(savedStartTime);
    const elapsed = Date.now() - miningStartTime;

    if (elapsed < miningDuration) {
      // Mining still in progress - resume
      const remainingMs = miningDuration - elapsed;
      remainingSeconds = Math.floor(remainingMs / 1000);

      isMining = true;
      const timerDisplay = document.querySelector('.countTime');
      const startBtn = document.getElementById('startMining');

      startBtn.disabled = true;
      startBtn.textContent = "Mining in Progress...";

      // Start visual countdown with ACTUAL remaining time
      miningWorker = createMiningWorker(remainingSeconds); // PASS THE CALCULATED TIME
      miningWorker.onmessage = function(e) {
        if (e.data === 'completed') {
          handleMiningCompletion();
        } else {
          timerDisplay.textContent = formatTime(e.data);
        }
      };
      miningWorker.postMessage('start');

    } else {
      // Mining completed while browser was closed
      handleMiningCompletion();
    }
  }
}
// Initialize mining
function initMining() {
  // Check for any completed mining sessions first
  checkCompletedMining();

  // Then check current mining status
  checkMiningStatus();

  // Set up periodic checks for completion (every minute)
  setInterval(checkCompletedMining, 60000);
}

// Start the countdown
function startTimer() {
  miningStartTime = Date.now();
  isMining = true;

  // Save to localStorage
  localStorage.setItem('miningStartTime', miningStartTime.toString());

  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  startBtn.disabled = true;
  startBtn.textContent = "Mining in Progress...";

  // Start visual countdown with current remaining seconds
  miningWorker = createMiningWorker(remainingSeconds); // PASS CURRENT REMAINING SECONDS

  miningWorker.onmessage = function(e) {
    if (e.data === 'completed') {
      handleMiningCompletion();
    } else {
      timerDisplay.textContent = formatTime(e.data);
    }
  };

  miningWorker.postMessage('start');
}

// Add mined Gints to user balance
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
          timerDisplay.textContent = "Success! +83 Gints";
          showNotification("💰 Gints Added!", "83 Gints have been added to your balance!");

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
  isMining = false;
  if (miningWorker) {
    miningWorker.postMessage('stop');
    miningWorker.terminate();
  }

  remainingSeconds = totalSeconds;
  minedGints = 0;
  miningStartTime = null;

  const timerDisplay = document.querySelector('.countTime');
  const startBtn = document.getElementById('startMining');

  timerDisplay.textContent = formatTime(remainingSeconds);
  startBtn.textContent = "Start Mining Gint";
  startBtn.disabled = false;

  // Clear saved state
  localStorage.removeItem('miningStartTime');
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
// Add these functions to fix the referral system

function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function processReferral(newUserId, referrerId) {
  try {
    const referrerRef = ref(db, "Web Users/" + referrerId);
    const snapshot = await get(referrerRef);

    if (snapshot.exists()) {
      // Update referrer's referral count
      await update(referrerRef, {
        referralNumber: increment(1)
      });

      // Add bonus to referrer (optional - you can adjust the amount)
      await update(referrerRef, {
        gintBalance: increment(50) // 50 Gint bonus for referrer
      });

      // Add bonus to new user (optional)
      const newUserRef = ref(db, "Web Users/" + newUserId);
      await update(newUserRef, {
        gintBalance: increment(25) // 25 Gint bonus for new user
      });

      console.log('Referral processed successfully');
    } else {
      console.log('Referrer ID not found');
    }
  } catch (error) {
    console.error('Error processing referral:', error);
  }
}

function saveTimerState(seconds, isRunning, minedGints) {
  const timerState = {
    remainingSeconds: seconds,
    isMining: isRunning,
    minedGints: minedGints,
    timestamp: Date.now()
  };
  localStorage.setItem('miningTimerState', JSON.stringify(timerState));
}

// Load timer state from localStorage
function loadTimerState() {
  const saved = localStorage.getItem('miningTimerState');
  if (saved) {
    const timerState = JSON.parse(saved);

    // Check if saved state is older than 6 hours (expired)
    const timeElapsed = Date.now() - timerState.timestamp;
    const sixHoursInMs = 6 * 60 * 60 * 1000;

    if (timeElapsed < sixHoursInMs) {
      return timerState;
    } else {
      // Timer expired, clear saved state
      localStorage.removeItem('miningTimerState');
    }
  }
  return null;
}


// Initialize the timer display
document.addEventListener('DOMContentLoaded', function() {
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
});
// Add these functions for animated loading
function showLoadingState() {
  // Remove any existing loading first
  hideLoadingState();

  // Create simple loading element
  const loadingElement = document.createElement('div');
  loadingElement.id = 'dataLoadingText';
  loadingElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-family: Arial, sans-serif;
    `;

  loadingElement.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            min-width: 200px;
        ">
            <div style="font-size: 24px; margin-bottom: 10px;">⏳</div>
            <div style="font-weight: bold; margin-bottom: 10px; color: #333;">Loading Your Data</div>
            <div style="color: #666; font-size: 14px;">Please wait...</div>
        </div>
    `;

  document.body.appendChild(loadingElement);
}

function hideLoadingState() {
  const loadingElement = document.getElementById('dataLoadingText');
  if (loadingElement) {
    loadingElement.remove();
  }
}
// =============================================
// MHINT SERVICE - COMPLETE IMPLEMENTATION
// =============================================

// Initialize Mhint Service
function initializeMhintService() {
    displaySongsUsersAreLookingFor();
    
    const storeFindSongBtn = document.getElementById('storeFindSong');
    if (storeFindSongBtn) {
        storeFindSongBtn.addEventListener('click', addSongToFindList);
    }
    
    // Add image upload functionality
    setupImageUpload();
}

// Setup image upload for song search
function setupImageUpload() {
    const musicNameInput = document.getElementById('musicName');
    const artistNameInput = document.getElementById('artistName');
    
    // Create image upload container
    const imageUploadContainer = document.createElement('div');
    imageUploadContainer.innerHTML = `
        <div style="margin: 15px 0;">
            <p style="color: white; margin-bottom: 10px;">📸 Add Song Screenshot (Optional)</p>
            <input type="file" id="songImageUpload" accept="image/*" style="display: none;">
            <button type="button" id="uploadImageBtn" style="
                background: white; 
                color: #333; 
                border: none; 
                padding: 10px 15px; 
                border-radius: 5px; 
                cursor: pointer; 
                font-size: 14px; 
                width: 100%;
            ">
                📁 Choose Image
            </button>
            <div id="imagePreview" style="
                margin-top: 10px; 
                display: none;
                text-align: center;
            ">
                <img id="previewImg" style="
                    max-width: 100%;
                    max-height: 200px;
                    border-radius: 8px;
                    border: 2px solid white;
                ">
                <button type="button" id="removeImageBtn" style="
                    background: #D9534F;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 5px;
                    font-size: 12px;
                ">
                    ❌ Remove Image
                </button>
            </div>
        </div>
    `;
    
    // Insert image upload after artist input
    artistNameInput.parentNode.insertBefore(imageUploadContainer, artistNameInput.nextSibling);
    
    // Add event listeners for image upload
    document.getElementById('uploadImageBtn').addEventListener('click', function() {
        document.getElementById('songImageUpload').click();
    });
    
    document.getElementById('songImageUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('❌ Please select an image file (JPG, PNG, etc.)');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                alert('❌ Image too large! Please select an image smaller than 5MB');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
                // Store image data for later use
                localStorage.setItem('currentSongImage', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    
    document.getElementById('removeImageBtn').addEventListener('click', function() {
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('songImageUpload').value = '';
        localStorage.removeItem('currentSongImage');
    });
    
    // Load saved image on page refresh
    const savedImage = localStorage.getItem('currentSongImage');
    if (savedImage) {
        document.getElementById('previewImg').src = savedImage;
        document.getElementById('imagePreview').style.display = 'block';
    }
}

// Display songs users are looking for from Firebase
function displaySongsUsersAreLookingFor() {
    const findSongListRef = ref(db, 'Find Song Lists/');
    const findSongListContainer = document.querySelector('.findSongList');
    if (!findSongListContainer) return;
    
    findSongListContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: white;">Loading songs...</div>';
    
    onValue(findSongListRef, (snapshot) => {
        const songsData = snapshot.val();
        const findSongListContainer = document.querySelector('.findSongList');
        
        if (!songsData || Object.keys(songsData).length === 0) {
            findSongListContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: white;">
                    <p>🎵 No songs are currently being searched for</p>
                    <p style="font-size: 14px; margin-top: 10px;">Be the first to request a song!</p>
                </div>
            `;
            return;
        }
        
        const songsArray = Object.entries(songsData).map(([songId, songData]) => ({
            songId,
            ...songData
        }));
        
        // Separate active searches and found songs
        const activeSearches = songsArray.filter(song => song.searchSatus !== false);
        const foundSongs = songsArray.filter(song => song.searchSatus === false && song.audioUrl);
        
        if (activeSearches.length === 0 && foundSongs.length === 0) {
            findSongListContainer.innerHTML = `
                <div style="text-align: center; padding: 20px; color: white;">
                    <p>✅ All song requests have been fulfilled!</p>
                    <p style="font-size: 14px; margin-top: 10px;">Check back later for new requests</p>
                </div>
            `;
            return;
        }
        
        // Calculate user counts for each song
        const songUserCounts = calculateSongUserCounts(activeSearches);
        
        let songListHTML = '';
        
        // Display found songs first
        if (foundSongs.length > 0) {
            songListHTML += `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #4CAF50; margin-bottom: 15px; border-bottom: 2px solid #4CAF50; padding-bottom: 5px;">
                        🎉 Found Songs - Ready for Download!
                    </h3>
                    ${foundSongs.map(song => {
                        const isCurrentUser = auth.currentUser && song.originalUserId === auth.currentUser.uid.slice(18);
                        const isMatchedSong = song.matchedFrom;
                        
                        return `
                        <div class="found-song-item" style="
                            background: rgba(76, 175, 80, 0.15);
                            padding: 15px;
                            margin: 10px 0;
                            border-radius: 10px;
                            border-left: 4px solid #4CAF50;
                            border: 2px solid #4CAF50;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: white; font-size: 16px;">
                                        🎵 ${song.songName || 'Unknown Song'} ✅
                                        ${isMatchedSong ? ' 🔄' : ''}
                                    </h4>
                                    <p style="margin: 0; color: #ccc; font-size: 14px;">🎤 Artist: ${song.musician || 'Unknown Artist'}</p>
                                    <p style="margin: 5px 0 0 0; color: #aaa; font-size: 12px;">
                                        👤 Requested by: User${song.originalUserId}
                                        ${song.uploadedBy ? `<br>📤 Uploaded by: User${song.uploadedBy}` : ''}
                                        ${isMatchedSong ? `<br>🔄 Automatically matched from similar song` : ''}
                                        ${song.uploadedAt ? `<br>⏰ Found on: ${new Date(song.uploadedAt).toLocaleDateString()}` : ''}
                                    </p>
                                    
                                    ${song.songImage ? `
                                        <div style="margin: 15px 0; text-align: center;">
                                            <p style="color: #4CAF50; margin-bottom: 8px; font-size: 14px;">
                                                <strong>📸 Song Screenshot:</strong>
                                            </p>
                                            <img src="${song.songImage}" 
                                                 alt="Song screenshot" 
                                                 style="
                                                    max-width: 100%;
                                                    max-height: 200px;
                                                    border-radius: 8px;
                                                    border: 2px solid #4CAF50;
                                                 "
                                                 onerror="this.style.display='none'">
                                        </div>
                                    ` : ''}
                                    
                                    <div style="margin-top: 15px;">
                                        <p style="color: #4CAF50; margin-bottom: 8px; font-size: 14px;">
                                            <strong>✅ Song Found! Preview before download:</strong>
                                        </p>
                                        <audio controls style="width: 100%; height: 40px; margin-bottom: 12px; border-radius: 20px;">
                                            <source src="${song.audioUrl}" type="audio/mpeg">
                                            Your browser does not support the audio element.
                                        </audio>
                                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                            <a href="${song.audioUrl}" download="${(song.songName || 'song').replace(/[^a-z0-9]/gi, '_')}.mp3" 
                                               class="download-song-link"
                                               data-song-id="${song.songId}"
                                               style="background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; 
                                                      text-decoration: none; display: inline-block; font-size: 14px; transition: all 0.3s ease;">
                                                📥 Download Song
                                            </a>
                                            ${isCurrentUser ? `
                                                <button class="mark-completed-btn" 
                                                        data-song-id="${song.songId}"
                                                        style="background: white; color: #333; border: none; padding: 10px 15px; 
                                                               border-radius: 5px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                                    ✅ Mark as Completed
                                                </button>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                <span style="
                                    background: #4CAF50;
                                    color: white;
                                    padding: 5px 10px;
                                    border-radius: 15px;
                                    font-size: 12px;
                                    white-space: nowrap;
                                ">${isMatchedSong ? '🔄 Matched' : '✅ Available'}</span>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        // Display active searches
        if (activeSearches.length > 0) {
            songListHTML += `
                <div>
                    <h3 style="color: white; margin-bottom: 15px; border-bottom: 2px solid white; padding-bottom: 5px;">
                        🔍 Users Are Looking For These Songs
                    </h3>
                    ${activeSearches.map(song => {
                        const isCurrentUser = auth.currentUser && song.originalUserId === auth.currentUser.uid.slice(18);
                        const userCount = songUserCounts[song.songName + '|' + song.musician] || 1;
                        const otherUsersCount = userCount - (isCurrentUser ? 1 : 0);
                        
                        return `
                        <div class="song-request-item" style="
                            background: rgba(255,255,255,0.1);
                            padding: 15px;
                            margin: 10px 0;
                            border-radius: 10px;
                            border-left: 4px solid white;
                        ">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 5px 0; color: white; font-size: 16px;">
                                        🎵 ${song.songName || 'Unknown Song'}
                                    </h4>
                                    <p style="margin: 0; color: #ccc; font-size: 14px;">🎤 Artist: ${song.musician || 'Unknown Artist'}</p>
                                    <p style="margin: 5px 0 0 0; color: #aaa; font-size: 12px;">
                                        👤 Requested by: User${song.originalUserId}
                                        ${song.requestedAt ? `<br>⏰ Requested: ${new Date(song.requestedAt).toLocaleDateString()}` : ''}
                                    </p>
                                    
                                    <!-- User Count Display -->
                                    <div style="margin: 12px 0; padding: 10px; background: rgba(255, 193, 7, 0.2); border-radius: 8px; border: 1px solid #FFC107;">
                                        <div style="display: flex; align-items: center; gap: 10px;">
                                            <span style="font-size: 18px; color: #FFC107;">👥</span>
                                            <div>
                                                <div style="font-size: 14px; color: #FFC107; font-weight: bold;">
                                                    ${userCount} ${userCount === 1 ? 'user is' : 'users are'} searching for this song
                                                </div>
                                                ${otherUsersCount > 0 ? `
                                                    <div style="font-size: 12px; color: #FFD54F; margin-top: 3px;">
                                                        ${isCurrentUser ? 
                                                            `You + ${otherUsersCount} other ${otherUsersCount === 1 ? 'person' : 'people'}` : 
                                                            `${userCount} ${userCount === 1 ? 'person' : 'people'} in the community`
                                                        }
                                                    </div>
                                                ` : `
                                                    <div style="font-size: 12px; color: #FFD54F; margin-top: 3px;">
                                                        Be the first to help find this song!
                                                    </div>
                                                `}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    ${song.songImage ? `
                                        <div style="margin: 15px 0; text-align: center;">
                                            <p style="color: white; margin-bottom: 8px; font-size: 14px;">
                                                <strong>📸 Song Screenshot:</strong>
                                            </p>
                                            <img src="${song.songImage}" 
                                                 alt="Song screenshot" 
                                                 style="
                                                    max-width: 100%;
                                                    max-height: 200px;
                                                    border-radius: 8px;
                                                    border: 2px solid white;
                                                 "
                                                 onerror="this.style.display='none'">
                                        </div>
                                    ` : ''}
                                    
                                    <div style="margin-top: 10px;">
                                        <button class="upload-song-btn" 
                                                data-song-id="${song.songId}"
                                                data-song-name="${song.songName}"
                                                data-artist-name="${song.musician}"
                                                style="background: white; color: #333; border: none; padding: 8px 15px; 
                                                       border-radius: 5px; cursor: pointer; font-size: 14px; transition: all 0.3s ease;">
                                            📤 I Have This Song
                                        </button>
                                        ${isCurrentUser ? `
                                            <button class="cancel-search-btn" 
                                                    data-song-id="${song.songId}"
                                                    style="background: #D9534F; color: white; border: none; padding: 8px 15px; 
                                                           border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 10px; transition: all 0.3s ease;">
                                                ❌ Cancel Search
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                                    <span style="
                                        background: white;
                                        color: #333;
                                        padding: 5px 10px;
                                        border-radius: 15px;
                                        font-size: 12px;
                                        white-space: nowrap;
                                    ">🔍 Searching</span>
                                    <div style="display: flex; align-items: center; gap: 5px; background: #FFC107; padding: 4px 8px; border-radius: 12px;">
                                        <span style="font-size: 12px; color: #333; font-weight: bold;">👥</span>
                                        <span style="font-size: 12px; color: #333; font-weight: bold;">${userCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
            `;
        }
        
        findSongListContainer.innerHTML = songListHTML;
        
        // Add event listeners
        document.querySelectorAll('.upload-song-btn').forEach(button => {
            button.addEventListener('click', handleSongUpload);
        });
        
        document.querySelectorAll('.download-song-link').forEach(link => {
            link.addEventListener('click', handleSongDownload);
        });
        
        document.querySelectorAll('.mark-completed-btn').forEach(button => {
            button.addEventListener('click', handleMarkCompleted);
        });
        
        document.querySelectorAll('.cancel-search-btn').forEach(button => {
            button.addEventListener('click', handleCancelSearch);
        });
        
    }, (error) => {
        const findSongListContainer = document.querySelector('.findSongList');
        findSongListContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #D9534F;">
                <p>❌ Error loading songs</p>
                <p style="font-size: 14px; margin-top: 10px;">Please try again later</p>
            </div>
        `;
    });
}

// Calculate how many users are searching for each song
function calculateSongUserCounts(activeSearches) {
    const songCounts = {};
    
    activeSearches.forEach(song => {
        const songKey = song.songName + '|' + song.musician;
        if (songCounts[songKey]) {
            songCounts[songKey]++;
        } else {
            songCounts[songKey] = 1;
        }
    });
    
    return songCounts;
}

// Check if user is already searching for the same song
function isUserAlreadySearchingForSong(userId, songName, artistName) {
    const findSongListRef = ref(db, 'Find Song Lists/');
    
    return get(findSongListRef).then((snapshot) => {
        const songsData = snapshot.val();
        if (!songsData) return false;
        
        const userSongName = songName.toLowerCase().trim();
        const userArtistName = artistName.toLowerCase().trim();
        
        for (const [songId, songData] of Object.entries(songsData)) {
            if (songData.originalUserId === userId && songData.searchSatus !== false) {
                const existingSongName = songData.songName.toLowerCase().trim();
                const existingArtistName = songData.musician.toLowerCase().trim();
                
                // Check for exact match
                if (existingSongName === userSongName && existingArtistName === userArtistName) {
                    return true;
                }
                
                // Check for similar matches (fuzzy matching)
                const songSimilarity = calculateSimilarity(existingSongName, userSongName);
                const artistSimilarity = calculateSimilarity(existingArtistName, userArtistName);
                
                if (songSimilarity > 0.8 && artistSimilarity > 0.8) {
                    return true;
                }
            }
        }
        
        return false;
    });
}

// Add song to find list with duplicate prevention and image support
function addSongToFindList() {
    const musicName = document.getElementById('musicName').value.trim();
    const artistName = document.getElementById('artistName').value.trim();
    const songImage = localStorage.getItem('currentSongImage');
    
    if (!musicName || !artistName) {
        alert('❌ Please fill in both song name and artist name');
        return;
    }
    
    if (musicName.length < 2 || artistName.length < 2) {
        alert('❌ Please enter valid song and artist names');
        return;
    }
    
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert('❌ Please log in to search for songs');
            return;
        }
        
        const userId = user.uid.slice(18);
        const userData = child(dbRef, 'Web Users/' + userId);
        const findSongListRef = ref(db, 'Find Song Lists/');
        
        // First check if user is already searching for this song
        isUserAlreadySearchingForSong(userId, musicName, artistName).then((isAlreadySearching) => {
            if (isAlreadySearching) {
                alert(`❌ You are already searching for this song!\n\n"${musicName}" by ${artistName}\n\nPlease check your active searches.`);
                return;
            }
            
            // Then check if the same song already exists from other users
            get(findSongListRef).then((snapshot) => {
                const songsData = snapshot.val();
                let duplicateFound = false;
                let duplicateSongInfo = '';
                let userCount = 1;
                
                if (songsData) {
                    // Check for duplicates and count users
                    Object.values(songsData).forEach(song => {
                        if (song.songName && song.musician && song.searchSatus !== false) {
                            const existingSongName = song.songName.toLowerCase().trim();
                            const existingArtistName = song.musician.toLowerCase().trim();
                            const newSongName = musicName.toLowerCase().trim();
                            const newArtistName = artistName.toLowerCase().trim();
                            
                            if (existingSongName === newSongName && existingArtistName === newArtistName) {
                                duplicateFound = true;
                                duplicateSongInfo = `"${song.songName}" by ${song.musician}`;
                                userCount++;
                            }
                        }
                    });
                }
                
                if (duplicateFound) {
                    const joinMessage = userCount > 1 ? 
                        `Join ${userCount} other users looking for this song!` :
                        `Someone else is also looking for this song!`;
                    
                    const userConfirmation = confirm(
                        `🎵 "${musicName}" by ${artistName}\n\n` +
                        `👥 ${userCount} ${userCount === 1 ? 'user is' : 'users are'} already searching for this song!\n\n` +
                        `${joinMessage}\n\n` +
                        `Do you want to join them and search for this song?\n\n` +
                        `This will cost 166 Gints from your balance.`
                    );
                    
                    if (!userConfirmation) return;
                }
                
                // Check user balance and proceed
                get(userData).then((userSnapshot) => {
                    if (!userSnapshot.exists()) {
                        alert('❌ User data not found');
                        return;
                    }
                    
                    const data = userSnapshot.val();
                    const userGintBalance = data.gintBalance || 0;
                    
                    if (userGintBalance < 166) {
                        alert(`❌ Insufficient balance! You need 166 Gints but only have ${userGintBalance} Gints`);
                        return;
                    }
                    
                    // If no duplicate found, show regular confirmation
                    if (!duplicateFound) {
                        const userConfirmation = confirm(`🔍 Search for: "${musicName}" by ${artistName}\n\nThis will cost 166 Gints from your balance.\n\nCurrent Balance: ${userGintBalance} Gints\nAfter Charge: ${userGintBalance - 166} Gints\n\nClick OK to proceed`);
                        
                        if (!userConfirmation) return;
                    }
                    
                    alert('⏳ Processing your song search request...');
                    
                    update(userData, {
                        gintBalance: increment(-166)
                    }).then(() => {
                        // Generate unique ID for multiple songs from same user
                        const songId = userId + '_' + Date.now();
                        
                        const songData = {
                            songName: musicName,
                            musician: artistName,
                            searchSatus: true,
                            requestedAt: new Date().toISOString(),
                            originalUserId: userId,
                            songId: songId
                        };
                        
                        // Add image if available
                        if (songImage) {
                            songData.songImage = songImage;
                        }
                        
                        set(ref(db, "Find Song Lists/" + songId), songData).then(() => {
                            // Clear form and local storage
                            document.getElementById('musicName').value = '';
                            document.getElementById('artistName').value = '';
                            document.getElementById('imagePreview').style.display = 'none';
                            document.getElementById('songImageUpload').value = '';
                            localStorage.removeItem('currentSongImage');
                            
                            getAllUserCredential(user);
                            
                            if (duplicateFound) {
                                alert(`✅ Success! You've joined ${userCount} ${userCount === 1 ? 'other user' : 'other users'} searching for: "${musicName}" by ${artistName}\n\nYou'll be notified when the song is found!`);
                            } else {
                                alert(`✅ Success! You've been charged 166 Gints\n\nWe're now searching for: "${musicName}" by ${artistName}\n\nYou'll be notified when we find your song!`);
                            }
                            
                            displaySongsUsersAreLookingFor();
                        }).catch((error) => {
                            console.error('Error adding song to search list:', error);
                            alert('❌ Failed to add song to search list. Please try again.');
                            // Refund the Gints if song addition failed
                            update(userData, { gintBalance: increment(166) });
                        });
                    }).catch((error) => {
                        console.error('Error updating Gint balance:', error);
                        alert('❌ Transaction failed. Please try again.');
                    });
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                    alert('❌ Error accessing your account. Please try again.');
                });
                
            }).catch((error) => {
                console.error('Error checking for duplicates:', error);
                alert('❌ Error checking song database. Please try again.');
            });
            
        }).catch((error) => {
            console.error('Error checking user existing searches:', error);
            alert('❌ Error checking your existing searches. Please try again.');
        });
    });
}

// Handle song upload
function handleSongUpload(event) {
    const button = event.target;
    const songId = button.getAttribute('data-song-id');
    const songName = button.getAttribute('data-song-name');
    const artistName = button.getAttribute('data-artist-name');
    
    if (!auth.currentUser) {
        alert('❌ Please log in to upload songs');
        return;
    }
    
    if (songId.startsWith(auth.currentUser.uid.slice(18))) {
        alert('❌ You cannot upload a song that you requested yourself');
        return;
    }
    
    const uploadConfirmation = confirm(`📤 Upload Song\n\n"${songName}" by ${artistName}\n\nDo you have this song file ready to upload?`);
    
    if (!uploadConfirmation) return;
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('audio/')) {
            alert('❌ Please select an audio file (MP3, WAV, etc.)');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            alert('❌ File too large! Please select a file smaller than 10MB');
            return;
        }
        
        uploadSongFile(file, songId, songName, artistName);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Upload song file and notify similar song requesters
function uploadSongFile(file, songId, songName, artistName) {
    alert('⏳ Uploading song file...');
    
    setTimeout(() => {
        const mockAudioUrl = URL.createObjectURL(file);
        const songRef = ref(db, 'Find Song Lists/' + songId);
        
        update(songRef, {
            audioUrl: mockAudioUrl,
            uploadedBy: auth.currentUser.uid.slice(18),
            uploadedAt: new Date().toISOString(),
            fileName: file.name,
            fileSize: file.size,
            searchSatus: false
        }).then(() => {
            alert(`✅ Song uploaded successfully!\n\n"${songName}" by ${artistName}\n\nYou've helped fulfill this song request!`);
            displaySongsUsersAreLookingFor();
            
            // Notify ALL users looking for similar songs
            notifyAllSimilarSongRequesters(songName, artistName, mockAudioUrl);
            
        }).catch((error) => {
            console.error('Error updating song record:', error);
            alert('❌ Failed to upload song. Please try again.');
        });
    }, 2000);
}

// Calculate similarity between two strings (0 to 1)
function calculateSimilarity(str1, str2) {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    return (longer.length - levenshteinDistance(longer, shorter)) / parseFloat(longer.length);
}

// Levenshtein distance algorithm for fuzzy matching
function levenshteinDistance(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
        for (let i = 1; i <= str1.length; i++) {
            const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[j][i] = Math.min(
                matrix[j][i - 1] + 1,
                matrix[j - 1][i] + 1,
                matrix[j - 1][i - 1] + indicator
            );
        }
    }
    
    return matrix[str2.length][str1.length];
}

// [Rest of the functions remain the same - notifyAllSimilarSongRequesters, checkSimilarSongs, sendSimilarSongNotification, handleSongDownload, handleMarkCompleted, handleCancelSearch, deleteSongFromList]

// Initialize when user is logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        setTimeout(() => {
            initializeMhintService();
        }, 1000);
    }
});

// Add CSS for better styling
const mhintStyles = `
    .song-request-item, .found-song-item {
        transition: all 0.3s ease;
        cursor: pointer;
    }
    
    .song-request-item:hover, .found-song-item:hover {
        transform: translateX(5px);
        background: rgba(255,255,255,0.15) !important;
    }
    
    .found-song-item {
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
        100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
    }
    
    .mhintInput {
        width: 100%;
        padding: 12px;
        margin: 10px 0;
        border: 2px solid white;
        border-radius: 8px;
        background: rgba(255,255,255,0.1);
        color: white;
        font-size: 16px;
    }
    
    .mhintInput::placeholder {
        color: #ccc;
    }
    
    .mhintInput:focus {
        outline: none;
        border-color: var(--color2);
        background: rgba(255,255,255,0.15);
    }
    
    .mhintBtn {
        background: white;
        color: #333;
        border: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 10px;
    }
    
    .mhintBtn:hover {
        background: var(--color2);
        color: white;
        transform: translateY(-2px);
    }
    
    .upload-song-btn, .mark-completed-btn, .cancel-search-btn {
        transition: all 0.3s ease;
    }
    
    .upload-song-btn:hover, .mark-completed-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .cancel-search-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
    
    .download-song-link {
        transition: all 0.3s ease;
    }
    
    .download-song-link:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        background: #45a049 !important;
    }
    
    audio {
        border-radius: 25px;
        background: rgba(0,0,0,0.3);
    }
    
    audio::-webkit-media-controls-panel {
        background: rgba(0,0,0,0.3);
    }
    
    #uploadImageBtn:hover {
        background: var(--color2);
        color: white;
        transform: translateY(-1px);
    }
    
    #removeImageBtn:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = mhintStyles;
document.head.appendChild(styleSheet);