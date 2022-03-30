import city from "./classes/city.js"

let lastName = document.getElementById("last_name")
let firstName = document.getElementById("first_name")
let resaButton = document.getElementById("resa-button")
let address = document.getElementById("address")
let remainBikes = document.getElementById("remain_bikes")
let client = document.getElementById("client")
let station = document.getElementById("station")
let partTwo = document.getElementById("parttwo")
let timer = document.getElementById("timer")
let stopTimer
let formStatus = {
    bikesAvailable : false, 
    addressValid : false,
    firstNameValid : false,
    lastNameValid : false
}
const timing = 1200;
let reservation = {
    active : false,
    fName : "",
    lName : "",
    stationName : "",
    stationNumber : "",
    availableBikes : 0,
    tempsRestant : timing 
}
let currentStationNumber = ""


let listbox = document.getElementById("city-select")
listbox.addEventListener('change', selectCity)

lastName.addEventListener('keyup', lastNameInput)
firstName.addEventListener('keyup', firstNameInput)
resaButton.addEventListener('click', bookDebookBike)

let theCity = new city();
let allCities = theCity.getListVilles();
let i=0;
for (i=0; i<allCities.length; i++) {
    let option = document.createElement("option");
    option.value = option.innerHTML = allCities[i].name;
    listbox.appendChild(option)
}

resaButton.disabled = checkAllInputs()

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Gestionaire d'événements pour mise à jour de l'interface utilisateur
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener('message', (e) => {
    console.log(e.data)
    switch(e.data.origin) {
        case "clickedStation" :
            remainBikes.innerText = e.data.station.available_bikes;
            if (e.data.station.available_bikes === 0) {
                formStatus.bikesAvailable=false
            }
            else {
                formStatus.bikesAvailable = true
            }
            document.getElementById("places").innerText = e.data.station.bike_stands;
            if (e.data.station.address !== "") {
                address.innerText = e.data.station.address;
            }
            else {
                address.innerText = e.data.station.name;
            }
            reservation.stationName = e.data.station.name
            currentStationNumber = e.data.station.number
            reservation.availableBikes = e.data.station.available_bikes
            formStatus.addressValid = true;
            resaButton.disabled = checkAllInputs()
            break;
    }
})

function selectCity() {
    theCity.setCity(listbox.value)
}

function lastNameInput() {
    if (lastName.value === "") {
        formStatus.lastNameValid = false
    }
    else {
        formStatus.lastNameValid = true
    }
    resaButton.disabled = checkAllInputs()
}

function firstNameInput() {
    if (firstName.value === "") {
        formStatus.firstNameValid = false
    }
    else {
        formStatus.firstNameValid = true
    }
    resaButton.disabled = checkAllInputs()
}
//renvoie false si tous les champs sont bons, valeur affectée à resaButton.disabled
function checkAllInputs () {
    if ((formStatus.addressValid) && (formStatus.firstNameValid) && (formStatus.lastNameValid) && (formStatus.bikesAvailable)) {
        resaButton.style.fontStyle = "normal"
        return false
    }
    else {
        resaButton.style.fontStyle = "italic"
        return true
    }
}

////////////////////////////////////////////////////////////////////////////////////////////
// Réservation du vélo et mise à jour de la carte
////////////////////////////////////////////////////////////////////////////////////////////
function bookDebookBike(unBook) {
    if (reservation.active) {
        reservation.active = false
        reservation.fName = ""
        reservation.lName = ""
        client.innerText = ""
        station.innerText = ""
        document.getElementById("parttwo").style.opacity = "0"
        theCity.unbookBike(reservation.stationNumber)
        remainBikes.innerText = ++reservation.availableBikes
        reservation.stationNumber = ""

        if (unBook !== "timer") {
            reservation.active = true
            reservation.fName = firstName.value
            reservation.lName = lastName.value
            reservation.stationNumber = currentStationNumber
            client.innerText = reservation.fName + " " + reservation.lName
            station.innerText = reservation.stationName
            document.getElementById("parttwo").style.opacity = "1"
            theCity.bookBike(reservation.stationNumber)
            remainBikes.innerText = --reservation.availableBikes
            reservation.tempsRestant = timing
            timer.innerText = secondsToString(reservation.tempsRestant)
            clearInterval(stopTimer)
            stopTimer = setInterval(diminuerTemps, 1000)
        }
    }
    else {
        reservation.active = true
        reservation.fName = firstName.value
        reservation.lName = lastName.value
        reservation.stationNumber = currentStationNumber
        client.innerText = reservation.fName + " " + reservation.lName
        station.innerText = reservation.stationName
        document.getElementById("parttwo").style.opacity = "1"
        theCity.bookBike(reservation.stationNumber)
        remainBikes.innerText = --reservation.availableBikes
        timer.innerText = secondsToString(reservation.tempsRestant)
        stopTimer = setInterval(diminuerTemps, 1000)
    }
}

function diminuerTemps() {
    timer.innerText = secondsToString(reservation.tempsRestant)
    reservation.tempsRestant--
    if (reservation.tempsRestant === 0) {
        bookDebookBike("timer")
        clearInterval(stopTimer)
        reservation.tempsRestant = timing
    }
}

function secondsToString(seconds) {
    let numdays = Math.floor(seconds / 86400);
    let numhours = Math.floor((seconds % 86400) / 3600);
    let numminutes = Math.floor(((seconds % 86400) % 3600) / 60);
    let numseconds = ((seconds % 86400) % 3600) % 60;
    return numminutes + " min " + numseconds + "s";
}