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
//Boolean variables 
var onDarkMood = false
var navIsOpen = false 
//eventListeners
openNavContainer.addEventListener("click",openNavigation);
moodButton.addEventListener("click", changeMood)
mainPage.onscroll = function() {
  if (navIsOpen) {
    removeWidthAndDesing()
  }
}


//for each
links.forEach(smoothScroll)
pageLink.forEach(smoothScroll)

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
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color2)38%, var(--color3) 68%, var(--color3) 98%)'
    body.style.animation ='gradient 15s ease infinite'
    body.style.backgroundSize = '400% 400%'
    body.style.backgroundAttachment = 'fixed'
  } else{
    body.style.background = 'linear-gradient(250deg, var(--color2) 3%, var(--color2)38%, var(--color1) 68%, var(--color1) 98%)'
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
    
  console.log(target);
};