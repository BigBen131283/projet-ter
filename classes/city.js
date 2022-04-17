import map from "./map.js"

export default class City {
    #villes = [
        {
            "name" : "--",
            "position" : [31.07819293, 1.7697380]
        },
        {
            "name" : "Toyama",
            "position" : [36.6957569, 137.2136215]
        },
        {
            "name" : "Lyon",
            "position" : [45.7578137, 4.8320114]
        },
        {
            "name" : "Toulouse",
            "position" : [43.6044622, 1.4442469]
        }
    ]
    constructor (cityName = "--") {
        this.cityName = cityName;
        this.map = new map(this.getSelectedCity(cityName));
    }

    getListVilles(){return this.#villes}
    getName () {return this.cityName}
    getCoord (cityName) {
        for (let i=0; i<this.#villes.length; i++) {
            if (this.#villes[i].name === cityName) {
                return this.#villes[i].position;
            }
        }
        return [0, 0];
    }
    getSelectedCity(cityName){
        for (let i=0; i<this.#villes.length; i++) {
            if (this.#villes[i].name === cityName) {
                return this.#villes[i];
            }
        }
        return this.#villes[0];
    }

    setCity(cityName) {
        this.cityName = cityName; 
        this.map.setMapPosition(this.getSelectedCity(cityName))
    }
    bookBike(stationNumber) {
        this.map.bookBike(stationNumber)
    }
    unbookBike(stationNumber) {
        this.map.unbookBike(stationNumber)
    }
    updateOneStation(stationNumber, inc) {
        return this.map.updateOneStation(stationNumber,inc); 
    }
}