import city from "./classes/city.js"


let listbox = document.getElementById("city-select")
listbox.addEventListener('change', selectCity)

let theCity = new city();
let allCities = theCity.getListVilles();
let i=0;
for (i=0; i<allCities.length; i++) {
    let option = document.createElement("option");
    option.value = option.innerHTML = allCities[i].name;
    listbox.appendChild(option)
}

window.addEventListener('message', (e) => {
    console.log(e.data)
    switch(e.data.origin) {
        case "clickedStation" :
            document.getElementById("remain_bikes").innerText = e.data.station.available_bikes;
            document.getElementById("places").innerText = e.data.station.bike_stands;
            if (e.data.station.address !== "") {
                document.getElementById("address").innerText = e.data.station.address;
            }
            else {
                document.getElementById("address").innerText = e.data.station.name;
            }
            break;
    }
})

function selectCity() {
    theCity.setCity(listbox.value)
}
