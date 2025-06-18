//variables 
var navContainer = document.querySelector (".navContainer")
var openNavContainer = document.querySelector(".openNavContainer");
var hintAllName = document.querySelector(".hintAllName")
var logoNameHolder = document.querySelector(".logoNameHolder")
var navUnderling = document.querySelector('.underling')
var pageLink = document.querySelectorAll
(".pageLinkHolder a")
var moodButton = document.querySelector(".moodButton")
var mainPage = document.getElementById('main')
var links = document.querySelectorAll('.pageLinkHolder i')
var body = document.querySelector ('.html')
var loginSignBtn = document.querySelector('.loginSignBtn')
var signLoginBtn = document.querySelector('.signLoginBtn')
var signPage = document.getElementById ('SignPage')
  var logPage = document.getElementById ('loginPage')
//Boolean variables 
var onDarkMood = false
var navIsOpen = false 
var onloginPage = true

//eventListeners
openNavContainer.addEventListener("click",openNavigation);
moodButton.addEventListener("click", changeMood)
mainPage.onscroll = function() {
  if (navIsOpen) {
    removeWidthAndDesing()
  }
}
loginSignBtn.addEventListener("click", openSigninPage) 
signLoginBtn.addEventListener("click", openSigninPage)


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
navUnderling.classList.add
('newUnderlingDesing')
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
    
  } 
  else{
    moodButton.innerHTML = `<i class="fa-solid fa-cloud-moon"></i>` 
    document.getElementById('navMood').style.background = 'var(--color1)'
    onDarkMood = false 
    changebodyBg(onDarkMood )
    
  }
}
function changebodyBg(param) {
  var body = document.getElementById('body')
  if (param) {
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color3)38%, var(--color3) 68%, var(--color3) 98%)'
    body.style.animation ='gradient 15s ease infinite'
    body.style.backgroundSize = '400% 400%'
    body.style.backgroundAttachment = 'fixed'
  } else{
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color1)38%, var(--color1) 68%, var(--color1) 98%)'
    body.style.animation ='gradient 15s ease infinite'
    body.style.backgroundSize = '400% 400%'
    body.style.backgroundAttachment = 'fixed'
  }
}
function smoothScroll(link){
  link.addEventListener('click',eachAnchor)
};
function eachAnchor(e){
  e.preventDefault()
  var target = e.currentTarget.getAttribute('href').slice(1);
  var element = document.getElementById(target);
  var position = element.offsetTop;
  
  mainPage.scrollTo(
    {
      right:0,top:position
    }
    );
    
  
};
function notAvailableOnDt(){
  var bodyWidth = body.getBoundingClientRect().width
  var notAvailDis = document.querySelector('.notAvailable')
  var displayBd = document.querySelector ('.displayBd')
  var displaylogPages = document.querySelector('.loginAndSignupPage ')
  if (bodyWidth > 900){
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
  if(onloginPage){
    signPage.style.display = 'block'
  logPage.style.display = 'none'
  onloginPage = false
  }else{
    signPage.style.display = 'none'
  logPage.style.display = 'block'
  onloginPage = true
  }
  
}