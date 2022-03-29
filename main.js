import city from "./classes/city.js"

let lastName = document.getElementById("last_name")
let firstName = document.getElementById("first_name")
let resaButton = document.getElementById("resa-button")
let address = document.getElementById("address")
let remainBikes = document.getElementById("remain_bikes")
let client = document.getElementById("client")
let station = document.getElementById("station")
let partTwo = document.getElementById("parttwo")
let formStatus = {
    bikesAvailable : false, 
    addressValid : false,
    firstNameValid : false,
    lastNameValid : false
}
let reservation = {
    active : false,
    fName : "",
    lName : "",
    stationName : ""
}

let listbox = document.getElementById("city-select")
listbox.addEventListener('change', selectCity)

lastName.addEventListener('keyup', lastNameInput)
firstName.addEventListener('keyup', firstNameInput)
resaButton.addEventListener('click', () => {
        if (reservation.active) {
            reservation.active = false
            console.log("libéré")
            resaButton.innerText = "Réserver"
            reservation.fName = ""
            reservation.lName = ""
            client.innerText = ""
            station.innerText = ""
            console.log(document.getElementById("parttwo"))
            document.getElementById("parttwo").style.opacity = "0"
        }
        else {
            reservation.active = true
            reservation.fName = firstName.value
            reservation.lName = lastName.value
            resaButton.innerText = "Libérer"
            client.innerText = reservation.fName + " " + reservation.lName
            station.innerText = reservation.stationName
            document.getElementById("parttwo").style.opacity = "1"
        }
})

let theCity = new city();
let allCities = theCity.getListVilles();
let i=0;
for (i=0; i<allCities.length; i++) {
    let option = document.createElement("option");
    option.value = option.innerHTML = allCities[i].name;
    listbox.appendChild(option)
}

resaButton.disabled = checkAllInputs()


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
    console.log(formStatus)
    if ((formStatus.addressValid) && (formStatus.firstNameValid) && (formStatus.lastNameValid) && (formStatus.bikesAvailable)) {
        resaButton.style.fontStyle = "normal"
        return false
    }
    else {
        resaButton.style.fontStyle = "italic"
        return true
    }
}

// function bookDebookBike () {
//     if (reservation.active) {
//         reservation.active = false
//         console.log("libéré")
//         resaButton.innerText = "Réserver"
//         reservation.fName = ""
//         reservation.lName = ""
//         client.innerText = ""
//         station.innerText = ""
//         console.log(document.getElementById("parttwo"))
//         document.getElementById("parttwo").style.opacity = "0"
//     }
//     else {
//         reservation.active = true
//         reservation.fName = firstName.value
//         reservation.lName = lastName.value
//         resaButton.innerText = "Libérer"
//         client.innerText = reservation.fName + " " + reservation.lName
//         station.innerText = reservation.stationName
//         document.getElementById("parttwo").style.opacity = "1"
//     }
// }

