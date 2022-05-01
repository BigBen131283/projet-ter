const imagesLeft = ["./resources/images/left-1.jpg", "./resources/images/left-2.jpg", "./resources/images/left-3.jpg"]
const imagesRight = ["./resources/images/right-1.jpg", "./resources/images/right-2.jpg", "./resources/images/right-3.jpg"]
const lastImagePosition = Math.min(imagesLeft.length, imagesRight.length)-1

for (let i=0; i<imagesLeft.length; i++) {
    const slideLeft = document.getElementById("slide-wrapper-left")
    const newSlide = document.createElement("div")
    const img = document.createElement("img")
    img.src = imagesLeft[i]
    slideLeft.appendChild(newSlide)
    newSlide.appendChild(img)
    newSlide.classList.add("slide", "slide-left"+[i+1])
}

for (let i=0; i<imagesRight.length; i++) {
    const slideRight = document.getElementById("slide-wrapper-right")
    const newSlide = document.createElement("div")
    const img = document.createElement("img")
    img.src = imagesRight[i]
    slideRight.appendChild(newSlide)
    newSlide.appendChild(img)
    newSlide.classList.add("slide","slide-right"+[i+1])
}

let position = 0
const imageHeight = 450
const totalSliderHeight = lastImagePosition*imageHeight
//sens = 1 on avance sens = -1 on recule position
function displaySlide(sens) {
        position = position + sens;
        if (position === 3) {
            position = 0
        }
        if (position === -1) {
            position = 2
        }
    const currentLeftTop = position*imageHeight;
    const currentRightTop = -totalSliderHeight+currentLeftTop
    document.getElementById("slide-wrapper-left").style.top = -currentLeftTop+"px"
    document.getElementById("slide-wrapper-right").style.top = currentRightTop+"px"
    document.getElementById("slide-wrapper-left").style.transition = "all 0.7s ease-in";
    document.getElementById("slide-wrapper-right").style.transition = "all 0.7s ease-out";
}

let isPaused = false
let forced = false
const pauseButton = document.getElementById("pause_button")

function togglePause() {
    if (forced) {
        isPaused = false
        forced = false
    }
    
    isPaused = !isPaused
    if (isPaused === true) {
        pauseButton.classList.replace("fa-circle-pause", "fa-circle-play")
        document.getElementById("nav_word").innerText = "Play"
    }
    else {
        pauseButton.classList.replace("fa-circle-play", "fa-circle-pause")
        document.getElementById("nav_word").innerText = "Pause"
    }
}

pauseButton.addEventListener('click', togglePause)

function autoDefil() {
    if (isPaused === false) {
        displaySlide(1)
    }
}

setInterval (autoDefil, 5000)

const previous = document.getElementById("previous")
const next = document.getElementById("next")

previous.addEventListener('click', function() {
    displaySlide(-1)
})
next.addEventListener('click', function() {
    displaySlide(1)
})

document.addEventListener("keydown", function(e) {
    switch(e.code) {
        case "ArrowRight" : displaySlide(1)
        forced = true
        togglePause()
        break
        case "ArrowLeft" : displaySlide(-1)
        forced = true
        togglePause()
        break
    }
    // togglePause(true) : forcer la pause si l'utilisateur appuie sur une des flèches
})