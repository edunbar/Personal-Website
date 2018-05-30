/*
    nav.js creates a smooth transition when mousing over one tab to the next. It uses two even listeners
    and a background that follows the information. 
    Attaches to index.html and home.css
*/


//creates the constant dom selectors that will be used later
const triggers = document.querySelectorAll('.cool > li')
const background = document.querySelector('.dropdownBackground')
const nav = document.querySelector('.top')
const navTabs = document.querySelector('.cool')

//handles the event that happens when the mouse starts to hover over the different nav selectors
function handleEnter() {

    //adds class names to trigger different events on the class tags
    this.classList.add('trigger-enter')
    setTimeout(() => this.classList.contains('trigger-enter') && this.classList.add('trigger-enter-active'), 150)
    background.classList.add('open')

    //this gets the dropdown coordinates to move the background onto the actual information
    const dropdown = this.querySelector('.dropdown')
    const dropdownCoords = dropdown.getBoundingClientRect()
    const navCoords = nav.getBoundingClientRect()

    //makes a variable that has the coordinates that the background should be
    const coords = {
        height: dropdownCoords.height,
        width: dropdownCoords.width,
        top: dropdownCoords.top - navCoords.top,
        left: dropdownCoords.left - navCoords.left,
    }

    //sets the style of the background based off the coords that were set previously
    background.style.setProperty('width', `${coords.width}px`)
    background.style.setProperty('height', `${coords.height}px`)
    background.style.setProperty('transform', `translate(${coords.left}px, ${coords.top}px`)

}

//function that handles the mouse leaving the nav bars
function handleLeave() {

    //this removes the added class names that were added when the mouse enters the navs
    this.classList.remove('trigger-enter', 'trigger-enter-active')
    background.classList.remove('open')
}

function addNavColor() {
    

}

function removeNavColor() {
    
}

//event listeners for the two functions that are being used
triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleEnter))
triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleLeave))

navTabs.addEventListener('mouseenter', addNavColor)
navTabs.addEventListener('mouseleave', removeNavColor)