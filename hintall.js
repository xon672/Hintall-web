//variables 
var navContainer = document.querySelector(".navContainer")
var openNavContainer = document.querySelector(".openNavContainer");
var hintAllName = document.querySelector(".hintAllName")
var logoNameHolder = document.querySelector(".logoNameHolder")
var navUnderling = document.querySelector('.underling')
var pageLink = document.querySelectorAll
(".pageLinkHolder a")

//eventListeners
openNavContainer.addEventListener("click",openNavigation);

//for each


//functions

function openNavigation() {
  var navContainerWidth = navContainer.getBoundingClientRect().width;
  if (navContainerWidth == 70) {
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
}

function removeWidthAndDesing() {
navContainer.classList.remove('newNavWidth')
openNavContainer.innerHTML = `<i class="fa-solid fa-bars"></i>`
hintAllName.classList.add('fadeOutText')
hintAllName.classList.remove('hintAllNameDesign')
hintAllName.classList.add('hintAllName')
navUnderling.classList.remove('newUnderlingDesing')
pageLink.forEach(removeNavDesings)

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